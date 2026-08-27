"use client";

import { useEffect, useState } from "react";
import { useLingui } from "@lingui/react";
import { t } from "@lingui/core/macro";

import { formatBlogIndex } from "@/lib/blog-format";

import styles from "./blog-article.module.css";

type ArticleContentsProps = {
  sections: readonly {
    id: string;
    heading: string;
  }[];
};

export function ArticleContents({ sections }: ArticleContentsProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  useLingui();

  useEffect(() => {
    let frame = 0;

    const updateActiveSection = () => {
      frame = 0;
      const threshold = Math.min(180, window.innerHeight * 0.24);
      let nextId = sections[0]?.id ?? "";

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (!element) continue;

        if (element.getBoundingClientRect().top <= threshold) {
          nextId = section.id;
        } else {
          break;
        }
      }

      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 8
      ) {
        nextId = sections.at(-1)?.id ?? nextId;
      }

      setActiveId((current) => (current === nextId ? current : nextId));
    };

    const queueUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", queueUpdate, { passive: true });
    window.addEventListener("resize", queueUpdate);

    return () => {
      window.removeEventListener("scroll", queueUpdate);
      window.removeEventListener("resize", queueUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [sections]);

  return (
    <nav className={styles.articleContents} aria-label={t`Article contents`}>
      {sections.map((section, index) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          aria-current={activeId === section.id ? "location" : undefined}
        >
          <span>{formatBlogIndex(index + 1)}</span>
          {section.heading}
        </a>
      ))}
    </nav>
  );
}
