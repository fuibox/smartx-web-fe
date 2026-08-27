import Link from "next/link";
import { notFound } from "next/navigation";

import {
  BlogCategoryLabel,
  BlogDate,
  BlogReadTime,
  BlogUiText,
} from "@/components/blog/blog-i18n";
import { BlogVisual } from "@/components/blog/blog-visual";
import styles from "@/components/blog/blog-list.module.css";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import type { BlogPostSummary } from "@/content/blog-types";
import { listBlogPosts } from "@/content/blog-repository";
import { formatBlogDate, formatBlogIndex } from "@/lib/blog-format";

type BlogIndexProps = {
  pageNumber: number;
};

function getPageHref(pageNumber: number) {
  return pageNumber === 1 ? "/blog" : `/blog/page/${pageNumber}`;
}

function StoryMeta({ post }: { post: BlogPostSummary }) {
  return (
    <div className={styles.storyMeta}>
      <span>
        <BlogCategoryLabel category={post.category} />
      </span>
      <small>
        <BlogReadTime minutes={post.readingMinutes} />
      </small>
    </div>
  );
}

export async function BlogIndex({ pageNumber }: BlogIndexProps) {
  const archive = await listBlogPosts({ page: pageNumber });
  const pagePosts = archive.items;
  const totalPages = archive.totalPages;
  const featuredPost = pagePosts[0];
  const remainingPosts = pagePosts.slice(1);

  if (!featuredPost) notFound();

  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#latest-stories">
        <BlogUiText k="skipToLatest" />
      </a>
      <SiteHeader active="blog" allowThemeToggle />

      <main>
        <section className={styles.masthead} aria-labelledby="journal-title">
          <h1 id="journal-title">
            <BlogUiText k="journalTitle" />
          </h1>

          <div className={styles.mastheadIntro}>
            <p>
              <BlogUiText k="mastheadIntro" />
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
                  <time
                    className={styles.leadDate}
                    dateTime={featuredPost.publishedAt}
                    aria-label={formatBlogDate(featuredPost.publishedAt)}
                  >
                    <BlogDate date={featuredPost.publishedAt} variant="short" />
                  </time>
                  <StoryMeta post={featuredPost} />
                </div>
                <h2>{featuredPost.title}</h2>
                <p>{featuredPost.excerpt}</p>
                <span className={styles.readStory}>
                  <BlogUiText k="readDispatch" />
                </span>
              </div>
            </Link>
          </article>

          {remainingPosts.length > 0 ? (
            <ol className={styles.storyRows} aria-label="More stories">
              {remainingPosts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    aria-label={`Read ${post.title}`}
                  >
                    <time
                      className={styles.storyDate}
                      dateTime={post.publishedAt}
                      aria-label={formatBlogDate(post.publishedAt)}
                    >
                      <BlogDate date={post.publishedAt} variant="short" />
                    </time>
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
          ) : null}

          {totalPages > 1 ? (
            <nav className={styles.pagination} aria-label="Journal pages">
              {pageNumber > 1 ? (
                <Link href={getPageHref(pageNumber - 1)}>
                  <i aria-hidden="true">←</i> <BlogUiText k="newer" />
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
                  <BlogUiText k="older" /> <i aria-hidden="true">→</i>
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
