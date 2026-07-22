"use client";

import { useEffect, useRef } from "react";

/**
 * V4 签名纹理：像素抖动——克制版。
 * 只作为边缘纹理存在（品牌片头的右缘密度带 + 底部过渡带），
 * 中央阅读区完全干净；滚动时底部带增强、整体让位给下一章。
 */

const CELL = 8;
const TEAL = "8, 223, 181";

const BAYER_8 = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
];

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function noise2(x: number, y: number, t: number) {
  const v =
    Math.sin(x * 12.9898 + y * 78.233 + t * 0.6) * 0.5 +
    Math.sin(x * 3.1 - y * 5.7 + t * 0.3) * 0.5;
  return v * 0.5 + 0.5;
}

type DitherFieldProps = {
  /** hero 滚动进度 ref（0=顶部，1=完全离开） */
  scrollRef: React.MutableRefObject<number>;
};

export function DitherField({ scrollRef }: DitherFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let startTime = 0;
    let lastDraw = 0;
    let width = 0;
    let height = 0;
    let pageVisible = document.visibilityState === "visible";

    const schedule = () => {
      if (pageVisible && !frame) frame = window.requestAnimationFrame(draw);
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      schedule();
    };

    const draw = (now: number) => {
      frame = 0;
      if (!pageVisible) return;
      if (!reduceMotion.matches && now - lastDraw < 1000 / 30) {
        schedule();
        return;
      }
      lastDraw = now;
      if (!startTime) startTime = now;
      const elapsed = reduceMotion.matches ? 0 : (now - startTime) / 1000;
      const scroll = scrollRef.current;
      // 入场：右缘密度带从无到有（0.3-1.4s），克制的呼吸
      const intro = reduceMotion.matches ? 1 : smoothstep(0.3, 1.4, elapsed);
      // 滚动：整体让位（保留 25%），底部过渡带增强后再消失
      const yield_ = 1 - smoothstep(0.1, 0.9, scroll) * 0.75;

      context.clearRect(0, 0, width, height);

      const columns = Math.ceil(width / CELL);
      const rows = Math.ceil(height / CELL);
      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const x = column * CELL;
          const y = row * CELL;
          const nx = x / width;
          const ny = y / height;

          // 极稀疏的底噪（星尘级，几乎不可察觉的闪烁）
          let density = 0.008 + 0.014 * noise2(column * 0.17, row * 0.19, elapsed);
          // 品牌构图：右缘密度带（片头素材的直接引用）+ 缓慢的纵向密度波
          density +=
            0.42 *
            smoothstep(0.87, 1.02, nx) *
            intro *
            (0.82 + 0.18 * noise2(column * 0.07, row * 0.05, elapsed * 0.5)) *
            (0.92 + 0.08 * Math.sin(ny * 7 - elapsed * 0.7));
          // 底部过渡带：随滚动增强，交接给 01 章后随 yield 一起退场
          density +=
            0.26 *
            smoothstep(0.84, 1.04, ny) *
            (0.25 + 0.75 * smoothstep(0.05, 0.5, scroll));

          density *= yield_;

          const threshold = (BAYER_8[row % 8][column % 8] + 0.5) / 64;
          if (density > threshold) {
            const alpha = Math.min(0.5, 0.16 + density * 0.55);
            context.fillStyle = `rgba(${TEAL}, ${alpha.toFixed(3)})`;
            context.fillRect(x, y, CELL - 1, CELL - 1);
          }
        }
      }

      // Hero 离开后保留静态终帧；回滚到 Hero 时由 scroll 事件重新唤醒。
      if (!reduceMotion.matches && scroll < 0.98) schedule();
    };

    const handleVisibility = () => {
      pageVisible = document.visibilityState === "visible";
      if (!pageVisible && frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      } else {
        schedule();
      }
    };

    resize();
    schedule();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", schedule, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);
    reduceMotion.addEventListener("change", schedule);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", schedule);
      document.removeEventListener("visibilitychange", handleVisibility);
      reduceMotion.removeEventListener("change", schedule);
    };
  }, [scrollRef]);

  return <canvas ref={canvasRef} aria-hidden="true" data-dither-field />;
}
