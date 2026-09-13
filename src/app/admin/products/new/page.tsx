import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";

export const metadata: Metadata = {
  title: "افزودن محصول",
  robots: { index: false, follow: false },
};

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 mb-6">افزودن محصول جدید</h1>
      <ProductForm categories={categories} brands={brands} />
    </div>
  );
}