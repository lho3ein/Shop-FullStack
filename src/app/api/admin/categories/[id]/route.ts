import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: Props) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }
  const { id } = await params;

  const body = await request.json();
  const { isActive, name, description, icon, sortOrder } = body;

  await prisma.category.update({
    where: { id },
    data: {
      ...(isActive !== undefined && { isActive }),
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(icon && { icon }),
      ...(sortOrder !== undefined && { sortOrder }),
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

  const productCount = await prisma.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    return NextResponse.json(
      { error: "این دسته‌بندی دارای محصول است و قابل حذف نیست" },
      { status: 400 }
    );
  }

  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ success: true });
}