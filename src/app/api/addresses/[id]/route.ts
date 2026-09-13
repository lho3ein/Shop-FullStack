import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: Request, { params }: Props) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "ابتدا وارد شوید" }, { status: 401 });
  }
  const { id } = await params;

  try {
    const address = await prisma.address.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!address) {
      return NextResponse.json({ error: "آدرس یافت نشد" }, { status: 404 });
    }

    await prisma.address.delete({ where: { id } });

    // If deleted was default, set another as default
    if (address.isDefault) {
      const another = await prisma.address.findFirst({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
      });
      if (another) {
        await prisma.address.update({
          where: { id: another.id },
          data: { isDefault: true },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "خطا در حذف آدرس" }, { status: 500 });
  }
}