import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductDetail } from "@/components/products/product-detail";
import { ProductGrid } from "@/components/products/product-grid";
import { ChevronLeft, Home } from "lucide-react";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findFirst({
    where: { slug, isActive: true },
    include: { category: true },
  });

  if (!product) return { title: "محصول یافت نشد" };

  return {
    title: product.name,
    description: product.shortDescription || product.description?.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.shortDescription || undefined,
      images: [product.image],
      type: "website",
      locale: "fa_IR",
      siteName: "موبایل‌سنتر",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findFirst({
    where: { slug, isActive: true },
    include: {
      brand: true,
      category: true,
    },
  });

  if (!product) notFound();

  // Increment views
  await prisma.product.update({
    where: { id: product.id },
    data: { views: { increment: 1 } },
  });

  const relatedProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    orderBy: { soldCount: "desc" },
    take: 8,
  });

  const specs = JSON.parse(product.specifications || "{}") as Record<string, string>;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6 flex-wrap">
        <Link href="/" className="flex items-center gap-1 hover:text-primary">
          <Home className="w-3.5 h-3.5" />
          خانه
        </Link>
        <ChevronLeft className="w-3.5 h-3.5" />
        <Link href="/products" className="hover:text-primary">
          فروشگاه
        </Link>
        {product.category && (
          <>
            <ChevronLeft className="w-3.5 h-3.5" />
            <Link href={`/products?category=${product.category.slug}`} className="hover:text-primary">
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronLeft className="w-3.5 h-3.5" />
        <span className="text-slate-800 font-medium truncate max-w-50">{product.name}</span>
      </nav>

      {/* Product detail */}
      <ProductDetail product={product} specs={specs} />

      {/* Specifications */}
      {Object.keys(specs).length > 0 && (
        <section className="mt-12 bg-white rounded-2xl border border-slate-100 p-6 lg:p-8">
          <h2 className="text-xl font-black text-slate-900 mb-6 pb-4 border-b border-slate-100">
            مشخصات فنی
          </h2>
          <div className="grid md:grid-cols-2 gap-x-12">
            {Object.entries(specs).map(([key, value], i) => (
              <div
                key={key}
                className={`flex items-center justify-between py-3 text-sm ${i % 2 === 0 ? "md:border-b md:border-slate-50" : ""}`}
              >
                <span className="text-muted-foreground">{key}</span>
                <span className="font-medium text-slate-800">{value}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Description */}
      {product.description && (
        <section className="mt-6 bg-white rounded-2xl border border-slate-100 p-6 lg:p-8">
          <h2 className="text-xl font-black text-slate-900 mb-4 pb-4 border-b border-slate-100">
            توضیحات
          </h2>
          <div className="text-sm text-slate-600 leading-8 whitespace-pre-line">
            {product.description}
          </div>
        </section>
      )}

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-black text-slate-900 mb-6">
            محصولات مرتبط
          </h2>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </div>
  );
}