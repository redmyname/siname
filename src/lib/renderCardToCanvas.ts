import type { CandidateName } from "@/types";

export type CardStyle = "ink" | "elegant" | "dark";

interface StyleVars {
  bg: string;
  nameColor: string;
  subColor: string;
  accent: string;
  accentLight: string;
  border: string;
  stampBg: string;
  stampText: string;
  dividerColor: string;
}

const STYLES: Record<CardStyle, StyleVars> = {
  ink: {
    bg: "linear-gradient(155deg, #faf6ee 0%, #efe4cd 30%, #f3ead8 60%, #f8f1e3 100%)",
    nameColor: "#2c2416",
    subColor: "#6b5e45",
    accent: "#b8382c",
    accentLight: "rgba(184,56,44,0.07)",
    border: "rgba(184,56,44,0.18)",
    stampBg: "#c0392b",
    stampText: "#fdf6ed",
    dividerColor: "rgba(139,115,70,0.2)",
  },
  elegant: {
    bg: "linear-gradient(165deg, #fdfdfb 0%, #f7f4ed 40%, #f0ebe0 100%)",
    nameColor: "#1e1e1e",
    subColor: "#77756d",
    accent: "#5b7a6b",
    accentLight: "rgba(91,122,107,0.06)",
    border: "rgba(91,122,107,0.15)",
    stampBg: "#4a6b5d",
    stampText: "#fafaf7",
    dividerColor: "rgba(91,122,107,0.15)",
  },
  dark: {
    bg: "linear-gradient(160deg, #1a1d24 0%, #212531 40%, #1c1f28 100%)",
    nameColor: "#e8d5a3",
    subColor: "#8b8a7e",
    accent: "#d4a843",
    accentLight: "rgba(212,168,67,0.07)",
    border: "rgba(212,168,67,0.2)",
    stampBg: "#d4a843",
    stampText: "#1a1d24",
    dividerColor: "rgba(212,168,67,0.12)",
  },
};

const W = 360;
const H = 640;
const PAD = 36;

// Resolve the brush font-family from --font-brush CSS variable at runtime
function resolveBrushFont(): string {
  const el = document.createElement("span");
  el.style.cssText = "position:absolute;left:-9999px;top:-9999px;font-family:var(--font-brush),cursive";
  document.body.appendChild(el);
  const font = getComputedStyle(el).fontFamily;
  document.body.removeChild(el);
  return font;
}

// Parse a linear-gradient(angle, stops...) string into a CanvasGradient
function makeGradient(ctx: CanvasRenderingContext2D, cssGradient: string): CanvasGradient | null {
  const match = cssGradient.match(/linear-gradient\((\d+)deg,\s*(.*)\)/);
  if (!match) return null;

  const angle = (parseInt(match[1], 10) * Math.PI) / 180;
  const cx = W / 2;
  const cy = H / 2;
  const r = Math.sqrt(cx * cx + cy * cy);
  const startX = cx - r * Math.cos(angle);
  const startY = cy - r * Math.sin(angle);
  const endX = cx + r * Math.cos(angle);
  const endY = cy + r * Math.sin(angle);

  const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
  const stops = match[2].split(",").map((s) => s.trim());
  for (const stop of stops) {
    const parts = stop.split(/\s+/);
    if (parts.length >= 2) {
      const color = parts[0];
      const pct = parseFloat(parts[1]) / 100;
      gradient.addColorStop(pct, color);
    }
  }
  return gradient;
}

// Draw a rounded rect path
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// Draw a corner ornament (from the SVG path in the original design)
function drawCorner(ctx: CanvasRenderingContext2D, x: number, y: number, sx: number, sy: number, color: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(sx, sy);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.2;
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.moveTo(2, 22);
  ctx.lineTo(2, 10);
  ctx.bezierCurveTo(2, 6.68629, 4.68629, 4, 8, 4);
  ctx.lineTo(22, 4);
  ctx.moveTo(2, 22);
  ctx.lineTo(2, 18);
  ctx.bezierCurveTo(2, 15.7909, 3.79086, 14, 6, 14);
  ctx.lineTo(22, 14);
  ctx.stroke();
  ctx.restore();
}

