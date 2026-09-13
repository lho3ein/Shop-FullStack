import type { Metadata } from "next";
import Link from "next/link";
import {
  Smartphone,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headset,
  Star,
  BadgeCheck,
  Users,
  PackageCheck,
  Sparkles,
  CheckCircle2,
  Heart,
} from "lucide-react";

export const metadata: Metadata = {
  title: "درباره ما",
  description:
    "موبایل‌سنتر، فروشگاه اینترنتی تخصصی گوشی موبایل، تبلت و لوازم جانبی با ضمانت اصالت کالا، گارانتی معتبر و ارسال سریع به سراسر کشور.",
};

const values = [
  {
    icon: ShieldCheck,
    title: "ضمانت اصالت کالا",
    desc: "تمام محصولات با ضمانت اصالت و گارانتی معتبر به شما تحویل داده می‌شود.",
  },
  {
    icon: BadgeCheck,
    title: "قیمت منصفانه",
    desc: "بهترین قیمت بازار همراه با امکان مقایسه و شرایط پرداخت متنوع.",
  },
  {
    icon: PackageCheck,
    title: "تحویل امن و سریع",
    desc: "بسته‌بندی استاندارد و ارسال سریع به تمام نقاط کشور.",
  },
  {
    icon: Headset,
    title: "پشتیبانی واقعی",
    desc: "تیم پشتیبانی آماده پاسخگویی به سوالات شما، پیش و پس از خرید.",
  },
];

const stats = [
  { value: "+۱۲٬۰۰۰", label: "محصول فعال" },
  { value: "+۸۵٬۰۰۰", label: "مشتری وفادار" },
  { value: "+۹۸٪", label: "رضایت مشتریان" },
  { value: "+۴٫۹", label: "امتیاز در نظرسنجی‌ها" },
];

const timeline = [
  { year: "۱۳۹۶", title: "آغاز فعالیت", desc: "تیم موبایل‌سنتر با تمرکز بر فروش تخصصی گوشی موبایل کار خود را آغاز کرد." },
  { year: "۱۳۹۹", title: "راه‌اندازی وب‌سایت", desc: "بستر فروش آنلاین با هدف تجربه خریدی ساده، شفاف و مطمئن معرفی شد." },
  { year: "۱۴۰۱", title: "تنوع کامل کالا", desc: "علاوه بر گوشی، تبلت و لوازم جانبی نیز به سبد محصولات اضافه شد." },
  { year: "۱۴۰۴", title: "همین امروز", desc: "با تکیه بر اعتماد شما، به توسعه خدمات و ارتقای تجربه خرید ادامه می‌دهیم." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-primary via-primary to-violet-700 text-white">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, white 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-16 w-80 h-80 rounded-full bg-violet-400/20 blur-3xl" />
        <div className="container relative mx-auto px-4 py-20 md:py-24 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-sm font-bold mb-6 backdrop-blur border border-white/15">
            <Sparkles className="w-4 h-4" />
            داستان ما
          </span>
          <h1 className="text-4xl md:text-6xl font-black leading-[1.3] mb-6 drop-shadow">
            مرجع تخصصی خرید موبایل
            <span className="block text-violet-100 text-2xl md:text-3xl mt-3 font-extrabold">
              در موبایل‌سنتر، اعتماد شما سرمایه ماست
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-violet-50/90 text-base md:text-lg leading-9 mb-8">
            از سال ۱۳۹۶ در کنار شما بوده‌ایم؛ با تیمی متخصص که فقط گوشی نمی‌فروشد، بلکه مشاور انتخاب درست شماست.
            امضای الکترونیکی ما، تعهد به اصالت، کیفیت و صداقت در قیمت است.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/products"
              className="px-8 py-3.5 rounded-2xl bg-white text-primary font-black shadow-xl shadow-violet-900/20 hover:bg-violet-50 hover:-translate-y-0.5 transition-all"
            >
              مشاهده محصولات
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3.5 rounded-2xl border-2 border-white/25 font-bold hover:bg-white/10 hover:border-white transition-all"
            >
              تماس با ما
            </Link>
          </div>
        </div>
        {/* stats */}
        <div className="border-t border-white/10 bg-white/[0.05] backdrop-blur">
          <div className="container mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl md:text-4xl font-black text-white">{s.value}</p>
                <p className="mt-1 text-sm text-violet-100/80">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-black text-3xl md:text-4xl text-slate-900 mb-3">چرا موبایل‌سنتر؟</h2>
            <p className="text-slate-500 max-w-xl mx-auto leading-8">
              ما به تفاوت میان یک خرید معمولی و یک خرید هوشمندانه اعتقاد داریم.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v) => (
              <div
                key={v.title}
                className="group bg-white rounded-3xl border border-slate-100 p-7 shadow-sm hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1.5 hover:border-primary/20 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-violet-500/10 flex items-center justify-center mb-5 group-hover:from-primary group-hover:to-violet-600 group-hover:text-white transition-all duration-300">
                  <v.icon className="w-7 h-7 text-primary group-hover:text-white" />
                </div>
                <h3 className="font-black text-lg text-slate-900 mb-2">{v.title}</h3>
                <p className="text-sm text-slate-500 leading-7">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-black text-3xl md:text-4xl text-slate-900 mb-3">مسیر رشد ما</h2>
            <p className="text-slate-500 max-w-xl mx-auto leading-8">
              هر قدم، با هدف نزدیک‌تر شدن به شما برداشته شده است.
            </p>
          </div>
          <div className="relative">
            <div className="absolute right-[27px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-violet-400 to-slate-200" />
            <div className="space-y-10">
              {timeline.map((t) => (
                <div key={t.year} className="relative pr-[68px]">
                  <span className="absolute right-0 top-1 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-violet-600 text-white flex items-center justify-center text-sm font-black shadow-lg shadow-primary/25">
                    {t.year}
                  </span>
                  <div className="rounded-3xl border border-slate-100 bg-slate-50/60 p-6 pr-5 transition-all hover:border-primary/30 hover:bg-white hover:shadow-lg hover:shadow-primary/10">
                    <h3 className="font-black text-xl text-slate-900 mb-1.5">{t.title}</h3>
                    <p className="text-slate-500 leading-8">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-bl from-primary via-primary to-violet-700 p-10 md:p-16 text-center text-white shadow-2xl shadow-primary/25">
            <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
            <Heart className="w-12 h-12 mx-auto mb-5 text-violet-200" />
            <h2 className="font-black text-3xl md:text-4xl mb-4">می‌خواهید با ما خرید کنید؟</h2>
            <p className="max-w-xl mx-auto text-violet-100/90 mb-8 leading-8">
              همین حالا به جمع مشتریان راضی موبایل‌سنتر بپیوندید و تجربه‌ای متفاوت از خرید آنلاین را تجربه کنید.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-white text-primary font-black shadow-xl hover:bg-violet-50 hover:-translate-y-0.5 transition-all text-lg"
            >
              <Smartphone className="w-5 h-5" />
              شروع خرید
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
