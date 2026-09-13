import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.BASE_URL || "https://mobilecenter.ir";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.category.findMany({
      where: { isActive: true, parentId: null },
      select: { slug: true },
    }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/products`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE_URL}/cart`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/checkout`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/login`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/register`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const productRoutes = products.map((p) => ({
    url: `${BASE_URL}/product/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryRoutes = categories.map((c) => ({
    url: `${BASE_URL}/products?category=${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}