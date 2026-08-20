export type ResultCardFormat = "story" | "og";

export type RenderedResultCard = {
  href: string;
  filename: string;
};

export type ResultCardExportData = {
  name: string;
  cn: string;
  code: string;
  rarity: number;
  verdict: string;
  partner: string;
  enemy: string;
  poles: readonly string[];
  stats: Record<string, number>;
};

const COLORS = {
  ink: "#070b13",
  paper: "#eee8dc",
  body: "#c9c3b8",
  muted: "#8993a0",
  dim: "#5e6877",
  gold: "#c8a96b",
  goldBright: "#e4cc94",
  teal: "#2dcbb3",
};

function loadImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = new URL(source, window.location.href).toString();
  });
}

function drawCover(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const sourceWidth = width / scale;
  const sourceHeight = height / scale;
  const sourceX = (image.naturalWidth - sourceWidth) / 2;
  const sourceY = (image.naturalHeight - sourceHeight) / 2;
  context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
}

function drawTrackedText(
  context: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
  tracking: number,
) {
  let cursor = x;
  for (const character of value) {
    context.fillText(character, cursor, y);
    cursor += context.measureText(character).width + tracking;
  }
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
  const words = value.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (context.measureText(candidate).width <= maxWidth || !line) {
      line = candidate;
      continue;
    }
    lines.push(line);
    line = word;
  }
  if (line) lines.push(line);
  lines.slice(0, maxLines).forEach((text, index) => {
    const isLastVisible = index === maxLines - 1 && lines.length > maxLines;
    context.fillText(isLastVisible ? `${text.replace(/[.,—]$/, "")}…` : text, x, y + index * lineHeight);
  });
}

function drawBase(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  atlas: HTMLImageElement,
  isOwl: boolean,
) {
  context.fillStyle = COLORS.ink;
  context.fillRect(0, 0, width, height);
  context.save();
  context.globalAlpha = 0.32;
  drawCover(context, atlas, 0, 0, width, height);
  context.restore();

  const wash = context.createLinearGradient(0, 0, width, height);
  wash.addColorStop(0, "rgba(4,8,15,0.2)");
  wash.addColorStop(0.55, "rgba(4,8,15,0.78)");
  wash.addColorStop(1, "rgba(4,8,15,0.94)");
  context.fillStyle = wash;
  context.fillRect(0, 0, width, height);

  const accent = isOwl ? COLORS.goldBright : COLORS.gold;
  context.strokeStyle = accent;
  context.lineWidth = isOwl ? 4 : 2;
  context.strokeRect(24, 24, width - 48, height - 48);
  context.globalAlpha = 0.42;
  context.lineWidth = 1;
  context.strokeRect(38, 38, width - 76, height - 76);
  context.globalAlpha = 1;
  if (isOwl) {
    context.shadowColor = "rgba(228,204,148,0.75)";
    context.shadowBlur = 26;
    context.strokeStyle = COLORS.goldBright;
    context.strokeRect(25, 25, width - 50, height - 50);
    context.shadowBlur = 0;
  }
}

function drawHeader(
  context: CanvasRenderingContext2D,
  logo: HTMLImageElement,
  width: number,
  x: number,
  y: number,
  logoWidth: number,
) {
  const logoHeight = logoWidth * (logo.naturalHeight / logo.naturalWidth);
  context.drawImage(logo, x, y, logoWidth, logoHeight);
  context.fillStyle = COLORS.goldBright;
  context.font = "600 18px Inter, sans-serif";
  context.textAlign = "right";
  context.fillText("TRADING SPIRIT ANIMAL", width - x, y + 24);
  context.textAlign = "left";
}

function drawStats(
  context: CanvasRenderingContext2D,
  stats: Record<string, number>,
  x: number,
  y: number,
  width: number,
  gap: number,
  fontSize: number,
) {
  Object.entries(stats).forEach(([label, score], index) => {
    const rowY = y + index * gap;
    context.fillStyle = COLORS.muted;
    context.font = `600 ${fontSize}px Inter, sans-serif`;
    context.fillText(label.toUpperCase(), x, rowY);
    context.fillStyle = "rgba(200,169,107,0.18)";
    context.fillRect(x + width * 0.27, rowY - 7, width * 0.62, 4);
    context.fillStyle = COLORS.goldBright;
    context.fillRect(x + width * 0.27, rowY - 7, width * 0.62 * (score / 100), 4);
    context.fillStyle = COLORS.paper;
    context.font = `500 ${fontSize}px ui-monospace, monospace`;
    context.textAlign = "right";
    context.fillText(String(score), x + width, rowY);
    context.textAlign = "left";
  });
}

