export type ResultCardFormat = "story" | "og";

export type RenderedResultCard = {
  href: string;
  filename: string;
  blob: Blob;
};

export type ResultCardExportData = {
  name: string;
  code: string;
  roast: string;
  artSrc: string;
  localArtSrc?: string;
  poles: readonly string[];
  scores: { conviction: number; instinct: number; resilience: number };
  rank: number;
  labels: {
    traderType: string;
    waitlistRank: string;
    conviction: string;
    instinct: string;
    resilience: string;
  };
};

const COLORS = {
  canvas: "#010101",
  surface: "#050808",
  line: "#202627",
  text: "#f5f5f5",
  body: "#d4d7d6",
  muted: "#747474",
  dim: "#62676e",
  mint: "#08dfb5",
  mintStrong: "#08dfb5",
};

const AXIS_THEME = [
  { fill: "#08dfb5", track: "rgba(8, 223, 181, 0.12)" },
  { fill: "#a957d6", track: "rgba(169, 87, 214, 0.2)" },
  { fill: "#f69002", track: "rgba(246, 144, 2, 0.14)" },
] as const;

function wrapLines(
  context: CanvasRenderingContext2D,
  value: string,
  maxWidth: number,
  maxLines: number,
) {
  const words = value.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (context.measureText(candidate).width <= maxWidth || !line) line = candidate;
    else { lines.push(line); line = word; }
  }
  if (line) lines.push(line);
  return lines.slice(0, maxLines);
}

function wrapText(
  context: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
) {
  const lines = wrapLines(context, value, maxWidth, maxLines);
  lines.forEach((text, index) => {
    context.fillText(text, x, y + index * lineHeight);
  });
  return lines.length;
}

const STORY_WIDTH = 1080;
const STORY_INSET = 42;
const STORY_BOTTOM_PAD = 28;

function measureStoryHeight(context: CanvasRenderingContext2D, data: ResultCardExportData) {
  context.font = "600 84px \"Playfair Display\", Georgia, serif";
  const nameLines = wrapLines(context, data.name, 912, 2).length;
  const rankY = 268 + (nameLines - 1) * 84 + 68;
  const artY = rankY + 36;
  const axisY = artY + 668;
  const quoteY = axisY + 156;
  context.font = "500 34px \"Playfair Display\", Georgia, serif";
  const quoteLines = wrapLines(context, `“${data.roast}”`, 912, 3).length;
  return quoteY + quoteLines * 45 + STORY_BOTTOM_PAD + STORY_INSET;
}

function roundedRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
}

function drawBase(context: CanvasRenderingContext2D, width: number, height: number, inset: number) {
  context.fillStyle = COLORS.canvas;
  context.fillRect(0, 0, width, height);
  roundedRect(context, inset, inset, width - inset * 2, height - inset * 2, Math.round(inset * 0.56));
  context.fillStyle = COLORS.surface;
  context.fill();
  context.strokeStyle = COLORS.line;
  context.lineWidth = 2;
  context.stroke();
}

function drawHeader(context: CanvasRenderingContext2D, width: number, x: number, y: number, traderType: string) {
  context.fillStyle = COLORS.text;
  context.font = "700 26px Lexend, sans-serif";
  context.fillText("SmartX", x, y);
  context.fillStyle = COLORS.dim;
  context.font = "700 13px Inter, sans-serif";
  context.textAlign = "right";
  context.fillText(traderType.toUpperCase(), width - x, y - 4);
  context.textAlign = "left";
}

