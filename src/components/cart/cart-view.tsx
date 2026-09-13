"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart-store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/format";
import { SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Trash,
  Truck,
  ShieldCheck,
  CreditCard,
  PackageCheck,
  BadgeCheck,
} from "lucide-react";
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
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg text-center">
        <div className="bg-white rounded-[2rem] border border-slate-100 p-12 shadow-sm">
          <div className="w-24 h-24 mx-auto rounded-[2rem] bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-6 animate-pulse-glow">
            <ShoppingBag className="w-11 h-11 text-primary/70" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-3">سبد خرید شما خالی است</h1>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
            هنوز هیچ محصولی به سبد خرید اضافه نکرده‌اید.
            <br />
            از فروشگاه دیدن کنید و خرید خود را شروع کنید
          </p>
          <Button size="lg" className="h-12 px-8 rounded-2xl shadow-lg shadow-primary/25" asChild>
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
      <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-primary">خانه</Link>
        <span className="text-slate-300">/</span>
        <span className="font-medium text-slate-800">سبد خرید</span>
      </nav>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl lg:text-3xl font-black text-slate-900">
          سبد خرید
          <span className="text-base font-normal text-muted-foreground mr-2">
            ({count.toLocaleString("fa-IR")} کالا)
          </span>
        </h1>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
          onClick={() => {
            clearCart();
            toast.success("سبد خرید خالی شد");
          }}
        >
          <Trash className="ml-1.5 h-4 w-4" />
          خالی کردن سبد
        </Button>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">
        <div className="space-y-4">
          <div className="rounded-2xl border border-primary/10 bg-primary/[0.04] p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary shrink-0">
                <Truck className="w-5 h-5" />
              </span>
              {freeShippingGap > 0 ? (
                <p className="text-sm leading-6 text-slate-700">
                  <span className="font-bold text-primary">{formatPrice(freeShippingGap)}</span> تا ارسال
                  رایگان فاصله دارید
                </p>
              ) : (
                <p className="text-sm font-bold text-emerald-600">🎉 تبریک! این سفارش ارسال رایگان دارد</p>
              )}
            </div>
            <div className="h-2.5 bg-white rounded-full overflow-hidden ring-1 ring-primary/10">
              <div
                className="h-full rounded-full bg-gradient-to-l from-primary to-violet-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.color}-${item.storage}`}
                className="flex gap-4 p-4 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <Link
                  href={`/product/${item.slug}`}
                  className="shrink-0 w-24 h-24 rounded-xl border border-slate-100 bg-slate-50 relative overflow-hidden"
                >
                  <Image src={item.image} alt={item.name} fill sizes="96px" className="object-contain p-1.5" />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/product/${item.slug}`}
                    className="text-sm font-semibold text-slate-800 line-clamp-2 hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                  {(item.color || item.storage) && (
                    <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                      <BadgeCheck className="w-3.5 h-3.5" />
                      {[item.color, item.storage].filter(Boolean).join(" • ")}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                    <div className="flex items-center gap-0.5 rounded-full border border-slate-200 p-0.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1, item.color, item.storage)}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                      <span className="text-sm w-8 text-center font-bold tabular-nums">
                        {item.quantity.toLocaleString("fa-IR")}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1, item.color, item.storage)}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
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

                <div className="text-left shrink-0 pt-0.5">
                  <p className="font-black text-slate-900">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <p className="text-xs text-muted-foreground line-through mt-1">
                      {formatPrice(item.originalPrice * item.quantity)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end">
            <Link
              href="/products"
              className="flex items-center gap-2 text-sm text-primary font-medium hover:gap-3 transition-all"
            >
              <ArrowRight className="w-4 h-4" />
              ادامه خرید
            </Link>
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <h2 className="font-black text-slate-900 text-lg mb-5 flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-primary" />
              خلاصه سفارش
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">قیمت کالاها</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">هزینه ارسال</span>
                {shippingCost === 0 ? (
                  <span className="text-emerald-600 font-semibold">
                    {subtotal === 0 ? "-" : "رایگان"}
                  </span>
                ) : (
                  <span className="font-semibold">{formatPrice(shippingCost)}</span>
                )}
              </div>
              {freeShippingGap > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">مبلغ تا ارسال رایگان</span>
                  <span className="font-semibold text-primary">{formatPrice(freeShippingGap)}</span>
                </div>
              )}
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between mb-5 items-center">
              <span className="font-bold text-slate-900">مبلغ قابل پرداخت</span>
              <span className="font-black text-2xl text-primary">{formatPrice(total)}</span>
            </div>
            <Button
              className="w-full h-12 text-base rounded-2xl shadow-lg shadow-primary/25"
              size="lg"
              onClick={() => router.push("/checkout")}
            >
              ثبت سفارش و پرداخت
              <ArrowRight className="mr-2 w-4 h-4" />
            </Button>
            <p className="text-[11px] text-muted-foreground text-center mt-3">
              هزینه نهایی در صفحه پرداخت محاسبه می‌شود
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="flex flex-col items-center gap-2">
                <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                </span>
                <span className="text-[11px] leading-4 text-muted-foreground">ضمانت اصالت کالا</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-emerald-600" />
                </span>
                <span className="text-[11px] leading-4 text-muted-foreground">ارسال سریع</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-amber-600" />
                </span>
                <span className="text-[11px] leading-4 text-muted-foreground">پرداخت امن</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}