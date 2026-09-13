"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROVINCES } from "@/lib/constants";
import { Plus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface AddressFormDialogProps {
  onCreated?: (address: { id: string }) => void;
  triggerLabel?: string;
  variant?: "default" | "outline";
}

export function AddressFormDialog({
  onCreated,
  triggerLabel = "افزودن آدرس جدید",
  variant = "outline",
}: AddressFormDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    label: "خانه",
    province: "",
    city: "",
    district: "",
    street: "",
    postalCode: "",
    receiverName: "",
    receiverPhone: "",
    isDefault: false,
  });

  const update = (key: string, value: string | boolean) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "خطا در ذخیره آدرس");
        return;
      }

      toast.success("آدرس جدید اضافه شد");
      setOpen(false);
      router.refresh();
      onCreated?.(data.address);
    } catch {
      toast.error("خطایی رخ داد. لطفاً دوباره تلاش کنید");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size="sm">
          <Plus className="ml-1.5 h-4 w-4" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>افزودن آدرس جدید</DialogTitle>
          <DialogDescription>
            مشخصات آدرس دریافت سفارش را وارد کنید
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="label">عنوان آدرس</Label>
              <Select value={form.label} onValueChange={(v) => update("label", v)}>
                <SelectTrigger><SelectValue placeholder="انتخاب" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="خانه">خانه</SelectItem>
                  <SelectItem value="محل کار">محل کار</SelectItem>
                  <SelectItem value="سایر">سایر</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="receiverName">نام تحویل‌گیرنده</Label>
              <Input
                id="receiverName"
                value={form.receiverName}
                onChange={(e) => update("receiverName", e.target.value)}
                placeholder="مثال: علی محمدی"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="receiverPhone">شماره تماس تحویل‌گیرنده</Label>
            <Input
              id="receiverPhone"
              value={form.receiverPhone}
              onChange={(e) => update("receiverPhone", e.target.value)}
              placeholder="مثال: 09120000000"
              dir="ltr"
              className="text-right"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="province">استان</Label>
              <Select value={form.province} onValueChange={(v) => update("province", v)}>
                <SelectTrigger><SelectValue placeholder="انتخاب استان" /></SelectTrigger>
                <SelectContent>
                  {PROVINCES.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">شهر</Label>
              <Input
                id="city"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                placeholder="مثال: تهران"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="district">منطقه / محله (اختیاری)</Label>
            <Input
              id="district"
              value={form.district}
              onChange={(e) => update("district", e.target.value)}
              placeholder="مثال: سعادت‌آباد"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="street">آدرس کامل</Label>
            <Input
              id="street"
              value={form.street}
              onChange={(e) => update("street", e.target.value)}
              placeholder="خیابان، کوچه، پلاک، واحد"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="postalCode">کد پستی</Label>
            <Input
              id="postalCode"
              value={form.postalCode}
              onChange={(e) => update("postalCode", e.target.value)}
              placeholder="۱۰ رقمی"
              dir="ltr"
              className="text-right"
              required
            />
          </div>

          <DialogFooter className="gap-2 mt-6">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              انصراف
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              ثبت آدرس
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}