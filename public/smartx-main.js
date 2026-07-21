// SmartX hero surface: cosmic starfield renderer + hero text calibration.
// Exposed lifecycle: window.SmartXKineticGrid { start, destroy, getCanvas, pause, resume, renderOnce }.

let canvas = null;
let ctx = null;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let animationFrameId = 0;
let syncQueued = false;
let pageObserver = null;
let rendererPaused = false;

const state = {
  dpr: 1,
  width: 0,
  height: 0,
  lastTime: 0,
  pointerDown: false,
  rainClock: 0,
  rainNextSpawn: 0.2,
  signalClock: 0,
  signalNextSpawn: 1.3,
  signalSequence: 0,
  meteors: [],
  pulses: [],
  focus: null,
};

/**
 * 所有流星共享同一个辐射方向（流星雨语义）：从左上方进入，向右下方划过。
 * 个体只允许极小的角度偏差，保证画面读作“同一场流星雨”，而不是乱飞的粒子。
 */
const METEOR_DIRECTION = (() => {
  const x = 0.9;
  const y = 0.44;
  const length = Math.hypot(x, y);
  return { x: x / length, y: y / length };
})();

/**
 * 信号流星：彩色、更亮、更慢、带头部脉冲。四条固定路线错开高度与弧度，
 * 避开标题所在的中央横带（y ≈ 0.38-0.62 的中心区域只允许尾迹穿过，不允许头部停留）。
 */
/** 路线长度保证终点在可视区之外——流星永远滑出屏幕后再回收，不在画面中央凭空消失。 */
const SIGNAL_ROUTES = [
  { id: "fast", color: "255, 155, 62", start: [-0.16, 0.02], length: 1.55, bow: 0.05, guideAlpha: 0.02 },
  { id: "smart", color: "54, 199, 232", start: [0.12, -0.12], length: 1.25, bow: -0.035, guideAlpha: 0.024 },
  { id: "cohort", color: "136, 184, 216", start: [-0.22, 0.34], length: 1.62, bow: 0.03, guideAlpha: 0.016 },
  { id: "news", color: "255, 196, 94", start: [0.42, -0.1], length: 0.95, bow: -0.05, guideAlpha: 0.018 },
];

const AMBIENT_CAP = 16;
const SIGNAL_CAP = 4;