function drawStory(
  context: CanvasRenderingContext2D,
  data: ResultCardExportData,
  art: HTMLImageElement,
  logo: HTMLImageElement,
  atlas: HTMLImageElement,
) {
  const width = 1080;
  const height = 1920;
  const isOwl = data.code === "OWL";
  drawBase(context, width, height, atlas, isOwl);
  drawHeader(context, logo, width, 72, 72, 176);

  context.save();
  context.strokeStyle = isOwl ? COLORS.goldBright : COLORS.gold;
  context.lineWidth = isOwl ? 3 : 1;
  context.strokeRect(116, 218, 848, 848);
  context.beginPath();
  context.rect(124, 226, 832, 832);
  context.clip();
  drawCover(context, art, 124, 226, 832, 832);
  context.restore();

  context.fillStyle = COLORS.goldBright;
  context.font = "600 20px Inter, sans-serif";
  drawTrackedText(context, isOwl ? "HIDDEN GILDED EDITION" : data.poles.join(" · "), 116, 1118, 3.4);
  context.fillStyle = COLORS.paper;
  context.font = "400 94px 'Iowan Old Style', Georgia, serif";
  context.fillText(data.name, 116, 1228);
  context.fillStyle = COLORS.muted;
  context.font = "400 28px Inter, sans-serif";
  context.fillText(data.cn, 120, 1274);

  context.fillStyle = COLORS.goldBright;
  context.font = "600 22px Inter, sans-serif";
  context.fillText(`RARER THAN ${100 - data.rarity}% OF TRADERS`, 116, 1332);
  drawStats(context, data.stats, 116, 1408, 848, 64, 19);

  context.fillStyle = COLORS.body;
  context.font = "italic 34px 'Iowan Old Style', Georgia, serif";
  wrapText(context, `“${data.verdict}”`, 116, 1608, 848, 46, 3);

  context.strokeStyle = "rgba(200,169,107,0.34)";
  context.beginPath();
  context.moveTo(116, 1744);
  context.lineTo(964, 1744);
  context.stroke();
  context.font = "600 19px Inter, sans-serif";
  context.fillStyle = COLORS.muted;
  context.fillText("BEST MATCH", 116, 1790);
  context.fillText("NATURAL RIVAL", 568, 1790);
  context.fillStyle = COLORS.goldBright;
  context.fillText(data.partner.toUpperCase(), 116, 1824);
  context.fillText(data.enemy.toUpperCase(), 568, 1824);

  context.fillStyle = COLORS.teal;
  context.font = "600 18px ui-monospace, monospace";
  context.fillText("smartx.io/waitlist", 72, 1870);
  context.fillStyle = COLORS.dim;
  context.font = "500 13px Inter, sans-serif";
  context.textAlign = "right";
  context.fillText("FOR ENTERTAINMENT ONLY · NOT FINANCIAL ADVICE", 1008, 1870);
  context.textAlign = "left";
}

function drawOg(
  context: CanvasRenderingContext2D,
  data: ResultCardExportData,
  art: HTMLImageElement,
  logo: HTMLImageElement,
  atlas: HTMLImageElement,
) {
  const width = 1200;
  const height = 630;
  const isOwl = data.code === "OWL";
  drawBase(context, width, height, atlas, isOwl);
  drawHeader(context, logo, width, 52, 48, 150);

  context.fillStyle = COLORS.goldBright;
  context.font = "600 14px Inter, sans-serif";
  drawTrackedText(context, isOwl ? "HIDDEN GILDED EDITION" : data.poles.join(" · "), 52, 130, 2.4);
  context.fillStyle = COLORS.paper;
  context.font = "400 68px 'Iowan Old Style', Georgia, serif";
  context.fillText(data.name, 52, 208);
  context.fillStyle = COLORS.muted;
  context.font = "400 20px Inter, sans-serif";
  context.fillText(`${data.cn}  ·  Rarer than ${100 - data.rarity}% of traders`, 55, 246);

  context.fillStyle = COLORS.body;
  context.font = "italic 24px 'Iowan Old Style', Georgia, serif";
  wrapText(context, `“${data.verdict}”`, 52, 302, 560, 32, 3);
  drawStats(context, data.stats, 52, 418, 554, 42, 13);

  context.fillStyle = COLORS.muted;
  context.font = "600 13px Inter, sans-serif";
  context.fillText("BEST MATCH", 52, 566);
  context.fillText("NATURAL RIVAL", 310, 566);
  context.fillStyle = COLORS.goldBright;
  context.fillText(data.partner.toUpperCase(), 52, 590);
  context.fillText(data.enemy.toUpperCase(), 310, 590);

  context.save();
  context.strokeStyle = isOwl ? COLORS.goldBright : COLORS.gold;
  context.lineWidth = isOwl ? 3 : 1;
  context.strokeRect(682, 100, 458, 458);
  context.beginPath();
  context.rect(690, 108, 442, 442);
  context.clip();
  drawCover(context, art, 690, 108, 442, 442);
  context.restore();
}

export async function renderResultCard(data: ResultCardExportData, format: ResultCardFormat): Promise<RenderedResultCard> {
  await document.fonts.ready;
  const [art, logo, atlas] = await Promise.all([
    loadImage(`/assets/waitlist/spirits/${data.code.toLowerCase()}.webp`),
    loadImage("/assets/smartx-logo.svg"),
    loadImage("/assets/waitlist/source/celestial-atlas-v2.webp"),
  ]);
  const canvas = document.createElement("canvas");
  canvas.width = format === "story" ? 1080 : 1200;
  canvas.height = format === "story" ? 1920 : 630;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is unavailable in this browser.");
  if (format === "story") drawStory(context, data, art, logo, atlas);
  else drawOg(context, data, art, logo, atlas);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => (result ? resolve(result) : reject(new Error("Could not render the result card."))), "image/png");
  });
  return {
    href: URL.createObjectURL(blob),
    filename: `smartx-${data.code.toLowerCase()}-${format === "story" ? "1080x1920" : "1200x630"}.png`,
  };
}
