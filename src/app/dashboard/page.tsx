import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  formatPrice,
  formatDate,
  toPersianDigits,
} from "@/lib/format";
import { ORDER_STATUS_MAP } from "@/lib/constants";
import {
  Package,
  MapPin,
  Heart,
  Wallet,
  ArrowLeft,
  Truck,
  CheckCircle2,
  Clock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "حساب کاربری",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [orders, addresses, wishlistCount] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session.user.id },
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.address.count({ where: { userId: session.user.id } }),
    prisma.wishlistItem.count({ where: { userId: session.user.id } }),
  ]);

  const totalSpent = orders
    .filter((o) => o.paymentStatus === "SUCCESS")
    .reduce((s, o) => s + o.total, 0);

  const activeOrders = orders.filter(
    (o) => ["PAID", "PROCESSING", "SHIPPED"].includes(o.status)
  ).length;

  const stats = [
    { label: "سفارش‌ها", value: toPersianDigits(orders.length), icon: Package, color: "bg-blue-50 text-blue-600" },
    { label: "در حال ارسال", value: toPersianDigits(activeOrders), icon: Truck, color: "bg-indigo-50 text-indigo-600" },
    { label: "آدرس‌ها", value: toPersianDigits(addresses), icon: MapPin, color: "bg-amber-50 text-amber-600" },
    { label: "علاقه‌مندی‌ها", value: toPersianDigits(wishlistCount), icon: Heart, color: "bg-red-50 text-red-500" },
  ];

  return (
    <div>
      <div className="bg-white rounded-2xl border border-slate-100 p-6 lg:p-8 mb-6">
        <h1 className="text-2xl font-black text-slate-900 mb-2">
          سلام، {(session.user.name ?? "کاربر").split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          به حساب کاربری خود در موبایل‌سنتر خوش آمدید
        </p>
        <div className="flex items-center gap-3 mt-5 bg-primary/5 border border-primary/10 rounded-xl p-4 w-fit">
          <Wallet className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">مجموع خریدهای شما</p>
            <p className="font-black text-primary">{formatPrice(totalSpent)}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Link
            key={s.label}
            href="/dashboard"
            className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md hover:shadow-slate-200/50 transition-all"
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-slate-900">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Latest orders */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="font-bold text-slate-900 text-lg">آخرین سفارش‌ها</h2>
          {orders.length > 0 && (
            <Link href="/dashboard/orders" className="flex items-center gap-1 text-sm text-primary font-medium hover:gap-2 transition-all">
              مشاهده همه
              <ArrowLeft className="w-4 h-4" />
            </Link>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="px-6 pb-8 text-center py-12">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="font-medium text-slate-700 mb-2">هنوز سفارشی ثبت نکرده‌اید</p>
            <p className="text-sm text-muted-foreground mb-6">
              برای شروع خرید به فروشگاه بروید
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90"
            >
              شروع خرید
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {orders.map((order) => {
              const status = ORDER_STATUS_MAP[order.status] || ORDER_STATUS_MAP.PENDING;
              return (
                <Link
                  key={order.id}
                  href={`/dashboard/orders/${order.id}`}
                  className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center relative overflow-hidden">
                      {order.items[0]?.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={order.items[0].image} alt="" className="w-full h-full object-contain p-1" />
                      ) : (
                        <Package className="w-5 h-5 text-slate-400" />
                      )}
                      {order.items.length > 1 && (
                        <span className="absolute -bottom-1 -right-1 bg-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                          {toPersianDigits(order.items.length)}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm" dir="ltr">
                        {order.orderNumber}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-900">{formatPrice(order.total)}</p>
                      <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full text-white ${status.color}`}>
                        {order.paymentStatus === "SUCCESS" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {status.label}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}