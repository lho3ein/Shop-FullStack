"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  Smartphone,
  Tablets,
  Headphones,
  ShoppingBag,
  User,
  Heart,
  Package,
  MapPin,
  LayoutDashboard,
  LogOut,
  BadgePercent,
  ChevronLeft,
  ShieldCheck,
  ChevronRight,
  XIcon,
  Info,
  PhoneCall,
} from "lucide-react";

const CATEGORIES = [
  { name: "گوشی موبایل", slug: "phones", icon: Smartphone },
  { name: "تبلت", slug: "tablets", icon: Tablets },
  { name: "لوازم جانبی", slug: "accessories", icon: Headphones },
];

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartCount: number;
}

export function MobileMenu({ open, onOpenChange, cartCount }: MobileMenuProps) {
  const { data: session, status } = useSession();

  const close = () => onOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[86%] max-w-sm p-0 gap-0 overflow-y-auto"
        showCloseButton={false}
      >
        <div className="bg-linear-to-br min-h-max from-primary via-primary to-violet-600 text-primary-foreground px-5 pt-6 pb-7 relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-0 right-10 w-24 h-24 rounded-full bg-white/10 blur-xl" />
          <div className="flex items-center justify-between relative">
            <SheetTitle className="flex items-center gap-2 text-lg font-black text-primary-foreground">
              <span className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </span>
              موبایل‌سنتر
            </SheetTitle>
            <button
              onClick={close}
              className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 transition-colors flex items-center justify-center"
              aria-label="بستن منو"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {status === "authenticated" && session.user ? (
            <div className="relative mt-5 flex items-center gap-3 bg-white/10 rounded-2xl p-3 backdrop-blur">
              <Avatar className="w-12 h-12 border-2 border-white/40">
                <AvatarImage src={session.user.image ?? ""} />
                <AvatarFallback className="bg-white/20 text-primary-foreground font-bold">
                  {(
                    session.user.name?.[0] ??
                    session.user.email?.[0] ??
                    "ع"
                  ).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-bold text-primary-foreground truncate">
                  {session.user.name || "کاربر موبایل‌سنتر"}
                </p>
                <p className="text-[11px] text-primary-foreground/70 truncate">
                  {session.user.email}
                </p>
              </div>
              <Link
                href="/dashboard"
                onClick={close}
                className="ml-auto shrink-0 text-[11px] font-bold bg-white/15 hover:bg-white/25 transition-colors rounded-xl px-3 py-2"
              >
                پنل کاربری
              </Link>
            </div>
          ) : (
            <div className="relative mt-5 grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={close}
                className="flex items-center justify-center gap-1.5 bg-white text-primary font-bold rounded-xl h-11 hover:bg-white/90 transition-colors"
              >
                <User className="w-4 h-4" />
                ورود
              </Link>
              <Link
                href="/register"
                onClick={close}
                className="flex items-center justify-center gap-1.5 bg-white/15 text-primary-foreground font-bold rounded-xl h-11 hover:bg-white/25 transition-colors"
              >
                ثبت‌نام
              </Link>
            </div>
          )}
        </div>

        <div className="py-3 stagger">
          <p className="px-5 pt-2 pb-1 text-[11px] font-bold text-muted-foreground">
            دسترسی سریع
          </p>
          <Link
            href="/"
            onClick={close}
            className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-primary/5 hover:text-primary transition-colors mx-2 rounded-xl"
          >
            <span className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Home className="w-4.5 h-4.5" />
            </span>
            صفحه اصلی
          </Link>
          <Link
            href="/products"
            onClick={close}
            className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-primary/5 hover:text-primary transition-colors mx-2 rounded-xl"
          >
            <span className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <ShoppingBag className="w-4.5 h-4.5" />
            </span>
            فروشگاه
          </Link>

          <div className="grid grid-cols-2 gap-1 px-5 mt-1">
            <Link
              href="/about"
              onClick={close}
              className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-700 hover:bg-primary/5 hover:text-primary transition-colors rounded-xl"
            >
              <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center">
                <Info className="w-4 h-4" />
              </span>
              درباره ما
            </Link>
            <Link
              href="/contact"
              onClick={close}
              className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-700 hover:bg-primary/5 hover:text-primary transition-colors rounded-xl"
            >
              <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <PhoneCall className="w-4 h-4" />
              </span>
              تماس با ما
            </Link>
          </div>

          <p className="px-5 pt-3 pb-1 text-[11px] font-bold text-muted-foreground">
            دسته‌بندی‌ها
          </p>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              onClick={close}
              className="flex items-center gap-3 px-5 py-3 text-sm text-slate-700 hover:bg-primary/5 hover:text-primary transition-colors mx-2 rounded-xl"
            >
              <span className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
                <cat.icon className="w-4.5 h-4.5" />
              </span>
              {cat.name}
            </Link>
          ))}
        </div>

        <div className="px-5 mt-3">
          <Link
            href="/products?sort=featured"
            onClick={close}
            className="flex items-center gap-3 rounded-2xl border border-primary/15 bg-gradient-to-l from-primary/10 to-violet-500/10 p-4 hover:shadow-md hover:shadow-primary/10 transition-all"
          >
            <span className="w-10 h-10 rounded-xl bg-danger/10 text-danger flex items-center justify-center">
              <BadgePercent className="w-5 h-5" />
            </span>
            <div>
              <p className="font-bold text-slate-800 text-sm">
                پیشنهادهای ویژه
              </p>
              <p className="text-[11px] text-muted-foreground">
                با بهترین تخفیف‌های امروز
              </p>
            </div>
            <ChevronLeft className="mr-auto w-4 h-4 text-muted-foreground" />
          </Link>
        </div>

        {status === "authenticated" && (
          <div className="px-5 py-4 mt-2 stagger space-y-1.5 border-t border-slate-200">
            <p className="text-[11px] font-bold text-muted-foreground mb-1">
              حساب کاربری
            </p>
            <Link
              href="/dashboard/orders"
              onClick={close}
              className="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-700 hover:bg-primary/5 hover:text-primary transition-colors rounded-xl"
            >
              <Package className="w-4.5 h-4.5 text-muted-foreground" />
              سفارش‌های من
            </Link>
            <Link
              href="/dashboard/wishlist"
              onClick={close}
              className="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-700 hover:bg-primary/5 hover:text-primary transition-colors rounded-xl"
            >
              <Heart className="w-4.5 h-4.5 text-muted-foreground" />
              علاقه‌مندی‌ها
            </Link>
            <Link
              href="/dashboard/addresses"
              onClick={close}
              className="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-700 hover:bg-primary/5 hover:text-primary transition-colors rounded-xl"
            >
              <MapPin className="w-4.5 h-4.5 text-muted-foreground" />
              آدرس‌ها
            </Link>
            {session.user.role === "ADMIN" && (
              <Link
                href="/admin"
                onClick={close}
                className="flex items-center gap-3 px-5 py-2.5 text-sm text-primary font-medium hover:bg-primary/5 transition-colors rounded-xl"
              >
                <LayoutDashboard className="w-4.5 h-4.5" />
                پنل مدیریت
              </Link>
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex w-full items-center gap-3 px-5 py-2.5 text-sm text-destructive hover:bg-destructive/5 transition-colors rounded-xl"
            >
              <LogOut className="w-4.5 h-4.5" />
              خروج از حساب
            </button>
          </div>
        )}

        <div className="mt-auto px-5 pb-6 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          ضمانت اصالت کالا{" "}
          {cartCount > 0
            ? ` • ${cartCount.toLocaleString("fa-IR")} کالا در سبد`
            : ""}
        </div>
      </SheetContent>
    </Sheet>
  );
}
