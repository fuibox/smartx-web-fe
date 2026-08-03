import type {
  BlogContentBlock,
  BlogListResult,
  BlogPostDetail,
  BlogPostSource,
  BlogPostStatus,
  BlogPostSummary,
  BlogSection,
  BlogSectionSource,
} from "./blog-types";

const LATIN_WORDS_PER_MINUTE = 220;
const CJK_CHARACTERS_PER_MINUTE = 500;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SEO_TITLE_MAX_LENGTH = 65;
const SEO_DESCRIPTION_MIN_LENGTH = 100;
const SEO_DESCRIPTION_MAX_LENGTH = 170;

function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`[blog] ${message}`);
}

function nonEmpty(value: string, field: string) {
  invariant(value.trim().length > 0, `${field} must not be empty.`);
  return value;
}

function validateUrl(value: string, field: string, allowRelative = false) {
  if (allowRelative && value.startsWith("/")) return value;

  try {
    new URL(value);
    return value;
  } catch {
    throw new Error(`[blog] ${field} must be an absolute URL${allowRelative ? " or a root-relative path" : ""}.`);
  }
}

function validateCover(
  cover: BlogPostSource["cover"],
  field: string,
) {
  nonEmpty(cover.alt, `${field}.alt`);
  validateUrl(cover.src, `${field}.src`, true);
  invariant(
    Number.isInteger(cover.width) && cover.width > 0,
    `${field}.width must be a positive integer.`,
  );
  invariant(
    Number.isInteger(cover.height) && cover.height > 0,
    `${field}.height must be a positive integer.`,
  );
}

function validateBlock(
  block: BlogContentBlock,
  postSlug: string,
  sectionId: string,
  blockIndex: number,
) {
  const field = `${postSlug}.${sectionId}.blocks[${blockIndex}]`;

  if (block.type === "ordered-list" || block.type === "unordered-list") {
    invariant(block.items.length > 0, `${field} must contain at least one item.`);
    block.items.forEach((item, itemIndex) =>
      nonEmpty(item, `${field}.items[${itemIndex}]`),
    );
    return;
  }

  nonEmpty(block.text, `${field}.text`);
  if (block.type === "heading" && block.id) {
    invariant(SLUG.test(block.id), `${field}.id must be a kebab-case slug.`);
  }
}

export function normalizeBlogSection(
  section: BlogSectionSource,
  postSlug: string,
): BlogSection {
  nonEmpty(section.id, `${postSlug}.section.id`);
  invariant(
    SLUG.test(section.id),
    `${postSlug}.${section.id}.id must be a kebab-case slug.`,
  );
  nonEmpty(section.heading, `${postSlug}.${section.id}.heading`);

  const hasBlocks = section.blocks !== undefined;
  const hasLegacyFields =
    section.paragraphs !== undefined ||
    section.bullets !== undefined ||
    section.quote !== undefined;

  invariant(
    !(hasBlocks && hasLegacyFields),
    `${postSlug}.${section.id} cannot mix blocks with legacy body fields.`,
  );

  const blocks: BlogContentBlock[] = hasBlocks
    ? [...section.blocks]
    : [
        ...(section.paragraphs ?? []).map(
          (text): BlogContentBlock => ({ type: "paragraph", text }),
        ),
        ...(section.bullets
          ? [
              {
                type: "unordered-list" as const,
                items: section.bullets,
              },
            ]
          : []),
        ...(section.quote
          ? [{ type: "quote" as const, text: section.quote }]
          : []),
      ];

  invariant(
    blocks.length > 0,
    `${postSlug}.${section.id} must contain at least one body block.`,
  );
  blocks.forEach((block, index) =>
    validateBlock(block, postSlug, section.id, index),
  );

  return {
    id: section.id,
    heading: section.heading,
    blocks,
  };
}

