import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { toPersianDigits, formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "پرداخت موفق",
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{ order?: string; refId?: string }>;
}

export default async function PaymentSuccessPage({ searchParams }: Props) {
  const { order: orderNumber, refId } = await searchParams;

  const order = orderNumber
    ? await prisma.order.findUnique({ where: { orderNumber } })
    : null;

  return (
    <div className="container mx-auto px-4 py-16 max-w-lg">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden text-center">
        <div className="bg-gradient-to-b from-green-50 to-transparent p-8 pb-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-2">پرداخت با موفقیت انجام شد</h1>
          <p className="text-sm text-muted-foreground">
            سفارش شما ثبت و پرداخت آن تأیید شد. سپاس از خرید شما!
          </p>
        </div>

        <div className="p-8 pt-0">
          {order && (
            <div className="bg-green-50/50 border border-green-100 rounded-2xl p-5 mb-6 text-right space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">شماره سفارش</span>
                <span className="font-bold text-slate-900" dir="ltr">
                  {order.orderNumber}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">مبلغ پرداخت‌شده</span>
                <span className="font-bold text-green-700">{formatPrice(order.total)}</span>
              </div>
              {refId && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">کد رهگیری پرداخت</span>
                  <span className="font-bold text-slate-900" dir="ltr">
                    {toPersianDigits(refId)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">وضعیت</span>
                <span className="font-bold text-green-700">در حال پردازش</span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Button asChild className="w-full h-12" size="lg">
              <Link href="/dashboard/orders">
                <Package className="ml-2 w-5 h-5" />
                پیگیری سفارش
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full h-12">
              <Link href="/products">
                <ArrowRight className="ml-2 w-4 h-4" />
                ادامه خرید
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}