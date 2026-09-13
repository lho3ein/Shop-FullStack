import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { zarinpalVerifyPayment } from "@/lib/zarinpal";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const authority = searchParams.get("Authority");
  const status = searchParams.get("Status");

  try {
    const order = await prisma.order.findFirst({
      where: { authorityId: authority as string },
    });

    if (!order) {
      return NextResponse.redirect(
        new URL(`/payment/failed?reason=nf`, process.env.BASE_URL!)
      );
    }

    if (status !== "OK" || !authority) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "CANCELLED", paymentStatus: "FAILED" },
      });
      return NextResponse.redirect(
        new URL(`/payment/failed?order=${order.orderNumber}`, process.env.BASE_URL!)
      );
    }

    try {
      const verification = await zarinpalVerifyPayment({
        amount: order.total,
        authority,
      });

      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "PAID",
          paymentStatus: "SUCCESS",
          refId: verification.refId,
        },
      });

      // Decrement stock & clear cart
      const orderItems = await prisma.orderItem.findMany({
        where: { orderId: order.id },
      });
      for (const item of orderItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
            soldCount: { increment: item.quantity },
          },
        });
      }

      await prisma.cartItem.deleteMany({
        where: { userId: order.userId },
      });

      return NextResponse.redirect(
        new URL(
          `/payment/success?order=${order.orderNumber}&refId=${verification.refId || ""}`,
          process.env.BASE_URL!
        )
      );
    } catch (err) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "CANCELLED", paymentStatus: "FAILED" },
      });
      return NextResponse.redirect(
        new URL(
          `/payment/failed?order=${order.orderNumber}&reason=${
            err instanceof Error ? err.message : "ve"
          }`,
          process.env.BASE_URL!
        )
      );
    }
  } catch {
    return NextResponse.redirect(
      new URL(`/payment/failed?reason=err`, process.env.BASE_URL!)
    );
  }
}