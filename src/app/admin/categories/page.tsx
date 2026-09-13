import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { toPersianDigits } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { NewCategoryForm } from "@/components/admin/new-category-form";
import { AdminCategoryActions } from "@/components/admin/admin-category-actions";
import { Tags, Smartphone, Tablet, Headphones, type LucideIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "دسته‌بندی‌ها",
  robots: { index: false, follow: false },
};

const iconMap: Record<string, LucideIcon> = {
  smartphone: Smartphone,
  tablet: Tablet,
  accessory: Headphones,
};

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">دسته‌بندی‌ها</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {toPersianDigits(categories.length)} دسته‌بندی
          </p>
        </div>
        <NewCategoryForm parentCategories={categories.filter((c) => !c.parentId)} />
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon ? iconMap[cat.icon] : Tags;
          return (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-slate-100 p-5 hover:border-primary/25 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{cat.name}</p>
                    <p className="text-xs text-muted-foreground" dir="ltr">
                      /{cat.slug}
                    </p>
                  </div>
                </div>
                <AdminCategoryActions category={cat} />
              </div>
              <div className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {cat.description || "—"}
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-slate-50 text-slate-600 border-slate-200">
                  {toPersianDigits(cat._count.products)} محصول
                </Badge>
                {cat.parentId ? (
                  <Badge variant="secondary" className="bg-amber-50 text-amber-600 border-amber-200">
                    زیردسته
                  </Badge>
                ) : (
                  <Badge className="bg-green-50 text-green-700 border-green-200">دسته اصلی</Badge>
                )}
                <Badge className={cat.isActive ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-slate-500 text-white border-0"}>
                  {cat.isActive ? "فعال" : "غیرفعال"}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}