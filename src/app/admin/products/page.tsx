import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPrice, toPersianDigits } from "@/lib/format";
import { AdminProductActions } from "@/components/admin/admin-product-actions";
import { Badge } from "@/components/ui/badge";
import { Plus, Package } from "lucide-react";

export const metadata: Metadata = {
  title: "مدیریت محصولات",
  robots: { index: false, follow: false },
};

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const products = await prisma.product.findMany({
    include: { category: true, brand: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const filtered = q
    ? products.filter((p) => p.name.includes(q))
    : products;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">محصولات</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {toPersianDigits(filtered.length)} کالا در فروشگاه
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          افزودن محصول جدید
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-14 h-14 text-slate-300 mx-auto mb-4" />
            <p className="font-bold text-slate-700 mb-2">محصولی یافت نشد</p>
            <p className="text-sm text-muted-foreground">
              اولین محصول خود را اضافه کنید
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="text-right px-5 py-3.5 text-xs font-bold text-slate-500 whitespace-nowrap">کالا</th>
                  <th className="text-right px-5 py-3.5 text-xs font-bold text-slate-500 whitespace-nowrap">دسته</th>
                  <th className="text-right px-5 py-3.5 text-xs font-bold text-slate-500 whitespace-nowrap">قیمت</th>
                  <th className="text-right px-5 py-3.5 text-xs font-bold text-slate-500 whitespace-nowrap">موجودی</th>
                  <th className="text-right px-5 py-3.5 text-xs font-bold text-slate-500 whitespace-nowrap">فروش</th>
                  <th className="text-right px-5 py-3.5 text-xs font-bold text-slate-500 whitespace-nowrap">وضعیت</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 whitespace-nowrap">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3 min-w-[220px]">
                        <div className="relative w-11 h-11 rounded-lg bg-slate-50 overflow-hidden shrink-0">
                          <Image src={product.image} alt="" fill sizes="44px" className="object-contain" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-800 line-clamp-1">{product.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{product.brand?.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-600 whitespace-nowrap">
                      {product.category?.name}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="text-sm font-bold text-slate-900">{formatPrice(product.price)}</div>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <div className="text-xs text-slate-400 line-through">
                          {formatPrice(product.originalPrice)}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge
                        className={
                          product.stock === 0
                            ? "bg-red-500 text-white border-0"
                            : product.stock <= 5
                            ? "bg-amber-500 text-white border-0"
                            : "bg-green-50 text-green-700 border-green-200"
                        }
                      >
                        {toPersianDigits(product.stock)} عدد
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-600 whitespace-nowrap">
                      {toPersianDigits(product.soldCount)}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge className={product.isActive ? "bg-green-50 text-green-700 border-green-200" : "bg-slate-500 text-white border-0"}>
                        {product.isActive ? "فعال" : "غیرفعال"}
                      </Badge>
                      {product.isFeatured && (
                        <Badge variant="secondary" className="mr-1 bg-primary/10 text-primary border-primary/20">
                          ویژه
                        </Badge>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <AdminProductActions
                        productId={product.id}
                        productName={product.name}
                        isActive={product.isActive}
                        isFeatured={product.isFeatured}
                        editHref={`/admin/products/${product.id}/edit`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}