import { Metadata } from "next";
import Link from "next/link";
import { languagePages, type LangPage } from "@/data/languagePages";

export async function generateStaticParams() {
  return languagePages.map((p) => ({ lang: p.slug.replace("chinese-name-for-", "") }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const page = languagePages.find((p) => p.slug === `chinese-name-for-${lang}`);
  if (!page) return { title: "Siname — Discover Your Chinese Name" };

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `https://mychinesename.net/${page.slug}` },
    openGraph: {
      title: page.title,
      description: page.description,
      url: `https://mychinesename.net/${page.slug}`,
    },
  };
}

export default async function LanguagePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const page = languagePages.find((p) => p.slug === `chinese-name-for-${lang}`) as LangPage | undefined;

  if (!page) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-stone-800">Page Not Found</h1>
        <p className="text-stone-500 mt-2">This language page does not exist.</p>
        <Link href="/" className="text-accent underline mt-4 inline-block">
          ← Back to Siname
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50">
      <header className="max-w-3xl mx-auto px-4 pt-16 pb-8 text-center">
        <Link href="/" className="text-stone-400 hover:text-stone-600 text-sm underline underline-offset-4">
          ← Siname Home
        </Link>
        <h1 className="text-4xl font-bold text-stone-900 mt-6 mb-4">{page.h1}</h1>
        <p className="text-lg text-stone-600 leading-relaxed">{page.description}</p>
      </header>

      <section className="max-w-3xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100">
          <p className="text-stone-700 leading-relaxed whitespace-pre-line">{page.body}</p>
        </div>
      </section>

      <section className="text-center pb-16">
        <h2 className="text-2xl font-bold text-stone-900 mb-4">Ready for Your Chinese Name?</h2>
        <p className="text-stone-500 mb-8">
          Let our AI find the perfect Chinese name — meaningful, authentic, and uniquely yours.
        </p>
        <a
          href="/#generate"
          className="inline-flex items-center gap-2 bg-accent text-white font-semibold px-8 py-3.5 rounded-full text-lg hover:bg-red-700 transition shadow-lg"
        >
          Generate My Chinese Name →
        </a>
      </section>

      <footer className="text-center py-8 text-stone-400 text-sm border-t border-stone-200">
        <p className="font-semibold text-stone-500">Siname</p>
        <p className="mt-1">Discover your authentic Chinese name.</p>
      </footer>
    </main>
  );
}
