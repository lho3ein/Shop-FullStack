import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "نام حداقل ۲ حرف باشد"),
  email: z.string().email("ایمیل معتبر وارد کنید"),
  password: z.string().min(8, "رمز عبور حداقل ۸ کاراکتر باشد"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "این ایمیل قبلاً ثبت شده است" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "خطایی رخ داد. لطفاً دوباره تلاش کنید" },
      { status: 500 }
    );
  }
}