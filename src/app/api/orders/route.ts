import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { generateOrderNumber } from "@/lib/format";
import { zarinpalRequestPayment } from "@/lib/zarinpal";

const orderSchema = z.object({
  addressId: z.string().min(1, "آدرس را انتخاب کنید"),
  note: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "ابتدا وارد شوید" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = orderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "اطلاعات نامعتبر" },
        { status: 400 }
      );
    }

    const { addressId, note } = parsed.data;

    const address = await prisma.address.findFirst({
      where: { id: addressId, userId: session.user.id },
    });

    if (!address) {
      return NextResponse.json({ error: "آدرس یافت نشد" }, { status: 404 });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "سبد خرید خالی است" }, { status: 400 });
    }

    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const total = subtotal + shippingCost;

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: session.user.id,
        addressId,
        subtotal,
        shippingCost,
        total,
        note: note || null,
        paymentMethod: "zarinpal",
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            color: item.color,
            storage: item.storage,
            image: item.product.image,
          })),
        },
      },
    });

    // Initiate Zarinpal payment
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    let paymentUrl: string | null = null;
    let authority: string | null = null;

    try {
      const payment = await zarinpalRequestPayment({
        amount: total,
        description: order.orderNumber,
        email: user?.email ?? undefined,
        mobile: user?.phone ?? undefined,
      });

      paymentUrl = payment.paymentUrl;
      authority = payment.authority;

      await prisma.order.update({
        where: { id: order.id },
        data: { authorityId: authority },
      });
    } catch (err) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "CANCELLED",
          paymentStatus: "FAILED",
        },
      });
      return NextResponse.json(
        {
          error: `خطا در اتصال به درگاه پرداخت: ${
            err instanceof Error ? err.message : "خطای ناشناخته"
          }`,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      orderId: order.id,
      url: paymentUrl,
    });
  } catch {
    return NextResponse.json(
      { error: "خطا در ثبت سفارش. لطفاً دوباره تلاش کنید" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "ابتدا وارد شوید" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: true,
      address: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}