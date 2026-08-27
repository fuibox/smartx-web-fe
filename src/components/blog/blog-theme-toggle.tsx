"use client";

import { useEffect, useState } from "react";
import { useLingui } from "@lingui/react";
import { t } from "@lingui/core/macro";
import { FiMoon, FiSun } from "react-icons/fi";

import styles from "@/components/site/site-chrome.module.css";

type BlogTheme = "dark" | "light";

const STORAGE_KEY = "smartx-blog-theme";

function getCurrentTheme(): BlogTheme {
  return document.documentElement.dataset.blogTheme === "light"
    ? "light"
    : "dark";
}

export function BlogThemeToggle() {
  const [theme, setTheme] = useState<BlogTheme | null>(null);
  useLingui();

  useEffect(() => {
    setTheme(getCurrentTheme());
  }, []);

  const toggleTheme = () => {
    const nextTheme: BlogTheme =
      getCurrentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.blogTheme = nextTheme;
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    setTheme(nextTheme);
  };

  const toggleLabel =
    theme === "light" ? t`Use dark reading theme` : t`Use light reading theme`;

  return (
    <button
      className={styles.themeToggle}
      type="button"
      onClick={toggleTheme}
      aria-label={toggleLabel}
      title={toggleLabel}
    >
      <FiSun className={styles.themeSun} aria-hidden="true" />
      <FiMoon className={styles.themeMoon} aria-hidden="true" />
    </button>
  );
}
