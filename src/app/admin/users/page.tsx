import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate, toPersianDigits } from "@/lib/format";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

export const metadata: Metadata = {
  title: "مدیریت کاربران",
  robots: { index: false, follow: false },
};

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: {
      _count: { select: { orders: true, addresses: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 mb-6">کاربران</h1>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {users.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-14 h-14 text-slate-300 mx-auto mb-4" />
            <p className="font-bold text-slate-700 mb-2">کاربری یافت نشد</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="text-right px-5 py-3.5 text-xs font-bold text-slate-500 whitespace-nowrap">کاربر</th>
                  <th className="text-right px-5 py-3.5 text-xs font-bold text-slate-500 whitespace-nowrap">نقش</th>
                  <th className="text-right px-5 py-3.5 text-xs font-bold text-slate-500 whitespace-nowrap">تاریخ عضویت</th>
                  <th className="text-right px-5 py-3.5 text-xs font-bold text-slate-500 whitespace-nowrap">سفارش‌ها</th>
                  <th className="text-right px-5 py-3.5 text-xs font-bold text-slate-500 whitespace-nowrap">آدرس‌ها</th>
                  <th className="text-right px-5 py-3.5 text-xs font-bold text-slate-500 whitespace-nowrap">اقدام</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border border-slate-100">
                          <AvatarImage src={user.image ?? ""} />
                          <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                            {(user.name?.[0] ?? user.email?.[0] ?? "ع").toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{user.name || "کاربر ناشناس"}</p>
                          <p className="text-xs text-muted-foreground" dir="ltr">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge className={user.role === "ADMIN" ? "bg-primary text-white border-0" : "bg-slate-50 text-slate-600 border-slate-200"}>
                        {user.role === "ADMIN" ? "مدیر" : "کاربر"}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-600 whitespace-nowrap">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-slate-900">
                      {toPersianDigits(user._count.orders)}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {toPersianDigits(user._count.addresses)}
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href="/admin"
                        className="text-xs text-primary hover:underline"
                      >
                        مشاهده
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}