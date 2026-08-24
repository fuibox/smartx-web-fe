import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogVisual } from "@/components/blog/blog-visual";
import styles from "@/components/blog/blog-list.module.css";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import type { BlogPostSummary } from "@/content/blog-types";
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

  const firstStoryNumber = (pageNumber - 1) * BLOG_PAGE_SIZE + 1;
  const archiveUpdatedAt =
    latestPublishedPost.updatedAt ?? latestPublishedPost.publishedAt;

  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#latest-stories">
        Skip to latest stories
      </a>
      <SiteHeader active="blog" />

      <main>
        <section className={styles.masthead} aria-labelledby="journal-title">
          <div className={styles.mastheadTitle}>
            <p className={styles.mastheadKicker}>SmartX / Field notes</p>
            <h1 id="journal-title">
              SmartX <span>Journal.</span>
            </h1>
          </div>

          <div className={styles.mastheadIntro}>
            <p>
              Product thinking and market intelligence for people who want to
              understand how smarter trading systems take shape.
            </p>
            <p className={styles.archiveFolio}>
              <span>
                {formatBlogIndex(archive.total)}{" "}
                {archive.total === 1 ? "story" : "stories"}
              </span>
              <span>
                Updated{" "}
                <time dateTime={archiveUpdatedAt}>
                  {formatBlogDate(archiveUpdatedAt)}
                </time>
              </span>
            </p>
          </div>
        </section>

        <section
          id="latest-stories"
          className={styles.storyArchive}
          aria-label={`Latest stories, page ${pageNumber} of ${totalPages}`}
        >
          <article className={styles.featuredStory}>
            <Link
              className={styles.featuredLink}
              href={`/blog/${featuredPost.slug}`}
              aria-label={`Read ${featuredPost.title}`}
            >
              <BlogVisual
                post={featuredPost}
                priority
                showLabel={false}
                className={styles.featuredVisual}
                sizes="(min-width: 1180px) 660px, (min-width: 760px) 55vw, 100vw"
              />
              <div className={styles.featuredStoryCopy}>
                <div className={styles.leadLine}>
                  <span className={styles.leadMarker}>
                    No. {formatBlogIndex(firstStoryNumber)}
                  </span>
                  <StoryMeta post={featuredPost} />
                </div>
                <h2>{featuredPost.title}</h2>
                <p>{featuredPost.excerpt}</p>
                <span className={styles.readStory}>Read the dispatch</span>
              </div>
            </Link>
          </article>

          {remainingPosts.length > 0 ? (
            <div className={styles.archiveSection}>
              <h2 className={styles.archiveHeading} id="archive-heading">
                <span>From the archive</span>
                <i aria-hidden="true">
                  {formatBlogIndex(remainingPosts.length)} dispatches
                </i>
              </h2>

              <ol
                className={styles.storyRows}
                aria-labelledby="archive-heading"
              >
                {remainingPosts.map((post, index) => (
                  <li key={post.slug}>
                    <Link
                      href={`/blog/${post.slug}`}
                      aria-label={`Read ${post.title}`}
                    >
                      <span className={styles.storyNumber}>
                        No. {formatBlogIndex(firstStoryNumber + index + 1)}
                      </span>
                      <div className={styles.storyCopy}>
                        <StoryMeta post={post} />
                        <h3>{post.title}</h3>
                        <p>{post.excerpt}</p>
                      </div>
                      <BlogVisual
                        post={post}
                        showLabel={false}
                        className={styles.storyThumbVisual}
                        sizes="(min-width: 1180px) 232px, (min-width: 640px) 184px, calc(100vw - 72px)"
                      />
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          {totalPages > 1 ? (
            <nav className={styles.pagination} aria-label="Journal pages">
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
