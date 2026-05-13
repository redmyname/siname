"use client";

import { useCallback, useState } from "react";

interface Props {
  text: string;
  size?: "sm" | "md";
  label?: string;
}

export default function SpeakButton({ text, size = "md", label }: Props) {
  const [speaking, setSpeaking] = useState(false);

  const speak = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!window.speechSynthesis) return;

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "zh-CN";
      utterance.rate = 0.7;
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [text]
  );

  const sizeClass = size === "sm" ? "w-6 h-6" : "w-8 h-8";
  const iconSize = size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5";

  return (
    <button
      type="button"
      onClick={speak}
      title={label ? `Listen: ${label}` : `Listen: ${text}`}
      className={`${sizeClass} inline-flex items-center justify-center rounded-full transition-all shrink-0 ${
        speaking
          ? "bg-amber-100 text-amber-600 scale-110"
          : "bg-stone-100 text-stone-400 hover:bg-amber-50 hover:text-amber-500"
      }`}
    >
      {speaking ? (
        // Sound wave animation
        <span className="flex items-end gap-[1px] h-3">
          <span className="w-[2px] bg-amber-500 rounded-full animate-pulse" style={{ height: "40%", animationDelay: "0s" }} />
          <span className="w-[2px] bg-amber-500 rounded-full animate-pulse" style={{ height: "70%", animationDelay: "0.1s" }} />
          <span className="w-[2px] bg-amber-500 rounded-full animate-pulse" style={{ height: "100%", animationDelay: "0.2s" }} />
          <span className="w-[2px] bg-amber-500 rounded-full animate-pulse" style={{ height: "50%", animationDelay: "0.15s" }} />
        </span>
      ) : (
        <svg className={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      )}
    </button>
  );
}
