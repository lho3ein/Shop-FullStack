"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart-store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { formatPrice } from "@/lib/format";
import { SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { useMounted } from "@/lib/hooks/use-mounted";
import {
  CreditCard,
  MapPin,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { AddressFormDialog } from "@/components/checkout/address-form-dialog";

interface Address {
  id: string;
  label: string;
  province: string;
  city: string;
  district?: string | null;
  street: string;
  postalCode: string;
  receiverName: string;
  receiverPhone: string;
  isDefault: boolean;
}

interface CheckoutViewProps {
  addresses: Address[];
}

export function CheckoutView({ addresses }: CheckoutViewProps) {
  const router = useRouter();
  const mounted = useMounted();
  const { items, getTotals } = useCartStore();
  const { subtotal } = getTotals();

  const [selectedAddress, setSelectedAddress] = useState<string>(
    addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id ?? ""
  );
  const [note, setNote] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"online">("online");
  const [processing, setProcessing] = useState(false);

  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST;

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg text-center">
        <div className="bg-white rounded-3xl border border-slate-100 p-12">
          <h1 className="text-2xl font-black text-slate-900 mb-3">سبد خرید خالی است</h1>
          <p className="text-sm text-muted-foreground mb-8">
            برای ثبت سفارش ابتدا محصولات را به سبد خرید اضافه کنید
          </p>
          <Button asChild>
            <Link href="/products">مشاهده محصولات</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!selectedAddress) {
      toast.error("لطفاً آدرس دریافت سفارش را انتخاب کنید");
      return;
    }
    if (!termsAccepted) {
      toast.error("لطفاً قوانین و مقررات را بپذیرید");
      return;
    }

    setProcessing(true);
    try {
      const syncRes = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            color: i.color,
            storage: i.storage,
          })),
        }),
      });

      if (!syncRes.ok) {
        toast.error("خطا در ذخیره سبد خرید");
        return;
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId: selectedAddress,
          note: note.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "خطا در ثبت سفارش");
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.success("سفارش ثبت شد!");
        router.push(`/dashboard/orders/${data.orderId}`);
      }
    } catch {
      toast.error("خطایی رخ داد. لطفاً دوباره تلاش کنید");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-primary">خانه</Link>
        <span className="text-slate-300">/</span>
        <Link href="/cart" className="hover:text-primary">سبد خرید</Link>
        <span className="text-slate-300">/</span>
        <span className="font-medium text-slate-800">تسویه حساب</span>
      </nav>

      <h1 className="text-2xl lg:text-3xl font-black text-slate-900 mb-8">تسویه حساب</h1>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
        <div className="space-y-6">
          {/* Address */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                آدرس دریافت سفارش
              </h2>
              <AddressFormDialog onCreated={(addr) => {
                setSelectedAddress(addr.id);
                toast.success("آدرس جدید ثبت شد");
              }} />
            </div>

            {addresses.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                <p className="mb-4">هنوز آدرسی ثبت نکرده‌اید</p>
                <AddressFormDialog
                  onCreated={(addr) => {
                    setSelectedAddress(addr.id);
                    toast.success("آدرس جدید ثبت شد");
                  }}
                />
              </div>
            ) : (
              <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress} className="gap-3">
                {addresses.map((addr) => (
                  <div key={addr.id}>
                    <RadioGroupItem value={addr.id} id={`addr-${addr.id}`} className="peer sr-only" />
                    <Label
                      htmlFor={`addr-${addr.id}`}
                      className={`flex items-start gap-3 border-2 rounded-xl p-4 cursor-pointer transition-all peer-data-[state=checked]:border-primary ${
                        selectedAddress === addr.id
                          ? "border-primary bg-primary/5"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-sm font-bold text-slate-900">{addr.label}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              پیش‌فرض
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600">
                          {addr.province}، {addr.city}
                          {addr.district ? `، ${addr.district}` : ""}، {addr.street}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1.5">
                          {addr.receiverName} • {addr.receiverPhone}
                        </p>
                      </div>
                      {selectedAddress === addr.id && (
                        <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-xs shrink-0">
                          ✓
                        </span>
                      )}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>

          {/* Payment method */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-bold text-slate-900 flex items-center gap-2 mb-5">
              <CreditCard className="w-5 h-5 text-primary" />
              روش پرداخت
            </h2>
            <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as "online")} className="gap-3">
              <div>
                <RadioGroupItem value="online" id="pay-online" className="peer sr-only" />
                <Label
                  htmlFor="pay-online"
                  className={`flex items-center justify-between border-2 rounded-xl p-4 cursor-pointer peer-data-[state=checked]:border-primary ${
                    paymentMethod === "online" ? "border-primary bg-primary/5" : "border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">پرداخت آنلاین (زرین‌پال)</p>
                      <p className="text-xs text-muted-foreground">
                        همه کارت‌های بانکی عضو شتاب
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-green-50 text-green-600 font-medium px-2.5 py-1 rounded-full border border-green-200">
                    توصیه‌شده
                  </span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Note */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-bold text-slate-900 mb-4">توضیحات سفارش</h2>
            <Textarea
              placeholder="توضیحات اضافه برای سفارش خود (اختیاری) بنویسید"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[90px]"
            />
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 sticky top-28">
          <h2 className="font-bold text-slate-900 text-lg mb-5">
            سفارش شما
            <span className="text-sm font-normal text-muted-foreground mr-1">
              ({items.reduce((s, i) => s + i.quantity, 0).toLocaleString("fa-IR")} کالا)
            </span>
          </h2>

          <div className="space-y-4 max-h-[280px] overflow-y-auto mb-5 pe-1">
            {items.map((item) => (
              <div key={`${item.productId}-${item.color}-${item.storage}`} className="flex gap-3">
                <div className="relative w-14 h-14 rounded-lg bg-slate-50 border overflow-hidden shrink-0">
                  <Image src={item.image} alt={item.name} fill sizes="56px" className="object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium line-clamp-2">{item.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {[item.storage, item.color].filter(Boolean).join(" • ")}
                  </p>
                  <p className="text-xs font-bold text-slate-900 mt-1">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">قیمت کالاها</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">هزینه ارسال</span>
              {shippingCost === 0 ? (
                <span className="text-green-600 font-medium">رایگان</span>
              ) : (
                <span className="font-medium">{formatPrice(shippingCost)}</span>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">کد تخفیف</span>
              <span className="text-muted-foreground">ندارید</span>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex justify-between mb-5">
            <span className="font-bold">مبلغ قابل پرداخت</span>
            <span className="font-black text-xl text-primary">{formatPrice(subtotal + shippingCost)}</span>
          </div>

          <div className="flex items-start gap-2 mb-5 cursor-pointer" onClick={() => setTermsAccepted(!termsAccepted)}>
            <Checkbox checked={termsAccepted} onCheckedChange={(v) => setTermsAccepted(!!v)} />
            <p className="text-xs text-muted-foreground leading-5">
              با ثبت سفارش، <span className="text-primary">قوانین و مقررات</span> فروشگاه
              موبایل‌سنتر و شرایط بازگشت کالا را می‌پذیرم
            </p>
          </div>

          <Button
            className="w-full h-13 text-base"
            size="lg"
            onClick={handleSubmit}
            disabled={processing}
          >
            {processing ? (
              <>
                <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                در حال اتصال به درگاه پرداخت...
              </>
            ) : (
              <>
                <ShieldCheck className="ml-2 w-5 h-5" />
                پرداخت و ثبت سفارش
              </>
            )}
          </Button>
          <p className="text-[11px] text-muted-foreground text-center mt-3 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
            پرداخت امن با درگاه زرین‌پال
          </p>
        </div>
      </div>
    </div>
  );
}