import {
  normalizeBlogPosts,
  paginateBlogPosts,
  selectBlogPosts,
  selectRelatedBlogPosts,
  toBlogPostSummary,
} from "./blog-core";
import { BLOG_POST_SOURCES } from "./blog-posts";
import type {
  BlogPostDetail,
  BlogPostStatus,
  BlogPostSummary,
} from "./blog-types";

export const BLOG_PAGE_SIZE = 6;

const normalizedPosts = normalizeBlogPosts(BLOG_POST_SOURCES);
const postsByStatus: Record<
  BlogPostStatus,
  readonly BlogPostDetail[]
> = {
  draft: selectBlogPosts(normalizedPosts, "draft"),
  published: selectBlogPosts(normalizedPosts, "published"),
};
const publishedBySlug = new Map(
  postsByStatus.published.map((post) => [post.slug, post]),
);

function postsWithStatus(status: BlogPostStatus) {
  return postsByStatus[status];
}

export async function listBlogPosts({
  page = 1,
  pageSize = BLOG_PAGE_SIZE,
  status = "published",
}: {
  page?: number;
  pageSize?: number;
  status?: BlogPostStatus;
} = {}) {
  return paginateBlogPosts(postsWithStatus(status), page, pageSize);
}

export async function listAllPublishedBlogPosts(): Promise<
  readonly BlogPostSummary[]
> {
  return postsWithStatus("published").map(toBlogPostSummary);
}

export async function getLatestBlogPosts(
  limit: number,
): Promise<readonly BlogPostSummary[]> {
  if (!Number.isInteger(limit) || limit < 0) {
    throw new Error("[blog] Latest-post limit must be a non-negative integer.");
  }

  return postsWithStatus("published")
    .slice(0, limit)
    .map(toBlogPostSummary);
}

export async function getBlogArchivePageCount() {
  const { totalPages } = await listBlogPosts();
  return totalPages;
}

export async function getBlogPost(
  slug: string,
): Promise<BlogPostDetail | null> {
  return publishedBySlug.get(slug) ?? null;
}

export async function getRelatedBlogPosts(
  slug: string,
  limit = 3,
): Promise<readonly BlogPostSummary[]> {
  const published = postsWithStatus("published");
  const current = published.find((post) => post.slug === slug);
  if (!current) return [];
  return selectRelatedBlogPosts(published, current, limit);
}
