"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";
import { formatPrice, getDiscountPercent, toPersianDigits } from "@/lib/format";
import { ShoppingBag, Trash2, Heart } from "lucide-react";
import toast from "react-hot-toast";

interface WishlistItem {
  id: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    originalPrice: number | null;
    image: string;
    stock: number;
  };
}

interface WishlistItemsProps {
  items: WishlistItem[];
}

export function WishlistItems({ items }: WishlistItemsProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const handleRemove = async (id: string, productName: string) => {
    try {
      const res = await fetch(`/api/wishlist/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success(`${productName} از علاقه‌مندی‌ها حذف شد`);
        router.refresh();
      }
    } catch {
      toast.error("خطا در حذف از علاقه‌مندی‌ها");
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 text-center py-16">
        <Heart className="w-14 h-14 text-slate-300 mx-auto mb-4" />
        <p className="font-bold text-slate-700 mb-2">لیست علاقه‌مندی‌های شما خالی است</p>
        <p className="text-sm text-muted-foreground mb-6">
          محصولاتی را که دوست دارید به این لیست اضافه کنید
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90"
        >
          مشاهده محصولات
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
      {items.map((item) => {
        const discount = getDiscountPercent(item.product.price, item.product.originalPrice);
        const outOfStock = item.product.stock <= 0;
        return (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col">
            <Link
              href={`/product/${item.product.slug}`}
              className="relative aspect-square bg-slate-50 rounded-xl overflow-hidden mb-3 block"
            >
              <Image
                src={item.product.image}
                alt={item.product.name}
                fill
                sizes="200px"
                className="object-contain p-3 hover:scale-105 transition-transform"
              />
              {discount && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                  {toPersianDigits(discount)}٪
                </span>
              )}
            </Link>
            <Link
              href={`/product/${item.product.slug}`}
              className="text-sm font-medium text-slate-800 line-clamp-2 mb-2 hover:text-primary transition-colors flex-1"
            >
              {item.product.name}
            </Link>
            <div className="flex items-center justify-between text-left">
              <p className="font-bold text-primary text-sm">{formatPrice(item.product.price)}</p>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Button
                size="sm"
                className="flex-1 text-xs"
                disabled={outOfStock}
                onClick={() => {
                  addItem(item.product);
                  toast.success("به سبد خرید اضافه شد");
                }}
              >
                <ShoppingBag className="ml-1 h-3.5 w-3.5" />
                {outOfStock ? "ناموجود" : "افزودن به سبد"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-red-500 hover:text-red-600 hover:bg-red-50 px-2"
                onClick={() => handleRemove(item.id, item.product.name)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}