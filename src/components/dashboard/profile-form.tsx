"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface ProfileFormProps {
  name: string;
  email: string;
  phone: string;
}

export function ProfileForm({ name, email, phone }: ProfileFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({ name, phone: phone ?? "" });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));
  const updatePw = (key: string, value: string) =>
    setPasswordForm((f) => ({ ...f, [key]: value }));

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, phone: form.phone }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("پروفایل با موفقیت به‌روزرسانی شد");
        router.refresh();
      } else {
        setError(data.error || "خطا در به‌روزرسانی");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword.length < 8) {
      toast.error("رمز جدید باید حداقل ۸ کاراکتر باشد");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("رمز جدید و تکرار آن یکسان نیستند");
      return;
    }
    setPwLoading(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("رمز عبور با موفقیت تغییر کرد");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setPwError(data.error || "خطا در تغییر رمز");
      }
    } finally {
      setPwLoading(false);
    }
  };

  const [error, setError] = useState("");
  const [pwError, setPwError] = useState("");

  return (
    <div className="space-y-6 max-w-xl">
      {/* Profile info */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="font-bold text-slate-900 text-lg mb-5">اطلاعات شخصی</h2>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">نام و نام خانوادگی</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              required
              className="h-12 mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="email">ایمیل</Label>
            <Input
              id="email"
              dir="ltr"
              className="h-12 mt-1.5 text-right bg-slate-50"
              value={email}
              disabled
            />
            <p className="text-xs text-muted-foreground mt-1">ایمیل قابل تغییر نیست</p>
          </div>
          <div>
            <Label htmlFor="phone">شماره موبایل</Label>
            <Input
              id="phone"
              dir="ltr"
              className="h-12 mt-1.5 text-right"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="مثال: 09120000000"
            />
          </div>
          <Button type="submit" disabled={loading} className="h-11">
            {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            ذخیره تغییرات
          </Button>
        </form>
      </div>

      <Separator />

      {/* Password */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="font-bold text-slate-900 text-lg mb-5">تغییر رمز عبور</h2>

        {pwError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{pwError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">رمز عبور فعلی</Label>
            <Input
              id="currentPassword"
              type="password"
              dir="ltr"
              className="h-12 mt-1.5 text-right"
              value={passwordForm.currentPassword}
              onChange={(e) => updatePw("currentPassword", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="newPassword">رمز عبور جدید</Label>
            <Input
              id="newPassword"
              type="password"
              dir="ltr"
              className="h-12 mt-1.5 text-right"
              value={passwordForm.newPassword}
              onChange={(e) => updatePw("newPassword", e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">حداقل ۸ کاراکتر</p>
          </div>
          <div>
            <Label htmlFor="confirmPassword">تکرار رمز عبور جدید</Label>
            <Input
              id="confirmPassword"
              type="password"
              dir="ltr"
              className="h-12 mt-1.5 text-right"
              value={passwordForm.confirmPassword}
              onChange={(e) => updatePw("confirmPassword", e.target.value)}
              required
            />
          </div>
          <Button type="submit" variant="outline" disabled={pwLoading} className="h-11">
            {pwLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            تغییر رمز عبور
          </Button>
        </form>
      </div>
    </div>
  );
}