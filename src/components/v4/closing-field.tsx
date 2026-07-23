"use client";

import { useEffect, useRef, type RefObject } from "react";

import styles from "./story-page.module.css";

/**
 * ClosingFlowField：Banner 的像素深度场（§2.5 语义映射 → 深度图/量能柱）。
 * 全宽竖直 cell 柱从底边生长，高度轮廓左低右高、峰值指向 CTA；
 * 一道涌浪按周期从左向右扫过，经过的柱子逐格抬升再落回，
 * 抵达按钮时左边框亮起一列再熄灭——量能推着你去交易。
 * 柱高一律整格步进（网格轴向），顶边挂一排短刻度与底部呼应。
 * 标题与 docs 链接下方的柱高有硬上限，阅读区不被侵入；
 * 离屏暂停；reduced-motion 只渲染静态基础轮廓。
 */

const CELL = 10;
/** 柱间距（格）：10px 柱 + 10px 空档，继承竖线版的韵律 */
const PITCH = 2;
/** 涌浪周期（含离场的静默段） */
const WAVE_MS = 5600;
/** 涌浪高斯半宽（列数） */
const WAVE_WIDTH = 5;
const WAVE_AMP = 3.4;
const TEAL = "8, 223, 181";

type Zone = {
  cols: number;
  rows: number;
  keepOut: { c0: number; c1: number; r0: number; r1: number } | null;
  targetCol: number;
  targetR0: number;
  targetR1: number;
};

function computeZone(
  section: HTMLElement,
  copy: HTMLElement | null,
  cta: HTMLElement | null,
): Zone {
  const rect = section.getBoundingClientRect();
  const cols = Math.ceil(rect.width / CELL);
  const rows = Math.ceil(rect.height / CELL);

  let keepOut: Zone["keepOut"] = null;
  if (copy) {
    const c = copy.getBoundingClientRect();
    keepOut = {
      c0: Math.floor((c.left - rect.left) / CELL) - 2,
      c1: Math.ceil((c.right - rect.left) / CELL) + 2,
      r0: Math.floor((c.top - rect.top) / CELL) - 2,
      r1: Math.ceil((c.bottom - rect.top) / CELL) + 2,
    };
  }

  let targetCol = cols - 6;
  let targetR0 = Math.floor(rows / 2) - 2;
  let targetR1 = Math.floor(rows / 2) + 2;
  if (cta) {
    const c = cta.getBoundingClientRect();
    targetCol = Math.floor((c.left - rect.left) / CELL) - 1;
    targetR0 = Math.floor((c.top - rect.top) / CELL) + 1;
    targetR1 = Math.ceil((c.bottom - rect.top) / CELL) - 2;
  }
  return { cols, rows, keepOut, targetCol, targetR0, targetR1 };
}

/** 确定性伪随机（列级噪声/相位，两次渲染一致） */
function hash(seed: number): number {
  return Math.abs(Math.sin(seed * 12.9898) * 43758.5453) % 1;
}

type Column = { c: number; base: number; cap: number; phase: number };

/** 基础高度轮廓：左低右高的量能坡 + 每列 ±1 格的天际线噪声 */
function buildProfile(zone: Zone, compact: boolean): Column[] {
  const { cols, rows, keepOut, targetCol, targetR1 } = zone;
  const columns: Column[] = [];
  /* 窄屏（列布局）：内容纵向堆叠，柱阵只保留一条低矮底带 */
  const mobile = !compact && cols < 78;
  /* CTA 及 docs 链接下方的硬上限：柱顶至少低于按钮底 7 格 */
  const rightCap = Math.max(4, rows - (targetR1 + 7));
  for (let c = 0; c < cols; c += PITCH) {
    const x = c / (cols - 1);
    const ramp = mobile
      ? 2 + 3.4 * Math.pow(x, 1.4)
      : compact
        ? 2 + 7 * Math.pow(x, 1.55)
        : 3 + 13 * Math.pow(x, 1.7);
    const noise = Math.floor(hash(c + 7) * 3) - 1;
    let cap = mobile ? 6 : rows - 2;
    if (!mobile && keepOut && c >= keepOut.c0 - 1 && c <= keepOut.c1 + 1) {
      cap = Math.max(3, rows - (keepOut.r1 + 2));
    }
    if (!mobile && c >= targetCol - 26) cap = Math.min(cap, rightCap);
    columns.push({
      c,
      base: Math.max(2, Math.round(ramp + noise)),
      cap,
      phase: hash(c + 31) * Math.PI * 2,
    });
  }
  return columns;
}

