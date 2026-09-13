"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Filter,
  SlidersHorizontal,
  ArrowDownUp,
} from "lucide-react";
import { useState, useTransition } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Brand {
  id: string;
  name: string;
  slug: string;
}

interface ProductsFiltersProps {
  categories: Category[];
  brands: Brand[];
  activeCategory?: string;
  activeBrand?: string;
  activeSort?: string;
  minPrice?: number;
  maxPrice?: number;
}

const SORTS = [
  { value: "popular", label: "پرفروش‌ترین" },
  { value: "newest", label: "جدیدترین" },
  { value: "featured", label: "پیشنهاد ویژه" },
  { value: "price_asc", label: "ارزان‌ترین" },
  { value: "price_desc", label: "گران‌ترین" },
  { value: "views", label: "پربازدیدترین" },
];

function SortSegmented({
  active,
  onChange,
}: {
  active?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {SORTS.map((s) => {
        const isActive = active === s.value || (!active && s.value === "popular");
        return (
          <button
            key={s.value}
            onClick={() => onChange(s.value)}
            className={`text-xs font-medium py-2.5 px-3 rounded-xl border transition-all duration-200 ${
              isActive
                ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/25 scale-[1.02]"
                : "bg-white text-slate-600 border-slate-200 hover:border-primary/40 hover:text-primary hover:shadow-sm"
            }`}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

export function ProductsFilters({
  categories,
  brands,
  activeCategory,
  activeBrand,
  activeSort,
  minPrice,
  maxPrice,
}: ProductsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [priceMin, setPriceMin] = useState(minPrice?.toString() ?? "");
  const [priceMax, setPriceMax] = useState(maxPrice?.toString() ?? "");

  const updateUrl = (params: Record<string, string | undefined>) => {
    const url = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        url.delete(key);
      } else {
        url.set(key, value);
      }
    });
    startTransition(() => {
      router.push(`/products?${url.toString()}`);
    });
  };

  const handleSort = (value: string) => {
    updateUrl({ sort: value === "popular" ? undefined : value });
  };

  const handleCategory = (slug: string) => {
    updateUrl({ category: activeCategory === slug ? undefined : slug });
  };

  const handleBrand = (slug: string) => {
    updateUrl({ brand: activeBrand === slug ? undefined : slug });
  };

  const applyPrice = () => {
    const min = priceMin ? Math.max(0, Number(priceMin)) : undefined;
    const max = priceMax ? Math.max(0, Number(priceMax)) : undefined;
    if (min !== undefined && max !== undefined && min > max) return;
    updateUrl({
      minPrice: min?.toString(),
      maxPrice: max?.toString(),
    });
  };

  const clearFilters = () => {
    setPriceMin("");
    setPriceMax("");
    router.push("/products");
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block bg-white rounded-2xl border border-slate-100 p-5 self-start sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            فیلترها
          </h3>
          {activeCategory || activeBrand || minPrice || maxPrice ? (
            <button
              onClick={clearFilters}
              className="text-xs text-red-500 hover:text-red-600"
            >
              حذف فیلترها
            </button>
          ) : null}
        </div>

        {/* Sort */}
        <div className="mb-5">
          <p className="text-sm font-semibold text-slate-700 mb-2.5 flex items-center gap-1.5">
            <ArrowDownUp className="w-3.5 h-3.5 text-slate-400" />
            مرتب‌سازی
          </p>
          <SortSegmented active={activeSort} onChange={handleSort} />
        </div>

        <Separator className="my-4" />

        {/* Category */}
        <div className="mb-5">
          <p className="text-sm font-semibold text-slate-700 mb-2.5">دسته‌بندی</p>
          <div className="space-y-1.5">
            <button
              onClick={() => handleCategory("")}
              className={`flex w-full items-center justify-between text-right text-sm px-3 py-2.5 rounded-xl transition-all ${
                !activeCategory
                  ? "bg-primary/10 text-primary font-semibold shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-primary"
              }`}
            >
              همه دسته‌بندی‌ها
              {!activeCategory && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCategory(c.slug)}
                className={`flex w-full items-center justify-between text-right text-sm px-3 py-2.5 rounded-xl transition-all ${
                  activeCategory === c.slug
                    ? "bg-primary/10 text-primary font-semibold shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-primary"
                }`}
              >
                {c.name}
                {activeCategory === c.slug && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
              </button>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Brand */}
        <div className="mb-5">
          <p className="text-sm font-semibold text-slate-700 mb-2.5">برند</p>
          <div className="space-y-1.5">
            <button
              onClick={() => handleBrand("")}
              className={`flex w-full items-center justify-between text-right text-sm px-3 py-2.5 rounded-xl transition-all ${
                !activeBrand
                  ? "bg-primary/10 text-primary font-semibold shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-primary"
              }`}
            >
              همه برندها
              {!activeBrand && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
            </button>
            {brands.map((b) => (
              <button
                key={b.id}
                onClick={() => handleBrand(b.slug)}
                className={`flex w-full items-center justify-between text-right text-sm px-3 py-2.5 rounded-xl transition-all ${
                  activeBrand === b.slug
                    ? "bg-primary/10 text-primary font-semibold shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-primary"
                }`}
              >
                {b.name}
                {activeBrand === b.slug && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
              </button>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Price range */}
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-2.5">محدوده قیمت</p>
          <div className="flex items-center gap-2 mb-3">
            <Input
              type="number"
              placeholder="حداقل"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className="h-9 text-sm"
            />
            <span className="text-slate-400 text-sm">تا</span>
            <Input
              type="number"
              placeholder="حداکثر"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="h-9 text-sm"
            />
          </div>
          <Button
            size="sm"
            className="w-full"
            onClick={applyPrice}
            disabled={isPending}
          >
            اعمال فیلتر قیمت
          </Button>
        </div>
      </aside>

      {/* Mobile filter sheet */}
      <div className="lg:hidden flex items-center gap-2 mb-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex-1">
              <Filter className="ml-2 h-4 w-4" />
              فیلترها
              {(activeCategory || activeBrand || minPrice !== undefined || maxPrice !== undefined) && (
                <span className="w-4 h-4 bg-primary text-primary-foreground rounded-full text-[10px] flex items-center justify-center mr-1">
                  !
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[85%] max-w-sm overflow-y-auto">
            <SheetHeader className="mb-4">
              <SheetTitle className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                فیلترها
              </SheetTitle>
            </SheetHeader>

            <div className="mb-5">
              <p className="text-sm font-semibold text-slate-700 mb-2.5">مرتب‌سازی</p>
              <SortSegmented active={activeSort} onChange={handleSort} />
            </div>

            <Separator className="my-4" />

            <div className="mb-5">
              <p className="text-sm font-semibold text-slate-700 mb-2.5">دسته‌بندی</p>
              <div className="space-y-1.5">
                <button
                  onClick={() => handleCategory("")}
                  className={`block w-full text-right text-sm px-3 py-2.5 rounded-xl transition-colors hover:bg-primary/5 ${
                    !activeCategory ? "bg-primary/10 text-primary font-semibold" : "text-slate-600"
                  }`}
                >
                  همه دسته‌بندی‌ها
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleCategory(c.slug)}
                    className={`block w-full text-right text-sm px-3 py-2.5 rounded-xl transition-colors hover:bg-primary/5 ${
                      activeCategory === c.slug ? "bg-primary/10 text-primary font-semibold" : "text-slate-600"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <Separator className="my-4" />

            <div className="mb-5">
              <p className="text-sm font-semibold text-slate-700 mb-2.5">برند</p>
              <div className="space-y-1.5">
                <button
                  onClick={() => handleBrand("")}
                  className={`block w-full text-right text-sm px-3 py-2.5 rounded-xl transition-colors hover:bg-primary/5 ${
                    !activeBrand ? "bg-primary/10 text-primary font-semibold" : "text-slate-600"
                  }`}
                >
                  همه برندها
                </button>
                {brands.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => handleBrand(b.slug)}
                    className={`block w-full text-right text-sm px-3 py-2.5 rounded-xl transition-colors hover:bg-primary/5 ${
                      activeBrand === b.slug ? "bg-primary/10 text-primary font-semibold" : "text-slate-600"
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>

            <Separator className="my-4" />

            <div className="mb-6">
              <p className="text-sm font-semibold text-slate-700 mb-2.5">محدوده قیمت</p>
              <div className="flex items-center gap-2 mb-3">
                <Input type="number" placeholder="حداقل" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} className="h-9 text-sm" />
                <span className="text-slate-400 text-sm">تا</span>
                <Input type="number" placeholder="حداکثر" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} className="h-9 text-sm" />
              </div>
              <Button size="sm" className="w-full" onClick={applyPrice} disabled={isPending}>
                اعمال فیلتر قیمت
              </Button>
            </div>

            <Button variant="outline" className="w-full" onClick={clearFilters}>
              حذف همه فیلترها
            </Button>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}