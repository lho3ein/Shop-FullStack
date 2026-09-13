import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "ابتدا وارد شوید" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, phone } = body;

    if (!name || (name as string).trim().length < 2) {
      return NextResponse.json({ error: "نام نامعتبر است" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name.trim(),
        phone: phone || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "خطا در به‌روزرسانی پروفایل" }, { status: 500 });
  }
}