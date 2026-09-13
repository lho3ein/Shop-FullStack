"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCartStore } from "@/lib/store/cart-store";
import { formatPrice } from "@/lib/format";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
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
  const progress = Math.min(subtotal / FREE_SHIPPING_THRESHOLD, 1) * 100;

  const handleCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent side="left" className="w-full max-w-md p-0 flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <ShoppingBag className="w-5 h-5 text-primary" />
            سبد خرید
            {mounted && count > 0 && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                {count.toLocaleString("fa-IR")} کالا
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {!mounted || items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="font-semibold text-lg">سبد خرید شما خالی است</p>
            <p className="text-sm text-muted-foreground">
              برای شروع خرید به فروشگاه بروید و محصولات مورد نظر خود را انتخاب کنید
            </p>
            <Button onClick={closeCart} asChild>
              <Link href="/products">مشاهده محصولات</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="px-6 pt-4">
              {freeShippingGap > 0 ? (
                <div className="bg-primary/5 border border-primary/15 rounded-lg p-3 text-sm">
                  <p className="text-primary font-medium mb-2">
                    {formatPrice(freeShippingGap)} تا ارسال رایگان فاصله دارید
                  </p>
                  <div className="h-2 bg-primary/15 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700 font-medium">
                  ارسال این سفارش رایگان است!
                </div>
              )}
            </div>

            <ScrollArea className="flex-1 px-6 py-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.color}-${item.storage}`} className="flex gap-3">
                    <Link
                      href={`/product/${item.slug}`}
                      onClick={closeCart}
                      className="shrink-0 w-20 h-20 rounded-lg border bg-white overflow-hidden relative"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={closeCart}
                        className="text-sm font-medium line-clamp-2 hover:text-primary transition-colors"
                      >
                        {item.name}
                      </Link>
                      {(item.color || item.storage) && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {[item.color, item.storage].filter(Boolean).join(" • ")}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1, item.color, item.storage)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm w-6 text-center">{item.quantity.toLocaleString("fa-IR")}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1, item.color, item.storage)
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => {
                            removeItem(item.productId, item.color, item.storage);
                            toast.success("از سبد خرید حذف شد");
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-left shrink-0">
                      <p className="text-sm font-bold text-primary">
                        {formatPrice(item.price * item.quantity).replace(" تومان", " ت")}
                      </p>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <p className="text-xs text-muted-foreground line-through">
                          {formatPrice(item.originalPrice * item.quantity).replace(" تومان", " ت")}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t px-6 py-4 space-y-3 bg-white">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">هزینه ارسال</span>
                <span>{subtotal >= FREE_SHIPPING_THRESHOLD ? "رایگان" : formatPrice(SHIPPING_COST)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-semibold">مبلغ قابل پرداخت</span>
                <span className="font-bold text-lg text-primary">
                  {formatPrice(subtotal + (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST))}
                </span>
              </div>
              <Button className="w-full h-12 text-base" onClick={handleCheckout}>
                ادامه فرایند خرید
              </Button>
              <Button variant="ghost" className="w-full" onClick={closeCart}>
                ادامه خرید
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}