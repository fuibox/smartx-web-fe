import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogVisual } from "@/components/blog/blog-visual";
import styles from "@/components/blog/blog.module.css";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import type { BlogCategory, BlogPostSummary } from "@/content/blog-types";
import {
  BLOG_PAGE_SIZE,
  listAllPublishedBlogPosts,
  listBlogPosts,
} from "@/content/blog-repository";
import {
  formatBlogDate,
  formatBlogIndex,
  formatBlogReadTime,
} from "@/lib/blog-format";

type BlogIndexProps = {
  pageNumber: number;
};

function getPageHref(pageNumber: number) {
  return pageNumber === 1 ? "/blog" : `/blog/page/${pageNumber}`;
}

/**
 * What the archive is made of, counted rather than asserted. A publication
 * states its desks; this one had five categories that only ever appeared one
 * story at a time, so the shape of the coverage was invisible from the index.
 */
function countDesks(posts: readonly BlogPostSummary[]) {
  const counts = new Map<BlogCategory, number>();
  for (const post of posts) {
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([category, count]) => ({ category, count }));
}

function StoryMeta({ post }: { post: BlogPostSummary }) {
  return (
    <div className={styles.storyMeta}>
      <span>{post.category}</span>
      <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time>
      <small>{formatBlogReadTime(post.readingMinutes)}</small>
    </div>
  );
}

export async function BlogIndex({ pageNumber }: BlogIndexProps) {
  const [archive, allPublishedPosts] = await Promise.all([
    listBlogPosts({ page: pageNumber }),
    listAllPublishedBlogPosts(),
  ]);
  const pagePosts = archive.items;
  const totalPages = archive.totalPages;
  const featuredPost = pagePosts[0];
  const remainingPosts = pagePosts.slice(1);
  const latestPublishedPost = allPublishedPosts[0];

  if (!featuredPost || !latestPublishedPost) notFound();

  const desks = countDesks(allPublishedPosts);
  const isFirstPage = pageNumber === 1;

  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#latest-stories">
        Skip to latest stories
      </a>
      <SiteHeader active="blog" />

      <main>
        <section className={styles.masthead} aria-labelledby="journal-title">
          <h1 id="journal-title">SmartX Journal.</h1>

          <p className={styles.mastheadLede}>
            Product thinking and market intelligence.{" "}
            <span>How smart money moves, and what we build from it.</span>
          </p>

          <dl className={styles.deskIndex} aria-label="Desks in this archive">
            {desks.map(({ category, count }) => (
              <div key={category}>
                <dt>{category}</dt>
                <dd>{formatBlogIndex(count)}</dd>
              </div>
            ))}
            <div className={styles.deskTotal}>
              <dt>Published</dt>
              <dd>{formatBlogIndex(archive.total)}</dd>
            </div>
          </dl>
        </section>

        <section
          id="latest-stories"
          className={styles.storyArchive}
          aria-label={`Latest stories, page ${pageNumber} of ${totalPages}`}
        >
          <article className={styles.featuredStory}>
            <Link
              href={`/blog/${featuredPost.slug}`}
              aria-label={`Read ${featuredPost.title}`}
            >
              <BlogVisual
                post={featuredPost}
                priority
                showLabel={false}
                sizes="(min-width: 1180px) 660px, (min-width: 760px) 55vw, 100vw"
              />
              <div className={styles.featuredStoryCopy}>
                <div className={styles.leadLine}>
                  <span className={styles.leadMarker}>
                    {isFirstPage
                      ? "Lead story"
                      : `Page ${formatBlogIndex(pageNumber)}`}
                  </span>
                  <StoryMeta post={featuredPost} />
                </div>
                <h2>{featuredPost.title}</h2>
                {featuredPost.dek ? (
                  <p className={styles.featuredDek}>{featuredPost.dek}</p>
                ) : null}
                <p>{featuredPost.excerpt}</p>
                <span className={styles.readStory}>
                  Read story <i aria-hidden="true">↗</i>
                </span>
              </div>
            </Link>
          </article>

          <h2 className={styles.archiveHeading} id="archive-heading">
            <span>More from the archive</span>
            <i aria-hidden="true">
              {formatBlogIndex(remainingPosts.length)} / {formatBlogIndex(archive.total)}
            </i>
          </h2>

          <ol className={styles.storyRows} aria-labelledby="archive-heading">
            {remainingPosts.map((post, index) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  aria-label={`Read ${post.title}`}
                >
                  <span className={styles.storyNumber}>
                    {formatBlogIndex(
                      (pageNumber - 1) * BLOG_PAGE_SIZE + index + 2,
                    )}
                  </span>
                  <div className={styles.storyThumb}>
                    <BlogVisual
                      post={post}
                      showLabel={false}
                      sizes="(min-width: 1180px) 224px, 160px"
                    />
                  </div>
                  <div className={styles.storyCopy}>
                    <StoryMeta post={post} />
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                  </div>
                  <i className={styles.storyArrow} aria-hidden="true">
                    ↗
                  </i>
                </Link>
              </li>
            ))}
          </ol>

          {totalPages > 1 ? (
            <nav className={styles.pagination} aria-label="Blog pages">
              {pageNumber > 1 ? (
                <Link href={getPageHref(pageNumber - 1)}>
                  <i aria-hidden="true">←</i> Newer
                </Link>
              ) : (
                <span
                  className={styles.paginationPlaceholder}
                  aria-hidden="true"
                />
              )}

              <div className={styles.paginationPages}>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                  (page) =>
                    page === pageNumber ? (
                      <span key={page} aria-current="page">
                        {formatBlogIndex(page)}
                      </span>
                    ) : (
                      <Link
                        key={page}
                        href={getPageHref(page)}
                        aria-label={`Blog page ${page}`}
                      >
                        {formatBlogIndex(page)}
                      </Link>
                    ),
                )}
              </div>

              {pageNumber < totalPages ? (
                <Link href={getPageHref(pageNumber + 1)}>
                  Older <i aria-hidden="true">→</i>
                </Link>
              ) : (
                <span
                  className={styles.paginationPlaceholder}
                  aria-hidden="true"
                />
              )}
            </nav>
          ) : null}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
