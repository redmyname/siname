"use client";

import type { CandidateName } from "@/types";
import SpeakButton from "./SpeakButton";

interface Props {
  candidate: CandidateName;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

export default function CandidateCard({ candidate, index, isSelected, onSelect }: Props) {
  const labels = ["A", "B", "C"];

  return (
    <div
      onClick={onSelect}
      className={`name-card rounded-2xl p-8 cursor-pointer transition-all duration-300 border-2 ${
        isSelected
          ? "border-amber-400 shadow-xl scale-[1.02]"
          : "border-transparent hover:border-stone-200 hover:shadow-lg"
      }`}
    >
      {/* Label */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-stone-300 uppercase tracking-widest">
          Option {labels[index]}
        </span>
        <span className="text-xs text-stone-400 capitalize px-2 py-0.5 bg-stone-100 rounded-full">
          {candidate.style}
        </span>
      </div>

      {/* Chinese Name + Speak */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2">
          <h3 className="font-brush text-5xl md:text-6xl text-ink leading-tight">
            {candidate.chineseName}
          </h3>
          <SpeakButton text={candidate.chineseName} label={candidate.chineseName} />
        </div>
        <p className="text-stone-400 text-lg mt-1">{candidate.pinyin}</p>
      </div>

      {/* Character breakdown */}
      <div className="space-y-3 mb-4">
        <div className="flex items-start gap-3 p-3 bg-amber-50/50 rounded-xl">
          <span className="font-brush text-2xl text-amber-700 w-8 text-center shrink-0">
            {candidate.surname.char}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold text-stone-700">Surname · {candidate.surname.meaning}</p>
              <SpeakButton text={candidate.surname.char} size="sm" label={candidate.surname.char} />
            </div>
            <p className="text-xs text-stone-500 mt-0.5">{candidate.surname.reason}</p>
          </div>
        </div>
        {candidate.givenName.map((g, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl">
            <span className="font-brush text-2xl text-stone-700 w-8 text-center shrink-0">
              {g.char}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold text-stone-700">Given · {g.meaning}</p>
                <SpeakButton text={g.char} size="sm" label={g.char} />
              </div>
              <p className="text-xs text-stone-500 mt-0.5">{g.reason}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Overall meaning */}
      <div className="border-t border-stone-200 pt-4">
        <p className="text-sm text-stone-600 leading-relaxed italic">
          &ldquo;{candidate.overallMeaning}&rdquo;
        </p>
      </div>

      {/* Select button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        className={`mt-4 w-full py-2.5 rounded-xl font-semibold text-sm transition ${
          isSelected
            ? "bg-amber-500 text-white"
            : "bg-stone-100 text-stone-600 hover:bg-amber-100 hover:text-amber-800"
        }`}
      >
        {isSelected ? "✓ Selected" : "Choose This Name"}
      </button>
    </div>
  );
}
