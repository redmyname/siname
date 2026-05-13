"use client";

import type { FormData } from "@/types";
import AdvancedSettings from "./AdvancedSettings";

interface Props {
  form: FormData;
  onChange: (updates: Partial<FormData>) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const LANGUAGES = [
  { value: "english", label: "English" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  { value: "spanish", label: "Spanish" },
  { value: "italian", label: "Italian" },
  { value: "russian", label: "Russian" },
  { value: "portuguese", label: "Portuguese" },
  { value: "arabic", label: "Arabic" },
  { value: "japanese", label: "Japanese" },
  { value: "korean", label: "Korean" },
  { value: "other", label: "Other" },
];

export default function NameInputForm({ form, onChange, onSubmit, isLoading }: Props) {
  const isValid = form.originalName.trim().length > 0 && form.gender && form.language;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid && !isLoading) onSubmit();
  };

  return (
    <section id="generate" className="max-w-2xl mx-auto px-4 py-12 scroll-mt-20" aria-label="Name generation form">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-stone-900 mb-3">What&apos;s Your Chinese Name?</h2>
        <p className="text-stone-500">Tell us about yourself and we&apos;ll craft three authentic names for you.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Primary fields */}
        <fieldset className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-sm">
          <legend className="sr-only">Basic Information</legend>
          <div>
            <label htmlFor="full-name" className="block text-sm font-semibold text-stone-700 mb-1.5">
              Your Full Name <span className="text-accent">*</span>
            </label>
            <input
              id="full-name"
              type="text"
              value={form.originalName}
              onChange={(e) => onChange({ originalName: e.target.value })}
              placeholder="e.g. Michael Johnson, Marie Dubois..."
              maxLength={100}
              required
              className="w-full rounded-xl border border-stone-200 px-4 py-3 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 focus:bg-white transition text-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <fieldset>
              <legend className="block text-sm font-semibold text-stone-700 mb-1.5">
                Gender <span className="text-accent">*</span>
              </legend>
              <div className="flex gap-2">
                {[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "neutral", label: "Neutral" },
                ].map((g) => (
                  <button
                    key={g.value}
                    type="button"
                    onClick={() => onChange({ gender: g.value as FormData["gender"] })}
                    aria-pressed={form.gender === g.value}
                    className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition ${
                      form.gender === g.value
                        ? "bg-amber-50 border-amber-400 text-amber-900"
                        : "bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="language" className="block text-sm font-semibold text-stone-700 mb-1.5">
                Language of Origin <span className="text-accent">*</span>
              </label>
              <select
                id="language"
                value={form.language}
                onChange={(e) => onChange({ language: e.target.value })}
                required
                className="w-full rounded-xl border border-stone-200 px-4 py-2.5 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 focus:bg-white transition text-sm"
              >
                <option value="">Select language...</option>
                {LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        {/* Advanced Settings */}
        <AdvancedSettings form={form} onChange={onChange} />

        {/* Submit */}
        <button
          type="submit"
          disabled={!isValid || isLoading}
          className="w-full py-4 rounded-2xl bg-accent text-white font-bold text-lg hover:bg-red-700 disabled:bg-stone-300 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-3">
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Crafting your name...
            </span>
          ) : (
            "Generate My Chinese Name"
          )}
        </button>
      </form>
    </section>
  );
}
