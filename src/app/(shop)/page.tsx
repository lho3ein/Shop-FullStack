import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/products/product-grid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Smartphone,
  Tablet,
  Headphones,
  ChevronLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headset,
  Star,
  Zap,
  TrendingUp,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";

export const metadata: Metadata = {
  title: "فروشگاه اینترنتی موبایل و لوازم جانبی",
  description:
    "خرید انواع گوشی موبایل اپل، سامسونگ، شیائومی و سایر برندها با ضمانت اصالت و بهترین قیمت. تبلت، هدفون، قاب و لوازم جانبی با ارسال سریع به سراسر ایران.",
};

const categoryItems = [
  {
    name: "گوشی موبایل",
    slug: "phones",
    icon: Smartphone,
    color: "bg-blue-50 text-primary",
    count: "بیش از ۱۰۰ مدل",
  },
  {
    name: "تبلت",
    slug: "tablets",
    icon: Tablet,
    color: "bg-indigo-50 text-indigo-600",
    count: "آیپد و اندروید",
  },
  {
    name: "لوازم جانبی",
    slug: "accessories",
    icon: Headphones,
    color: "bg-amber-50 text-amber-600",
    count: "قاب، هدفون، شارژر",
  },
];

const services = [
  {
    icon: ShieldCheck,
    title: "ضمانت اصالت کالا",
    desc: "تضمین اصل بودن تمام محصولات",
  },
  { icon: Truck, title: "ارسال سریع و رایگان", desc: "ارسال به سراسر ایران" },
  {
    icon: RotateCcw,
    title: "بازگشت تا ۷ روز",
    desc: "برگشت آسان کالا بدون قید و شرط",
  },
  {
    icon: Headset,
    title: "پشتیبانی ۲۴ ساعته",
    desc: "پاسخگویی همه‌روزه تیم پشتیبانی",
  },
];

