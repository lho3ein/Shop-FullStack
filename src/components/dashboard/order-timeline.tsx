"use client";

import { cn } from "@/lib/utils";
import {
  ShoppingBag,
  CreditCard,
  PackageCheck,
  Truck,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface OrderTimelineProps {
  status: string;
}

const STEPS = [
  { key: "PENDING", label: "ثبت سفارش", icon: ShoppingBag },
  { key: "PAID", label: "پرداخت", icon: CreditCard },
  { key: "PROCESSING", label: "بررسی سفارش", icon: PackageCheck },
  { key: "SHIPPED", label: "ارسال", icon: Truck },
  { key: "DELIVERED", label: "تحویل", icon: CheckCircle2 },
];

const ORDER_INDEX: Record<string, number> = {
  PENDING: 0,
  PAID: 1,
  PROCESSING: 2,
  SHIPPED: 3,
  DELIVERED: 4,
  CANCELLED: -1,
};

export function OrderTimeline({ status }: OrderTimelineProps) {
  const currentIndex = ORDER_INDEX[status] ?? 0;
  const isCancelled = status === "CANCELLED";

  if (isCancelled) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 text-red-700 text-sm">
        <XCircle className="w-5 h-5 shrink-0" />
        این سفارش لغو شده است
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6">
      <div className="flex items-center justify-between relative">
        {/* connector */}
        <div className="absolute top-5 right-[10%] left-[10%] h-0.5 bg-slate-100" />
        <div
          className="absolute top-5 right-[10%] h-0.5 bg-primary transition-all duration-500"
          style={{ width: `${(currentIndex / (STEPS.length - 1)) * 80}%` }}
        />

        {STEPS.map((step, i) => {
          const completed = i <= currentIndex;
          const isCurrent = i === currentIndex;
          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center gap-2 flex-1">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                  completed
                    ? "bg-primary border-primary text-white"
                    : "bg-white border-slate-200 text-slate-300",
                  isCurrent && "ring-4 ring-primary/15 scale-110"
                )}
              >
                <step.icon className="w-4.5 h-4.5" />
              </div>
              <span className={cn(
                "text-[11px] font-medium whitespace-nowrap",
                completed ? "text-slate-900" : "text-slate-400",
                isCurrent && "text-primary font-bold"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}