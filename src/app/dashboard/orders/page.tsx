import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate, toPersianDigits } from "@/lib/format";
import { ORDER_STATUS_MAP } from "@/lib/constants";
import { Package, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "سفارش‌های من",
  robots: { index: false, follow: false },
};

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 mb-6">سفارش‌های من</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 text-center py-16">
          <Package className="w-14 h-14 text-slate-300 mx-auto mb-4" />
          <p className="font-bold text-slate-700 mb-2">هنوز سفارشی ثبت نکرده‌اید</p>
          <p className="text-sm text-muted-foreground mb-6">برای دیدن سفارش‌ها، اولین خرید خود را انجام دهید</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90"
          >
            <ArrowLeft className="w-4 h-4" />
            شروع خرید
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = ORDER_STATUS_MAP[order.status] || ORDER_STATUS_MAP.PENDING;
            return (
              <Link
                key={order.id}
                href={`/dashboard/orders/${order.id}`}
                className="block bg-white rounded-2xl border border-slate-100 p-5 hover:border-primary/30 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900" dir="ltr">
                      {order.orderNumber}
                    </span>
                    <span className={`text-[11px] px-2.5 py-1 rounded-full text-white ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</span>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center -space-x-2 space-x-reverse">
                    {order.items.slice(0, 4).map((item) => (
                      <div key={item.id} className="w-11 h-11 rounded-lg bg-slate-50 border-2 border-white relative overflow-hidden">
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.image} alt="" className="w-full h-full object-contain" />
                        ) : null}
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <div className="w-11 h-11 rounded-lg bg-primary text-white text-xs font-bold flex items-center justify-center border-2 border-white">
                        +{toPersianDigits(order.items.length - 4)}
                      </div>
                    )}
                    <div className="mr-3 text-sm text-muted-foreground hidden sm:block">
                      {toPersianDigits(order.items.length)} کالا
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground mb-0.5">مبلغ سفارش</p>
                    <p className="font-black text-primary">{formatPrice(order.total)}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}