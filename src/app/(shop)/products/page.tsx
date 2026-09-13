import type { Metadata } from "next";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductsFilters } from "@/components/products/products-filters";
import { Badge } from "@/components/ui/badge";
import { toPersianDigits } from "@/lib/format";
import { X, ShoppingBag, Tag, BadgeCheck } from "lucide-react";

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

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
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

  const [products, total, allCategories, allBrands, saleCount] =
    await Promise.all([
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
      prisma.product.count({
        where: { ...where, originalPrice: { not: null } },
      }),
    ]);

  const activeFilterCategory = allCategories.find((x) => x.slug === category);
  const titleCategory = activeFilterCategory?.name;

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
    activeFilters.push({
      label: `قیمت: ${toPersianDigits(range)}`,
      href: "/products",
    });
  }

  return (
    <div className="container mx-auto px-4 py-6 lg:py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-5 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-primary transition-colors">
          خانه
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-800 font-medium">فروشگاه</span>
      </nav>

      {/* Shop banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-l from-primary via-[#1e3a8a] to-[#0c1f4d] text-white p-7 lg:p-10 mb-8">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 40%, white 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="absolute -top-20 right-10 w-72 h-72 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute -bottom-24 left-10 w-64 h-64 rounded-full bg-violet-400/20 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <Badge className="bg-white/15 text-white border-white/20 px-4 py-1.5 mb-4">
              <ShoppingBag className="w-3.5 h-3.5 ml-1" />
              فروشگاه موبایل‌سنتر
            </Badge>
            <h1 className="text-2xl lg:text-4xl font-black leading-tight">
              {q ? (
                <>
                  نتایج جستجو برای
                  <span className="text-blue-300"> «{q}»</span>
                </>
              ) : category ? (
                <>
                  دسته‌بندی
                  <span className="text-blue-300"> {titleCategory}</span>
                </>
              ) : (
                "مرجع تخصصی خرید موبایل"
              )}
            </h1>
            <p className="text-blue-100/80 text-sm lg:text-base mt-3 leading-relaxed">
              {toPersianDigits(total)} محصول آماده خرید
              {saleCount > 0 && (
                <span className="text-amber-300 mr-1">
                  • {toPersianDigits(saleCount)} مورد با تخفیف ویژه
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur border border-white/15 rounded-2xl px-4 py-3">
              <span className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center">
                <Tag className="w-4.5 h-4.5" />
              </span>
              <div>
                <p className="text-xs text-blue-100/70">تخفیف‌های فعال</p>
                <p className="font-black text-sm">
                  {toPersianDigits(saleCount)} مورد
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2.5 bg-white/10 backdrop-blur border border-white/15 rounded-2xl px-4 py-3">
              <span className="w-9 h-9 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center">
                <BadgeCheck className="w-4.5 h-4.5" />
              </span>
              <div>
                <p className="text-xs text-blue-100/70">ضمانت اصالت</p>
                <p className="font-black text-sm">کالای ۱۰۰٪ اورجینال</p>
              </div>
            </div>
          </div>
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
              محصولات بیشتری وجود دارد - از فیلترها برای جستجوی دقیق‌تر استفاده
              کنید
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
