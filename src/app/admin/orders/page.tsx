import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@prisma/client";
import { formatPrice, formatDate, toPersianDigits } from "@/lib/format";
import { ORDER_STATUS_MAP, PAYMENT_STATUS_MAP } from "@/lib/constants";
import { AdminOrderActions } from "@/components/admin/admin-order-actions";
import { ShoppingBag } from "lucide-react";

export const metadata: Metadata = {
  title: "مدیریت سفارش‌ها",
  robots: { index: false, follow: false },
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const orders = await prisma.order.findMany({
    include: { user: true, items: true, address: true },
    orderBy: { createdAt: "desc" },
    where: status ? { status: status as OrderStatus } : {},
  });

  const statusTabs = [
    { key: "", label: "همه" },
    { key: "PENDING", label: "در انتظار پرداخت" },
    { key: "PAID", label: "پرداخت شده" },
    { key: "PROCESSING", label: "در حال پردازش" },
    { key: "SHIPPED", label: "ارسال شده" },
    { key: "DELIVERED", label: "تحویل شده" },
    { key: "CANCELLED", label: "لغو شده" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 mb-6">سفارش‌ها</h1>

      {/* Status tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {statusTabs.map((tab) => (
          <Link
            key={tab.key}
            href={tab.key ? `/admin/orders?status=${tab.key}` : "/admin/orders"}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm transition-colors ${
              (status || "") === tab.key
                ? "bg-primary text-white font-medium"
                : "bg-white border border-slate-100 text-slate-600 hover:border-primary/30"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-14 h-14 text-slate-300 mx-auto mb-4" />
            <p className="font-bold text-slate-700 mb-2">سفارشی یافت نشد</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="text-right px-5 py-3.5 text-xs font-bold text-slate-500 whitespace-nowrap">شماره سفارش</th>
                  <th className="text-right px-5 py-3.5 text-xs font-bold text-slate-500 whitespace-nowrap">مشتری</th>
                  <th className="text-right px-5 py-3.5 text-xs font-bold text-slate-500 whitespace-nowrap">محصولات</th>
                  <th className="text-right px-5 py-3.5 text-xs font-bold text-slate-500 whitespace-nowrap">تاریخ</th>
                  <th className="text-right px-5 py-3.5 text-xs font-bold text-slate-500 whitespace-nowrap">مبلغ</th>
                  <th className="text-right px-5 py-3.5 text-xs font-bold text-slate-500 whitespace-nowrap">وضعیت پرداخت</th>
                  <th className="text-right px-5 py-3.5 text-xs font-bold text-slate-500 whitespace-nowrap">وضعیت سفارش</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 whitespace-nowrap">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orders.map((order) => {
                  const status = ORDER_STATUS_MAP[order.status] || ORDER_STATUS_MAP.PENDING;
                  const payStatus = PAYMENT_STATUS_MAP[order.paymentStatus] || PAYMENT_STATUS_MAP.PENDING;
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-bold text-primary text-sm hover:underline"
                          dir="ltr"
                        >
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-sm font-medium text-slate-800">{order.user?.name || "کاربر ناشناس"}</div>
                        <div className="text-xs text-muted-foreground" dir="ltr">
                          {order.user?.email}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center -space-x-1.5 space-x-reverse">
                          {order.items.slice(0, 3).map((item) => (
                            <div key={item.id} className="w-8 h-8 rounded-lg bg-slate-50 border-2 border-white overflow-hidden relative">
                              {item.image ? (
                                <Image src={item.image} alt="" fill sizes="32px" className="object-contain" />
                              ) : null}
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="w-8 h-8 rounded-lg bg-primary text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                              +{toPersianDigits(order.items.length - 3)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-600 whitespace-nowrap">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-slate-900 whitespace-nowrap">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-[10px] px-2.5 py-1 rounded-full text-white ${payStatus.color}`}>
                          {payStatus.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-[10px] px-2.5 py-1 rounded-full text-white ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <AdminOrderActions
                          orderId={order.id}
                          status={order.status}
                          orderNumber={order.orderNumber}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}