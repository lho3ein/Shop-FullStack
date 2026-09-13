"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  Users,
  Smartphone,
  LogOut,
  Store,
  ArrowRight,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "داشبورد", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "محصولات", icon: Package },
  { href: "/admin/orders", label: "سفارش‌ها", icon: ShoppingBag },
  { href: "/admin/categories", label: "دسته‌بندی‌ها", icon: Tags },
  { href: "/admin/users", label: "کاربران", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="space-y-4 lg:sticky lg:top-24 self-start">
      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <Link href="/" className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-black text-sm text-slate-900">موبایل‌سنتر</p>
            <p className="text-[10px] text-primary font-medium">پنل مدیریت</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
        </Link>
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors",
                    isActive
                      ? "bg-primary text-white font-medium"
                      : "text-slate-600 hover:bg-slate-50 hover:text-primary"
                  )}
                >
                  <item.icon className="w-4.5 h-4.5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-3 space-y-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <Store className="w-4.5 h-4.5" />
          بازگشت به فروشگاه
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4.5 h-4.5" />
          خروج
        </button>
      </div>
    </aside>
  );
}