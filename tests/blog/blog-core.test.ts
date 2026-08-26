import assert from "node:assert/strict";
import test from "node:test";

import {
  getBlogReadingStats,
  normalizeBlogPost,
  normalizeBlogPosts,
  paginateBlogPosts,
  selectBlogPosts,
  selectRelatedBlogPosts,
} from "../../src/content/blog-core";
import { BLOG_POST_SOURCES } from "../../src/content/blog-posts";
import type {
  BlogPostSource,
  BlogSectionSource,
} from "../../src/content/blog-types";

function makeSource(
  overrides: Partial<BlogPostSource> = {},
): BlogPostSource {
  return {
    slug: "example-post",
    status: "published",
    category: "Product",
    publishedAt: "2026-07-01",
    title: "Example post",
    excerpt: "A stable test fixture.",
    seo: {
      title: "Example prediction market article",
      description:
        "A complete example description that explains the prediction-market article clearly enough for search and social previews.",
    },
    cover: {
      src: "/assets/example.webp",
      alt: "Example cover",
      width: 1200,
      height: 630,
    },
    sections: [
      {
        id: "opening",
        heading: "Opening",
        blocks: [{ type: "paragraph", text: "A short body." }],
      },
    ],
    ...overrides,
  };
}

test("the production source validates into canonical body blocks", () => {
  const posts = normalizeBlogPosts(BLOG_POST_SOURCES);

  assert.equal(posts.length, 28);
  assert.ok(
    posts.every((post) =>
      post.sections.every(
        (section) =>
          section.blocks.length > 0 &&
          !("paragraphs" in section) &&
          !("bullets" in section),
      ),
    ),
  );
  assert.ok(
    posts.every(
      (post) =>
        post.seo &&
        post.seo.title.length <= 65 &&
        post.seo.description.length >= 100 &&
        post.seo.description.length <= 170,
    ),
  );

  const published = selectBlogPosts(posts, "published");
  const drafts = selectBlogPosts(posts, "draft");
  const firstPage = paginateBlogPosts(published, 1, 6);
  const secondPage = paginateBlogPosts(published, 2, 6);

  assert.equal(published.length, 7);
  assert.equal(drafts.length, 21);
  assert.equal(firstPage.items.length, 6);
  assert.equal(secondPage.items.length, 1);
  assert.equal(firstPage.totalPages, 2);
  assert.equal(secondPage.items.at(-1)?.slug, "smartx-ambassador-program");
  assert.deepEqual(
    firstPage.items.slice(0, 3).map((post) => post.slug),
    [
      "the-state-of-prediction-markets-in-2026-what-serious-traders-need-to-know",
      "what-does-it-actually-mean-to-have-edge-in-prediction-markets",
      "why-personalized-crypto-trading-recommendations-beat-generic-signals",
    ],
  );
});

test("normalization rejects mixed or empty section formats", () => {
  const mixedSection = {
    id: "opening",
    heading: "Opening",
    blocks: [{ type: "paragraph", text: "Canonical." }],
    paragraphs: ["Legacy."],
  } as unknown as BlogSectionSource;

  assert.throws(
    () => normalizeBlogPost(makeSource({ sections: [mixedSection] })),
    /cannot mix blocks with legacy body fields/,
  );

  assert.throws(
    () =>
      normalizeBlogPost(
        makeSource({
          sections: [
            {
              id: "opening",
              heading: "Opening",
              blocks: [],
            },
          ],
        }),
      ),
    /must contain at least one body block/,
  );
});

test("published posts require complete, concise SEO metadata", () => {
  assert.throws(
    () => normalizeBlogPost(makeSource({ seo: undefined })),
    /seo is required for published posts/,
  );
  assert.throws(
    () =>
      normalizeBlogPost(
        makeSource({
          seo: {
            title: "A".repeat(66),
            description:
              "A complete example description that explains the prediction-market article clearly enough for search and social previews.",
          },
        }),
      ),
    /seo.title must be 65 characters or fewer/,
  );
  assert.throws(
    () =>
      normalizeBlogPost(
        makeSource({
          seo: {
            title: "A concise SEO title",
            description: "Too short.",
          },
        }),
      ),
    /seo.description must be between 100 and 170 characters/,
  );
});

test("published selection is filtered and sorted before pagination", () => {
  const posts = normalizeBlogPosts([
    makeSource({ slug: "older", publishedAt: "2026-06-01" }),
    makeSource({
      slug: "draft-newer",
      status: "draft",
      publishedAt: "2026-08-01",
    }),
    makeSource({ slug: "newer", publishedAt: "2026-07-01" }),
  ]);
  const published = selectBlogPosts(posts, "published");
  const firstPage = paginateBlogPosts(published, 1, 1);
  const secondPage = paginateBlogPosts(published, 2, 1);

  assert.deepEqual(
    published.map((post) => post.slug),
    ["newer", "older"],
  );
  assert.equal(firstPage.total, 2);
  assert.equal(firstPage.totalPages, 2);
  assert.equal(firstPage.items[0]?.slug, "newer");
  assert.equal(secondPage.items[0]?.slug, "older");
  assert.deepEqual(paginateBlogPosts(published, 3, 1).items, []);
});

test("same-day releases preserve editorial source order", () => {
  const posts = normalizeBlogPosts([
    makeSource({ slug: "published-first", publishedAt: "2026-08-03" }),
    makeSource({ slug: "published-second", publishedAt: "2026-08-03" }),
  ]);

  assert.deepEqual(
    selectBlogPosts(posts, "published").map((post) => post.slug),
    ["published-first", "published-second"],
  );
});

test("reading time is derived from canonical body content", () => {
  const shortPost = normalizeBlogPost(makeSource());
  const longPost = normalizeBlogPost(
    makeSource({
      sections: [
        {
          id: "opening",
          heading: "Opening",
          blocks: [
            {
              type: "paragraph",
              text: Array.from({ length: 500 }, () => "signal").join(" "),
            },
          ],
        },
      ],
    }),
  );

  assert.equal(getBlogReadingStats(shortPost).minutes, 1);
  assert.equal(getBlogReadingStats(longPost).minutes, 3);
});

test("related stories prioritize category without exposing the current post", () => {
  const posts = selectBlogPosts(
    normalizeBlogPosts([
      makeSource({
        slug: "current",
        category: "Product",
        publishedAt: "2026-07-03",
      }),
      makeSource({
        slug: "same-category",
        category: "Product",
        publishedAt: "2026-07-01",
      }),
      makeSource({
        slug: "newer-other-category",
        category: "Guide",
        publishedAt: "2026-07-02",
      }),
    ]),
    "published",
  );
  const current = posts.find((post) => post.slug === "current");

  assert.ok(current);
  assert.deepEqual(
    selectRelatedBlogPosts(posts, current, 2).map((post) => post.slug),
    ["same-category", "newer-other-category"],
  );
});

test("duplicate slugs fail before a route can be generated", () => {
  assert.throws(
    () =>
      normalizeBlogPosts([
        makeSource(),
        makeSource({ title: "Duplicate" }),
      ]),
    /Duplicate post slug/,
  );
});
