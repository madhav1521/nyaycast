import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  const url = process.env.NEXT_PUBLIC_SITE_URL || "https://manasagravat.com";
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/admin" },
    sitemap: `${url}/sitemap.xml`,
  };
}
