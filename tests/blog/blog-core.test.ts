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
    cover: {
      src: "/assets/example.webp",
      alt: "Example cover",
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

  assert.equal(posts.length, 5);
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
