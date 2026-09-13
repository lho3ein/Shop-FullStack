import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "ابتدا وارد شوید" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!newPassword || (newPassword as string).length < 8) {
      return NextResponse.json(
        { error: "رمز جدید باید حداقل ۸ کاراکتر باشد" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user?.passwordHash) {
      return NextResponse.json({ error: "حساب کاربری روشن معتبر نیست" }, { status: 400 });
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "رمز عبور فعلی اشتباه است" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { passwordHash },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "خطا در تغییر رمز عبور" }, { status: 500 });
  }
}