import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogVisual } from "@/components/blog/blog-visual";
import styles from "@/components/blog/blog.module.css";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import {
  BLOG_PAGE_SIZE,
  listAllPublishedBlogPosts,
  listBlogPosts,
} from "@/content/blog-repository";
import {
  formatBlogArchiveMonth,
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

  const archiveLabel = formatBlogArchiveMonth(
    latestPublishedPost.publishedAt,
  );

  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#latest-stories">
        Skip to latest stories
      </a>
      <SiteHeader active="blog" />

      <main>
        <section className={styles.journalHero} aria-labelledby="journal-title">
          <div>
            <p className={styles.eyebrow}>
              SMARTX JOURNAL / {formatBlogIndex(pageNumber)}
            </p>
            <h1 id="journal-title">SmartX Journal.</h1>
          </div>
          <p>
            Product thinking, market intelligence,
            <br />
            and what comes next.
          </p>
          <div
            className={styles.heroIndex}
            aria-label={`${archive.total} published stories`}
          >
            <span>{archiveLabel}</span>
            <strong>{formatBlogIndex(archive.total)}</strong>
            <small>Published stories</small>
          </div>
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
              <BlogVisual post={featuredPost} priority />
              <div className={styles.featuredStoryCopy}>
                <div className={styles.storyMeta}>
                  <span>{featuredPost.category}</span>
                  <time dateTime={featuredPost.publishedAt}>
                    {formatBlogDate(featuredPost.publishedAt)}
                  </time>
                  <small>
                    {formatBlogReadTime(featuredPost.readingMinutes)}
                  </small>
                </div>
                <h2>{featuredPost.title}</h2>
                <p>{featuredPost.excerpt}</p>
                <span className={styles.readStory}>
                  Read story <i aria-hidden="true">↗</i>
                </span>
              </div>
            </Link>
          </article>

          <div className={styles.storyRows}>
            {remainingPosts.map((post, index) => (
              <article key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  aria-label={`Read ${post.title}`}
                >
                  <span className={styles.storyNumber}>
                    {formatBlogIndex(
                      (pageNumber - 1) * BLOG_PAGE_SIZE + index + 2,
                    )}
                  </span>
                  <div>
                    <div className={styles.storyMeta}>
                      <span>{post.category}</span>
                      <time dateTime={post.publishedAt}>
                        {formatBlogDate(post.publishedAt)}
                      </time>
                      <small>
                        {formatBlogReadTime(post.readingMinutes)}
                      </small>
                    </div>
                    <h2>{post.title}</h2>
                    <p>{post.excerpt}</p>
                  </div>
                  <i className={styles.storyArrow} aria-hidden="true">
                    ↗
                  </i>
                </Link>
              </article>
            ))}
          </div>

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
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1,
                ).map((page) =>
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
