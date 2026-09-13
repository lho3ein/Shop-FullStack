import type { Metadata } from "next";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductsFilters } from "@/components/products/products-filters";
import { toPersianDigits } from "@/lib/format";
import { SlidersHorizontal, X } from "lucide-react";

export const metadata: Metadata = {
  title: "فروشگاه",
  description:
    "مشاهده و خرید انواع گوشی موبایل، تبلت و لوازم جانبی از فروشگاه موبایل‌سنتر با فیلتر بر اساس برند، قیمت و دسته‌بندی",
};

interface ProductsPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    brand?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

const PAGE_SIZE = 12;

const SORT_OPTIONS: Record<string, Prisma.ProductOrderByWithRelationInput> = {
  newest: { createdAt: "desc" },
  featured: { isFeatured: "desc" },
  price_asc: { price: "asc" },
  price_desc: { price: "desc" },
  popular: { soldCount: "desc" },
  views: { views: "desc" },
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const q = params.q?.trim();
  const category = params.category?.trim();
  const brand = params.brand?.trim();
  const sort = params.sort || "popular";
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;

  const where: Prisma.ProductWhereInput = { isActive: true };

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  if (category) {
    where.category = { slug: category };
  }

  if (brand) {
    where.brand = { slug: brand };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  const sortOption = SORT_OPTIONS[sort] || SORT_OPTIONS.popular;

  const [products, total, allCategories, allBrands, saleCount] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: sortOption,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({
      where: { parentId: null, isActive: true },
    }),
    prisma.brand.findMany({ where: { isActive: true } }),
    prisma.product.count({ where: { ...where, originalPrice: { not: null } } }),
  ]);

  const activeFilters: { label: string; href: string }[] = [];
  if (q) activeFilters.push({ label: `جستجو: "${q}"`, href: "/products" });
  if (category) {
    const c = allCategories.find((x) => x.slug === category);
    if (c) activeFilters.push({ label: c.name, href: "/products" });
  }
  if (brand) {
    const b = allBrands.find((x) => x.slug === brand);
    if (b) activeFilters.push({ label: b.name, href: "/products" });
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    const range = `${minPrice ?? 0} - ${maxPrice ?? "بدون سقف"}`;
    activeFilters.push({ label: `قیمت: ${toPersianDigits(range)}`, href: "/products" });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-5 flex items-center gap-2">
        <Link href="/" className="hover:text-primary">خانه</Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-800 font-medium">فروشگاه</span>
      </nav>

      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 mb-1">
            فروشگاه موبایل‌سنتر
          </h1>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <SlidersHorizontal className="w-4 h-4" />
            {toPersianDigits(total)} محصول یافت شد
            {saleCount > 0 && <span className="text-green-600"> • {toPersianDigits(saleCount)} مورد با تخفیف</span>}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[250px_1fr] gap-8">
        {/* Filters sidebar */}
        <ProductsFilters
          categories={allCategories}
          brands={allBrands}
          activeCategory={category}
          activeBrand={brand}
          activeSort={sort}
          minPrice={minPrice}
          maxPrice={maxPrice}
        />

        {/* Products */}
        <div>
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {activeFilters.map((f) => (
                <Link
                  key={f.label}
                  href={f.href}
                  className="flex items-center gap-1.5 bg-primary/10 text-primary text-sm px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors"
                >
                  {f.label}
                  <X className="w-3.5 h-3.5" />
                </Link>
              ))}
            </div>
          )}

          <ProductGrid products={products} />

          {total > PAGE_SIZE && (
            <div className="mt-8 text-center text-sm text-muted-foreground">
              محصولات بیشتری وجود دارد - از فیلترها برای جستجوی دقیق‌تر استفاده کنید
            </div>
          )}
        </div>
      </div>
    </div>
  );
}