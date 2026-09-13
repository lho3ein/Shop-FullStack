import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "ابتدا وارد شوید" }, { status: 401 });
  }

  try {
    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json({ error: "شناسه محصول نامعتبر" }, { status: 400 });
    }

    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    if (existing) {
      await prisma.wishlistItem.delete({ where: { id: existing.id } });
      return NextResponse.json({ wishlisted: false });
    }

    await prisma.wishlistItem.create({
      data: { userId: session.user.id, productId },
    });

    return NextResponse.json({ wishlisted: true });
  } catch {
    return NextResponse.json({ error: "خطا در ذخیره علاقه‌مندی" }, { status: 500 });
  }
}