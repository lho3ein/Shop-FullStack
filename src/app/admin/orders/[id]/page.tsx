import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDateTime, toPersianDigits } from "@/lib/format";
import { ORDER_STATUS_MAP, PAYMENT_STATUS_MAP } from "@/lib/constants";
import { AdminOrderStatusForm } from "@/components/admin/admin-order-status-form";
import { MapPin, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "جزئیات سفارش",
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      address: true,
      user: true,
    },
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
          href="/admin/orders"
          className="flex items-center gap-2 text-sm text-primary font-medium hover:gap-3 transition-all"
        >
          <ArrowRight className="w-4 h-4" />
          بازگشت به لیست
        </Link>
      </div>

      {/* Status banner */}
      <div className="flex items-center justify-between gap-4 rounded-2xl p-5 bg-white border border-slate-100 mb-6 flex-wrap">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">وضعیت سفارش</p>
            <span className={`text-[11px] px-3 py-1.5 rounded-full text-white ${status.color}`}>
              {status.label}
            </span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">وضعیت پرداخت</p>
            <span className={`text-[11px] px-3 py-1.5 rounded-full text-white ${payStatus.color}`}>
              {payStatus.label}
            </span>
          </div>
          {(order.refId || order.trackingCode) && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">شناسه‌ها</p>
              <p className="text-xs font-mono" dir="ltr">
                {order.refId || ""} {order.trackingCode ? `| ${order.trackingCode}` : ""}
              </p>
            </div>
          )}
        </div>
        <AdminOrderStatusForm orderId={order.id} status={order.status} />
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        {/* Items */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="font-bold text-slate-900 text-lg mb-5">کالاهای سفارش</h2>
          <div className="divide-y divide-slate-50">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                {item.image ? (
                  <div className="relative w-16 h-16 rounded-xl bg-slate-50 border overflow-hidden shrink-0">
                    <Image src={item.image} alt={item.name} fill sizes="64px" className="object-contain" />
                  </div>
                ) : null}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 line-clamp-2">{item.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {[item.storage, item.color].filter(Boolean).join(" • ")}
                    <span className="mx-1">•</span>
                    تعداد: {toPersianDigits(item.quantity)}
                  </p>
                </div>
                <div className="text-left shrink-0">
                  <p className="font-bold text-slate-900 text-sm">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatPrice(item.price)} / عدد</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-2.5 text-sm mt-4">
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
            <div className="border-t border-slate-100 pt-3 flex justify-between">
              <span className="font-bold">مبلغ نهایی</span>
              <span className="font-black text-lg text-primary">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="font-bold text-slate-900 text-sm mb-3">مشتری</h3>
            <p className="text-sm font-medium text-slate-800">{order.user?.name || "—"}</p>
            <p className="text-xs text-muted-foreground mt-1" dir="ltr">{order.user?.email}</p>
            <p className="text-xs text-muted-foreground mt-1" dir="ltr">{order.user?.phone}</p>
            <Link href="/admin/users" className="text-xs text-primary hover:underline mt-2 inline-block">
              مشاهده پروفایل مشتری
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-primary" />
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

          {order.note && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-sm text-amber-800">
              <p className="font-bold mb-1">یادداشت سفارش</p>
              {order.note}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}