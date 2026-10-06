import type { MetadataRoute } from "next";
import { legalGuides } from "@/lib/v2-guides";
export default function sitemap(): MetadataRoute.Sitemap {
  const url = process.env.NEXT_PUBLIC_SITE_URL || "https://manasagravat.com";
  const lastModified = new Date();
  return [
    { url, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${url}/nyaycast`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${url}/resources`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${url}/guides`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${url}/newsletter`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${url}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${url}/resources/checklists`, lastModified, changeFrequency: "yearly", priority: 0.5 },
    { url: `${url}/resources/consultation-preparation`, lastModified, changeFrequency: "yearly", priority: 0.5 },
    ...legalGuides.map((guide) => ({
      url: `${url}/guides/${guide.slug}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.65,
    })),
  ];
}