export async function renderCardToCanvas(
  canvas: HTMLCanvasElement,
  candidate: CandidateName,
  originalName: string,
  styleKey: CardStyle,
): Promise<void> {
  const dpr = window.devicePixelRatio || 1;
  const scale = 3;
  canvas.width = W * scale * dpr;
  canvas.height = H * scale * dpr;

  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale * dpr, scale * dpr);

  const s = STYLES[styleKey];
  const chars = [...candidate.chineseName];
  const charSize = chars.length <= 3 ? 72 : 56;

  // Ensure the brush font is loaded
  const brushFont = resolveBrushFont();
  await document.fonts.load(`bold ${charSize}px ${brushFont}`);

  // 1. Background
  const gradient = makeGradient(ctx, s.bg);
  if (gradient) {
    ctx.fillStyle = gradient;
  } else {
    ctx.fillStyle = "#faf6ee";
  }
  ctx.fillRect(0, 0, W, H);

  // 2. Inner border (12px inset, rounded)
  ctx.strokeStyle = s.border;
  ctx.lineWidth = 1;
  roundRect(ctx, 12, 12, W - 24, H - 24, 12);
  ctx.stroke();

  // 3. Corner ornaments (24×24 SVG, positioned 20px from card edges)
  drawCorner(ctx, 20, 20, 1, 1, s.accent);
  drawCorner(ctx, W - 20 - 24, 20, -1, 1, s.accent);
  drawCorner(ctx, 20, H - 20 - 24, 1, -1, s.accent);
  drawCorner(ctx, W - 20 - 24, H - 20 - 24, -1, -1, s.accent);

  // 4. TOP SECTION — stamp + original name (y = 36)
  // Stamp (52×52 square with surname character)
  ctx.fillStyle = s.stampBg;
  roundRect(ctx, PAD, PAD, 52, 52, 6);
  ctx.fill();
  ctx.fillStyle = s.stampText;
  ctx.font = `26px ${brushFont}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(candidate.surname.char, PAD + 26, PAD + 26);

  // Original name (right aligned)
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.font = `11px system-ui, sans-serif`;
  ctx.fillStyle = s.subColor;
  ctx.globalAlpha = 0.55;
  ctx.fillText(originalName, W - PAD, PAD + 6);
  ctx.globalAlpha = 0.3;
  ctx.font = `9px system-ui, sans-serif`;
  ctx.fillText("→ Chinese Name", W - PAD, PAD + 20);
  ctx.globalAlpha = 1;

  // 5. CENTER SECTION — Chinese name
  const totalCharWidth = chars.length <= 3
    ? chars.length * charSize + (chars.length - 1) * 12
    : chars.length * charSize + (chars.length - 1) * 8;
  let charX = (W - totalCharWidth) / 2;
  const nameY = 230;
  const gap = chars.length <= 3 ? 12 : 8;

  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = s.nameColor;
  ctx.font = `${charSize}px ${brushFont}`;
  for (const char of chars) {
    ctx.fillText(char, charX, nameY);
    charX += charSize + gap;
  }

  // Pinyin
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillStyle = s.subColor;
  ctx.font = `15px system-ui, sans-serif`;
  ctx.fillText(candidate.pinyin, W / 2, nameY + charSize * 1.1 + 4);

  // 6. BOTTOM SECTION — character breakdown
  const bottomStart = 400;

  // Divider
  ctx.strokeStyle = s.dividerColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD, bottomStart);
  ctx.lineTo(W - PAD, bottomStart);
  ctx.stroke();

  let y = bottomStart + 16;

  // Surname row
  ctx.fillStyle = s.accentLight;
  roundRect(ctx, PAD, y, W - PAD * 2, 36, 8);
  ctx.fill();

  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = `9px system-ui, sans-serif`;
  ctx.fillStyle = s.accent;
  ctx.fillText("SURNAME", PAD + 12, y + 18);
  ctx.font = `13px system-ui, sans-serif`;
  ctx.fillStyle = s.nameColor;
  ctx.fillText(candidate.surname.char, PAD + 60, y + 18);
  ctx.font = `11px system-ui, sans-serif`;
  ctx.fillStyle = s.subColor;
  ctx.fillText(candidate.surname.meaning, PAD + 80, y + 18);

  y += 44;

  // Given name rows
  for (let i = 0; i < candidate.givenName.length; i++) {
    const g = candidate.givenName[i];
    const margin = i < candidate.givenName.length - 1 ? 6 : 8;

    ctx.fillStyle = "rgba(0,0,0,0.015)";
    roundRect(ctx, PAD, y, W - PAD * 2, 36, 8);
    ctx.fill();

    ctx.font = `9px system-ui, sans-serif`;
    ctx.fillStyle = s.accent;
    ctx.fillText("GIVEN", PAD + 12, y + 18);
    ctx.font = `13px system-ui, sans-serif`;
    ctx.fillStyle = s.nameColor;
    ctx.fillText(g.char, PAD + 60, y + 18);
    ctx.font = `11px system-ui, sans-serif`;
    ctx.fillStyle = s.subColor;
    ctx.fillText(g.meaning, PAD + 80, y + 18);

    y += 36 + margin;
  }

  // Overall meaning
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.font = `11px system-ui, sans-serif`;
  ctx.fillStyle = s.subColor;
  ctx.globalAlpha = 0.7;
  wrapText(ctx, `"${candidate.overallMeaning}"`, PAD, y + 4, W - PAD * 2, 16);
  ctx.globalAlpha = 1;

  // 7. FOOTER with CTA
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  const footerY = H - 28;
  ctx.font = `8px system-ui, sans-serif`;
  ctx.fillStyle = s.subColor;
  ctx.globalAlpha = 0.25;
  ctx.fillText("Give me a Chinese name too", W / 2, footerY);
  ctx.globalAlpha = 0.4;
  ctx.font = `10px system-ui, sans-serif`;
  ctx.fillText("mychinesename.net", W / 2, footerY + 13);
  ctx.globalAlpha = 1;
}

// Simple word wrap for canvas text
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(" ");
  let line = "";
  let ly = y;
  for (const word of words) {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, ly);
      line = word;
      ly += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) {
    ctx.fillText(line, x, ly);
  }
}
