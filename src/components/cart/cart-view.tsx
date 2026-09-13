"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart-store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/format";
import { SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { Minus, Plus, ShoppingBag, Trash2, ArrowRight, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useMounted } from "@/lib/hooks/use-mounted";

export function CartView() {
  const router = useRouter();
  const mounted = useMounted();
  const { items, updateQuantity, removeItem, clearCart, getTotals } = useCartStore();
  const { subtotal, count } = getTotals();

  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST;
  const total = subtotal + shippingCost;
  const freeShippingGap = FREE_SHIPPING_THRESHOLD - subtotal;

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg text-center">
        <div className="bg-white rounded-3xl border border-slate-100 p-12 shadow-sm">
          <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <ShoppingBag className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-3">سبد خرید شما خالی است</h1>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
            هنوز هیچ محصولی به سبد خرید اضافه نکرده‌اید.
            <br />
            از فروشگاه دیدن کنید و خرید خود را شروع کنید
          </p>
          <Button size="lg" className="h-12 px-8" asChild>
            <Link href="/products">
              مشاهده محصولات
              <ArrowRight className="mr-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-primary">خانه</Link>
        <span className="text-slate-300">/</span>
        <span className="font-medium text-slate-800">سبد خرید</span>
      </nav>

      <h1 className="text-2xl lg:text-3xl font-black text-slate-900 mb-8">
        سبد خرید
        <span className="text-base font-normal text-muted-foreground mr-2">
          ({count.toLocaleString("fa-IR")} کالا)
        </span>
      </h1>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
        {/* Items */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 lg:p-6">
          {freeShippingGap > 0 ? (
            <div className="bg-primary/5 border border-primary/15 rounded-xl p-4 mb-6">
              <p className="text-sm font-medium text-primary mb-3">
                {formatPrice(freeShippingGap)} تا ارسال رایگان فاصله دارید 🚚
              </p>
              <div className="h-2.5 bg-primary/15 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-green-700 font-medium text-sm">
              🎉 تبریک! این سفارش شامل ارسال رایگان می‌شود
            </div>
          )}

          <div className="divide-y divide-slate-50 rounded-xl overflow-hidden border border-slate-50">
            {items.map((item) => (
              <div key={`${item.productId}-${item.color}-${item.storage}`} className="flex gap-4 p-4 bg-white hover:bg-slate-50/50 transition-colors">
                <Link
                  href={`/product/${item.slug}`}
                  className="shrink-0 w-24 h-24 rounded-xl border bg-slate-50 relative overflow-hidden"
                >
                  <Image src={item.image} alt={item.name} fill sizes="96px" className="object-contain p-1" />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/product/${item.slug}`}
                    className="text-sm font-medium text-slate-800 line-clamp-2 hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                  {(item.color || item.storage) && (
                    <p className="text-xs text-muted-foreground mt-1.5">
                      {[item.color, item.storage].filter(Boolean).join(" • ")}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                    <div className="flex items-center gap-2 border rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1, item.color, item.storage)}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                      <span className="text-sm w-8 text-center font-medium">
                        {item.quantity.toLocaleString("fa-IR")}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1, item.color, item.storage)}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => {
                        removeItem(item.productId, item.color, item.storage);
                        toast.success("از سبد خرید حذف شد");
                      }}
                    >
                      <Trash2 className="ml-1.5 h-4 w-4" />
                      حذف
                    </Button>
                  </div>
                </div>

                <div className="text-left shrink-0">
                  <p className="font-bold text-slate-900">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <p className="text-xs text-muted-foreground line-through">
                      {formatPrice(item.originalPrice * item.quantity)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-6">
            <Link href="/products" className="flex items-center gap-2 text-sm text-primary font-medium hover:gap-3 transition-all">
              <ArrowRight className="w-4 h-4" />
              ادامه خرید
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => {
                clearCart();
                toast.success("سبد خرید خالی شد");
              }}
            >
              <Trash className="ml-1.5 h-4 w-4" />
              خالی کردن سبد
            </Button>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 sticky top-28">
          <h2 className="font-bold text-slate-900 text-lg mb-5">خلاصه سفارش</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">قیمت کالاها</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">هزینه ارسال</span>
              {shippingCost === 0 ? (
                <span className="text-green-600 font-medium">
                  {subtotal === 0 ? "-" : "رایگان"}
                </span>
              ) : (
                <span className="font-medium">{formatPrice(shippingCost)}</span>
              )}
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between mb-5">
            <span className="font-bold text-slate-900">مبلغ قابل پرداخت</span>
            <span className="font-black text-xl text-primary">{formatPrice(total)}</span>
          </div>
          <Button
            className="w-full h-12 text-base"
            size="lg"
            onClick={() => router.push("/checkout")}
          >
            ادامه فرایند خرید
            <ArrowRight className="mr-2 w-4 h-4" />
          </Button>
          <p className="text-[11px] text-muted-foreground text-center mt-3">
            هزینه نهایی در صفحه پرداخت محاسبه می‌شود
          </p>
        </div>
      </div>
    </div>
  );
}