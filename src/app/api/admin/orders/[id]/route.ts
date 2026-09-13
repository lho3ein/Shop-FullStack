import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

interface Props {
  params: Promise<{ id: string }>;
}

const statusSchema = z.object({
  status: z.enum([
    "PENDING",
    "PAID",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ]),
  trackingCode: z.string().optional().nullable(),
});

export async function PATCH(request: Request, { params }: Props) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }
  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = statusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "وضعیت نامعتبر است" }, { status: 400 });
    }

    await prisma.order.update({
      where: { id },
      data: {
        status: parsed.data.status,
        trackingCode: parsed.data.trackingCode || null,
        deliveredAt: parsed.data.status === "DELIVERED" ? new Date() : null,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "خطا در تغییر وضعیت سفارش" }, { status: 500 });
  }
}