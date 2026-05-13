"use client";

import { useState } from "react";
import type { FormData } from "@/types";

interface Props {
  form: FormData;
  onChange: (updates: Partial<FormData>) => void;
}

const INTERESTS = [
  "Nature", "Music", "Martial Arts", "Tea Ceremony", "Calligraphy",
  "Travel", "Reading", "Sports", "Meditation", "Cooking",
];

const PERSONALITIES = ["Outgoing", "Introverted", "Calm", "Energetic", "Rational", "Emotional"];

const STYLES = [
  { value: "classical", label: "Classical & Traditional" },
  { value: "modern", label: "Modern & Trendy" },
  { value: "literary", label: "Literary & Poetic" },
  { value: "minimalist", label: "Clean & Minimalist" },
  { value: "cute", label: "Cute & Endearing" },
  { value: "powerful", label: "Bold & Powerful" },
];

const THEMES = [
  { value: "wisdom", label: "Wisdom" },
  { value: "courage", label: "Courage" },
  { value: "beauty", label: "Beauty" },
  { value: "nature", label: "Nature" },
  { value: "fortune", label: "Good Fortune" },
  { value: "virtue", label: "Virtue & Morality" },
  { value: "success", label: "Success" },
  { value: "freedom", label: "Freedom" },
  { value: "peace", label: "Peace" },
];

const CULTURAL_REFS = [
  { value: "historical", label: "Historical Figures" },
  { value: "poetry", label: "Classical Poetry" },
  { value: "taoism", label: "Taoist Philosophy" },
  { value: "zen", label: "Zen Spirit" },
  { value: "wuxia", label: "Martial Arts & Wuxia" },
];

export default function AdvancedSettings({ form, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleInterest = (interest: string) => {
    const current = form.interests || [];
    const next = current.includes(interest)
      ? current.filter((i) => i !== interest)
      : [...current, interest];
    onChange({ interests: next });
  };

  const toggleTheme = (theme: string) => {
    const current = form.themes || [];
    const next = current.includes(theme)
      ? current.filter((t) => t !== theme)
      : [...current, theme];
    onChange({ themes: next.slice(0, 3) });
  };

  const toggleCulturalRef = (ref: string) => {
    const current = form.culturalRef || [];
    const next = current.includes(ref)
      ? current.filter((r) => r !== ref)
      : [...current, ref];
    onChange({ culturalRef: next });
  };

  return (
    <div className="border border-stone-200 rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 text-left bg-stone-50 hover:bg-stone-100 transition-colors"
      >
        <span className="font-medium text-stone-700">
          Advanced Settings &amp; Preferences
          <span className="ml-2 text-sm text-stone-400 font-normal">(optional)</span>
        </span>
        <svg
          className={`w-5 h-5 text-stone-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="px-6 pb-6 space-y-6 animate-in fade-in duration-300">
          {/* Row 1: Country + Birth Year */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Country / Region</label>
              <input
                type="text"
                value={form.country}
                onChange={(e) => onChange({ country: e.target.value })}
                placeholder="e.g. United States, France..."
                className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Birth Year <span className="text-stone-400">(for Five Elements)</span></label>
              <input
                type="number"
                value={form.birthYear}
                onChange={(e) => onChange({ birthYear: e.target.value })}
                placeholder="e.g. 1995"
                min={1900}
                max={2026}
                className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition"
              />
            </div>
          </div>

          {/* Row 2: Profession + Personality */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Profession</label>
              <input
                type="text"
                value={form.profession}
                onChange={(e) => onChange({ profession: e.target.value })}
                placeholder="e.g. Engineer, Artist, Student..."
                className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Personality</label>
              <select
                value={form.personality}
                onChange={(e) => onChange({ personality: e.target.value })}
                className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition"
              >
                <option value="">Select...</option>
                {PERSONALITIES.map((p) => (
                  <option key={p} value={p.toLowerCase()}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Interests & Hobbies</label>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                    (form.interests || []).includes(interest)
                      ? "bg-amber-100 text-amber-800 border border-amber-300"
                      : "bg-white text-stone-600 border border-stone-200 hover:border-stone-300"
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Preferences section */}
          <div className="border-t border-stone-100 pt-4">
            <p className="text-sm font-semibold text-stone-700 mb-4">Name Preferences</p>

            {/* Char Count + Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Character Count</label>
                <select
                  value={form.charCount}
                  onChange={(e) => onChange({ charCount: e.target.value })}
                  className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition"
                >
                  <option value="">Any</option>
                  <option value="2">2 characters (e.g. 李白)</option>
                  <option value="3">3 characters (e.g. 诸葛亮)</option>
                  <option value="4">4 characters</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Style</label>
                <select
                  value={form.style}
                  onChange={(e) => onChange({ style: e.target.value })}
                  className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition"
                >
                  <option value="">Any</option>
                  {STYLES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Themes */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Meaning Themes <span className="text-stone-400">(up to 3)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {THEMES.map((theme) => (
                  <button
                    key={theme.value}
                    type="button"
                    onClick={() => toggleTheme(theme.value)}
                    disabled={
                      !(form.themes || []).includes(theme.value) &&
                      (form.themes || []).length >= 3
                    }
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                      (form.themes || []).includes(theme.value)
                        ? "bg-red-100 text-red-800 border border-red-300"
                        : "bg-white text-stone-600 border border-stone-200 hover:border-stone-300 disabled:opacity-40"
                    }`}
                  >
                    {theme.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cultural References */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Cultural References</label>
              <div className="flex flex-wrap gap-2">
                {CULTURAL_REFS.map((ref) => (
                  <button
                    key={ref.value}
                    type="button"
                    onClick={() => toggleCulturalRef(ref.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                      (form.culturalRef || []).includes(ref.value)
                        ? "bg-blue-100 text-blue-800 border border-blue-300"
                        : "bg-white text-stone-600 border border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    {ref.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Taboo */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Characters / Sounds to Avoid
              </label>
              <input
                type="text"
                value={form.taboo}
                onChange={(e) => onChange({ taboo: e.target.value })}
                placeholder="e.g. a name that sounds like..."
                className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
