"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  Tag,
  MessageSquare,
  Loader2,
  CheckCircle2,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const contactSchema = z.object({
  name: z.string().min(2, "نام باید حداقل ۲ کاراکتر باشد").max(80),
  email: z.string().email("ایمیل معتبر نیست").max(120).optional().or(z.literal("")),
  phone: z.string().max(20).optional().or(z.literal("")),
  subject: z.string().max(150).optional().or(z.literal("")),
  message: z.string().min(5, "متن پیام باید حداقل ۵ کاراکتر باشد").max(3000),
});

type ContactValues = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const router = useRouter();
  const [sending, setSending] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", subject: "", message: "" },
  });

  async function onSubmit(values: ContactValues) {
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "خطا در ثبت پیام");
      }
      toast.success("پیام شما با موفقیت ثبت شد. به‌زودی با شما تماس می‌گیریم.");
      reset();
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "خطا در ارسال پیام");
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="name" className="mb-2 flex items-center gap-1.5">
            <User className="w-4 h-4" />
            نام و نام خانوادگی <span className="text-destructive">*</span>
          </Label>
          <Input id="name" dir="rtl" placeholder="مثلاً: سارا محمدی" {...register("name")} />
          {errors.name?.message ? (
            <p className="mt-1.5 text-xs font-medium text-destructive">{errors.name.message}</p>
          ) : null}
        </div>
        <div>
          <Label htmlFor="email" className="mb-2 flex items-center gap-1.5">
            <Mail className="w-4 h-4" />
            ایمیل
          </Label>
          <Input
            id="email"
            dir="ltr"
            placeholder="you@example.com"
            {...register("email")}
          />
          {errors.email?.message ? (
            <p className="mt-1.5 text-xs font-medium text-destructive">{errors.email.message}</p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="phone" className="mb-2 flex items-center gap-1.5">
            <Phone className="w-4 h-4" />
            شماره تماس
          </Label>
          <Input id="phone" dir="ltr" placeholder="09xxxxxxxxx" {...register("phone")} />
          {errors.phone?.message ? (
            <p className="mt-1.5 text-xs font-medium text-destructive">{errors.phone.message}</p>
          ) : null}
        </div>
        <div>
          <Label htmlFor="subject" className="mb-2 flex items-center gap-1.5">
            <Tag className="w-4 h-4" />
            موضوع
          </Label>
          <Input id="subject" dir="rtl" placeholder="مثلاً: پیگیری سفارش" {...register("subject")} />
          {errors.subject?.message ? (
            <p className="mt-1.5 text-xs font-medium text-destructive">{errors.subject.message}</p>
          ) : null}
        </div>
      </div>

      <div>
        <Label htmlFor="message" className="mb-2 flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4" />
          متن پیام <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="message"
          dir="rtl"
          rows={6}
          placeholder="پیام خود را بنویسید..."
          className="resize-none"
          {...register("message")}
        />
        {errors.message?.message ? (
          <p className="mt-1.5 text-xs font-medium text-destructive">{errors.message.message}</p>
        ) : null}
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" size="lg" className="flex-1 md:flex-none px-10" disabled={sending}>
          {sending ? (
            <Loader2 className="w-5 h-5 animate-spin ml-2" />
          ) : (
            <Send className="w-5 h-5 ml-2" />
          )}
          ارسال پیام
        </Button>
        <p className="text-xs text-slate-400 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" />
          پاسخ‌گویی معمولاً کمتر از ۲۴ ساعت
        </p>
      </div>
    </form>
  );
}
