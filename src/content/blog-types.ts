export type BlogPostStatus = "draft" | "published";

export type BlogCategory =
  | "Campaign"
  | "Community"
  | "Guide"
  | "Intelligence"
  | "Product";

export type BlogContentBlock =
  | {
      type: "paragraph";
      text: string;
    }
  | {
      type: "heading";
      level: 3;
      text: string;
      id?: string;
    }
  | {
      type: "unordered-list";
      items: readonly string[];
    }
  | {
      type: "ordered-list";
      items: readonly string[];
    }
  | {
      type: "quote";
      text: string;
    };

export type BlogSection = {
  id: string;
  heading: string;
  blocks: readonly BlogContentBlock[];
};

type CanonicalBlogSectionSource = {
  id: string;
  heading: string;
  blocks: readonly BlogContentBlock[];
  paragraphs?: never;
  bullets?: never;
  quote?: never;
};

type LegacyBlogSectionSource = {
  id: string;
  heading: string;
  blocks?: never;
  paragraphs?: readonly string[];
  bullets?: readonly string[];
  quote?: string;
};

/**
 * Temporary import shape for the initial Medium migrations.
 * Public consumers only receive canonical `BlogSection` records.
 */
export type BlogSectionSource =
  | CanonicalBlogSectionSource
  | LegacyBlogSectionSource;

export type BlogCover = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type BlogSeo = {
  title: string;
  description: string;
  image?: BlogCover;
};

export type BlogPostSource = {
  slug: string;
  status: BlogPostStatus;
  category: BlogCategory;
  publishedAt: string;
  updatedAt?: string;
  title: string;
  excerpt: string;
  dek?: string;
  cover: BlogCover;
  sourceUrl?: string;
  sections: readonly BlogSectionSource[];
  note?: string;
  seo?: BlogSeo;
};

export type BlogPostSummary = {
  slug: string;
  status: BlogPostStatus;
  category: BlogCategory;
  publishedAt: string;
  updatedAt?: string;
  title: string;
  excerpt: string;
  dek?: string;
  cover: BlogCover;
  /** Derived from canonical body blocks at build time. */
  readingMinutes: number;
};

export type BlogPostDetail = Omit<BlogPostSummary, "readingMinutes"> & {
  sourceUrl?: string;
  sections: readonly BlogSection[];
  note?: string;
  seo?: BlogSeo;
};

export type BlogListResult = {
  items: readonly BlogPostSummary[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
