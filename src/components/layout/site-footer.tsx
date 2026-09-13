import Link from "next/link";
import {
  Smartphone,
  Armchair,
  Mail,
  Phone,
  MapPin,
  Camera,
  Star,
  Send,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headset,
} from "lucide-react";

const services = [
  {
    icon: ShieldCheck,
    title: "ضمانت اصالت",
    desc: "تضمین اصل بودن کالا",
  },
  {
    icon: Truck,
    title: "ارسال سریع",
    desc: "ارسال به سراسر کشور",
  },
  {
    icon: RotateCcw,
    title: "بازگشت ۷ روزه",
    desc: "برگشت آسان کالا",
  },
  {
    icon: Headset,
    title: "پشتیبانی ۲۴/۷",
    desc: "پاسخگویی همیشگی",
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-[#071a3c] text-white mt-16">
      {/* Services bar */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                <s.icon className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-sm">{s.title}</p>
                <p className="text-xs text-blue-200/70">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <p className="font-black text-lg">موبایل‌سنتر</p>
          </div>
          <p className="text-sm text-blue-200/70 leading-relaxed mb-4">
            فروشگاه اینترنتی موبایل‌سنتر، مرجع تخصصی خرید گوشی موبایل، تبلت و لوازم جانبی با بهترین قیمت و ضمانت اصالت کالا.
          </p>
          <div className="flex items-center gap-3">
            <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors">
              <Camera className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors">
              <Send className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors">
              <Star className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-base mb-4 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-blue-400" />
            دسته‌بندی‌ها
          </h4>
          <ul className="space-y-2.5 text-sm text-blue-200/70">
            <li><Link href="/products?category=phones" className="hover:text-white transition-colors">گوشی موبایل</Link></li>
            <li><Link href="/products?category=tablets" className="hover:text-white transition-colors">تبلت</Link></li>
            <li><Link href="/products?category=accessories" className="hover:text-white transition-colors">لوازم جانبی</Link></li>
            <li><Link href="/products?brand=apple" className="hover:text-white transition-colors">آیفون</Link></li>
            <li><Link href="/products?brand=samsung" className="hover:text-white transition-colors">سامسونگ</Link></li>
            <li><Link href="/products?brand=xiaomi" className="hover:text-white transition-colors">شیائومی</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-base mb-4 flex items-center gap-2">
            <Armchair className="w-5 h-5 text-blue-400" />
            خدمات مشتریان
          </h4>
          <ul className="space-y-2.5 text-sm text-blue-200/70">
            <li><Link href="/about" className="hover:text-white transition-colors">درباره ما</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">تماس با ما</Link></li>
            <li><Link href="/faq" className="hover:text-white transition-colors">سوالات متداول</Link></li>
            <li><Link href="/shipping" className="hover:text-white transition-colors">روش‌های ارسال</Link></li>
            <li><Link href="/warranty" className="hover:text-white transition-colors">گارانتی و خدمات</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition-colors">حریم خصوصی</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-base mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5 text-blue-400" />
            تماس با ما
          </h4>
          <ul className="space-y-3 text-sm text-blue-200/70">
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
              تهران، خیابان ولیعصر، برج تجاری موبایل سنتر
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-400 shrink-0" />
              <span dir="ltr">021-91001234</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-400 shrink-0" />
              support@mobilecenter.ir
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-blue-200/60">
          <p>© ۱۴۰۳ موبایل‌سنتر - تمامی حقوق محفوظ است.</p>
          <p className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            نماد اعتماد الکترونیکی به صورت آنلاین
          </p>
        </div>
      </div>
    </footer>
  );
}