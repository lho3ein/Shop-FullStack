import Link from "next/link";
import { SearchX, Home, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <SearchX className="w-12 h-12 text-primary" />
        </div>
        <p className="text-7xl font-black text-primary mb-2">۴۰۴</p>
        <h1 className="text-2xl font-black text-slate-900 mb-3">صفحه مورد نظر یافت نشد</h1>
        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
          صفحه‌ای که به دنبال آن هستید وجود ندارد یا جابه‌جا شده است.
          لطفاً از طریق منوی فروشگاه به صفحه مورد نظر بروید.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Home className="w-4 h-4" />
            بازگشت به خانه
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 border-2 border-primary text-primary px-6 py-3 rounded-xl text-sm font-medium hover:bg-primary/5 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            فروشگاه
          </Link>
        </div>
      </div>
    </div>
  );
}