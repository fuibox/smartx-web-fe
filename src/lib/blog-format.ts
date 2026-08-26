import { resolveSmartXUrl } from "./site-metadata";

export function formatBlogIndex(index: number) {
  return String(index).padStart(2, "0");
}

export function formatBlogDate(publishedAt: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${publishedAt}T00:00:00Z`));
}

export function formatBlogShortDate(publishedAt: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${publishedAt}T00:00:00Z`));
}

export function formatBlogArchiveMonth(publishedAt: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })
    .format(new Date(`${publishedAt}T00:00:00Z`))
    .toUpperCase()
    .replace(" ", " / ");
}

export function formatBlogReadTime(minutes: number) {
  return `${minutes} min read`;
}

export { resolveSmartXUrl };
