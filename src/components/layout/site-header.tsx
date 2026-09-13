"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/lib/store/cart-store";
import { SearchPreview } from "@/components/search/search-preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MobileMenu } from "@/components/layout/mobile-menu";
import {
  Search,
  User,
  Smartphone,
  Menu,
  Heart,
  Package,
  LogOut,
  LayoutDashboard,
  MapPin,
  ShieldCheck,
  ChevronDown,
  ScrollText,
  ShoppingCart,
  LayoutGrid,
  Store,
  Info,
  PhoneCall,
  Flame,
  Headphones,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMounted } from "@/lib/hooks/use-mounted";

const categories = [
  { name: "گوشی موبایل", slug: "phones", icon: Smartphone },
  { name: "تبلت", slug: "tablets", icon: Store },
  { name: "لوازم جانبی", slug: "accessories", icon: Headphones },
];

export function SiteHeader() {
  const { data: session, status } = useSession();
  const { openCart, getTotals } = useCartStore();
  const { count } = getTotals();
  const mounted = useMounted();
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const closeMobile = () => setMobileMenuOpen(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?q=${encodeURIComponent(search.trim())}`);
    }
  };

  const cm = /^\/products/.test(pathname.replace(/\/?page=\d+/, ""));
  const isCategoryActive = (slug: string) =>
    cm && pathname.includes(`category=${slug}`);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-lg border-b shadow-sm">
      {/* Top bar */}
      <div className="bg-gradient-to-l from-primary via-primary to-violet-600 text-primary-foreground">
        <div className="container mx-auto px-4 py-1.5 flex items-center justify-between text-xs">
          <p className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            ضمانت اصالت کالا و بازگشت تا ۷ روز
          </p>
          <p className="hidden sm:flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            ارسال به سراسر ایران
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Main header row */}
        <div className="flex items-center gap-3 py-3">
          {/* Mobile menu */}
          <button
            className="lg:hidden p-2.5 -mr-2 rounded-xl hover:bg-slate-100 active:scale-95 transition-all"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="باز کردن منو"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-violet-600 rounded-xl flex items-center justify-center shadow-md shadow-primary/25 transition-transform group-hover:scale-105 group-hover:-rotate-3">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="font-black text-lg leading-tight text-primary">
                موبایل‌سنتر
              </p>
              <p className="text-[10px] text-muted-foreground leading-tight">
                Mobile Center
              </p>
            </div>
          </Link>

          {/* Search */}
          <SearchPreview
            defaultValue={search}
            onNavigate={closeMobile}
            className="hidden md:block flex-1 max-w-xl mx-auto"
          />

          {/* Actions */}
          <div className="flex items-center gap-2 mr-auto md:mr-0">
            {/* Cart */}
            <Button
              variant="ghost"
              className="relative h-11 px-3.5 rounded-2xl border border-transparent hover:border-primary/25 hover:shadow-md hover:shadow-primary/10 transition-all"
              onClick={openCart}
              aria-label="سبد خرید"
            >
              <ShoppingCart
                size={32}
                className="size-5 text-gray-700"
                strokeWidth={1.75}
              />
              {mounted && count > 0 && (
                <Badge
                  key={count}
                  className="absolute -top-1.5 -right-1.5 h-5 min-w-5 px-1.5 text-[10px] bg-gradient-to-br from-primary to-violet-600 text-white shadow-md shadow-primary/30 animate-pop-in"
                >
                  {count.toLocaleString("fa-IR")}
                </Badge>
              )}
            </Button>

            {/* User */}
            {status === "authenticated" ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-11 px-2 rounded-2xl hover:bg-slate-100 transition-all"
                  >
                    <Avatar className="h-9 w-9 border-2 border-primary/25 transition-transform group-hover:scale-105">
                      <AvatarImage src={session.user.image ?? ""} />
                      <AvatarFallback className="bg-gradient-to-br from-primary/15 to-violet-500/15 text-primary">
                        {(
                          session.user.name?.[0] ??
                          session.user.email?.[0] ??
                          "ع"
                        ).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 p-2 rounded-2xl shadow-xl shadow-slate-900/5 border-slate-100">
                  <div className="rounded-xl bg-gradient-to-br from-primary/10 to-violet-500/10 border border-primary/10 p-3 mb-1.5 flex items-center gap-3">
                    <Avatar className="w-11 h-11 border-2 border-white shadow-sm">
                      <AvatarImage src={session.user.image ?? ""} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-violet-600 text-white font-bold">
                        {(
                          session.user.name?.[0] ??
                          session.user.email?.[0] ??
                          "ع"
                        ).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate">
                        {session.user.name || "کاربر موبایل‌سنتر"}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {session.user.email}
                      </p>
                    </div>
                  </div>

                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard"
                      className="cursor-pointer rounded-xl py-2.5"
                    >
                      <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <LayoutDashboard className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block font-medium">پنل کاربری</span>
                        <span className="block text-[10px] text-muted-foreground">
                          مدیریت حساب شما
                        </span>
                      </span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard/orders"
                      className="cursor-pointer rounded-xl py-2.5"
                    >
                      <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Package className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block font-medium">سفارش‌های من</span>
                        <span className="block text-[10px] text-muted-foreground">
                          پیگیری سفارش‌ها
                        </span>
                      </span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard/wishlist"
                      className="cursor-pointer rounded-xl py-2.5"
                    >
                      <span className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center">
                        <Heart className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block font-medium">علاقه‌مندی‌ها</span>
                        <span className="block text-[10px] text-muted-foreground">
                          لیست نشان‌شده‌ها
                        </span>
                      </span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard/addresses"
                      className="cursor-pointer rounded-xl py-2.5"
                    >
                      <span className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                        <MapPin className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block font-medium">آدرس‌ها</span>
                        <span className="block text-[10px] text-muted-foreground">
                          مدیریت آدرس‌ها
                        </span>
                      </span>
                    </Link>
                  </DropdownMenuItem>

                  {session.user.role === "ADMIN" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link
                          href="/admin"
                          className="cursor-pointer rounded-xl py-2.5 font-medium text-primary"
                        >
                          <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                            <ScrollText className="h-4 w-4" />
                          </span>
                          <span className="font-semibold">پنل مدیریت</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="rounded-xl py-2.5 text-destructive cursor-pointer focus:bg-destructive/10 focus:text-destructive"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    <span className="w-8 h-8 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center">
                      <LogOut className="h-4 w-4" />
                    </span>
                    <span className="font-semibold">خروج از حساب</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                asChild
                className="h-11 px-4 rounded-2xl shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/25 hover:translate-y-[-1px] transition-all"
              >
                <Link href="/login">
                  <User className="ml-2 w-4.5 h-4.5" />
                  <span className="hidden sm:inline">ورود / ثبت‌نام</span>
                  <span className="sm:hidden">ورود</span>
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile search */}
        <form onSubmit={handleSearch} className="md:hidden pb-3">
          <SearchPreview
            defaultValue={search}
            onNavigate={closeMobile}
            className="w-full"
            autoFocus={mobileMenuOpen}
          />
        </form>
      </div>

      {/* Categories nav */}
      <nav className="hidden lg:block border-t border-slate-100 bg-gradient-to-b from-slate-50/80 via-slate-50/40 to-transparent">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-1 py-2">
            <li>
              <Link
                href="/products"
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl transition-all whitespace-nowrap border ${
                  cm
                    ? "bg-primary text-white border-primary shadow-md shadow-primary/25"
                    : "border-transparent text-slate-600 hover:bg-white hover:border-slate-100 hover:shadow-sm hover:text-primary"
                }`}
              >
                <LayoutGrid
                  className={`w-4 h-4 ${cm ? "text-white" : "text-primary"}`}
                />
                همه محصولات
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/products?category=${cat.slug}`}
                  className={`group flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all whitespace-nowrap border ${
                    isCategoryActive(cat.slug)
                      ? "bg-primary text-white border-primary shadow-md shadow-primary/25"
                      : "border-transparent text-slate-600 hover:bg-white hover:border-slate-100 hover:shadow-sm hover:text-primary"
                  }`}
                >
                  <cat.icon
                    className={`w-4 h-4 ${
                      isCategoryActive(cat.slug)
                        ? "text-white"
                        : "text-slate-400 group-hover:text-primary"
                    }`}
                  />
                  {cat.name}
                </Link>
              </li>
            ))}

            <li className="mr-auto flex items-center gap-1">
              <span className="w-px h-6 bg-slate-200 mx-1.5" />
              <Link
                href="/about"
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors"
              >
                <Info className="w-4 h-4" />
                درباره ما
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                تماس با ما
              </Link>
              <Link
                href="/products?sort=featured"
                className="flex items-center gap-1.5 bg-gradient-to-l from-danger to-orange-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-danger/20 hover:shadow-lg hover:shadow-danger/30 hover:animate-wiggle transition-all"
              >
                <Flame className="w-4 h-4" />
                تخفیف‌های ویژه
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      <MobileMenu
        open={mobileMenuOpen}
        onOpenChange={setMobileMenuOpen}
        cartCount={count}
      />
    </header>
  );
}
