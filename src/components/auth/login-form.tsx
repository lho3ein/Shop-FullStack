"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("ایمیل یا رمز عبور اشتباه است");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("خطایی رخ داد. لطفاً دوباره تلاش کنید");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">ایمیل</Label>
        <Input
          id="email"
          type="email"
          dir="ltr"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-12 text-right"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">رمز عبور</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            dir="ltr"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-12 text-right pl-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
        {loading ? "در حال ورود..." : "ورود به حساب"}
      </Button>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">حساب کاربری ندارید؟</span>{" "}
        <a href="/register" className="text-primary font-medium hover:underline">
          ثبت‌نام کنید
        </a>
      </div>
    </form>
  );
}