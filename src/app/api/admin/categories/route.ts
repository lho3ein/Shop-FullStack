import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(2, "نام دسته‌بندی را وارد کنید"),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "اسلاگ نامعتبر است"),
  description: z.string().nullable().optional(),
  icon: z.string().optional(),
  parentId: z.string().nullable().optional(),
  sortOrder: z.number().optional(),
  isActive: z.boolean().optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "اطلاعات نامعتبر" }, { status: 400 });
    }

    const existing = await prisma.category.findUnique({ where: { slug: parsed.data.slug } });
    if (existing) {
      return NextResponse.json({ error: "دسته‌بندی با این اسلاگ وجود دارد" }, { status: 409 });
    }

    const category = await prisma.category.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description ?? null,
        icon: parsed.data.icon,
        parentId: parsed.data.parentId || null,
        sortOrder: parsed.data.sortOrder ?? 0,
        isActive: parsed.data.isActive ?? true,
      },
    });

    return NextResponse.json({ category });
  } catch {
    return NextResponse.json({ error: "خطا در ایجاد دسته‌بندی" }, { status: 500 });
  }
}