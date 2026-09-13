"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface AdminOrderStatusFormProps {
  orderId: string;
  status: string;
}

const STATUS_OPTIONS = [
  { value: "PENDING", label: "در انتظار پرداخت" },
  { value: "PAID", label: "پرداخت شده" },
  { value: "PROCESSING", label: "در حال پردازش" },
  { value: "SHIPPED", label: "ارسال شده" },
  { value: "DELIVERED", label: "تحویل شده" },
  { value: "CANCELLED", label: "لغو شده" },
];

export function AdminOrderStatusForm({ orderId, status }: AdminOrderStatusFormProps) {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState(status);
  const [trackingCode, setTrackingCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: selectedStatus, trackingCode }),
      });
      if (res.ok) {
        toast.success("وضعیت سفارش ذخیره شد");
        router.refresh();
      } else {
        toast.error("خطا در ذخیره وضعیت");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 flex-wrap">
      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
        <SelectTrigger className="w-44 bg-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedStatus === "SHIPPED" && (
        <Input
          dir="ltr"
          className="w-40 h-10"
          placeholder="کد رهگیری پستی"
          value={trackingCode}
          onChange={(e) => setTrackingCode(e.target.value)}
        />
      )}
      <Button type="submit" disabled={loading} className="h-10">
        {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        ذخیره وضعیت
      </Button>
    </form>
  );
}