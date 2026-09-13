import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDateTime, toPersianDigits } from "@/lib/format";
import { ORDER_STATUS_MAP, PAYMENT_STATUS_MAP } from "@/lib/constants";
import { OrderTimeline } from "@/components/dashboard/order-timeline";
import {
  MapPin,
  CreditCard,
  ArrowRight,
  Package,
} from "lucide-react";

export const metadata: Metadata = {
  title: "جزئیات سفارش",
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const { id } = await params;

  const order = await prisma.order.findFirst({
    where: { id, userId: session.user.id },
    include: { items: true, address: true },
  });

  if (!order) notFound();

  const status = ORDER_STATUS_MAP[order.status] || ORDER_STATUS_MAP.PENDING;
  const payStatus = PAYMENT_STATUS_MAP[order.paymentStatus] || PAYMENT_STATUS_MAP.PENDING;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            سفارش <span dir="ltr" className="text-primary">{order.orderNumber}</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            ثبت شده در {formatDateTime(order.createdAt)}
          </p>
        </div>
        <Link
          href="/dashboard/orders"
          className="flex items-center gap-2 text-sm text-primary font-medium hover:gap-3 transition-all"
        >
          <ArrowRight className="w-4 h-4" />
          بازگشت به سفارش‌ها
        </Link>
      </div>

      {/* Status banner */}
      <div className={`rounded-2xl p-6 text-white bg-gradient-to-l ${status.color} mb-6 flex items-center justify-between`}>
        <div>
          <p className="text-xs opacity-80 mb-1">وضعیت سفارش</p>
          <p className="text-xl font-black">{status.label}</p>
        </div>
        <div className="text-left">
          <p className="text-xs opacity-80 mb-1">کد رهگیری</p>
          <p className="font-mono text-lg font-bold" dir="ltr">
            {order.trackingCode || "—"}
          </p>
        </div>
      </div>

      {/* Timeline */}
      <OrderTimeline status={order.status} />

      <div className="grid lg:grid-cols-[1fr_340px] gap-6 mt-6">
        {/* Items */}
        <div>
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-bold text-slate-900 text-lg mb-5">کالاهای سفارش</h2>
            <div className="divide-y divide-slate-50">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  {item.image ? (
                    <div className="relative w-16 h-16 rounded-xl bg-slate-50 border overflow-hidden shrink-0">
                      <Image src={item.image} alt={item.name} fill sizes="64px" className="object-contain" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-slate-50 border flex items-center justify-center shrink-0">
                      <Package className="w-6 h-6 text-slate-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 line-clamp-2">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {[item.storage, item.color].filter(Boolean).join(" • ")}
                      <span className="mx-1">•</span>
                      تعداد: {toPersianDigits(item.quantity)}
                    </p>
                  </div>
                  <div className="text-left shrink-0">
                    <p className="font-bold text-slate-900 text-sm">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 mt-4">
            <h2 className="font-bold text-slate-900 text-lg mb-4">جمع کل</h2>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">جمع کالاها</span>
                <span className="font-medium">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">هزینه ارسال</span>
                {order.shippingCost === 0 ? (
                  <span className="text-green-600 font-medium">رایگان</span>
                ) : (
                  <span className="font-medium">{formatPrice(order.shippingCost)}</span>
                )}
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">تخفیف</span>
                  <span className="font-medium text-green-600">{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="border-t border-slate-100 pt-3 flex justify-between">
                <span className="font-bold">مبلغ نهایی</span>
                <span className="font-black text-lg text-primary">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Side info */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
              <MapPin className="w-4.5 h-4.5 text-primary" />
              آدرس تحویل
            </h3>
            {order.address ? (
              <>
                <p className="text-sm font-medium text-slate-800 mb-1">
                  {order.address.receiverName} - {order.address.receiverPhone}
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {order.address.province}، {order.address.city}
                  {order.address.district ? `، ${order.address.district}` : ""}، {order.address.street}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  کد پستی: <span dir="ltr">{order.address.postalCode}</span>
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">آدرس ثبت نشده است</p>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
              <CreditCard className="w-4.5 h-4.5 text-primary" />
              اطلاعات پرداخت
            </h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">روش پرداخت</span>
                <span className="font-medium">زرین‌پال</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">وضعیت پرداخت</span>
                <span className={`text-[11px] px-2.5 py-1 rounded-full text-white ${payStatus.color}`}>
                  {payStatus.label}
                </span>
              </div>
              {order.refId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">کد تراکنش</span>
                  <span className="font-medium" dir="ltr">{toPersianDigits(order.refId)}</span>
                </div>
              )}
            </div>
          </div>

          {order.note && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-sm text-amber-800">
              <p className="font-bold mb-1">یادداشت سفارش</p>
              {order.note}
            </div>
          )}

          {order.status === "PENDING" && (
            <Link
              href="/checkout"
              className="block w-full bg-primary text-white text-center py-3 rounded-xl font-medium hover:bg-primary/90"
            >
              ادامه پرداخت سفارش
            </Link>
          )}
          {(order.status === "DELIVERED" || order.status === "PAID") && (
            <Link
              href="/support"
              className="block w-full border-2 border-primary text-primary text-center py-3 rounded-xl font-medium hover:bg-primary/5"
            >
              تماس با پشتیبانی
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}