function routeLengthToExit(start) {
  const toRightEdge = (1.18 - start[0]) / METEOR_DIRECTION.x;
  const toBottomEdge = (1.18 - start[1]) / METEOR_DIRECTION.y;
  return Math.min(toRightEdge, toBottomEdge) + 0.06;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

function smootherStep(value) {
  const t = clamp(value, 0, 1);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function prepareCalibrationText() {
  const targets = document.querySelectorAll("[data-calibrate-text]");

  for (const target of targets) {
    const text = (target.textContent || "").replace(/ /g, " ");
    if (
      target.getAttribute("data-calibrated-text") === text &&
      target.querySelector(".hero-title__char")
    ) {
      continue;
    }

    target.textContent = "";
    target.setAttribute("data-calibrated-text", text);
    target.style.setProperty("--char-count", text.length);

    for (const [index, char] of [...text].entries()) {
      const span = document.createElement("span");
      span.className = "hero-title__char";
      span.setAttribute("aria-hidden", "true");
      span.style.setProperty("--char-index", index);
      span.style.setProperty("--char-delay", `${160 + index * 38}ms`);
      span.textContent = char === " " ? " " : char;
      target.append(span);
    }
  }
}

/**
 * 路线是一条沿 METEOR_DIRECTION 的直线加正弦弓形偏移，
 * 数学上保证任何路线的整体方位一致，只有弧度和位置不同。
 */
function pointOnRoute(route, t) {
  const progress = clamp(t, 0, 1);
  const distance = route.length * progress;
  const perpendicularX = -METEOR_DIRECTION.y;
  const perpendicularY = METEOR_DIRECTION.x;
  const bowOffset = Math.sin(progress * Math.PI) * route.bow;

  return {
    x: (route.start[0] + METEOR_DIRECTION.x * distance + perpendicularX * bowOffset) * state.width,
    y: (route.start[1] + METEOR_DIRECTION.y * distance + perpendicularY * bowOffset) * state.height,
  };
}

function makeRainRoute(far) {
  const fromTop = Math.random() < 0.58;
  const start = fromTop
    ? [lerp(-0.15, 0.72, Math.random()), -0.12]
    : [-0.16, lerp(0.02, 0.58, Math.random())];

  return {
    id: far ? "rain-far" : "rain",
    color: far ? "203, 228, 224" : "226, 245, 241",
    start,
    length: routeLengthToExit(start),
    bow: (Math.random() - 0.5) * 0.05,
    guideAlpha: 0,
  };
}

function spawnMeteor(kind, options = {}) {
  let route;
  const far = kind === "ambient" && Math.random() < 0.4;
  if (kind === "signal") {
    route = SIGNAL_ROUTES[state.signalSequence % SIGNAL_ROUTES.length];
    state.signalSequence += 1;
  } else {
    route = makeRainRoute(far);
  }

  // 时长按路线长度换算成近似恒定速度，远景层更慢更小，铺纵深。
  const speed = kind === "ambient" ? (far ? 0.14 : 0.24) : 0.24;
  state.meteors.push({
    route,
    kind,
    age: 0,
    duration: options.duration ?? route.length / (speed * (0.85 + Math.random() * 0.3)),
    trail: options.trail ?? (kind === "ambient" ? (far ? 0.08 : 0.13) : 0.22),
    intensity:
      options.intensity ?? (kind === "ambient" ? (far ? 0.16 : 0.3) + Math.random() * 0.16 : 1),
    size: options.size ?? (kind === "ambient" ? (far ? 0.34 : 0.55) + Math.random() * 0.18 : 1),
    pulsePhase: Math.random() * Math.PI * 2,
  });

  const sameKind = state.meteors.filter((meteor) => meteor.kind === kind);
  const cap = kind === "ambient" ? AMBIENT_CAP : SIGNAL_CAP;
  if (sameKind.length > cap) {
    state.meteors.splice(state.meteors.indexOf(sameKind[0]), 1);
  }
}

function triggerPulse(x, y) {
  state.pulses.push({ x, y, age: 0 });

  if (state.pulses.length > 3) {
    state.pulses.shift();
  }
}

function setFocus(x, y) {
  state.focus = { x, y, age: 0 };
}

function updateEvents(dt) {
  state.meteors = state.meteors.filter((meteor) => {
    meteor.age += dt;
    return meteor.age < meteor.duration;
  });
  state.pulses = state.pulses.filter((pulse) => {
    pulse.age += dt;
    return pulse.age < 0.72;
  });

  if (state.focus) {
    state.focus.age += dt;
    if (state.focus.age >= 1.25) {
      state.focus = null;
    }
  }
}

function renderStars(time) {
  const area = state.width * state.height;
  const count = Math.max(260, Math.min(420, Math.round(area / 4200)));
  const centerX = state.width * 0.5;
  const centerY = state.height * 0.5;

  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  for (let index = 0; index < count; index += 1) {
    const xSeed = Math.sin((index + 1) * 19.193) * 37121.643;
    const ySeed = Math.sin((index + 1) * 47.711) * 21641.287;
    const sizeSeed = Math.sin((index + 1) * 71.173) * 11437.829;
    const xUnit = xSeed - Math.floor(xSeed);
    const yUnit = ySeed - Math.floor(ySeed);
    const sizeUnit = sizeSeed - Math.floor(sizeSeed);
    const sourceX = xUnit * state.width;
    const sourceY = yUnit * state.height;
    const layer = sizeUnit > 0.92 ? 2 : sizeUnit > 0.66 ? 1 : 0;
    const rotation = time * [0.0014, -0.0028, 0.0046][layer];
    const offsetX = sourceX - centerX;
    const offsetY = sourceY - centerY;
    const cosRotation = Math.cos(rotation);
    const sinRotation = Math.sin(rotation);
    const x = centerX + offsetX * cosRotation - offsetY * sinRotation;
    const y = centerY + offsetX * sinRotation + offsetY * cosRotation;
    const size = sizeUnit > 0.92 ? 1.55 : sizeUnit > 0.66 ? 1.05 : 0.68;
    // 约 15% 的星星快速闪烁（0.8-2s 周期），其余保持慢呼吸——闪烁感来自少数快闪星。
    const isFastTwinkler = sizeUnit > 0.5 && sizeUnit < 0.65;
    const twinkleSpeed = isFastTwinkler ? 3.2 + sizeUnit * 3.6 : 0.18 + sizeUnit * 1.15;
    const twinkleRange = isFastTwinkler ? 0.52 : [0.16, 0.32, 0.56][layer];
    const twinkleBase = isFastTwinkler ? 0.6 : [0.62, 0.68, 0.72][layer];
    const twinkle = twinkleBase + Math.sin(time * twinkleSpeed + index * 4.17) * twinkleRange;
    // 大星偶发 glint：短暂增亮并带十字光芒，同屏同时只有零星几颗。
    const glintWave = sizeUnit > 0.88 ? Math.sin(time * 0.34 + index * 2.71) : -1;
    const glint = glintWave > 0 ? Math.pow(glintWave, 22) : 0;
    const alpha = Math.max(0.035, (0.14 + sizeUnit * 0.34) * twinkle + glint * 0.42);

    if (size > 1.2) {
      const glow = ctx.createRadialGradient(x, y, 0, x, y, size * 6.5);
      glow.addColorStop(0, `rgba(197, 255, 245, ${(alpha * 0.46).toFixed(3)})`);
      glow.addColorStop(1, "rgba(82, 191, 183, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(x - size * 6.5, y - size * 6.5, size * 13, size * 13);
    }

    if (glint > 0.12) {
      const rayLength = size * (5 + glint * 7);
      ctx.strokeStyle = `rgba(222, 252, 246, ${(glint * 0.5).toFixed(3)})`;
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(x - rayLength, y);
      ctx.lineTo(x + rayLength, y);
      ctx.moveTo(x, y - rayLength);
      ctx.lineTo(x, y + rayLength);
      ctx.stroke();
    }

    ctx.fillStyle = `rgba(204, 250, 241, ${alpha.toFixed(3)})`;
    ctx.fillRect(x - size * 0.5, y - size * 0.5, size, size);
  }

  ctx.restore();
}

function renderGuides(time) {
  const scale = Math.min(state.width, state.height);

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.lineCap = "round";
  ctx.setLineDash([scale * 0.1, scale * 0.045]);

  for (const route of SIGNAL_ROUTES) {
    const active = state.meteors.some((meteor) => meteor.route.id === route.id);
    const pulse = 0.78 + Math.sin(time * 0.42 + route.start[0] * 8) * 0.22;
    const alpha = route.guideAlpha * (active ? 4.2 : 0.7) * pulse;
    if (alpha <= 0.001) continue;

    ctx.beginPath();
    const first = pointOnRoute(route, 0);
    ctx.moveTo(first.x, first.y);
    for (let step = 1; step <= 24; step += 1) {
      const point = pointOnRoute(route, step / 24);
      ctx.lineTo(point.x, point.y);
    }
    ctx.lineDashOffset = -time * 8;
    ctx.strokeStyle = `rgba(${route.color}, ${alpha.toFixed(3)})`;
    ctx.lineWidth = active ? 1.05 : 0.62;
    ctx.stroke();
  }

  ctx.setLineDash([]);
  ctx.restore();
}

function renderMeteors(time) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.lineCap = "round";

  for (const meteor of state.meteors) {
    const isAmbient = meteor.kind === "ambient";
    const progress = clamp(meteor.age / meteor.duration, 0, 1);
    const tailStart = Math.max(0, progress - meteor.trail);
    const fadeIn = smootherStep(meteor.age / (isAmbient ? 0.72 : 0.32));
    const fadeOut = 1 - smootherStep(
      (meteor.age - (meteor.duration - (isAmbient ? 1.3 : 0.7))) / (isAmbient ? 1.3 : 0.7),
    );
    const visibility = fadeIn * fadeOut;
    const pieces = isAmbient ? 12 : 18;

    for (let piece = 0; piece < pieces; piece += 1) {
      const segmentStart = lerp(tailStart, progress, piece / pieces);
      const segmentEnd = lerp(tailStart, progress, (piece + 1) / pieces);
      const segmentWeight = (piece + 1) / pieces;
      const start = pointOnRoute(meteor.route, segmentStart);
      const end = pointOnRoute(meteor.route, segmentEnd);
      const alpha = visibility * meteor.intensity * (0.04 + segmentWeight * (isAmbient ? 0.22 : 0.46));

      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.strokeStyle = `rgba(${meteor.route.color}, ${alpha.toFixed(3)})`;
      ctx.lineWidth = (0.5 + segmentWeight * (isAmbient ? 1.4 : 2.1)) * meteor.size;
      ctx.stroke();
    }

    const head = pointOnRoute(meteor.route, progress);
    const pulse = 0.78 + Math.sin(time * 8.4 + meteor.pulsePhase) * 0.22;
    const glowRadius = (isAmbient ? 8 : 10 + pulse * 5) * meteor.size;
    const glow = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, glowRadius);
    glow.addColorStop(0, `rgba(${meteor.route.color}, ${(visibility * (isAmbient ? 0.3 : 0.34) * meteor.intensity * pulse).toFixed(3)})`);
    glow.addColorStop(0.28, `rgba(${meteor.route.color}, ${(visibility * 0.14 * meteor.intensity).toFixed(3)})`);
    glow.addColorStop(1, `rgba(${meteor.route.color}, 0)`);
    ctx.fillStyle = glow;
    ctx.fillRect(head.x - glowRadius, head.y - glowRadius, glowRadius * 2, glowRadius * 2);
    ctx.fillStyle = `rgba(238, 255, 250, ${(visibility * (isAmbient ? 0.42 : 0.82) * meteor.intensity * pulse).toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(head.x, head.y, (isAmbient ? 0.85 : 1.5 + pulse * 1.3) * meteor.size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function renderPulses() {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  for (const pulse of state.pulses) {
    const progress = clamp(pulse.age / 0.72, 0, 1);
    const radius = 8 + progress * 42;
    const alpha = (1 - progress) * 0.22;
    ctx.beginPath();
    ctx.arc(pulse.x, pulse.y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(109, 239, 212, ${alpha.toFixed(3)})`;
    ctx.lineWidth = 1.1 - progress * 0.6;
    ctx.stroke();
  }

  ctx.restore();
}

function renderFocus() {
  const focus = state.focus;
  if (!focus) {
    return;
  }

  const progress = clamp(focus.age / 1.25, 0, 1);
  const fade = 1 - smootherStep(Math.max(0, progress - 0.46) / 0.54);
  const size = 18 + progress * 18;
  const length = 7;

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.strokeStyle = `rgba(112, 241, 216, ${(fade * 0.58).toFixed(3)})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(focus.x, focus.y, size * 0.72, 0, Math.PI * 2);
  ctx.stroke();

  for (const direction of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(focus.x + direction * size, focus.y - size);
    ctx.lineTo(focus.x + direction * (size - length), focus.y - size);
    ctx.lineTo(focus.x + direction * (size - length), focus.y - (size - length));
    ctx.moveTo(focus.x + direction * size, focus.y + size);
    ctx.lineTo(focus.x + direction * (size - length), focus.y + size);
    ctx.lineTo(focus.x + direction * (size - length), focus.y + (size - length));
    ctx.stroke();
  }

  ctx.restore();
}

function renderSurface(time) {
  if (!ctx) {
    return;
  }

  const centerX = state.width * 0.52;
  const centerY = state.height * 0.49;
  const scale = Math.min(state.width, state.height);
  const background = ctx.createLinearGradient(0, 0, state.width, state.height);
  background.addColorStop(0, "#061216");
  background.addColorStop(0.52, "#02090d");
  background.addColorStop(1, "#010608");

  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, state.width, state.height);

  const centerGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, scale * 0.76);
  centerGlow.addColorStop(0, "rgba(15, 91, 87, 0.18)");
  centerGlow.addColorStop(0.45, "rgba(8, 44, 52, 0.08)");
  centerGlow.addColorStop(1, "rgba(1, 8, 10, 0)");
  ctx.fillStyle = centerGlow;
  ctx.fillRect(0, 0, state.width, state.height);

  renderStars(time);
  renderGuides(time);
  renderFocus();
  renderPulses();
  renderMeteors(time);

  const vignette = ctx.createRadialGradient(
    centerX,
    centerY,
    scale * 0.24,
    centerX,
    centerY,
    Math.max(state.width, state.height) * 0.74,
  );
  vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
  vignette.addColorStop(1, "rgba(0, 3, 5, 0.38)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, state.width, state.height);
}

function tick(now) {
  if (!canvas || !ctx || rendererPaused) {
    animationFrameId = 0;
    return;
  }

  const time = now * 0.001;
  const dt = state.lastTime === 0 ? 1 / 60 : Math.min(0.05, time - state.lastTime);
  state.lastTime = time;

  if (!reduceMotion.matches) {
    state.rainClock += dt;
    if (state.rainClock >= state.rainNextSpawn) {
      spawnMeteor("ambient");
      state.rainClock = 0;
      state.rainNextSpawn = 0.3 + Math.random() * 0.34;
    }

    state.signalClock += dt;
    if (state.signalClock >= state.signalNextSpawn) {
      spawnMeteor("signal");
      state.signalClock = 0;
      state.signalNextSpawn = 3.4 + Math.random() * 2.6;
    }
    updateEvents(dt);
  }

  renderSurface(time);
  animationFrameId = window.requestAnimationFrame(tick);
}

function resetAnimationState() {
  state.lastTime = 0;
  state.pointerDown = false;
  state.rainClock = 0;
  state.rainNextSpawn = 0.2;
  state.signalClock = 0;
  state.signalNextSpawn = 1.3;
  state.signalSequence = 0;
  state.meteors = [];
  state.pulses = [];
  state.focus = null;
}

function resize() {
  if (!canvas || !ctx) {
    return;
  }

  state.dpr = Math.min(window.devicePixelRatio || 1, 2);
  state.width = window.innerWidth;
  state.height = window.innerHeight;
  canvas.width = Math.round(state.width * state.dpr);
  canvas.height = Math.round(state.height * state.dpr);
  canvas.style.width = `${state.width}px`;
  canvas.style.height = `${state.height}px`;
  ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
}

function bindCanvas() {
  const nextCanvas = document.getElementById("kinetic-grid");
  if (!(nextCanvas instanceof HTMLCanvasElement)) {
    canvas = null;
    ctx = null;
    return false;
  }

  if (nextCanvas !== canvas) {
    canvas = nextCanvas;
    ctx = canvas.getContext("2d");
    resetAnimationState();
  }

  resize();
  renderSurface(0);
  return true;
}

function syncPageExperience() {
  syncQueued = false;
  prepareCalibrationText();

  if (bindCanvas() && !animationFrameId && !rendererPaused) {
    animationFrameId = window.requestAnimationFrame(tick);
  }
}

function schedulePageSync() {
  if (syncQueued) {
    return;
  }

  syncQueued = true;
  window.requestAnimationFrame(syncPageExperience);
}

function nodeAffectsExperience(node) {
  if (!(node instanceof Element)) {
    return false;
  }

  return (
    node.id === "kinetic-grid" ||
    node.matches("[data-calibrate-text]") ||
    Boolean(node.querySelector("#kinetic-grid, [data-calibrate-text]"))
  );
}

function observePageChanges() {
  if (pageObserver || !document.body || !("MutationObserver" in window)) {
    return;
  }

  pageObserver = new MutationObserver((mutations) => {
    const shouldSync = mutations.some((mutation) => {
      if (
        mutation.target instanceof Element &&
        mutation.target.closest("[data-calibrate-text]")
      ) {
        return true;
      }
      const changedNodes = [...mutation.addedNodes, ...mutation.removedNodes];
      return changedNodes.some(nodeAffectsExperience);
    });

    if (shouldSync) {
      schedulePageSync();
    }
  });

  pageObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function startExperience() {
  rendererPaused = false;
  observePageChanges();
  schedulePageSync();
}

function pauseRenderer() {
  rendererPaused = true;
  if (animationFrameId) {
    window.cancelAnimationFrame(animationFrameId);
    animationFrameId = 0;
  }
  state.lastTime = 0;
}

function resumeRenderer() {
  rendererPaused = false;
  if (bindCanvas() && !animationFrameId) {
    animationFrameId = window.requestAnimationFrame(tick);
  }
}

function renderOnce() {
  if (!canvas || !ctx || !canvas.isConnected) {
    if (!bindCanvas()) {
      return;
    }
  }
  renderSurface(performance.now() * 0.001);
}

function getCanvas() {
  if (canvas?.isConnected) {
    return canvas;
  }

  const nextCanvas = document.getElementById("kinetic-grid");
  return nextCanvas instanceof HTMLCanvasElement ? nextCanvas : null;
}

function destroyExperience() {
  if (animationFrameId) {
    window.cancelAnimationFrame(animationFrameId);
    animationFrameId = 0;
  }

  if (pageObserver) {
    pageObserver.disconnect();
    pageObserver = null;
  }

  canvas = null;
  ctx = null;
  syncQueued = false;
  rendererPaused = false;
}

function pointerPosition(event) {
  if ("touches" in event && event.touches.length > 0) {
    return {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
  }

  return {
    x: event.clientX,
    y: event.clientY,
  };
}

window.addEventListener("pointerdown", (event) => {
  if (reduceMotion.matches || !canvas) {
    return;
  }

  state.pointerDown = true;
  const point = pointerPosition(event);
  setFocus(point.x, point.y);
  triggerPulse(point.x, point.y);
  spawnMeteor("signal", { duration: 2.6, intensity: 1.25, size: 1.1 });
});

window.addEventListener("pointermove", (event) => {
  if (!state.pointerDown || reduceMotion.matches || !canvas) {
    return;
  }

  const point = pointerPosition(event);
  triggerPulse(point.x, point.y);
});

window.addEventListener("pointerup", () => {
  state.pointerDown = false;
});

window.addEventListener("pointercancel", () => {
  state.pointerDown = false;
});

window.addEventListener("resize", resize);
reduceMotion.addEventListener("change", () => {
  state.lastTime = 0;
  resize();
  renderOnce();
});

window.SmartXKineticGrid = {
  start: startExperience,
  destroy: destroyExperience,
  getCanvas,
  pause: pauseRenderer,
  resume: resumeRenderer,
  renderOnce,
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startExperience, { once: true });
} else {
  startExperience();
}
