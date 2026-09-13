import type { Metadata } from "next";
import ContactForm from "@/components/contact/contact-form";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Headphones,
  ShieldCheck,
  MessageCircle,
  Send,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";

export const metadata: Metadata = {
  title: "تماس با ما",
  description:
    "اطلاعات تماس موبایل‌سنتر — آدرس، تلفن، ایمیل و فرم تماس آنلاین. پاسخ‌گویی به سوالات شما کمتر از ۲۴ ساعت.",
};

const contactInfo = [
  {
    icon: MapPin,
    title: "آدرس دفتر مرکزی",
    lines: ["تهران، خیابان ولیعصر، بالاتر از میدان ونک", "مجتمع تجاری موبایل‌سنتر، طبقه سوم، واحد ۳۰۲"],
  },
  {
    icon: Phone,
    title: "تلفن پشتیبانی",
    lines: ["۰۲۱-۹۱۰۰۱۲۳۴", "پاسخ‌گویی: شنبه تا پنجشنبه، ۹ تا ۱۸"],
    dir: "ltr",
  },
  {
    icon: Mail,
    title: "ایمیل",
    lines: ["support@mobilecenter.ir", "نسخه فارسی: تماس از طریق فرم زیر سریع‌تر است"],
    dir: "ltr",
  },
  {
    icon: Clock,
    title: "ساعات پاسخ‌گویی",
    lines: ["شنبه تا پنجشنبه: ۹ صبح تا ۶ عصر", "پاسخ به پیام‌ها معمولاً کمتر از ۲۴ ساعت"],
  },
];

const faqs = [
  {
    q: "چطور می‌توانم سفارشم را پیگیری کنم؟",
    a: "پس از ثبت سفارش، کد رهگیری از طریق پیامک و ایمیل برای شما ارسال می‌شود. برای پیگیری سریع‌تر می‌توانید موضوع «پیگیری سفارش» را در فرم تماس انتخاب کنید.",
  },
  {
    q: "گارانتی محصولات چگونه است؟",
    a: "تمام کالاهای موبایل‌سنتر دارای گارانتی اصالت و خدمات پس از فروش معتبر هستند. در صورت هرگونه ایراد، می‌توانید از طریق همین صفحه با واحد پشتیبانی در ارتباط باشید.",
  },
  {
    q: "آیا می‌توانم قبل از خرید مشاوره بگیرم؟",
    a: "بله. تیم تخصصی موبایل‌سنتر هر روز در ساعات اداری آماده مشاوره رایگان درباره انتخاب بهترین گوشی متناسب با نیاز شماست.",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-primary via-primary to-violet-700 text-white">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 15%, white 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="container relative mx-auto px-4 py-16 md:py-20 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-sm font-bold mb-6 backdrop-blur border border-white/15">
            <Headphones className="w-4 h-4" />
            پشتیبانی ۷ روز هفته
          </span>
          <h1 className="text-4xl md:text-5xl font-black leading-[1.3] mb-5">با ما در تماس باشید</h1>
          <p className="max-w-2xl mx-auto text-violet-100/90 leading-8 md:text-lg">
            هر سوال، پیشنهاد یا انتقادی دارید، خوشحال می‌شویم بشنویم. تیم پشتیبانی موبایل‌سنتر پاسخگوی شماست.
          </p>
          <div className="mt-10">
            <a
              href="tel:02191001234"
              dir="ltr"
              className="inline-flex flex-col items-center gap-1 px-8 py-4 rounded-3xl bg-white/10 backdrop-blur border border-white/20 hover:bg-white hover:text-primary transition-all group"
            >
              <Phone className="w-6 h-6" />
              <span className="text-2xl font-black tracking-wider group-hover:text-primary">۰۲۱-۹۱۰۰۱۲۳۴</span>
              <span className="text-xs text-violet-100/70">تماس مستقیم با پشتیبانی</span>
            </a>
          </div>
        </div>
      </section>

      {/* Info cards */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {contactInfo.map((item) => (
              <div
                key={item.title}
                className="group bg-white rounded-3xl border border-slate-100 p-7 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/20 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-violet-500/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-all">
                  <item.icon className="w-7 h-7 text-primary group-hover:text-white" />
                </div>
                <h3 className="font-black text-slate-900 text-lg mb-1.5">{item.title}</h3>
                {item.lines.map((line) => (
                  <p
                    key={line}
                    dir={item.dir === "ltr" ? "ltr" : undefined}
                    className="text-sm text-slate-500 leading-7"
                  >
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + side info */}
      <section className="pb-16 md:pb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Contact form */}
            <div className="lg:col-span-3 bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 shadow-xl shadow-slate-900/5">
              <div className="mb-8 pb-6 border-b border-slate-100">
                <h2 className="flex items-center gap-3 text-2xl md:text-3xl font-black text-slate-900 mb-2.5">
                  <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary">
                    <Send className="w-6 h-6" />
                  </span>
                  فرم تماس
                </h2>
                <p className="text-slate-500 leading-7">
                  فرم زیر را پر کنید تا در سریع‌ترین زمان ممکن با شما تماس بگیریم.
                </p>
              </div>
              <ContactForm />
            </div>

            {/* Side panel */}
            <aside className="lg:col-span-2 space-y-6">
              <div className="bg-gradient-to-bl from-primary to-violet-700 text-white rounded-[2rem] p-7 shadow-xl shadow-primary/20">
                <div className="flex items-center gap-3 mb-5">
                  <span className="flex items-center justify-center w-11 h-11 rounded-2xl bg-white/15">
                    <MessageCircle className="w-6 h-6" />
                  </span>
                  <h3 className="font-black text-xl">پاسخ‌گویی سریع</h3>
                </div>
                <ul className="space-y-4 text-sm leading-7 text-violet-50">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-1 text-emerald-300" />
                    پیام‌های ارسالی معمولاً در کمتر از ۲۴ ساعت پاسخ داده می‌شوند.
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-1 text-emerald-300" />
                    کارشناسان ما در زمینه تخصصی گوشی و لوازم جانبی آموزش دیده‌اند.
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-1 text-emerald-300" />
                    اطلاعات شما کاملاً محرمانه و فقط برای پاسخ‌گویی استفاده می‌شود.
                  </li>
                </ul>
                <div className="mt-6 pt-5 border-t border-white/15 flex items-center gap-3 text-sm">
                  <ShieldCheck className="w-6 h-6 text-emerald-300" />
                  <span>ضمانت اصالت کالا با گارانتی معتبر</span>
                </div>
              </div>

              {/* FAQs */}
              <div className="bg-white rounded-[2rem] border border-slate-100 p-7 shadow-sm">
                <h3 className="font-black text-lg text-slate-900 mb-5">پرسش‌های پرتکرار</h3>
                <div className="space-y-4">
                  {faqs.map((f) => (
                    <details
                      key={f.q}
                      className="group rounded-2xl border border-slate-100 bg-slate-50/50 px-5 py-4 open:bg-white open:shadow-sm transition-all"
                    >
                      <summary className="flex items-center justify-between gap-3 cursor-pointer font-bold text-sm text-slate-800 list-none">
                        {f.q}
                        <ChevronDown className="w-4 h-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
                      </summary>
                      <p className="mt-3 text-xs leading-6 text-slate-500">{f.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
