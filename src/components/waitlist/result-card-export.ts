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
};

const COLORS = {
  canvas: "#0c1322",
  panel: "#172033",
  line: "#34445e",
  text: "#f1f5f9",
  body: "#c8d3e8",
  muted: "#94a6c2",
  dim: "#71829e",
  teal: "#08dfb5",
  paper: "#f0ede4",
  paperInk: "#0b1c20",
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
    const finalLine = index === maxLines - 1 && lines.length > maxLines
      ? `${text.replace(/[.,—]$/, "")}…`
      : text;
    context.fillText(finalLine, x, y + index * lineHeight);
  });
}

function drawBase(context: CanvasRenderingContext2D, width: number, height: number) {
  context.fillStyle = COLORS.canvas;
  context.fillRect(0, 0, width, height);
  context.fillStyle = COLORS.teal;
  context.fillRect(0, 0, 12, height);
  context.strokeStyle = COLORS.line;
  context.lineWidth = 2;
  context.strokeRect(34, 34, width - 68, height - 68);
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
  context.fillStyle = COLORS.dim;
  context.font = "700 16px JetBrainsMono, monospace";
  context.textAlign = "right";
  context.fillText("TRADER TYPE", width - x, y + 24);
  context.textAlign = "left";
}

function drawPlaceholder(
  context: CanvasRenderingContext2D,
  code: string,
  x: number,
  y: number,
  size: number,
) {
  context.fillStyle = COLORS.paper;
  context.fillRect(x, y, size, size);
  context.strokeStyle = "rgba(11,28,32,0.22)";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(x + size * 0.12, y + size / 2);
  context.lineTo(x + size * 0.88, y + size / 2);
  context.moveTo(x + size / 2, y + size * 0.12);
  context.lineTo(x + size / 2, y + size * 0.88);
  context.stroke();
  context.fillStyle = COLORS.paperInk;
  context.font = `700 ${Math.round(size * 0.2)}px JetBrainsMono, monospace`;
  context.textAlign = "center";
  context.fillText(code, x + size / 2, y + size * 0.56);
  context.font = `700 ${Math.round(size * 0.024)}px JetBrainsMono, monospace`;
  context.fillText("ARTWORK DIRECTION TBD", x + size / 2, y + size * 0.92);
  context.textAlign = "left";
}

function drawStory(context: CanvasRenderingContext2D, data: ResultCardExportData, logo: HTMLImageElement) {
  const width = 1080;
  const height = 1920;
  drawBase(context, width, height);
  drawHeader(context, logo, width, 74, 72, 176);

  context.fillStyle = COLORS.teal;
  context.font = "700 20px JetBrainsMono, monospace";
  context.fillText(data.poles.join(" · "), 94, 190);
  context.fillStyle = COLORS.text;
  context.font = "650 84px Inter, sans-serif";
  wrapText(context, data.name, 94, 300, 892, 86, 2);
  context.fillStyle = COLORS.muted;
  context.font = "500 28px Inter, sans-serif";
  context.fillText(data.cn, 98, 410);

  drawPlaceholder(context, data.code, 160, 474, 760);

  context.fillStyle = COLORS.body;
  context.font = "500 31px Inter, sans-serif";
  wrapText(context, data.description, 94, 1322, 892, 44, 4);

  context.fillStyle = COLORS.teal;
  context.fillRect(94, 1520, 5, 142);
  context.fillStyle = COLORS.text;
  context.font = "650 34px Inter, sans-serif";
  wrapText(context, `“${data.roast}”`, 132, 1568, 816, 45, 3);

  context.strokeStyle = COLORS.line;
  context.beginPath();
  context.moveTo(94, 1740);
  context.lineTo(986, 1740);
  context.stroke();
  context.fillStyle = COLORS.teal;
  context.font = "700 18px JetBrainsMono, monospace";
  context.fillText("smartx.io/waitlist", 94, 1794);
  context.fillStyle = COLORS.dim;
  context.font = "600 14px Inter, sans-serif";
  context.textAlign = "right";
  context.fillText("FOR ENTERTAINMENT ONLY · NOT FINANCIAL ADVICE", 986, 1794);
  context.textAlign = "left";
}

function drawOg(context: CanvasRenderingContext2D, data: ResultCardExportData, logo: HTMLImageElement) {
  const width = 1200;
  const height = 630;
  drawBase(context, width, height);
  drawHeader(context, logo, width, 54, 46, 150);

  context.fillStyle = COLORS.teal;
  context.font = "700 14px JetBrainsMono, monospace";
  context.fillText(data.poles.join(" · "), 54, 130);
  context.fillStyle = COLORS.text;
  context.font = "650 62px Inter, sans-serif";
  wrapText(context, data.name, 54, 204, 600, 65, 2);
  context.fillStyle = COLORS.muted;
  context.font = "500 20px Inter, sans-serif";
  context.fillText(data.cn, 58, 292);
  context.fillStyle = COLORS.body;
  context.font = "500 21px Inter, sans-serif";
  wrapText(context, data.description, 54, 352, 590, 30, 4);
  context.fillStyle = COLORS.teal;
  context.fillRect(54, 495, 4, 64);
  context.fillStyle = COLORS.text;
  context.font = "650 20px Inter, sans-serif";
  wrapText(context, `“${data.roast}”`, 76, 522, 568, 28, 2);

  drawPlaceholder(context, data.code, 720, 108, 430);
}

export async function renderResultCard(data: ResultCardExportData, format: ResultCardFormat): Promise<RenderedResultCard> {
  await document.fonts.ready;
  const logo = await loadImage("/assets/smartx-logo.svg");
  const canvas = document.createElement("canvas");
  canvas.width = format === "story" ? 1080 : 1200;
  canvas.height = format === "story" ? 1920 : 630;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is unavailable in this browser.");
  if (format === "story") drawStory(context, data, logo);
  else drawOg(context, data, logo);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => (result ? resolve(result) : reject(new Error("Could not render the result card."))), "image/png");
  });
  return {
    href: URL.createObjectURL(blob),
    filename: `smartx-${data.code.toLowerCase()}-${format === "story" ? "1080x1920" : "1200x630"}.png`,
  };
}
