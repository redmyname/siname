"use client";

import { useRef, useState, useCallback } from "react";
import html2canvas from "html2canvas";
import type { CandidateName } from "@/types";

interface Props {
  candidate: CandidateName;
  originalName: string;
  onClose: () => void;
}

type CardStyle = "ink" | "elegant" | "dark";

const STYLES = {
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

export default function NameCardCanvas({ candidate, originalName, onClose }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardStyle, setCardStyle] = useState<CardStyle>("ink");
  const [isDownloading, setIsDownloading] = useState(false);

  const s = STYLES[cardStyle];
  const chars = [...candidate.chineseName];
  const charSize = chars.length <= 3 ? 72 : 56;

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: "#ffffff",
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `chinese-name-${candidate.chineseName}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Failed to generate card:", err);
    }
    setIsDownloading(false);
  }, [candidate]);

  const handleShare = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        logging: false,
      });
      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((b) => resolve(b!), "image/png")
      );
      if (navigator.share) {
        await navigator.share({
          title: `My Chinese Name: ${candidate.chineseName}`,
          text: `I got my Chinese name on Siname — discover yours too!`,
          files: [new File([blob], `chinese-name-${candidate.chineseName}.png`, { type: "image/png" })],
        });
      } else {
        handleDownload();
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        handleDownload();
      }
    }
  }, [candidate, handleDownload]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <h3 className="font-semibold text-stone-800">Your Name Card</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 p-1 rounded-lg hover:bg-stone-100 transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Style selector */}
        <div className="flex gap-2 px-5 py-3 border-b border-stone-50">
          {([
            { key: "ink" as const, en: "Ink Wash" },
            { key: "elegant" as const, en: "Elegant" },
            { key: "dark" as const, en: "Dark" },
          ]).map((style) => (
            <button
              key={style.key}
              onClick={() => setCardStyle(style.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                cardStyle === style.key
                  ? "bg-stone-800 text-white shadow-md"
                  : "bg-stone-50 text-stone-500 hover:bg-stone-100"
              }`}
            >
              {style.en}
            </button>
          ))}
        </div>

        {/* Card preview */}
        <div className="p-6 flex justify-center">
          <div
            ref={cardRef}
            style={{ background: s.bg, width: 360, height: 640 }}
            className="rounded-2xl flex flex-col justify-between relative overflow-hidden shadow-xl select-none"
          >
            {/* Inner border */}
            <div
              style={{
                position: "absolute", inset: 12,
                border: `1px solid ${s.border}`,
                borderRadius: 12, pointerEvents: "none",
              }}
            />

            {/* Corner ornaments */}
            {[
              { top: 20, left: 20 },
              { top: 20, right: 20, transform: "scaleX(-1)" },
              { bottom: 20, left: 20, transform: "scaleY(-1)" },
              { bottom: 20, right: 20, transform: "scale(-1,-1)" },
            ].map((pos, i) => (
              <svg
                key={i}
                width="24" height="24" viewBox="0 0 24 24" fill="none"
                style={{ position: "absolute", ...pos, opacity: 0.3, zIndex: 0 }}
              >
                <path d="M2 22V10C2 6.68629 4.68629 4 8 4H22" stroke={s.accent} strokeWidth="1.2" />
                <path d="M2 22V18C2 15.7909 3.79086 14 6 14H22" stroke={s.accent} strokeWidth="1.2" />
              </svg>
            ))}

            {/* ── TOP: seal + original name ── */}
            <div style={{ padding: "36px 36px 0", position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div
                  style={{
                    width: 52, height: 52, borderRadius: 6,
                    backgroundColor: s.stampBg, color: s.stampText,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-brush), cursive", fontSize: 26,
                    boxShadow: `0 2px 8px ${s.accent}18`,
                  }}
                >
                  {candidate.surname.char}
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ color: s.subColor, fontSize: 11, margin: 0, opacity: 0.55 }}>
                    {originalName}
                  </p>
                  <p style={{ color: s.subColor, fontSize: 9, margin: "2px 0 0", opacity: 0.3 }}>
                    → Chinese Name
                  </p>
                </div>
              </div>
            </div>

            {/* ── CENTER: the name ── */}
            <div style={{ textAlign: "center", position: "relative", zIndex: 1, padding: "0 36px" }}>
              <div style={{ display: "flex", justifyContent: "center", gap: chars.length <= 3 ? 12 : 8 }}>
                {chars.map((char, i) => (
                  <span
                    key={i}
                    style={{
                      fontFamily: "var(--font-brush), cursive",
                      color: s.nameColor,
                      fontSize: charSize,
                      lineHeight: 1.1,
                    }}
                  >
                    {char}
                  </span>
                ))}
              </div>
              <p style={{ color: s.subColor, fontSize: 15, margin: "10px 0 0", letterSpacing: "0.05em" }}>
                {candidate.pinyin}
              </p>
            </div>

            {/* ── BOTTOM: character breakdown ── */}
            <div style={{ padding: "0 36px 20px", position: "relative", zIndex: 1 }}>
              <div style={{ borderTop: `1px solid ${s.dividerColor}`, paddingTop: 16 }}>
                {/* Surname */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  marginBottom: 8, padding: "8px 12px", borderRadius: 8,
                  backgroundColor: s.accentLight,
                }}>
                  <span style={{ fontSize: 9, fontWeight: 600, color: s.accent, textTransform: "uppercase", letterSpacing: "0.06em", minWidth: 44 }}>Surname</span>
                  <span style={{ color: s.nameColor, fontSize: 13, fontWeight: 600 }}>{candidate.surname.char}</span>
                  <span style={{ color: s.subColor, fontSize: 11 }}>{candidate.surname.meaning}</span>
                </div>

                {/* Given names */}
                {candidate.givenName.map((g, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    marginBottom: i < candidate.givenName.length - 1 ? 6 : 8,
                    padding: "8px 12px", borderRadius: 8,
                    backgroundColor: "rgba(0,0,0,0.015)",
                  }}>
                    <span style={{ fontSize: 9, fontWeight: 600, color: s.accent, textTransform: "uppercase", letterSpacing: "0.06em", minWidth: 44 }}>Given</span>
                    <span style={{ color: s.nameColor, fontSize: 13, fontWeight: 600 }}>{g.char}</span>
                    <span style={{ color: s.subColor, fontSize: 11 }}>{g.meaning}</span>
                  </div>
                ))}

                {/* Overall meaning */}
                <p style={{
                  color: s.subColor, fontSize: 11, lineHeight: 1.55,
                  fontStyle: "italic", margin: "4px 0 0", opacity: 0.7,
                }}>
                  &ldquo;{candidate.overallMeaning}&rdquo;
                </p>
              </div>
            </div>

            {/* ── Footer ── */}
            <div style={{ textAlign: "center", padding: "0 36px 28px", position: "relative", zIndex: 1 }}>
              <p style={{ color: s.subColor, fontSize: 9, margin: 0, opacity: 0.3 }}>
                mychinesename.net
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 py-3 rounded-xl bg-stone-800 text-white font-medium text-sm hover:bg-stone-900 transition disabled:opacity-50"
          >
            {isDownloading ? "Rendering..." : "Download PNG"}
          </button>
          <button
            onClick={handleShare}
            className="flex-1 py-3 rounded-xl bg-accent text-white font-medium text-sm hover:bg-red-700 transition"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