export function normalizeBlogPost(source: BlogPostSource): BlogPostDetail {
  nonEmpty(source.slug, "slug");
  invariant(SLUG.test(source.slug), `${source.slug}.slug must be kebab-case.`);
  nonEmpty(source.title, `${source.slug}.title`);
  nonEmpty(source.excerpt, `${source.slug}.excerpt`);
  validateCover(source.cover, `${source.slug}.cover`);

  invariant(
    ISO_DATE.test(source.publishedAt) &&
      !Number.isNaN(Date.parse(`${source.publishedAt}T00:00:00Z`)),
    `${source.slug}.publishedAt must be an ISO calendar date.`,
  );

  if (source.updatedAt) {
    invariant(
      ISO_DATE.test(source.updatedAt) &&
        !Number.isNaN(Date.parse(`${source.updatedAt}T00:00:00Z`)),
      `${source.slug}.updatedAt must be an ISO calendar date.`,
    );
    invariant(
      source.updatedAt >= source.publishedAt,
      `${source.slug}.updatedAt cannot precede publishedAt.`,
    );
  }

  if (source.sourceUrl) {
    validateUrl(source.sourceUrl, `${source.slug}.sourceUrl`);
  }
  if (source.status === "published") {
    invariant(
      source.seo,
      `${source.slug}.seo is required for published posts.`,
    );
  }
  if (source.seo) {
    nonEmpty(source.seo.title, `${source.slug}.seo.title`);
    nonEmpty(source.seo.description, `${source.slug}.seo.description`);
    invariant(
      source.seo.title.length <= SEO_TITLE_MAX_LENGTH,
      `${source.slug}.seo.title must be ${SEO_TITLE_MAX_LENGTH} characters or fewer.`,
    );
    invariant(
      source.seo.description.length >= SEO_DESCRIPTION_MIN_LENGTH &&
        source.seo.description.length <= SEO_DESCRIPTION_MAX_LENGTH,
      `${source.slug}.seo.description must be between ${SEO_DESCRIPTION_MIN_LENGTH} and ${SEO_DESCRIPTION_MAX_LENGTH} characters.`,
    );
  }
  if (source.seo?.image) {
    validateCover(source.seo.image, `${source.slug}.seo.image`);
  }

  invariant(
    source.sections.length > 0,
    `${source.slug}.sections must contain at least one section.`,
  );

  const sectionIds = new Set<string>();
  const documentIds = new Set<string>();
  const sections = source.sections.map((section) => {
    invariant(
      !sectionIds.has(section.id),
      `${source.slug} contains duplicate section id "${section.id}".`,
    );
    sectionIds.add(section.id);
    documentIds.add(section.id);

    const normalized = normalizeBlogSection(section, source.slug);
    for (const block of normalized.blocks) {
      if (block.type !== "heading" || !block.id) continue;
      invariant(
        !documentIds.has(block.id),
        `${source.slug} contains duplicate document id "${block.id}".`,
      );
      documentIds.add(block.id);
    }
    return normalized;
  });

  return {
    slug: source.slug,
    status: source.status,
    category: source.category,
    publishedAt: source.publishedAt,
    updatedAt: source.updatedAt,
    title: source.title,
    excerpt: source.excerpt,
    dek: source.dek,
    cover: source.cover,
    sourceUrl: source.sourceUrl,
    sections,
    note: source.note,
    seo: source.seo,
  };
}

export function normalizeBlogPosts(
  sources: readonly BlogPostSource[],
): readonly BlogPostDetail[] {
  const slugs = new Set<string>();

  return sources.map((source) => {
    invariant(
      !slugs.has(source.slug),
      `Duplicate post slug "${source.slug}".`,
    );
    slugs.add(source.slug);
    return normalizeBlogPost(source);
  });
}

export function sortBlogPosts(
  posts: readonly BlogPostDetail[],
): readonly BlogPostDetail[] {
  return [...posts].sort((a, b) => {
    const publishedDifference = b.publishedAt.localeCompare(a.publishedAt);
    if (publishedDifference !== 0) return publishedDifference;
    // The source collection is kept in editorial publish order. Preserve that
    // order for same-day releases because `publishedAt` intentionally stores a
    // calendar date rather than exposing Medium's timestamp to the UI.
    return 0;
  });
}

export function selectBlogPosts(
  posts: readonly BlogPostDetail[],
  status: BlogPostStatus,
) {
  return sortBlogPosts(posts.filter((post) => post.status === status));
}

export function getBlogReadingText(post: BlogPostDetail) {
  const body = post.sections.flatMap((section) => [
    section.heading,
    ...section.blocks.flatMap((block) => {
      if (block.type === "ordered-list" || block.type === "unordered-list") {
        return block.items;
      }
      return block.text;
    }),
  ]);

  if (post.note) body.push(post.note);
  return body.join(" ");
}

export function getBlogReadingStats(post: BlogPostDetail) {
  const text = getBlogReadingText(post);
  const cjkCharacters =
    text.match(
      /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\u3040-\u30ff\uac00-\ud7af]/g,
    )?.length ?? 0;
  const latinText = text.replace(
    /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\u3040-\u30ff\uac00-\ud7af]/g,
    " ",
  );
  const words =
    latinText.match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
  const minutes = Math.max(
    1,
    Math.ceil(
      words / LATIN_WORDS_PER_MINUTE +
        cjkCharacters / CJK_CHARACTERS_PER_MINUTE,
    ),
  );

  return { words, cjkCharacters, minutes };
}

export function toBlogPostSummary(post: BlogPostDetail): BlogPostSummary {
  return {
    slug: post.slug,
    status: post.status,
    category: post.category,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    title: post.title,
    excerpt: post.excerpt,
    dek: post.dek,
    cover: post.cover,
    readingMinutes: getBlogReadingStats(post).minutes,
  };
}

export function paginateBlogPosts(
  posts: readonly BlogPostDetail[],
  page: number,
  pageSize: number,
): BlogListResult {
  invariant(Number.isInteger(pageSize) && pageSize > 0, "pageSize must be a positive integer.");

  const summaries = posts.map(toBlogPostSummary);
  const total = summaries.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (!Number.isInteger(page) || page < 1 || page > totalPages) {
    return {
      items: [],
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  const start = (page - 1) * pageSize;
  return {
    items: summaries.slice(start, start + pageSize),
    total,
    page,
    pageSize,
    totalPages,
  };
}

export function selectRelatedBlogPosts(
  posts: readonly BlogPostDetail[],
  current: BlogPostDetail,
  limit = 3,
): readonly BlogPostSummary[] {
  invariant(Number.isInteger(limit) && limit >= 0, "Related-post limit must be a non-negative integer.");

  return [...posts]
    .filter((candidate) => candidate.slug !== current.slug)
    .sort((a, b) => {
      const categoryDifference =
        Number(b.category === current.category) -
        Number(a.category === current.category);
      if (categoryDifference !== 0) return categoryDifference;
      return b.publishedAt.localeCompare(a.publishedAt);
    })
    .slice(0, limit)
    .map(toBlogPostSummary);
}
