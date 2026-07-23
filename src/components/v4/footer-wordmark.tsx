"use client";

import { useEffect, useRef } from "react";

import styles from "../site/site-chrome.module.css";

/**
 * FooterWordmark：超大 SMARTX 字标的像素聚合原型。
 * PixelOperator 以 16px 网格设计，因此在 64px（4px/字形像素）下逐字符渲染、
 * 按 4px 步长采样——每个字形像素恰好映射为一个 cell，笔画厚度均匀；
 * 字符间强制留 1 个字形像素的空档，保证字母彼此分开。
 * footer 进入视口时格子沿轴向滑入归位（逐字母 stagger、强 ease-out），
 * 落位瞬间一次极淡 teal 微亮后沉回低对比灰，此后完全静止。
 * 字体未就绪 / reduced-motion / canvas 失败 → 原 DOM 字标兜底。
 */

const SAMPLE_FONT = 64; // 16px 设计网格 × 4
const PX = 4; // 一个字形像素在采样画布上的边长
const FINAL_COLOR = "148, 166, 194";
const FINAL_ALPHA = 0.18;
const TEAL = "8, 223, 181";
const SLIDE_MS = 460;
const FLASH_MS = 240;
const LETTER_STAGGER_MS = 120;

type Glyph = {
  col: number;
  row: number;
  delay: number;
  /** 起始偏移（格子数，仅单轴） */
  dx: number;
  dy: number;
};

type Sampled = { cells: Array<[number, number, number]>; cols: number; rows: number };

/** 逐字符渲染 + 原生网格采样；返回 [col, row, letterIndex] 列表 */
function sampleWordmark(text: string): Sampled | null {
  const off = document.createElement("canvas");
  off.width = 1024;
  off.height = 160;
  const context = off.getContext("2d", { willReadFrequently: true });
  if (!context) return null;
  const font = `700 ${SAMPLE_FONT}px PixelOperatorMono, monospace`;
  const baseline = 128; // 4 的整数倍，保持字形像素与采样网格同相

  /* 第一遍：单独渲染每个字符量出实际字形包围盒 */
  const boxes: Array<{ minX: number; maxX: number }> = [];
  for (const char of text) {
    context.clearRect(0, 0, off.width, off.height);
    context.font = font;
    context.fillText(char, 16, baseline);
    const data = context.getImageData(0, 0, off.width, off.height).data;
    let minX = Infinity;
    let maxX = -1;
    for (let y = 0; y < off.height; y += 1) {
      for (let x = 0; x < off.width; x += 1) {
        if (data[(y * off.width + x) * 4 + 3] > 140) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
        }
      }
    }
    if (maxX < 0) return null;
    boxes.push({ minX, maxX });
  }

  /* 第二遍：按"字形宽 + 1 个字形像素空档"排版到同一画布 */
  context.clearRect(0, 0, off.width, off.height);
  context.font = font;
  const letterStartX: number[] = [];
  let cursor = 8;
  text.split("").forEach((char, index) => {
    const box = boxes[index];
    /* 光标与字形 minX 都落在 4px 网格上，平移量保持网格同相 */
    context.fillText(char, 16 + cursor - box.minX, baseline);
    letterStartX.push(cursor);
    const glyphWidth = Math.ceil((box.maxX - box.minX + 1) / PX) * PX;
    cursor += glyphWidth + PX;
  });

  const data = context.getImageData(0, 0, off.width, off.height).data;
  const raw: Array<[number, number, number]> = [];
  let minC = Infinity;
  let minR = Infinity;
  let maxC = 0;
  let maxR = 0;
  for (let sy = 0; sy < off.height; sy += PX) {
    for (let sx = 0; sx < off.width; sx += PX) {
      /* 取字形像素块的中心点判定 */
      const px = Math.min(off.width - 1, sx + PX / 2);
      const py = Math.min(off.height - 1, sy + PX / 2);
      if (data[(py * off.width + px) * 4 + 3] > 140) {
        const c = sx / PX;
        const r = sy / PX;
        let letter = 0;
        for (let index = text.length - 1; index >= 0; index -= 1) {
          if (sx >= letterStartX[index]) {
            letter = index;
            break;
          }
        }
        raw.push([c, r, letter]);
        if (c < minC) minC = c;
        if (r < minR) minR = r;
        if (c > maxC) maxC = c;
        if (r > maxR) maxR = r;
      }
    }
  }
  if (!raw.length) return null;
  return {
    cells: raw.map(([c, r, letter]) => [c - minC, r - minR, letter]),
    cols: maxC - minC + 1,
    rows: maxR - minR + 1,
  };
}

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

