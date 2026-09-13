import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate, toPersianDigits } from "@/lib/format";
import { ORDER_STATUS_MAP } from "@/lib/constants";
import {
  ShoppingBag,
  Package,
  Users,
  Wallet,
  TrendingUp,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";

export const metadata: Metadata = {
  title: "داشبورد مدیریت",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const [
    totalProducts,
    totalOrders,
    totalUsers,
    totalRevenue,
    orders,
    lowStock,
    pendingOrders,
  ] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.aggregate({
      where: { paymentStatus: "SUCCESS" },
      _sum: { total: true },
    }),
    prisma.order.findMany({
      include: { items: true, user: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.product.findMany({
      where: { stock: { lte: 5 }, isActive: true },
      orderBy: { stock: "asc" },
      take: 5,
    }),
    prisma.order.count({
      where: { status: "PENDING" },
    }),
  ]);

  const stats = [
    {
      label: "سفارش‌ها",
      value: toPersianDigits(totalOrders),
      icon: ShoppingBag,
      color: "bg-blue-50 text-blue-600",
      href: "/admin/orders",
    },
    {
      label: "کالاهای فروشگاه",
      value: toPersianDigits(totalProducts),
      icon: Package,
      color: "bg-indigo-50 text-indigo-600",
      href: "/admin/products",
    },
    {
      label: "کاربران",
      value: toPersianDigits(totalUsers),
      icon: Users,
      color: "bg-amber-50 text-amber-600",
      href: "/admin/users",
    },
    {
      label: "درآمد کل",
      value: formatPrice(totalRevenue._sum.total ?? 0),
      icon: Wallet,
      color: "bg-green-50 text-green-600",
      href: "/admin/orders",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">داشبورد مدیریت</h1>
          <p className="text-sm text-muted-foreground mt-1">
            مدیریت فروشگاه موبایل‌سنتر
          </p>
        </div>
        {pendingOrders > 0 && (
          <Link
            href="/admin/orders?status=PENDING"
            className="flex items-center gap-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl px-4 py-2 text-sm font-medium hover:bg-amber-100 transition-colors"
          >
            <AlertTriangle className="w-4 h-4" />
            {toPersianDigits(pendingOrders)} سفارش در انتظار پرداخت
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-all"
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-xl font-black text-slate-900 leading-tight">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Recent orders */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between p-6 pb-4">
            <h2 className="font-bold text-slate-900">سفارش‌های اخیر</h2>
            <Link href="/admin/orders" className="flex items-center gap-1 text-sm text-primary hover:gap-2 transition-all">
              همه سفارش‌ها
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {orders.map((order) => {
              const status = ORDER_STATUS_MAP[order.status] || ORDER_STATUS_MAP.PENDING;
              return (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between gap-4 px-6 py-3.5 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div>
                      <p className="text-sm font-bold text-slate-900" dir="ltr">
                        {order.orderNumber}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.user?.name || "کاربر"}{" "}
                        <span className="mx-0.5">•</span>{" "}
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-bold text-slate-900">
                      {formatPrice(order.total)}
                    </span>
                    <span className={`text-[10px] px-2 py-1 rounded-full text-white ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                </Link>
              );
            })}
            {orders.length === 0 && (
              <div className="px-6 py-10 text-center text-sm text-muted-foreground">
                هنوز سفارشی ثبت نشده است
              </div>
            )}
          </div>
        </div>

        {/* Low stock */}
        <div>
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4.5 h-4.5 text-amber-500" />
              هشدار موجودی (کمتر از ۵)
            </h2>
            {lowStock.length === 0 ? (
              <p className="text-sm text-green-600 flex items-center gap-1.5 font-medium">
                <TrendingUp className="w-4 h-4" />
                موجودی همه کالاها مناسب است
              </p>
            ) : (
              <div className="space-y-3">
                {lowStock.map((p) => (
                  <Link
                    key={p.id}
                    href={`/admin/products/${p.id}/edit`}
                    className="flex items-center justify-between gap-2 bg-amber-50/50 border border-amber-100 rounded-xl px-3.5 py-2.5 hover:bg-amber-50 transition-colors"
                  >
                    <p className="text-xs font-medium text-slate-700 line-clamp-1 flex-1">{p.name}</p>
                    <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-1 rounded-full shrink-0">
                      {toPersianDigits(p.stock)} عدد
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}