import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const addressSchema = z.object({
  label: z.string().min(1),
  province: z.string().min(1, "استان را انتخاب کنید"),
  city: z.string().min(1, "شهر را وارد کنید"),
  district: z.string().optional(),
  street: z.string().min(3, "آدرس کامل را وارد کنید"),
  postalCode: z.string().regex(/^\d{10}$/, "کد پستی ۱۰ رقمی وارد کنید"),
  receiverName: z.string().min(2, "نام تحویل‌گیرنده را وارد کنید"),
  receiverPhone: z.string().regex(/^09\d{9}$/, "شماره موبایل معتبر وارد کنید"),
  isDefault: z.boolean().optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "ابتدا وارد شوید" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = addressSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "اطلاعات نامعتبر" },
        { status: 400 }
      );
    }

    const { label, province, city, district, street, postalCode, receiverName, receiverPhone, isDefault } = parsed.data;

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: session.user.id,
        label,
        province,
        city,
        district: district || null,
        street,
        postalCode,
        receiverName,
        receiverPhone,
        isDefault: isDefault ?? false,
      },
    });

    const count = await prisma.address.count({ where: { userId: session.user.id } });
    if (count === 1) {
      await prisma.address.update({ where: { id: address.id }, data: { isDefault: true } });
    }

    return NextResponse.json({ address });
  } catch {
    return NextResponse.json({ error: "خطا در ذخیره آدرس" }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "ابتدا وارد شوید" }, { status: 401 });
  }

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: { isDefault: "desc" },
  });

  return NextResponse.json({ addresses });
}