export function FooterWordmark() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const strongRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const strong = strongRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !strong || !canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let disposed = false;
    let frame = 0;
    let started = false;

    const start = async () => {
      if (started) return;
      started = true;
      try {
        await document.fonts.load(`700 ${SAMPLE_FONT}px PixelOperatorMono`);
      } catch {
        return;
      }
      if (disposed) return;
      const sampled = sampleWordmark("SMARTX");
      if (!sampled) return;

      /* 以 DOM 字标的实际字号换算 cell 尺寸，保证观感与原文本一致；
         网格总宽超出容器（窄屏）时整体缩到正好放下 */
      const fontPx = parseFloat(window.getComputedStyle(strong).fontSize) || 240;
      const rect = strong.getBoundingClientRect();
      const cell = Math.min(fontPx / 16, rect.width / sampled.cols);
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const glyphs: Glyph[] = sampled.cells.map(([col, row, letter]) => {
        const axis = Math.random() < 0.5 ? "x" : "y";
        const distance = (3 + Math.floor(Math.random() * 7)) * (Math.random() < 0.5 ? -1 : 1);
        return {
          col,
          row,
          delay: letter * LETTER_STAGGER_MS + Math.random() * 90,
          dx: axis === "x" ? distance : 0,
          dy: axis === "y" ? distance : 0,
        };
      });
      const totalMs =
        Math.max(...glyphs.map((glyph) => glyph.delay)) + SLIDE_MS + FLASH_MS + 60;

      /* 垂直方向：字形网格在字标盒内居中 */
      const originY = (rect.height - sampled.rows * cell) / 2;
      wrap.dataset.assembling = "true";
      const startedAt = performance.now();

      const render = (now: number) => {
        const elapsed = now - startedAt;
        context.clearRect(0, 0, rect.width, rect.height);
        for (const glyph of glyphs) {
          const t = Math.min(1, Math.max(0, (elapsed - glyph.delay) / SLIDE_MS));
          if (t <= 0) continue;
          const eased = easeOutQuart(t);
          const x = (glyph.col + glyph.dx * (1 - eased)) * cell;
          const y = originY + (glyph.row + glyph.dy * (1 - eased)) * cell;
          const flashT = (elapsed - glyph.delay - SLIDE_MS) / FLASH_MS;
          let color = `rgba(${FINAL_COLOR}, ${(FINAL_ALPHA * eased).toFixed(3)})`;
          if (flashT > 0 && flashT < 1) {
            color = `rgba(${TEAL}, ${(0.26 * (1 - flashT) + FINAL_ALPHA * 0.6).toFixed(3)})`;
          }
          context.fillStyle = color;
          context.fillRect(x + 0.5, y + 0.5, cell - 1, cell - 1);
        }
        if (elapsed < totalMs && !disposed) {
          frame = window.requestAnimationFrame(render);
        } else {
          frame = 0;
        }
      };
      frame = window.requestAnimationFrame(render);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void start();
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(wrap);

    return () => {
      disposed = true;
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={wrapRef} className={styles.footerWordmarkWrap} aria-hidden="true">
      <strong ref={strongRef} className={styles.footerWordmark}>
        SMARTX
      </strong>
      <canvas ref={canvasRef} className={styles.wordmarkCanvas} />
    </div>
  );
}
