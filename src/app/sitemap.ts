import type { MetadataRoute } from "next";
import { languagePages } from "@/data/languagePages";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mychinesename.net";

  const entries = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1.0,
    },
  ];

  for (const page of languagePages) {
    entries.push({
      url: `${baseUrl}/${page.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    });
  }

  return entries;
}
