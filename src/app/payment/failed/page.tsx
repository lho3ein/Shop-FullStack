import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowRight, CreditCard } from "lucide-react";

export const metadata: Metadata = {
  title: "پرداخت ناموفق",
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{ order?: string; reason?: string }>;
}

export default async function PaymentFailedPage({ searchParams }: Props) {
  const { order, reason } = await searchParams;

  const reasons: Record<string, string> = {
    nf: "سفارش مورد نظر یافت نشد",
    ve: "تأیید پرداخت ناموفق بود",
    err: "خطایی در پردازش پرداخت رخ داد",
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-lg">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden text-center">
        <div className="bg-gradient-to-b from-red-50 to-transparent p-8 pb-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-4">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-2">پرداخت ناموفق بود</h1>
          <p className="text-sm text-muted-foreground">
            {reasons[reason || ""] || "متأسفانه پرداخت شما تکمیل نشد"}
            {order && <span className="block mt-1">شماره سفارش: <b dir="ltr">{order}</b></span>}
          </p>
        </div>

        <div className="p-8 pt-0">
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 mb-6 text-right text-sm text-amber-700 leading-relaxed">
            اگر مبلغی از حساب شما کسر شده است، به صورت خودکار ظرف ۷۲ ساعت
            به حساب شما بازگردانده خواهد شد. در صورت ایجاد مشکل با پشتیبانی تماس بگیرید.
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full h-12" size="lg">
              <Link href="/checkout">
                <CreditCard className="ml-2 w-5 h-5" />
                تلاش مجدد برای پرداخت
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full h-12">
              <Link href="/products">
                <ArrowRight className="ml-2 w-4 h-4" />
                بازگشت به فروشگاه
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}