"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { SiteFooter } from "@/components/site/site-footer";
import { SMARTX_APP_DESCRIPTION, SMARTX_HERO_TITLE } from "@/lib/site-metadata";
import styles from "./consumer-home.module.css";

const ASSET_ROOT = "/assets/consumer-network";

function Brand() {
  return (
    <span className={styles.brand}>
      <Image
        src={`${ASSET_ROOT}/logo-white.svg`}
        alt=""
        width={34}
        height={28}
      />
      <span>SmartX</span>
    </span>
  );
}

function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isVisible = true;

    const syncPlayback = () => {
      if (reduceMotion.matches || !isVisible) {
        video.pause();
        return;
      }

      void video.play().catch(() => {
        // The poster remains visible if a browser blocks autoplay.
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        syncPlayback();
      },
      { threshold: 0.05 },
    );

    observer.observe(video);
    reduceMotion.addEventListener("change", syncPlayback);
    syncPlayback();

    return () => {
      observer.disconnect();
      reduceMotion.removeEventListener("change", syncPlayback);
    };
  }, []);

  return (
    <section className={styles.hero} aria-labelledby="consumer-hero-title">
      <div className={styles.heroMedia} aria-hidden="true">
        <Image
          className={styles.heroPoster}
          src={`${ASSET_ROOT}/hero-brand-poster.jpg`}
          alt=""
          fill
          sizes="100vw"
          priority
        />
        <video
          ref={videoRef}
          className={styles.heroVideo}
          poster={`${ASSET_ROOT}/hero-brand-poster.jpg`}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
        >
          <source src={`${ASSET_ROOT}/hero-brand.mp4`} type="video/mp4" />
        </video>
      </div>
      <div className={styles.heroShade} aria-hidden="true" />

      <header className={styles.header}>
        <Link href="/" className={styles.headerBrand} aria-label="SmartX home">
          <Brand />
        </Link>
      </header>

      <div className={styles.heroCopy}>
        <h1 id="consumer-hero-title" tabIndex={-1}>{SMARTX_HERO_TITLE}</h1>
        <div className={styles.heroSubcopy}>
          <p className={styles.heroLede}>{SMARTX_APP_DESCRIPTION}</p>
        </div>
      </div>
      <SiteFooter overlay />
    </section>
  );
}

export function ConsumerHome() {
  return (
    <main className={styles.page}>
      <a className={styles.skipLink} href="#consumer-hero-title">
        Skip to SmartX
      </a>
      <Hero />
    </main>
  );
}