export default async function HomePage() {
  const [featuredProducts, latestProducts, bestSellers, brands] =
    await Promise.all([
      prisma.product.findMany({
        where: { isActive: true, isFeatured: true },
        orderBy: { createdAt: "desc" },
        take: 4,
      }),
      prisma.product.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      prisma.product.findMany({
        where: { isActive: true },
        orderBy: { soldCount: "desc" },
        take: 4,
      }),
      prisma.brand.findMany({
        where: { isActive: true },
      }),
    ]);

  return (
    <div className="min-h-screen">
      {/* ===== HERO ===== */}
      <section className="relative bg-gradient-to-l from-primary via-[#1e3a8a] to-[#0c1f4d] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 top-10 w-96 h-96 rounded-full bg-blue-400 blur-3xl" />
          <div className="absolute left-10 bottom-0 w-80 h-80 rounded-full bg-indigo-400 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 py-14 lg:py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="animate-fade-in">
              <Badge className="bg-white/15 text-white border-white/20 mb-5 px-4 py-1.5">
                <Zap className="w-3.5 h-3.5 ml-1" />
                تا ۳۰٪ تخفیف ویژه
              </Badge>
              <h1 className="text-3xl lg:text-5xl font-black leading-tight mb-5">
                جدیدترین گوشی‌های موبایل
                <span className="block text-blue-300 mt-2">
                  با ضمانت اصالت و بهترین قیمت
                </span>
              </h1>
              <p className="text-blue-100/80 text-sm lg:text-base leading-relaxed mb-8 max-w-lg">
                خرید مطمئن انواع گوشی موبایل اپل، سامسونگ و شیائومی به همراه
                لوازم جانبی با گارانتی معتبر، ارسال سریع و پشتیبانی حرفه‌ای از
                موبایل‌سنتر.
              </p>
              <div className="flex items-center flex-wrap gap-3">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-blue-50 h-13 px-8 text-base"
                  asChild
                >
                  <Link href="/products">
                    <ShoppingBag className="ml-2 h-5 w-5" />
                    مشاهده محصولات
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white bg-white/5 hover:bg-white/10 hover:text-white h-13.5 px-8 text-base border-2"
                  asChild
                >
                  <Link href="/products?category=phones">خرید گوشی</Link>
                </Button>
              </div>
              <div className="flex items-center gap-6 mt-10">
                <div>
                  <p className="text-2xl font-black text-white">+۲,۵۰۰</p>
                  <p className="text-xs text-blue-200/70">مشتری راضی</p>
                </div>
                <div className="w-px h-10 bg-white/20" />
                <div>
                  <p className="text-2xl font-black text-white">+۵۰۰</p>
                  <p className="text-xs text-blue-200/70">کالای اورجینال</p>
                </div>
                <div className="w-px h-10 bg-white/20" />
                <div className="flex items-center gap-1.5">
                  <div>
                    <p className="text-2xl font-black text-white">۴.۸/۵</p>
                    <p className="text-xs text-blue-200/70">امتیاز خرید</p>
                  </div>
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                </div>
              </div>
            </div>
            <div className="hidden lg:flex justify-center relative">
              <div className="relative w-[400px] h-[400px]">
                <Image
                  src="/products/photo-1601784551446-20c9e07cdbdb.webp"
                  alt="گوشی موبایل"
                  className="object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.4)]"
                  fill
                  sizes="400px"
                  priority
                />
                <div className="absolute right-0 top-10 bg-white text-slate-800 rounded-2xl shadow-xl p-4 animate-pulse-glow">
                  <p className="text-xs text-muted-foreground">شگفت‌انگیز</p>
                  <p className="font-black text-primary text-lg">۱۵٪ تخفیف</p>
                </div>
                <div className="absolute left-0 bottom-16 bg-white text-slate-800 rounded-2xl shadow-xl p-4">
                  <p className="text-xs text-muted-foreground mb-1">ارسال</p>
                  <p className="font-bold text-sm flex items-center gap-1">
                    <Truck className="w-4 h-4 text-primary" />
                    رایگان
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="container mx-auto px-4 -mt-0 lg:-mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 lg:scale-110 origin-center px-2">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-x-reverse divide-slate-100">
            {services.map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 lg:px-6 justify-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <s.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-800">
                    {s.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="container mx-auto px-4 mt-16 lg:mt-24">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              دسته‌بندی محصولات
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              بر اساس نیاز خود انتخاب کنید
            </p>
          </div>
          <Link
            href="/products"
            className="hidden sm:flex items-center text-sm text-primary hover:gap-3 gap-2 font-medium transition-all"
          >
            مشاهده همه
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
          {categoryItems.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group flex items-center gap-4 bg-white rounded-2xl border border-slate-100 p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all"
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform`}
              >
                <cat.icon className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">
                  {cat.name}
                </p>
                <p className="text-sm text-muted-foreground">{cat.count}</p>
              </div>
              <ChevronLeft className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
            </Link>
          ))}
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="container mx-auto px-4 mt-16 lg:mt-20">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-500" />
              پیشنهادهای ویژه
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              محبوب‌ترین کالاها با تخفیف‌های ویژه
            </p>
          </div>
          <Link
            href="/products?sort=featured"
            className="hidden sm:flex items-center gap-2 text-sm text-primary font-medium hover:gap-3 transition-all"
          >
            مشاهده همه
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
        <ProductGrid products={featuredProducts} />
      </section>

      {/* ===== PROMO BANNER ===== */}
      <section className="container mx-auto px-4 mt-16 lg:mt-20">
        <div className="relative rounded-3xl bg-gradient-to-l from-[#0c1f4d] via-[#1e3a8a] to-primary text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-blue-400 blur-3xl" />
            <div className="absolute right-10 bottom-0 w-64 h-64 rounded-full bg-indigo-400 blur-3xl" />
          </div>
          <div className="relative grid lg:grid-cols-2 gap-8 items-center p-8 lg:p-14">
            <div>
              <Badge className="bg-amber-400 text-slate-900 border-0 mb-4 px-4 py-1">
                <TrendingUp className="w-3.5 h-3.5 ml-1" />
                فروش ویژه
              </Badge>
              <h3 className="text-3xl lg:text-4xl font-black mb-4 leading-tight">
                تخفیف تا ۳۰٪
                <span className="block text-blue-300">بر گوشی‌های آیفون</span>
              </h3>
              <p className="text-blue-100/80 mb-6 max-w-md">
                به مناسبت فصل جدید، قیمت گوشی‌های آیفون را تا ۳۰ درصد کاهش
                دادیم. همین حالا خرید کنید و از ارسال رایگان بهره‌مند شوید.
              </p>
              <Button
                className="bg-amber-400 text-slate-900 hover:bg-amber-300 h-12 px-8"
                asChild
              >
                <Link href="/products?brand=apple">
                  خرید آیفون
                  <ChevronLeft className="mr-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="hidden lg:flex justify-center">
              <div className="relative w-72 h-72">
                <Image
                  src="/products/photo-1511707171634-5f897ff02aa9.webp"
                  alt="آیفون"
                  fill
                  className="object-contain"
                  sizes="288px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BRANDS ===== */}
      <section className="container mx-auto px-4 mt-16 lg:mt-20">
        <h2 className="text-2xl font-black text-slate-900 mb-6">
          برندهای معتبر
        </h2>
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-6">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/products?brand=${brand.slug}`}
                className="text-lg font-black text-slate-400 hover:text-primary transition-colors flex items-center gap-2"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                  <span className="text-primary/80 font-black text-sm">
                    {brand.name[0]}
                  </span>
                </div>
                {brand.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LATEST & BEST SELLERS ===== */}
      <section className="container mx-auto px-4 mt-16 lg:mt-20">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Latest */}
          <div>
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  جدیدترین محصولات
                  <span className="text-sm font-normal text-muted-foreground mr-1">
                    تازه رسیده‌ها
                  </span>
                </h2>
              </div>
              <Link
                href="/products?sort=newest"
                className="hidden sm:flex items-center gap-2 text-sm text-primary font-medium hover:gap-3 transition-all"
              >
                مشاهده همه
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
            <ProductGrid products={latestProducts} />
          </div>

          {/* Best sellers */}
          <aside>
            <h2 className="text-2xl font-black text-slate-900 mb-6">
              پرفروش‌ترین‌ها
            </h2>
            <div className="space-y-3">
              {bestSellers.map((p, i) => (
                <Link
                  key={p.id}
                  href={`/product/${p.slug}`}
                  className="group flex gap-3 bg-white rounded-xl border border-slate-100 p-3 hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <div className="relative w-16 h-16 rounded-lg bg-slate-50 overflow-hidden shrink-0">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-contain"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <span className="font-black text-primary text-lg -mt-1">
                        {toFa(i + 1)}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-800 line-clamp-2 group-hover:text-primary transition-colors">
                      {p.name}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {formatFarsiPrice(p.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-6 bg-gradient-to-br from-primary to-[#1e3a8a] text-white rounded-2xl p-6 overflow-hidden relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/10" />
              <div className="relative">
                <Smartphone className="w-8 h-8 mb-3 text-blue-300" />
                <p className="font-bold text-lg leading-relaxed mb-2">
                  اپلیکیشن موبایل‌سنتر
                </p>
                <p className="text-sm text-blue-100/80 mb-4">
                  با اپلیکیشن ما، خرید آسان‌تر و تخفیف‌های ویژه‌تر می‌شود!
                </p>
                <Button
                  size="sm"
                  className="bg-white text-primary hover:bg-blue-50"
                  asChild
                >
                  <Link href="/">دانلود اپلیکیشن</Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ===== SEO SECTION ===== */}
      <section className="container mx-auto px-4 mt-16 lg:mt-20 mb-12">
        <div className="bg-white rounded-3xl border border-slate-100 p-6 lg:p-10">
          <h2 className="text-xl lg:text-2xl font-black text-slate-900 mb-4">
            موبایل‌سنتر | مرجع تخصصی خرید موبایل و لوازم جانبی
          </h2>
          <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
            <p>
              فروشگاه اینترنتی موبایل‌سنتر با هدف ارائه بهترین تجربه خرید آنلاین
              گوشی موبایل، تبلت و لوازم جانبی فعالیت می‌کند. ما با عرضه محصولات
              اورجینال از برندهای معتبر جهانی از جمله اپل، سامسونگ، شیائومی،
              گوگل و هواوی، تمام تلاش خود را برای جلب رضایت شما عزیزان به کار
              می‌گیریم.
            </p>
            <p>
              تمامی محصولات موجود در فروشگاه موبایل‌سنتر دارای{" "}
              <strong>ضمانت اصالت کالا</strong> و<strong>گارانتی معتبر</strong>{" "}
              هستند و در کوتاه‌ترین زمان ممکن به سراسر کشور ارسال می‌شوند.
              همچنین امکان بازگشت کالا تا ۷ روز پس از تحویل برای شما فراهم است.
            </p>
            <p>
              برای خرید گوشی موبایل با بهترین قیمت و یا مشاهده جدیدترین مدل‌های
              موبایل، همین حالا از فروشگاه موبایل‌سنتر دیدن کنید و از تخفیف‌های
              ویژه بهره‌مند شوید.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function toFa(num: number): string {
  return num.toLocaleString("fa-IR");
}

function formatFarsiPrice(price: number): string {
  return price.toLocaleString("fa-IR") + " تومان";
}
