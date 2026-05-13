"use client";

export default function HeroSection() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-b from-amber-50 via-stone-50 to-stone-50 py-20 px-4">
      {/* Decorative background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none select-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-size='40' fill='black'%3E名%3C/text%3E%3C/svg%3E")`,
          backgroundSize: "120px 120px",
        }}
      />

      <div className="relative max-w-3xl mx-auto text-center">
        <div className="mb-4 inline-flex items-center gap-2 bg-white/80 backdrop-blur rounded-full px-4 py-1.5 text-sm text-stone-500 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          AI-Powered Chinese Naming
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-stone-900 leading-tight mb-3">
          Siname
        </h1>
        <p className="text-xl md:text-2xl text-stone-500 mb-8 font-medium">
          Discover Your Chinese Name
        </p>

        <p className="text-lg md:text-xl text-stone-600 max-w-xl mx-auto mb-10 leading-relaxed">
          Not just a translation — an authentic Chinese name crafted with cultural
          depth, meaningful characters, and a story that&apos;s uniquely yours.
        </p>

        <a
          href="#generate"
          className="inline-flex items-center gap-2 bg-accent hover:bg-red-700 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all hover:shadow-lg hover:-translate-y-0.5"
        >
          Generate Your Name
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </a>

        <p className="mt-6 text-sm text-stone-400">
          Free · No sign-up required · 50,000+ names generated
        </p>
      </div>
    </header>
  );
}
