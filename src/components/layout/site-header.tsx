"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/lib/store/cart-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  ShoppingBag,
  User,
  Smartphone,
  Menu,
  Heart,
  Package,
  LogOut,
  LayoutDashboard,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMounted } from "@/lib/hooks/use-mounted";

const categories = [
  { name: "گوشی موبایل", slug: "phones", icon: Smartphone },
  { name: "تبلت", slug: "tablets", icon: null },
  { name: "لوازم جانبی", slug: "accessories", icon: null },
];

export function SiteHeader() {
  const { data: session, status } = useSession();
  const { openCart, getTotals } = useCartStore();
  const { count } = getTotals();
  const mounted = useMounted();
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?q=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground">
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
        <div className="flex items-center gap-4 py-3">
          {/* Mobile menu */}
          <button
            className="lg:hidden p-2 -mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="منو"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="font-black text-lg leading-tight text-primary">موبایل‌سنتر</p>
              <p className="text-[10px] text-muted-foreground leading-tight">Mobile Center</p>
            </div>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 hidden md:flex max-w-xl mx-auto">
            <div className="relative w-full">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجو در محصولات..."
                className="h-11 pl-10 rounded-xl bg-slate-50 border-slate-200 focus-visible:bg-white"
              />
              <button
                type="submit"
                className="absolute left-1 top-1 h-9 w-9 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
                aria-label="جستجو"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2 mr-auto md:mr-0">
            {/* Cart */}
            <Button
              variant="ghost"
              className="relative h-11 px-3 hover:bg-slate-100"
              onClick={openCart}
            >
              <ShoppingBag className="w-6 h-6" />
              {count > 0 && mounted && (
                <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1.5 text-[10px] bg-primary text-white">
                  {count.toLocaleString("fa-IR")}
                </Badge>
              )}
            </Button>

            {/* User */}
            {status === "authenticated" ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-11 px-2 hover:bg-slate-100">
                    <Avatar className="h-9 w-9 border-2 border-primary/30">
                      <AvatarImage src={session.user.image ?? ""} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {(session.user.name?.[0] ?? session.user.email?.[0] ?? "ع").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal text-muted-foreground text-xs">
                    {session.user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="ml-2 h-4 w-4" />
                      پنل کاربری
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/orders" className="cursor-pointer">
                      <Package className="ml-2 h-4 w-4" />
                      سفارش‌های من
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/wishlist" className="cursor-pointer">
                      <Heart className="ml-2 h-4 w-4" />
                      علاقه‌مندی‌ها
                    </Link>
                  </DropdownMenuItem>
                  {session.user.role === "ADMIN" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer font-medium text-primary">
                          <LayoutDashboard className="ml-2 h-4 w-4" />
                          پنل مدیریت
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive cursor-pointer"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    <LogOut className="ml-2 h-4 w-4" />
                    خروج از حساب
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="h-11 px-4">
                <Link href="/login">
                  <User className="ml-2 w-4.5 h-4.5" />
                  ورود / ثبت‌نام
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile search */}
        <form onSubmit={handleSearch} className="md:hidden pb-3">
          <div className="relative">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجو در محصولات..."
              className="h-11 pl-10 rounded-xl bg-slate-50 border-slate-200"
            />
            <button
              type="submit"
              className="absolute left-1 top-1 h-9 w-9 bg-primary text-white rounded-lg flex items-center justify-center"
              aria-label="جستجو"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Categories nav */}
      <nav className={`border-t ${mobileMenuOpen ? "block" : "hidden"} lg:block`}>
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-1 overflow-x-auto py-0">
            <li>
              <Link
                href="/products"
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium hover:text-primary transition-colors whitespace-nowrap"
              >
                همه محصولات
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/products?category=${cat.slug}`}
                  className="block px-4 py-3 text-sm hover:text-primary transition-colors whitespace-nowrap"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
            <li className="mr-auto hidden lg:flex items-center text-xs text-muted-foreground">
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">تخفیف‌های ویژه! 🎉</span>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}