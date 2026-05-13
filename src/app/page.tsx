"use client";

import { useState, useRef } from "react";
import HeroSection from "@/components/HeroSection";
import NameInputForm from "@/components/NameInputForm";
import CandidateCard from "@/components/CandidateCard";
import NameCardCanvas from "@/components/NameCardCanvas";
import type { FormData, GenerateResponse, CandidateName } from "@/types";

const defaultForm: FormData = {
  originalName: "",
  gender: "male",
  language: "",
  country: "",
  birthYear: "",
  profession: "",
  interests: [],
  personality: "",
  religion: "",
  charCount: "",
  style: "",
  themes: [],
  culturalRef: [],
  taboo: "",
};

function getFingerprint(): string {
  const nav = typeof window !== "undefined" ? window.navigator : null;
  if (!nav) return "";
  const parts = [
    nav.language || "",
    nav.platform || "",
    String(screen.colorDepth || ""),
    screen.width + "x" + screen.height,
    String(new Date().getTimezoneOffset()),
  ];
  let hash = 0;
  for (const s of parts) {
    for (let i = 0; i < s.length; i++) {
      hash = ((hash << 5) - hash) + s.charCodeAt(i);
      hash = hash & hash;
    }
  }
  return hash.toString(36);
}

type Step = "form" | "loading" | "results" | "card";

export default function Home() {
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState<FormData>(defaultForm);
  const [results, setResults] = useState<GenerateResponse | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const skipCache = useRef(false);
  const [showHero, setShowHero] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updateForm = (updates: Partial<FormData>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  };

  const handleSubmit = async () => {
    setError(null);
    setStep("loading");
    setSelectedIndex(null);

    try {
      const payload: Record<string, unknown> = {
        originalName: form.originalName.trim(),
        gender: form.gender,
        language: form.language,
        _skipCache: skipCache.current,
      };

      if (form.country) payload.country = form.country;
      if (form.birthYear) payload.birthYear = parseInt(form.birthYear, 10);
      if (form.profession) payload.profession = form.profession;
      if (form.interests.length) payload.interests = form.interests;
      if (form.personality) payload.personality = form.personality;
      if (form.religion) payload.religion = form.religion;
      if (form.charCount) payload.charCount = parseInt(form.charCount, 10);
      if (form.style) payload.style = form.style;
      if (form.themes.length) payload.themes = form.themes;
      if (form.culturalRef.length) payload.culturalRef = form.culturalRef;
      if (form.taboo) payload.taboo = form.taboo;

      const res = await fetch("/api/generate-name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Fingerprint": getFingerprint(),
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 429) {
        setError("You've made too many requests. Please wait a moment and try again.");
        setStep("form");
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        setError(err.error || "Something went wrong. Please try again.");
        setStep("form");
        return;
      }

      const data: GenerateResponse = await res.json();
      setResults(data);
      setStep("results");
      skipCache.current = false;

      // Scroll to results
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch {
      setError("Network error. Please check your connection and try again.");
      setStep("form");
    }
  };

  const handleSelect = (candidate: CandidateName, index: number) => {
    setSelectedIndex(index);
    setStep("card");
  };

  const handleRegenerate = () => {
    skipCache.current = true;
    setShowHero(false);
    handleSubmit();
    setTimeout(() => {
      document.getElementById("generate")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const handleReset = () => {
    setStep("form");
    setShowHero(false);
    setResults(null);
    setSelectedIndex(null);
    setError(null);
    setTimeout(() => {
      document.getElementById("generate")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const handleCloseCard = () => {
    setStep("results");
  };

  return (
    <div className="min-h-screen">
      {showHero && step !== "results" && step !== "card" && <HeroSection />}

      {/* Form */}
      {(step === "form" || step === "loading") && (
        <>
          {error && (
            <div className="max-w-2xl mx-auto px-4 -mt-4 mb-4">
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            </div>
          )}
          <NameInputForm
            form={form}
            onChange={updateForm}
            onSubmit={handleSubmit}
            isLoading={step === "loading"}
          />
        </>
      )}

      {/* Loading */}
      {step === "loading" && (
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="ink-reveal inline-flex flex-col items-center gap-4">
            <div className="font-brush text-6xl text-amber-400 char-float">名</div>
            <p className="text-stone-500 text-lg animate-pulse">
              AI is crafting your authentic Chinese name...
            </p>
            <p className="text-stone-400 text-sm">This usually takes 3-5 seconds</p>
          </div>
        </div>
      )}

      {/* Results */}
      {step === "results" && results && (
        <section id="results" className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-6">
            <p className="text-sm text-stone-400 mb-2">Results for</p>
            <h2 className="text-2xl font-bold text-stone-900">{form.originalName}</h2>
            <p className="text-stone-500 text-sm mt-2">
              Here are three authentic Chinese names crafted for you. Each has a unique story.
            </p>
          </div>

          {/* Top action bar — always visible */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={handleRegenerate}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-800 text-white font-medium text-sm rounded-full hover:bg-stone-900 transition shadow-md"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Regenerate
            </button>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-stone-300 text-stone-700 font-medium text-sm rounded-full hover:bg-stone-50 transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Change settings
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {results.candidates.map((c, i) => (
              <CandidateCard
                key={i}
                candidate={c}
                index={i}
                isSelected={selectedIndex === i}
                onSelect={() => {
                  setSelectedIndex(i);
                }}
              />
            ))}
          </div>

          {/* Share prompt — shown after selection */}
          {selectedIndex !== null && (
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-5 py-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Love your Chinese name?{" "}
                <span className="font-medium">Share it with friends!</span>
              </div>
            </div>
          )}

          {/* Generate share card — shown after selection */}
          {selectedIndex !== null && (
            <div className="text-center">
              <button
                onClick={() =>
                  handleSelect(results.candidates[selectedIndex], selectedIndex)
                }
                className="inline-flex items-center gap-2 bg-accent text-white font-semibold px-8 py-3.5 rounded-full text-lg hover:bg-red-700 transition shadow-lg hover:shadow-xl"
              >
                ✨ Generate Share Card
              </button>
            </div>
          )}
        </section>
      )}

      {/* Card modal */}
      {step === "card" && results && selectedIndex !== null && (
        <NameCardCanvas
          candidate={results.candidates[selectedIndex]}
          originalName={form.originalName}
          onClose={handleCloseCard}
        />
      )}

      {/* Footer */}
      <footer className="text-center py-8 text-stone-400 text-sm border-t border-stone-200 mt-16">
        <p className="font-semibold text-stone-500">Siname</p>
        <p className="mt-1">Discover your authentic Chinese name.</p>
      </footer>
    </div>
  );
}
