"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCartStore } from "@/lib/store/cart-store";
import { formatPrice } from "@/lib/format";
import { Minus, Plus, ShoppingBag, Trash2, Truck, ShieldCheck, ArrowRight, BadgeCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { useMounted } from "@/lib/hooks/use-mounted";

export function CartSheet() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getTotals } = useCartStore();
  const router = useRouter();
  const mounted = useMounted();
  const { subtotal, count } = getTotals();

  const freeShippingGap = FREE_SHIPPING_THRESHOLD - subtotal;
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST;
  const total = subtotal + shippingCost;
  const progress = Math.min(subtotal / FREE_SHIPPING_THRESHOLD, 1) * 100;

  const handleCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent side="left" className="w-full max-w-md p-0 flex flex-col gap-0">
        <SheetHeader className="px-6 pt-6 pb-5 border-b border-slate-100 bg-gradient-to-b from-primary/[0.04] to-transparent">
          <SheetTitle className="flex items-center gap-3 text-xl font-black">
            <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-primary/10 text-primary">
              <ShoppingBag className="w-5 h-5" />
            </span>
            سبد خرید
            {mounted && count > 0 && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary text-primary-foreground shadow-sm shadow-primary/30">
                {count.toLocaleString("fa-IR")} کالا
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {!mounted || items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-5 px-6 text-center">
            <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center animate-pulse-glow">
              <ShoppingBag className="w-11 h-11 text-primary/70" />
            </div>
            <div>
              <p className="font-black text-xl text-slate-900 mb-2">سبد خرید شما خالی است</p>
              <p className="text-sm text-muted-foreground leading-7">
                هنوز محصولی اضافه نکرده‌اید.
                <br />
                از فروشگاه دیدن کنید و خریدتان را شروع کنید
              </p>
            </div>
            <Button size="lg" className="h-12 px-8 rounded-2xl shadow-lg shadow-primary/25" onClick={closeCart} asChild>
              <Link href="/products">
                مشاهده محصولات
                <ArrowRight className="mr-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="px-5 pt-4">
              <div className="rounded-2xl border border-primary/10 bg-primary/[0.04] p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary shrink-0">
                    <Truck className="w-4.5 h-4.5" />
                  </span>
                  {freeShippingGap > 0 ? (
                    <p className="text-[13px] leading-6 text-slate-700">
                      <span className="font-bold text-primary">{formatPrice(freeShippingGap)}</span>{" "}
                      تا ارسال رایگان فاصله دارید
                    </p>
                  ) : (
                    <p className="text-[13px] font-bold text-emerald-600">
                      ارسال این سفارش رایگان است!
                    </p>
                  )}
                </div>
                <div className="h-2 bg-white rounded-full overflow-hidden ring-1 ring-primary/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-l from-primary to-violet-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 px-5 py-4">
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.color}-${item.storage}`}
                    className="flex gap-3.5 p-3 rounded-2xl border border-slate-100 bg-white shadow-sm"
                  >
                    <Link
                      href={`/product/${item.slug}`}
                      onClick={closeCart}
                      className="shrink-0 w-21 h-21 rounded-xl border border-slate-100 bg-slate-50 overflow-hidden relative"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-1"
                        sizes="84px"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={closeCart}
                        className="text-sm font-semibold leading-6 line-clamp-2 hover:text-primary transition-colors"
                      >
                        {item.name}
                      </Link>
                      {(item.color || item.storage) && (
                        <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                          <BadgeCheck className="w-3.5 h-3.5" />
                          {[item.color, item.storage].filter(Boolean).join(" • ")}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2.5">
                        <div className="flex items-center gap-0.5 rounded-full border border-slate-200 bg-white p-0.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full hover:bg-primary/10 hover:text-primary"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1, item.color, item.storage)
                            }
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                          <span className="text-sm w-7 text-center font-bold tabular-nums">
                            {item.quantity.toLocaleString("fa-IR")}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full hover:bg-primary/10 hover:text-primary"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1, item.color, item.storage)
                            }
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            removeItem(item.productId, item.color, item.storage);
                            toast.success("از سبد خرید حذف شد");
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-left shrink-0 pt-0.5">
                      <p className="font-bold text-[15px] text-slate-900">
                        {formatPrice(item.price * item.quantity).replace(" تومان", "")}
                        <span className="text-[10px] font-medium text-muted-foreground mr-1">تومان</span>
                      </p>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <p className="text-xs text-muted-foreground line-through mt-1">
                          {formatPrice(item.originalPrice * item.quantity).replace(" تومان", "")}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t border-slate-100 px-5 py-4 space-y-3 bg-gradient-to-b from-white to-primary/[0.03]">
              <div className="flex items-center justify-between text-sm rounded-xl bg-white border border-slate-100 px-4 py-3">
                <span className="text-muted-foreground">هزینه ارسال</span>
                <span className="font-semibold">
                  {shippingCost === 0 ? (
                    <span className="text-emerald-600">رایگان</span>
                  ) : (
                    formatPrice(shippingCost)
                  )}
                </span>
              </div>
              <div className="flex items-end justify-between px-1">
                <span className="font-bold text-slate-900">مبلغ قابل پرداخت</span>
                <span className="font-black text-xl text-primary">
                  {formatPrice(total)}
                </span>
              </div>
              <Button className="w-full h-12 text-base rounded-2xl shadow-lg shadow-primary/25" onClick={handleCheckout}>
                ادامه فرایند خرید
                <ArrowRight className="mr-2 w-5 h-5" />
              </Button>
              <div className="flex items-center justify-center gap-4 text-[11px] text-muted-foreground pt-0.5">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  ضمانت اصالت کالا
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-primary" />
                  ارسال سریع
                </span>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}