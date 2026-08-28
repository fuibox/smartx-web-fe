export type ResultCardFormat = "story" | "og";

export type RenderedResultCard = {
  href: string;
  filename: string;
};

export type ResultCardExportData = {
  name: string;
  code: string;
  roast: string;
  artSrc: string;
  poles: readonly string[];
  scores: { conviction: number; instinct: number; resilience: number };
  bestMatch: { name: string };
  rival: { name: string };
  labels: {
    traderType: string;
    bestMatch: string;
    naturalRival: string;
    conviction: string;
    instinct: string;
    resilience: string;
    disclaimer: string;
  };
};

const COLORS = {
  canvas: "#010101",
  surface: "#050808",
  line: "#202627",
  text: "#f5f5f5",
  body: "#d4d7d6",
  muted: "#8a8f98",
  dim: "#62676e",
  mint: "#08dfb5",
  mintStrong: "#08dfb5",
};

function wrapText(
  context: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
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
  lines.slice(0, maxLines).forEach((text, index) => {
    const finalLine = index === maxLines - 1 && lines.length > maxLines ? `${text.replace(/[.,—]$/, "")}…` : text;
    context.fillText(finalLine, x, y + index * lineHeight);
  });
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

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not load artwork: ${src}`));
    image.src = src;
  });
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

function drawRelations(context: CanvasRenderingContext2D, data: ResultCardExportData, x: number, y: number, width: number) {
  const columnWidth = width / 2;
  context.fillStyle = COLORS.dim;
  context.font = "600 11px Inter, sans-serif";
  context.fillText(data.labels.bestMatch.toUpperCase(), x, y);
  context.fillText(data.labels.naturalRival.toUpperCase(), x + columnWidth, y);
  context.fillStyle = COLORS.text;
  context.font = "500 18px IBM Plex Sans, sans-serif";
  context.fillText(data.bestMatch.name, x, y + 28);
  context.fillText(data.rival.name, x + columnWidth, y + 28);
}

function drawAxis(
  context: CanvasRenderingContext2D,
  label: string,
  score: number,
  x: number,
  y: number,
  width: number,
) {
  context.fillStyle = COLORS.muted;
  context.font = "600 13px Inter, sans-serif";
  context.fillText(label, x, y);
  context.fillStyle = COLORS.text;
  context.font = "700 14px JetBrainsMono, monospace";
  context.textAlign = "right";
  context.fillText(String(score), x + width, y);
  context.textAlign = "left";
  roundedRect(context, x, y + 14, width, 5, 3);
  context.fillStyle = "rgba(208,224,232,0.12)";
  context.fill();
  if (score > 0) {
    roundedRect(context, x, y + 14, width * (score / 100), 5, 3);
    context.fillStyle = COLORS.mintStrong;
    context.fill();
  }
}

function drawStory(context: CanvasRenderingContext2D, data: ResultCardExportData, artwork: HTMLImageElement) {
  const width = 1080;
  drawBase(context, width, 1920, 42);
  drawHeader(context, width, 84, 98, data.labels.traderType);
  context.fillStyle = COLORS.mintStrong;
  context.font = "700 17px JetBrainsMono, monospace";
  context.fillText(data.poles.join(" · "), 84, 178);
  context.fillStyle = COLORS.text;
  context.font = "600 84px \"Playfair Display\", Georgia, serif";
  wrapText(context, data.name, 84, 282, 912, 88, 2);
  drawArtwork(context, artwork, 84, 440, 912, 600);
  drawAxis(context, data.labels.conviction, data.scores.conviction, 84, 1105, 278);
  drawAxis(context, data.labels.instinct, data.scores.instinct, 400, 1105, 278);
  drawAxis(context, data.labels.resilience, data.scores.resilience, 718, 1105, 278);
  context.fillStyle = COLORS.mint;
  context.font = "500 34px \"Playfair Display\", Georgia, serif";
  wrapText(context, `“${data.roast}”`, 84, 1260, 860, 45, 3);
  drawRelations(context, data, 84, 1510, 912);
  context.strokeStyle = COLORS.line;
  context.beginPath();
  context.moveTo(84, 1790);
  context.lineTo(996, 1790);
  context.stroke();
  context.fillStyle = COLORS.mintStrong;
  context.font = "700 16px Inter, sans-serif";
  context.fillText("smartx.io/waitlist", 84, 1844);
  context.fillStyle = COLORS.dim;
  context.font = "600 12px Inter, sans-serif";
  context.textAlign = "right";
  context.fillText(data.labels.disclaimer.toUpperCase(), 996, 1844);
  context.textAlign = "left";
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
  wrapText(context, data.name, 54, 190, 590, 60, 2);
  context.fillStyle = COLORS.mint;
  context.font = "500 24px \"Playfair Display\", Georgia, serif";
  wrapText(context, `“${data.roast}”`, 54, 350, 560, 31, 3);
  drawArtwork(context, artwork, 680, 104, 466, 382);
  drawAxis(context, data.labels.conviction.toUpperCase(), data.scores.conviction, 680, 528, 140);
  drawAxis(context, data.labels.instinct.toUpperCase(), data.scores.instinct, 842, 528, 140);
  drawAxis(context, data.labels.resilience.toUpperCase(), data.scores.resilience, 1004, 528, 140);
  drawRelations(context, data, 54, 566, 560);
}

export async function renderResultCard(data: ResultCardExportData, format: ResultCardFormat): Promise<RenderedResultCard> {
  const [, artwork] = await Promise.all([document.fonts.ready, loadImage(data.artSrc)]);
  const canvas = document.createElement("canvas");
  canvas.width = format === "story" ? 1080 : 1200;
  canvas.height = format === "story" ? 1920 : 630;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is unavailable in this browser.");
  if (format === "story") drawStory(context, data, artwork); else drawOg(context, data, artwork);
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => result ? resolve(result) : reject(new Error("Could not render the result card.")), "image/png");
  });
  return {
    href: URL.createObjectURL(blob),
    filename: `smartx-${data.code.toLowerCase()}-${format === "story" ? "1080x1920" : "1200x630"}.png`,
  };
}
