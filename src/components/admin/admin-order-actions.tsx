"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, CheckCircle2, XCircle } from "lucide-react";
import toast from "react-hot-toast";

interface AdminOrderActionsProps {
  orderId: string;
  status: string;
  orderNumber: string;
}

const STATUS_OPTIONS = [
  { value: "PENDING", label: "در انتظار پرداخت" },
  { value: "PAID", label: "پرداخت شده" },
  { value: "PROCESSING", label: "در حال پردازش" },
  { value: "SHIPPED", label: "ارسال شده" },
  { value: "DELIVERED", label: "تحویل شده" },
  { value: "CANCELLED", label: "لغو شده" },
];

export function AdminOrderActions({ orderId, status, orderNumber }: AdminOrderActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const updateStatus = async (newStatus: string) => {
    if (newStatus === status) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success(`وضعیت سفارش ${orderNumber} تغییر کرد`);
        router.refresh();
      } else {
        toast.error("خطا در تغییر وضعیت");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={loading}>
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          تغییر وضعیت سفارش
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {STATUS_OPTIONS.filter((s) => s.value !== "PENDING").map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onSelect={() => updateStatus(opt.value)}
            className={status === opt.value ? "text-primary font-medium" : "cursor-pointer"}
          >
            {opt.value === "CANCELLED" ? (
              <XCircle className="ml-2 h-4 w-4 text-red-500" />
            ) : (
              <CheckCircle2 className="ml-2 h-4 w-4 text-green-500" />
            )}
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}