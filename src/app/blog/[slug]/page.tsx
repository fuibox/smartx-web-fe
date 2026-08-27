import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleContents } from "@/components/blog/article-contents";
import { ArticleCta } from "@/components/blog/article-cta";
import {
  BlogCategoryLabel,
  BlogDate,
  BlogReadTime,
  BlogUiText,
} from "@/components/blog/blog-i18n";
import { BlogVisual } from "@/components/blog/blog-visual";
import styles from "@/components/blog/blog-article.module.css";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getBlogReadingStats } from "@/content/blog-core";
import {
  getBlogPost,
  getRelatedBlogPosts,
  listAllPublishedBlogPosts,
} from "@/content/blog-repository";
import type { BlogContentBlock } from "@/content/blog-types";
import { formatBlogIndex } from "@/lib/blog-format";
import {
  resolveSmartXUrl,
  SMARTX_INDEXABLE_ROBOTS,
  SMARTX_LOGO_URL,
  SMARTX_OPEN_GRAPH_DEFAULTS,
  SMARTX_ORGANIZATION_ID,
  SMARTX_TWITTER_DEFAULTS,
  SMARTX_WEBSITE_ID,
} from "@/lib/site-metadata";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function renderBlogBlock(block: BlogContentBlock, index: number) {
  const key = `${block.type}-${index}`;

  switch (block.type) {
    case "paragraph":
      return <p key={key}>{block.text}</p>;
    case "heading":
      return (
        <h3 key={key} id={block.id}>
          {block.text}
        </h3>
      );
    case "unordered-list":
      return (
        <ul key={key}>
          {block.items.map((item, itemIndex) => (
            <li key={`${itemIndex}-${item}`}>{item}</li>
          ))}
        </ul>
      );
    case "ordered-list":
      return (
        <ol key={key}>
          {block.items.map((item, itemIndex) => (
            <li key={`${itemIndex}-${item}`}>{item}</li>
          ))}
        </ol>
      );
    case "quote":
      return <blockquote key={key}>{block.text}</blockquote>;
  }
}

export async function generateStaticParams() {
  const posts = await listAllPublishedBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) return {};

  const title = post.seo?.title ?? post.title;
  const description = post.seo?.description ?? post.excerpt;
  const socialImage = post.seo?.image ?? post.cover;

  return {
    title,
    description,
    authors: [{ name: "SmartX", url: "https://smartx.io/" }],
    creator: "SmartX",
    publisher: "SmartX",
    category: post.category,
    alternates: {
      canonical: `/blog/${post.slug}/`,
    },
    robots: SMARTX_INDEXABLE_ROBOTS,
    openGraph: {
      ...SMARTX_OPEN_GRAPH_DEFAULTS,
      title,
      description,
      url: `/blog/${post.slug}/`,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: ["https://smartx.io/"],
      section: post.category,
      images: [
        {
          url: socialImage.src,
          width: socialImage.width,
          height: socialImage.height,
          alt: socialImage.alt,
        },
      ],
    },
    twitter: {
      ...SMARTX_TWITTER_DEFAULTS,
      title,
      description,
      images: [
        {
          url: socialImage.src,
          width: socialImage.width,
          height: socialImage.height,
          alt: socialImage.alt,
        },
      ],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) notFound();

  const relatedPosts = await getRelatedBlogPosts(post.slug);
  const readingStats = getBlogReadingStats(post);
  const articleUrl = `https://smartx.io/blog/${post.slug}/`;
  const socialImage = post.seo?.image ?? post.cover;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${articleUrl}#article`,
    url: articleUrl,
    headline: post.title,
    description: post.seo?.description ?? post.excerpt,
    inLanguage: "en",
    articleSection: post.category,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    wordCount: readingStats.words + readingStats.cjkCharacters,
    timeRequired: `PT${readingStats.minutes}M`,
    mainEntityOfPage: articleUrl,
    isPartOf: { "@id": SMARTX_WEBSITE_ID },
    image: {
      "@type": "ImageObject",
      url: resolveSmartXUrl(socialImage.src),
      width: socialImage.width,
      height: socialImage.height,
      caption: socialImage.alt,
    },
    author: {
      "@type": "Organization",
      "@id": SMARTX_ORGANIZATION_ID,
      name: "SmartX",
      url: "https://smartx.io/",
    },
    publisher: {
      "@type": "Organization",
      "@id": SMARTX_ORGANIZATION_ID,
      name: "SmartX",
      url: "https://smartx.io/",
      logo: {
        "@type": "ImageObject",
        url: SMARTX_LOGO_URL,
        width: 218,
        height: 42,
      },
    },
  };

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <a className={styles.skipLink} href="#article-body">
        <BlogUiText k="skipToArticle" />
      </a>
      <SiteHeader active="blog" allowThemeToggle />

      <main>
        <article>
          <header className={styles.articleHeader}>
            <div className={styles.articleMeta}>
              <Link className={styles.articleMetaBack} href="/blog">
                <i aria-hidden="true">←</i>
                <BlogUiText k="journal" />
              </Link>
              <span className={styles.articleCategory}>
                <BlogCategoryLabel category={post.category} />
              </span>
              <time dateTime={post.publishedAt}>
                <BlogDate date={post.publishedAt} />
              </time>
              <span className={styles.articleReadTime}>
                <BlogReadTime minutes={readingStats.minutes} />
              </span>
            </div>
            <h1>{post.title}</h1>
            {post.dek ? <p>{post.dek}</p> : null}
          </header>

          <div id="article-body" className={styles.articleLayout}>
            <aside className={styles.articleRail}>
              <p className={styles.articleRailLabel}>
                <BlogUiText k="inThisDispatch" />
              </p>
              <ArticleContents
                sections={post.sections.map(({ id, heading }) => ({
                  id,
                  heading,
                }))}
              />
            </aside>

            <div className={styles.articleBody}>
              <div className={styles.articleBodyVisual}>
                <BlogVisual
                  post={post}
                  priority
                  showLabel={false}
                  className={styles.articleCover}
                  sizes="(min-width: 901px) 680px, (min-width: 641px) calc(100vw - 64px), calc(100vw - 40px)"
                />
              </div>

              {post.sections.map((section) => (
                <section key={section.id} id={section.id}>
                  <h2>{section.heading}</h2>
                  {section.blocks.map(renderBlogBlock)}
                </section>
              ))}

              {post.note ? (
                <aside className={styles.articleNote}>{post.note}</aside>
              ) : null}

              <ArticleCta />
            </div>
          </div>
        </article>

        <section
          className={styles.relatedStories}
          aria-labelledby="related-stories-title"
        >
          <header>
            <h2 id="related-stories-title">
              <BlogUiText k="fromTheJournal" />
            </h2>
          </header>
          <div className={styles.relatedGrid}>
            {relatedPosts.slice(0, 3).map((related, index) => (
              <article key={related.slug}>
                <Link href={`/blog/${related.slug}`}>
                  <BlogVisual
                    post={related}
                    showLabel={false}
                    className={styles.relatedVisual}
                    sizes="(min-width: 901px) 400px, (min-width: 641px) 46vw, calc(100vw - 40px)"
                  />
                  <div className={styles.relatedCardCopy}>
                    <span className={styles.relatedIndex}>
                      {formatBlogIndex(index + 1)}
                    </span>
                    <div>
                      <div className={styles.relatedMeta}>
                        <span>
                          <BlogCategoryLabel category={related.category} />
                        </span>
                        <time dateTime={related.publishedAt}>
                          <BlogDate date={related.publishedAt} />
                        </time>
                      </div>
                      <h3>{related.title}</h3>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
