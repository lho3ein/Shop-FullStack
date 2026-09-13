"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  Loader2,
  UserRound,
  Mail,
  Phone,
  LockKeyhole,
  Eye,
  EyeOff,
  ShieldCheck,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";

interface ProfileFormProps {
  name: string;
  email: string;
  phone: string;
}

function getStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const labels = ["", "ضعیف", "ضعیف", "متوسط", "خوب", "قوی"];
  const colors = ["", "bg-red-400", "bg-red-400", "bg-amber-400", "bg-emerald-400", "bg-emerald-500"];
  return { score, label: labels[score], color: colors[score] };
}

export function ProfileForm({ name, email, phone }: ProfileFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({ name, phone: phone ?? "" });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [visible, setVisible] = useState({ current: false, next: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [error, setError] = useState("");
  const [pwError, setPwError] = useState("");

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));
  const updatePw = (key: string, value: string) =>
    setPasswordForm((f) => ({ ...f, [key]: value }));
  const toggleVisible = (key: keyof typeof visible) =>
    setVisible((v) => ({ ...v, [key]: !v[key] }));

  const strength = getStrength(passwordForm.newPassword);
  const reqs = [
    { label: "حداقل ۸ کاراکتر", ok: passwordForm.newPassword.length >= 8 },
    { label: "حداقل یک عدد", ok: /\d/.test(passwordForm.newPassword) },
    { label: "حروف کوچک و بزرگ", ok: /[a-z]/.test(passwordForm.newPassword) && /[A-Z]/.test(passwordForm.newPassword) },
  ];

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

  const fieldClass =
    "h-12 mt-1.5 rounded-xl bg-slate-50 border-slate-200 focus-visible:bg-white focus-visible:ring-[3px] focus-visible:ring-primary/20 transition-all";

  return (
    <div className="space-y-6 max-w-xl">
      {/* Profile info */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-slate-50 flex items-center gap-3 bg-gradient-to-b from-primary/[0.04] to-transparent">
          <span className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <UserRound className="w-5 h-5" />
          </span>
          <div>
            <h2 className="font-black text-slate-900">اطلاعات شخصی</h2>
            <p className="text-xs text-muted-foreground mt-0.5">مشخصات تماس و حساب کاربری شما</p>
          </div>
        </div>

        <div className="p-6 pt-5">
          {error && (
            <Alert variant="destructive" className="mb-4 rounded-xl">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <div>
              <Label htmlFor="name">نام و نام خانوادگی</Label>
              <div className="relative">
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  required
                  className={`${fieldClass} pl-11`}
                />
                <UserRound className="absolute left-3.5 top-4 w-4 h-4 text-slate-400" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">ایمیل</Label>
              <div className="relative">
                <Input
                  id="email"
                  dir="ltr"
                  className={`${fieldClass} pl-11 text-right bg-slate-100/70`}
                  value={email}
                  disabled
                />
                <Mail className="absolute left-3.5 top-4 w-4 h-4 text-slate-400" />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">ایمیل قابل تغییر نیست</p>
            </div>
            <div>
              <Label htmlFor="phone">شماره موبایل</Label>
              <div className="relative">
                <Input
                  id="phone"
                  dir="ltr"
                  className={`${fieldClass} pl-11 text-right`}
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="مثال: 09120000000"
                />
                <Phone className="absolute left-3.5 top-4 w-4 h-4 text-slate-400" />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="h-11 rounded-xl px-6 shadow-md shadow-primary/20">
              {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              ذخیره تغییرات
            </Button>
          </form>
        </div>
      </div>

      <Separator />

      {/* Password */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-slate-50 flex items-center gap-3 bg-gradient-to-b from-primary/[0.04] to-transparent">
          <span className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <LockKeyhole className="w-5 h-5" />
          </span>
          <div>
            <h2 className="font-black text-slate-900">تغییر رمز عبور</h2>
            <p className="text-xs text-muted-foreground mt-0.5">برای امنیت بیشتر، یک رمز قوی انتخاب کنید</p>
          </div>
        </div>

        <div className="p-6 pt-5">
          {pwError && (
            <Alert variant="destructive" className="mb-4 rounded-xl">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{pwError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <div>
              <Label htmlFor="currentPassword">رمز عبور فعلی</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={visible.current ? "text" : "password"}
                  dir="ltr"
                  className={`${fieldClass} pl-11 text-right`}
                  value={passwordForm.currentPassword}
                  onChange={(e) => updatePw("currentPassword", e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => toggleVisible("current")}
                  className="absolute left-3 top-3.5 text-slate-400 hover:text-primary transition-colors"
                  aria-label="نمایش رمز"
                >
                  {visible.current ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="newPassword">رمز عبور جدید</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={visible.next ? "text" : "password"}
                  dir="ltr"
                  className={`${fieldClass} pl-11 text-right`}
                  value={passwordForm.newPassword}
                  onChange={(e) => updatePw("newPassword", e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => toggleVisible("next")}
                  className="absolute left-3 top-3.5 text-slate-400 hover:text-primary transition-colors"
                  aria-label="نمایش رمز"
                >
                  {visible.next ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>

              {passwordForm.newPassword && (
                <div className="mt-2.5">
                  <div className="flex gap-1.5 mb-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                          i <= strength.score ? strength.color : "bg-slate-100"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs font-medium text-slate-500">قدرت رمز: {strength.label}</p>
                </div>
              )}

              <ul className="mt-3 space-y-1.5">
                {reqs.map((r) => (
                  <li key={r.label} className="flex items-center gap-2 text-xs">
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                        r.ok ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      <Check className="w-2.5 h-2.5" />
                    </span>
                    <span className={r.ok ? "text-slate-600" : "text-slate-400"}>{r.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Label htmlFor="confirmPassword">تکرار رمز عبور جدید</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={visible.confirm ? "text" : "password"}
                  dir="ltr"
                  className={`${fieldClass} pl-11 text-right`}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => updatePw("confirmPassword", e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => toggleVisible("confirm")}
                  className="absolute left-3 top-3.5 text-slate-400 hover:text-primary transition-colors"
                  aria-label="نمایش رمز"
                >
                  {visible.confirm ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
              {passwordForm.confirmPassword &&
                passwordForm.newPassword !== passwordForm.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1.5">رمز عبور جدید و تکرار آن یکسان نیستند</p>
                )}
            </div>

            <div className="flex items-center gap-3">
              <Button type="submit" variant="outline" disabled={pwLoading} className="h-11 rounded-xl px-6">
                {pwLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                تغییر رمز عبور
              </Button>
              <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                تغییر رمز، نشست‌های دیگر را معتبر نگه می‌دارد
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}