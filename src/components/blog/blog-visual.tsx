import Image from "next/image";

import type { BlogPostSummary } from "@/content/blog-types";

import styles from "./blog-visual.module.css";

type BlogVisualProps = {
  post: Pick<BlogPostSummary, "category" | "cover">;
  priority?: boolean;
  showLabel?: boolean;
  sizes?: string;
  className?: string;
};

export function BlogVisual({
  post,
  priority = false,
  showLabel = true,
  sizes = "(min-width: 1080px) 1120px, 100vw",
  className,
}: BlogVisualProps) {
  return (
    <div className={`${styles.coverVisual}${className ? ` ${className}` : ""}`}>
      <Image
        src={post.cover.src}
        alt={post.cover.alt}
        fill
        priority={priority}
        sizes={sizes}
      />
      {showLabel ? (
        <span aria-hidden="true">SMARTX / {post.category.toUpperCase()}</span>
      ) : null}
    </div>
  );
}
