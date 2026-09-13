import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const contactSchema = z.object({
  name: z.string().min(2, "نام باید حداقل ۲ کاراکتر باشد").max(80),
  email: z.string().email("ایمیل معتبر نیست").max(120).optional().or(z.literal("")),
  phone: z.string().max(20).optional().or(z.literal("")),
  subject: z.string().max(150).optional().or(z.literal("")),
  message: z.string().min(5, "متن پیام باید حداقل ۵ کاراکتر باشد").max(3000),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? "داده نامعتبر است" },
        { status: 400 }
      );
    }
    const d = parsed.data;
    const created = await prisma.contactMessage.create({
      data: {
        name: d.name,
        email: d.email || null,
        phone: d.phone || null,
        subject: d.subject || null,
        message: d.message,
      },
    });
    return NextResponse.json({ ok: true, id: created.id });
  } catch {
    return NextResponse.json({ ok: false, error: "خطا در ثبت پیام. دوباره تلاش کنید." }, { status: 500 });
  }
}
