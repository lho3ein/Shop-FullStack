import type { MetadataRoute } from "next";

const BASE_URL = process.env.BASE_URL || "https://mobilecenter.ir";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/admin", "/checkout", "/api", "/payment"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}