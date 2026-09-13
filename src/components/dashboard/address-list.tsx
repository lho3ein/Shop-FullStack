"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AddressFormDialog } from "@/components/checkout/address-form-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Trash2,
  MapPin,
  Loader2,
  Home,
  Briefcase,
} from "lucide-react";
import toast from "react-hot-toast";

interface Address {
  id: string;
  label: string;
  province: string;
  city: string;
  district?: string | null;
  street: string;
  postalCode: string;
  receiverName: string;
  receiverPhone: string;
  isDefault: boolean;
}

interface AddressListProps {
  addresses: Address[];
}

export function AddressList({ addresses }: AddressListProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [settingDefault, setSettingDefault] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const res = await fetch(`/api/addresses/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("آدرس حذف شد");
        router.refresh();
      } else {
        toast.error("خطا در حذف آدرس");
      }
    } finally {
      setDeleting(null);
    }
  };

  const handleSetDefault = async (id: string) => {
    setSettingDefault(id);
    try {
      const res = await fetch(`/api/addresses/${id}/default`, { method: "PUT" });
      if (res.ok) {
        toast.success("آدرس پیش‌فرض تنظیم شد");
        router.refresh();
      }
    } finally {
      setSettingDefault(null);
    }
  };

  const labelIcon = (label: string) =>
    label === "محل کار" ? <Briefcase className="w-4 h-4" /> : <Home className="w-4 h-4" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-muted-foreground">
          {addresses.length > 0
            ? `${addresses.length.toLocaleString("fa-IR")} آدرس ثبت شده`
            : "هنوز آدرسی ثبت نکرده‌اید"}
        </p>
        <AddressFormDialog
          triggerLabel="افزودن آدرس"
          onCreated={() => router.refresh()}
        />
      </div>

      {addresses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 text-center py-16">
          <MapPin className="w-14 h-14 text-slate-300 mx-auto mb-4" />
          <p className="font-bold text-slate-700 mb-2">آدرسی ثبت نشده است</p>
          <p className="text-sm text-muted-foreground mb-6">
            برای دریافت سفارش، آدرس خود را ثبت کنید
          </p>
          <AddressFormDialog
            variant="default"
            triggerLabel="ثبت اولین آدرس"
            onCreated={() => router.refresh()}
          />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="bg-white rounded-2xl border border-slate-100 p-5 hover:border-primary/25 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    {labelIcon(addr.label)}
                  </span>
                  <span className="font-bold text-slate-900 text-sm">{addr.label}</span>
                  {addr.isDefault && (
                    <Badge className="bg-primary text-white border-0 text-[10px]">
                      پیش‌فرض
                    </Badge>
                  )}
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-1">
                {addr.province}، {addr.city}
                {addr.district ? `، ${addr.district}` : ""}، {addr.street}
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                {addr.receiverName} • {addr.receiverPhone} • کد پستی:{" "}
                <span dir="ltr">{addr.postalCode}</span>
              </p>

              <div className="flex items-center gap-2">
                {!addr.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    disabled={settingDefault === addr.id}
                    onClick={() => handleSetDefault(addr.id)}
                  >
                    {settingDefault === addr.id && <Loader2 className="ml-1 h-3 w-3 animate-spin" />}
                    تعیین به‌عنوان پیش‌فرض
                  </Button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      disabled={deleting === addr.id}
                    >
                      {deleting === addr.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>حذف آدرس</AlertDialogTitle>
                      <AlertDialogDescription>
                        آیا از حذف این آدرس مطمئن هستید؟ این عمل قابل بازگشت نیست.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>انصراف</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-500 hover:bg-red-600"
                        onClick={() => handleDelete(addr.id)}
                      >
                        حذف آدرس
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}