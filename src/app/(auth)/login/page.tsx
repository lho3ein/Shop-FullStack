import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { Smartphone, ShieldCheck, Truck, RotateCcw } from "lucide-react";

export const metadata: Metadata = {
  title: "ورود به حساب",
  description: "ورود به حساب کاربری فروشگاه موبایل‌سنتر",
};

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-linear-to-b from-blue-50/50 to-transparent">
      <div className="w-full max-w-5xl grid md:grid-cols-2 rounded-3xl overflow-hidden bg-white shadow-xl shadow-slate-200/50 border border-slate-100">
        {/* Form side */}
        <div className="p-8 lg:p-12">
          <div className="mb-8">
            <Link href="/" className="flex items-center gap-2 mb-8">
              <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <p className="font-black text-xl text-primary">موبایل‌سنتر</p>
            </Link>
            <h1 className="text-2xl font-black text-slate-900 mb-1">
              ورود به حساب کاربری
            </h1>
            <p className="text-sm text-muted-foreground">
              خوش آمدید! لطفاً اطلاعات حساب خود را وارد کنید
            </p>
          </div>
          <LoginForm />
        </div>

        {/* Info side */}
        <div className="hidden md:flex flex-col justify-between p-10 bg-linear-to-br from-primary via-[#1e3a8a] to-[#0c1f4d] text-white relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/5" />
          <div className="absolute bottom-0 right-0 w-56 h-56 rounded-full bg-white/5" />
          <div className="relative">
            <h2 className="text-2xl font-black mb-4 leading-relaxed">
              تجربه‌ای مطمئن از خرید آنلاین
            </h2>
            <p className="text-blue-100/80 text-sm leading-relaxed mb-8">
              با عضویت در موبایل‌سنتر، از خرید آسان، سریع و مطمئن گوشی موبایل و
              لوازم جانبی لذت ببرید.
            </p>
          </div>
          <div className="relative space-y-4">
            {[
              { icon: ShieldCheck, text: "ضمانت اصالت تمامی کالاها" },
              { icon: Truck, text: "ارسال سریع و رایگان" },
              { icon: RotateCcw, text: "بازگشت آسان تا ۷ روز" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-sm bg-white/10 rounded-xl p-3.5 border border-white/10 backdrop-blur"
              >
                <item.icon className="w-5 h-5 text-blue-300 shrink-0" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