function drawCell(
  context: CanvasRenderingContext2D,
  col: number,
  row: number,
  alpha: number,
): void {
  context.fillStyle = `rgba(${TEAL}, ${alpha.toFixed(3)})`;
  context.fillRect(col * CELL + 1, row * CELL + 1, CELL - 2, CELL - 2);
}

export function ClosingFlowField({
  sectionRef,
  copyRef,
  ctaRef,
  className = styles.closingCanvas,
  variant = "default",
}: {
  sectionRef: RefObject<HTMLElement | null>;
  copyRef: RefObject<HTMLDivElement | null>;
  ctaRef: RefObject<HTMLAnchorElement | null>;
  className?: string;
  variant?: "default" | "compact";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const compact = variant === "compact";

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let zone: Zone | null = null;
    let columns: Column[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = false;

    /** @param now 传 null 渲染静态基础轮廓（reduced-motion / 首帧） */
    const draw = (now: number | null) => {
      if (!zone) return;
      const { cols, rows, targetCol, targetR0, targetR1 } = zone;
      context.clearRect(0, 0, width, height);

      /* 顶边短刻度：每隔一柱挂 1-2 格，与底部柱阵上下框定 */
      for (const column of columns) {
        if ((column.c / PITCH) % 2 !== 0) continue;
        const tick = 1 + Math.floor(hash(column.c + 53) * 2);
        for (let row = 0; row < tick; row += 1) {
          drawCell(context, column.c, row, 0.05);
        }
      }

      /* 涌浪中心（列坐标）：越界起止，留出静默段 */
      const wave =
        now === null ? -100 : ((now % WAVE_MS) / WAVE_MS) * (cols + 30) - 15;

      for (const column of columns) {
        const wobble =
          now === null
            ? 0
            : Math.round(Math.sin(now / 6800 + column.phase) * 0.9);
        const swell = Math.exp(-Math.pow((column.c - wave) / WAVE_WIDTH, 2));
        const bump = Math.round(WAVE_AMP * swell);
        const columnHeight = Math.min(
          column.cap,
          Math.max(2, column.base + wobble + bump),
        );
        for (let index = 0; index < columnHeight; index += 1) {
          const row = rows - 1 - index;
          const isTop = index === columnHeight - 1;
          const bodyAlpha = 0.045 + (index / Math.max(1, columnHeight - 1)) * 0.085;
          const alpha = isTop ? 0.24 + 0.4 * swell : bodyAlpha;
          drawCell(context, column.c, row, alpha);
        }
      }

      /* 涌浪抵达按钮：左边框列亮起再熄灭（窄屏按钮在场外，不做） */
      if (now !== null && (compact || cols >= 78)) {
        const arrive = Math.exp(-Math.pow((wave - targetCol) / 3, 2));
        if (arrive > 0.05) {
          for (let row = targetR0; row <= targetR1; row += 1) {
            drawCell(context, targetCol, row, 0.7 * arrive);
          }
        }
      }
    };

    const resize = () => {
      const rect = section.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      zone = computeZone(section, copyRef.current, ctaRef.current);
      columns = buildProfile(zone, compact);
      if (reduced) draw(null);
    };

    const render = (now: number) => {
      frame = visible ? window.requestAnimationFrame(render) : 0;
      draw(now);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (reduced) return;
        if (visible && !frame) frame = window.requestAnimationFrame(render);
      },
      { threshold: 0.08 },
    );

    resize();
    observer.observe(section);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(section);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
      visible = false;
    };
  }, [sectionRef, copyRef, ctaRef, compact]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
