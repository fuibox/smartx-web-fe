export type ResultCardFormat = "story" | "og";

export type RenderedResultCard = {
  href: string;
  filename: string;
};

export type ResultCardExportData = {
  name: string;
  cn: string;
  code: string;
  description: string;
  roast: string;
  poles: readonly string[];
  scores: { conviction: number; instinct: number; resilience: number };
};

const COLORS = {
  canvas: "#0c1219",
  surface: "#131d27",
  line: "rgba(208,224,232,0.18)",
  text: "#f4f4ef",
  body: "#bdc7ca",
  muted: "#879397",
  dim: "#69757b",
  mint: "#9cf3db",
  mintStrong: "#49d9b6",
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

function drawHeader(context: CanvasRenderingContext2D, width: number, x: number, y: number) {
  context.fillStyle = COLORS.text;
  context.font = "700 26px Inter, sans-serif";
  context.fillText("SmartX", x, y);
  context.fillStyle = COLORS.dim;
  context.font = "700 13px Inter, sans-serif";
  context.textAlign = "right";
  context.fillText("TRADER TYPE", width - x, y - 4);
  context.textAlign = "left";
}

function drawArtwork(context: CanvasRenderingContext2D, code: string, x: number, y: number, width: number, height: number) {
  roundedRect(context, x, y, width, height, Math.round(Math.min(width, height) * 0.07));
  context.fillStyle = "#17232e";
  context.fill();
  context.strokeStyle = COLORS.line;
  context.stroke();
  const radius = Math.min(width, height) * 0.28;
  context.strokeStyle = "rgba(156,243,219,0.16)";
  context.lineWidth = 2;
  context.beginPath();
  context.arc(x + width / 2, y + height / 2, radius, 0, Math.PI * 2);
  context.stroke();
  context.beginPath();
  context.arc(x + width / 2, y + height / 2, radius * 0.68, 0, Math.PI * 2);
  context.stroke();
  context.fillStyle = COLORS.text;
  context.font = `500 ${Math.round(Math.min(width, height) * 0.17)}px "IBM Plex Serif", Georgia, serif`;
  context.textAlign = "center";
  context.fillText(code, x + width / 2, y + height / 2 + Math.min(width, height) * 0.055);
  context.fillStyle = COLORS.dim;
  context.font = "700 10px Inter, sans-serif";
  context.fillText("PERSONA ARTWORK IN PROGRESS", x + width / 2, y + height - 26);
  context.textAlign = "left";
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

function drawStory(context: CanvasRenderingContext2D, data: ResultCardExportData) {
  const width = 1080;
  drawBase(context, width, 1920, 42);
  drawHeader(context, width, 84, 98);
  context.fillStyle = COLORS.mintStrong;
  context.font = "700 17px JetBrainsMono, monospace";
  context.fillText(data.poles.join(" · "), 84, 178);
  context.fillStyle = COLORS.text;
  context.font = "500 84px \"IBM Plex Serif\", Georgia, serif";
  wrapText(context, data.name, 84, 282, 912, 88, 2);
  context.fillStyle = COLORS.muted;
  context.font = "500 25px Inter, sans-serif";
  context.fillText(data.cn, 88, 390);
  drawArtwork(context, data.code, 84, 440, 912, 600);
  drawAxis(context, "Conviction", data.scores.conviction, 84, 1105, 278);
  drawAxis(context, "Instinct", data.scores.instinct, 400, 1105, 278);
  drawAxis(context, "Resilience", data.scores.resilience, 718, 1105, 278);
  context.fillStyle = COLORS.body;
  context.font = "500 29px Inter, sans-serif";
  wrapText(context, data.description, 84, 1250, 912, 42, 4);
  context.fillStyle = COLORS.mint;
  context.font = "500 34px \"IBM Plex Serif\", Georgia, serif";
  wrapText(context, `“${data.roast}”`, 84, 1485, 860, 45, 3);
  context.strokeStyle = COLORS.line;
  context.beginPath();
  context.moveTo(84, 1736);
  context.lineTo(996, 1736);
  context.stroke();
  context.fillStyle = COLORS.mintStrong;
  context.font = "700 16px Inter, sans-serif";
  context.fillText("smartx.io/waitlist", 84, 1794);
  context.fillStyle = COLORS.dim;
  context.font = "600 12px Inter, sans-serif";
  context.textAlign = "right";
  context.fillText("FOR ENTERTAINMENT ONLY", 996, 1794);
  context.textAlign = "left";
}

function drawOg(context: CanvasRenderingContext2D, data: ResultCardExportData) {
  const width = 1200;
  drawBase(context, width, 630, 24);
  drawHeader(context, width, 54, 70);
  context.fillStyle = COLORS.mintStrong;
  context.font = "700 13px JetBrainsMono, monospace";
  context.fillText(data.poles.join(" · "), 54, 120);
  context.fillStyle = COLORS.text;
  context.font = "500 58px \"IBM Plex Serif\", Georgia, serif";
  wrapText(context, data.name, 54, 190, 590, 60, 2);
  context.fillStyle = COLORS.muted;
  context.font = "500 18px Inter, sans-serif";
  context.fillText(data.cn, 58, 275);
  context.fillStyle = COLORS.body;
  context.font = "500 19px Inter, sans-serif";
  wrapText(context, data.description, 54, 330, 560, 27, 4);
  context.fillStyle = COLORS.mint;
  context.font = "500 20px \"IBM Plex Serif\", Georgia, serif";
  wrapText(context, `“${data.roast}”`, 54, 470, 560, 27, 2);
  drawArtwork(context, data.code, 680, 104, 466, 382);
  drawAxis(context, "CONVICTION", data.scores.conviction, 680, 528, 140);
  drawAxis(context, "INSTINCT", data.scores.instinct, 842, 528, 140);
  drawAxis(context, "RESILIENCE", data.scores.resilience, 1004, 528, 140);
}

export async function renderResultCard(data: ResultCardExportData, format: ResultCardFormat): Promise<RenderedResultCard> {
  await document.fonts.ready;
  const canvas = document.createElement("canvas");
  canvas.width = format === "story" ? 1080 : 1200;
  canvas.height = format === "story" ? 1920 : 630;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is unavailable in this browser.");
  if (format === "story") drawStory(context, data); else drawOg(context, data);
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => result ? resolve(result) : reject(new Error("Could not render the result card.")), "image/png");
  });
  return {
    href: URL.createObjectURL(blob),
    filename: `smartx-${data.code.toLowerCase()}-${format === "story" ? "1080x1920" : "1200x630"}.png`,
  };
}
