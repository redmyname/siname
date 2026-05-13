import type { Metadata } from "next";
import { Inter, Ma_Shan_Zheng } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const maShanZheng = Ma_Shan_Zheng({
  variable: "--font-brush",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Siname — Discover Your Chinese Name | AI Chinese Name Generator",
  description:
    "Get your authentic Chinese name with Siname. Our AI analyzes your original name, cultural background, and personal style to generate meaningful Chinese names with deep cultural roots. Free, no sign-up.",
  keywords: [
    "Chinese name generator",
    "get a Chinese name",
    "Chinese naming",
    "foreigner Chinese name",
    "Chinese name meaning",
    "Chinese surname",
    "name translation Chinese",
    "AI Chinese name",
  ],
  authors: [{ name: "Siname" }],
  creator: "Siname",
  publisher: "Siname",
  metadataBase: new URL("https://mychinesename.net"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Siname — Discover Your Chinese Name",
    description:
      "Get your authentic Chinese name with Siname. AI-powered naming with cultural depth — discover the Chinese name that truly represents you.",
    url: "https://mychinesename.net",
    siteName: "Siname",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Siname — Discover Your Chinese Name",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Siname — Discover Your Chinese Name",
    description:
      "Get your authentic Chinese name with Siname. AI-powered, culturally grounded, and uniquely yours.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${maShanZheng.variable} h-full antialiased`}
    >
      <body
        className="min-h-full bg-stone-50 text-stone-900 font-sans"
        suppressHydrationWarning
      >
        {/* JSON-LD Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Siname",
              alternateName: "AI Chinese Name Generator",
              url: "https://mychinesename.net",
              description:
                "Get your authentic Chinese name with Siname. Our AI analyzes your original name, cultural background, and personal style to generate meaningful Chinese names with deep cultural roots.",
              applicationCategory: "LifestyleApplication",
              operatingSystem: "Web",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              author: { "@type": "Organization", name: "Siname" },
              inLanguage: "en",
              potentialAction: {
                "@type": "GenerateAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://mychinesename.net/#generate",
                },
                description: "Generate an authentic Chinese name",
              },
            }),
          }}
        />
        {children}

        {/* Google Analytics 4 — enabled when NEXT_PUBLIC_GA_ID is set */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
