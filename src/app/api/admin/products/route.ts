import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(2, "نام محصول را وارد کنید"),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "اسلاگ نامعتبر است"),
  description: z.string().min(10, "توضیحات کامل را وارد کنید"),
  shortDescription: z.string().optional(),
  price: z.number().positive("قیمت باید بیشتر از صفر باشد"),
  originalPrice: z.number().nullable().optional(),
  stock: z.number().int().min(0),
  image: z.string().url("آدرس تصویر نامعتبر است"),
  images: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  storageOptions: z.array(z.string()).optional(),
  brandId: z.string().nullable().optional(),
  categoryId: z.string().min(1, "دسته‌بندی را انتخاب کنید"),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  specifications: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "اطلاعات نامعتبر" },
        { status: 400 }
      );
    }

    const existing = await prisma.product.findUnique({
      where: { slug: parsed.data.slug },
    });
    if (existing) {
      return NextResponse.json(
        { error: "محصولی با این اسلاگ وجود دارد" },
        { status: 409 }
      );
    }

    const product = await prisma.product.create({
      data: {
        ...parsed.data,
        originalPrice: parsed.data.originalPrice || null,
        brandId: parsed.data.brandId || null,
        images: parsed.data.images ?? [],
        colors: parsed.data.colors ?? [],
        storageOptions: parsed.data.storageOptions ?? [],
      },
    });

    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: "خطا در ایجاد محصول" }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  const products = await prisma.product.findMany({
    include: { category: true, brand: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ products });
}