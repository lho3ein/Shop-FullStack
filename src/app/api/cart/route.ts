import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const cartSyncSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().min(1).max(99),
      color: z.string().optional().nullable(),
      storage: z.string().optional().nullable(),
    })
  ),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "ابتدا وارد شوید" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = cartSyncSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "اطلاعات سبد خرید نامعتبر است" },
        { status: 400 }
      );
    }

    // Validate products exist and are active
    const productIds = parsed.data.items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });
    const validIds = new Set(products.map((p) => p.id));

    const validItems = parsed.data.items.filter((i) => validIds.has(i.productId));

    // Replace cart
    await prisma.cartItem.deleteMany({ where: { userId: session.user.id } });

    if (validItems.length > 0) {
      await prisma.cartItem.createMany({
        data: validItems.map((i) => ({
          userId: session.user.id,
          productId: i.productId,
          quantity: i.quantity,
          color: i.color || null,
          storage: i.storage || null,
        })),
      });
    }

    return NextResponse.json({ success: true, count: validItems.length });
  } catch {
    return NextResponse.json({ error: "خطا در ذخیره سبد خرید" }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ items: [] });
  }

  const items = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
  });

  return NextResponse.json({ items });
}