import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{ id: string }>;
}

export async function PUT(_request: Request, { params }: Props) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "ابتدا وارد شوید" }, { status: 401 });
  }
  const { id } = await params;

  const address = await prisma.address.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!address) {
    return NextResponse.json({ error: "آدرس یافت نشد" }, { status: 404 });
  }

  await prisma.address.updateMany({
    where: { userId: session.user.id },
    data: { isDefault: false },
  });

  await prisma.address.update({
    where: { id },
    data: { isDefault: true },
  });

  return NextResponse.json({ success: true });
}