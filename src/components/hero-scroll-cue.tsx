"use client";

import { ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";

import { STORY_SCROLL_VIEWPORTS, STORY_STATES } from "./motion-lab/story.config";

export function HeroScrollCue() {
  const [dismissed, setDismissed] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const readyTimer = window.setTimeout(() => setIsReady(true), 2200);
    const dismissAfterScroll = () => {
      if (window.scrollY <= 24) {
        setDismissed(false);
      } else if (window.scrollY > Math.max(64, window.innerHeight * 0.1)) {
        setDismissed(true);
      }
    };
    window.addEventListener("scroll", dismissAfterScroll, { passive: true });
    dismissAfterScroll();
    return () => {
      window.clearTimeout(readyTimer);
      window.removeEventListener("scroll", dismissAfterScroll);
    };
  }, []);

  const exploreStory = () => {
    const root = document.querySelector<HTMLElement>("[data-integrated-narrative-root]");
    const fallbackTarget = document.querySelector<HTMLElement>("#product");
    if (!root && !fallbackTarget) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!root) {
      setDismissed(true);
      fallbackTarget?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
      return;
    }

    const signalState = STORY_STATES.find((state) => state.id === "signal");
    if (!signalState) return;

    setDismissed(true);

    const rootTop = window.scrollY + root.getBoundingClientRect().top;
    window.scrollTo({
      top: rootTop + window.innerHeight * STORY_SCROLL_VIEWPORTS * signalState.progress,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <button
      className={`hero-scroll-cue${isReady ? " is-ready" : ""}${dismissed ? " is-dismissed" : ""}`}
      type="button"
      onClick={exploreStory}
      aria-label="Scroll to explore how SmartX reads a market"
    >
      <span>Scroll to explore</span>
      <i aria-hidden="true">
        <ArrowDown />
      </i>
    </button>
  );
}