function isCrossOriginSrc(src: string) {
  if (typeof window === "undefined") return false;
  if (!/^(https?:)?\/\//i.test(src)) return false;
  try {
    return new URL(src, window.location.href).origin !== window.location.origin;
  } catch {
    return true;
  }
}

function loadImageElement(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    if (isCrossOriginSrc(src)) image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not load artwork: ${src}`));
    image.src = src;
  });
}

async function loadArtwork(src: string, fallbackSrc?: string) {
  try {
    return await loadImageElement(src);
  } catch {
    if (fallbackSrc && fallbackSrc !== src) return loadImageElement(fallbackSrc);
    throw new Error(`Could not load artwork: ${src}`);
  }
}

function waitForFonts() {
  if (typeof document === "undefined" || !document.fonts?.ready) return Promise.resolve();
  return Promise.race([
    document.fonts.ready.then(() => undefined),
    new Promise<void>((resolve) => {
      window.setTimeout(resolve, 1200);
    }),
  ]);
}

function drawArtwork(context: CanvasRenderingContext2D, artwork: HTMLImageElement, x: number, y: number, width: number, height: number) {
  context.save();
  roundedRect(context, x, y, width, height, Math.round(Math.min(width, height) * 0.07));
  context.fillStyle = COLORS.canvas;
  context.fill();
  context.clip();
  const scale = Math.min(width / artwork.naturalWidth, height / artwork.naturalHeight);
  const drawnWidth = artwork.naturalWidth * scale;
  const drawnHeight = artwork.naturalHeight * scale;
  context.drawImage(artwork, x + (width - drawnWidth) / 2, y + (height - drawnHeight) / 2, drawnWidth, drawnHeight);
  context.restore();
}

function drawRank(context: CanvasRenderingContext2D, data: ResultCardExportData, x: number, y: number) {
  const rankText = `#${data.rank.toLocaleString("en-US")}`;
  context.textAlign = "left";
  context.fillStyle = COLORS.mintStrong;
  context.font = "600 52px \"IBM Plex Sans\", Inter, sans-serif";
  context.fillText(rankText, x, y);
  const rankWidth = context.measureText(rankText).width;
  context.fillStyle = COLORS.muted;
  context.font = "500 18px Inter, sans-serif";
  context.fillText(data.labels.waitlistRank, x + rankWidth + 16, y - 8);
}

function drawAxis(
  context: CanvasRenderingContext2D,
  label: string,
  score: number,
  x: number,
  y: number,
  width: number,
  theme: (typeof AXIS_THEME)[number],
) {
  context.fillStyle = COLORS.muted;
  context.font = "500 22px Inter, sans-serif";
  context.fillText(label, x, y);
  context.fillStyle = COLORS.text;
  context.font = "600 22px \"IBM Plex Sans\", Inter, sans-serif";
  context.textAlign = "right";
  context.fillText(String(score), x + width, y);
  context.textAlign = "left";
  roundedRect(context, x, y + 12, width, 8, 4);
  context.fillStyle = theme.track;
  context.fill();
  if (score > 0) {
    roundedRect(context, x, y + 12, Math.max(8, width * (score / 100)), 8, 4);
    context.fillStyle = theme.fill;
    context.fill();
  }
}

function drawStory(context: CanvasRenderingContext2D, data: ResultCardExportData, artwork: HTMLImageElement, height: number) {
  const width = STORY_WIDTH;
  drawBase(context, width, height, STORY_INSET);
  drawHeader(context, width, 84, 98, data.labels.traderType);
  context.fillStyle = COLORS.mintStrong;
  context.font = "700 17px JetBrainsMono, monospace";
  context.fillText(data.poles.join(" · "), 84, 178);
  context.fillStyle = COLORS.text;
  context.font = "600 84px \"Playfair Display\", Georgia, serif";
  const nameLines = wrapText(context, data.name, 84, 268, 912, 84, 2);
  const rankY = 268 + (nameLines - 1) * 84 + 68;
  drawRank(context, data, 84, rankY);
  const artY = rankY + 36;
  drawArtwork(context, artwork, 84, artY, 912, 620);
  const axisY = artY + 668;
  drawAxis(context, data.labels.conviction, data.scores.conviction, 84, axisY, 278, AXIS_THEME[0]);
  drawAxis(context, data.labels.instinct, data.scores.instinct, 400, axisY, 278, AXIS_THEME[1]);
  drawAxis(context, data.labels.resilience, data.scores.resilience, 718, axisY, 278, AXIS_THEME[2]);
  const quoteY = axisY + 156;
  context.fillStyle = COLORS.mint;
  context.font = "500 34px \"Playfair Display\", Georgia, serif";
  wrapText(context, `“${data.roast}”`, 84, quoteY, 912, 45, 3);
}

function drawOg(context: CanvasRenderingContext2D, data: ResultCardExportData, artwork: HTMLImageElement) {
  const width = 1200;
  drawBase(context, width, 630, 24);
  drawHeader(context, width, 54, 70, data.labels.traderType);
  context.fillStyle = COLORS.mintStrong;
  context.font = "700 13px JetBrainsMono, monospace";
  context.fillText(data.poles.join(" · "), 54, 120);
  context.fillStyle = COLORS.text;
  context.font = "600 58px \"Playfair Display\", Georgia, serif";
  const nameLines = wrapText(context, data.name, 54, 186, 590, 58, 2);
  context.fillStyle = COLORS.mintStrong;
  context.font = "600 32px \"IBM Plex Sans\", Inter, sans-serif";
  const rankText = `#${data.rank.toLocaleString("en-US")}`;
  const rankY = 186 + (nameLines - 1) * 58 + 52;
  context.fillText(rankText, 54, rankY);
  const rankWidth = context.measureText(rankText).width;
  context.fillStyle = COLORS.muted;
  context.font = "500 14px Inter, sans-serif";
  context.fillText(data.labels.waitlistRank, 54 + rankWidth + 12, rankY - 4);
  context.fillStyle = COLORS.mint;
  context.font = "500 24px \"Playfair Display\", Georgia, serif";
  wrapText(context, `“${data.roast}”`, 54, rankY + 56, 560, 31, 3);
  drawArtwork(context, artwork, 680, 104, 466, 382);
  drawAxis(context, data.labels.conviction, data.scores.conviction, 680, 528, 140, AXIS_THEME[0]);
  drawAxis(context, data.labels.instinct, data.scores.instinct, 842, 528, 140, AXIS_THEME[1]);
  drawAxis(context, data.labels.resilience, data.scores.resilience, 1004, 528, 140, AXIS_THEME[2]);
}

export async function renderResultCard(data: ResultCardExportData, format: ResultCardFormat): Promise<RenderedResultCard> {
  const [, artwork] = await Promise.all([
    waitForFonts(),
    loadArtwork(data.localArtSrc || data.artSrc, data.artSrc),
  ]);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is unavailable in this browser.");
  if (format === "story") {
    canvas.width = STORY_WIDTH;
    const height = measureStoryHeight(context, data);
    canvas.height = height;
    drawStory(context, data, artwork, height);
  } else {
    canvas.width = 1200;
    canvas.height = 630;
    drawOg(context, data, artwork);
  }
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => result ? resolve(result) : reject(new Error("Could not render the result card.")), "image/jpeg", 0.92);
  });
  return {
    href: URL.createObjectURL(blob),
    filename: `smartx-${data.code.toLowerCase()}-${canvas.width}x${canvas.height}`,
    blob,
  };
}
