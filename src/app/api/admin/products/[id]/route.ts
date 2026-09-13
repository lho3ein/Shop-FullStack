import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

interface Props {
  params: Promise<{ id: string }>;
}

const patchSchema = z.object({
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  stock: z.number().int().min(0).optional(),
  price: z.number().positive().optional(),
});

export async function PATCH(request: Request, { params }: Props) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }
  const { id } = await params;

  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "اطلاعات نامعتبر" }, { status: 400 });
  }

  await prisma.product.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json({ success: true });
}

export async function PUT(request: Request, { params }: Props) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }
  const { id } = await params;

  const body = await request.json();
  const { name, slug, description, shortDescription, price, originalPrice, stock, image, images, colors, storageOptions, brandId, categoryId, isFeatured, isActive, specifications } = body;

  if (!name || !slug || !price || !categoryId) {
    return NextResponse.json({ error: "اطلاعات اصلی را کامل کنید" }, { status: 400 });
  }

  // Check slug conflict
  const conflict = await prisma.product.findFirst({
    where: { slug, id: { not: id } },
  });
  if (conflict) {
    return NextResponse.json({ error: "محصولی با این اسلاگ وجود دارد" }, { status: 409 });
  }

  await prisma.product.update({
    where: { id },
    data: {
      name,
      slug,
      description,
      shortDescription: shortDescription || null,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      stock: Number(stock),
      image,
      images,
      colors,
      storageOptions,
      brandId: brandId || null,
      categoryId,
      isFeatured: !!isFeatured,
      isActive: isActive ?? true,
      specifications,
    },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(_request: Request, { params }: Props) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }
  const { id } = await params;

  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "امکان حذف محصول وجود ندارد (ممکن است سفارش داشته باشد)" },
      { status: 400 }
    );
  }
}