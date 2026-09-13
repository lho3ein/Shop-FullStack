"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  MapPin,
  Heart,
  User,
  LogOut,
  ShieldCheck,
} from "lucide-react";

interface DashboardNavProps {
  userName?: string | null;
  userEmail?: string | null;
  userImage?: string | null;
  isAdmin?: boolean;
}

const NAV_ITEMS = [
  { href: "/dashboard", label: "حساب کاربری", icon: LayoutDashboard },
  { href: "/dashboard/orders", label: "سفارش‌ها", icon: Package },
  { href: "/dashboard/addresses", label: "آدرس‌ها", icon: MapPin },
  { href: "/dashboard/wishlist", label: "علاقه‌مندی‌ها", icon: Heart },
  { href: "/dashboard/profile", label: "پروفایل", icon: User },
];

export function DashboardNav({ userName, userEmail, userImage, isAdmin }: DashboardNavProps) {
  const pathname = usePathname();

  return (
    <aside className="space-y-4">
      <div className="bg-gradient-to-br from-primary/[0.06] to-violet-500/[0.06] rounded-3xl border border-primary/10 p-5 flex items-center gap-3">
        <Avatar className="w-12 h-12 border-2 border-primary/25 shadow-sm">
          <AvatarImage src={userImage ?? ""} />
          <AvatarFallback className="bg-gradient-to-br from-primary to-violet-600 text-white font-bold text-lg">
            {(userName?.[0] ?? userEmail?.[0] ?? "ع").toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="font-bold text-slate-900 truncate">{userName || "کاربر موبایل‌سنتر"}</p>
          <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
        </div>
      </div>

      <nav className="bg-white rounded-3xl border border-slate-100 p-3 shadow-sm">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-l from-primary to-violet-600 text-white font-medium shadow-md shadow-primary/20"
                      : "text-slate-600 hover:bg-primary/5 hover:text-primary hover:translate-x-[-2px]"
                  )}
                >
                  <item.icon
                    className={cn("w-4.5 h-4.5", !isActive && "text-slate-400 group-hover:text-primary transition-colors")}
                  />
                  {item.label}
                  {isActive && <span className="mr-auto w-1.5 h-1.5 rounded-full bg-white/70" />}
                </Link>
              </li>
            );
          })}
        </ul>

        {isAdmin && (
          <>
            <div className="my-3 border-t border-slate-100" />
            <ul>
              <li>
                <Link
                  href="/admin"
                  className="group flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-primary font-medium hover:bg-primary/5 transition-all"
                >
                  <ShieldCheck className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
                  پنل مدیریت
                </Link>
              </li>
            </ul>
          </>
        )}

        <div className="my-3 border-t border-slate-100" />
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="group flex w-full items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 hover:translate-x-[-2px] transition-all"
        >
          <LogOut className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
          خروج از حساب
        </button>
      </nav>
    </aside>
  );
}