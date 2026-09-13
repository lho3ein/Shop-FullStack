import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "ابتدا وارد شوید" }, { status: 401 });
  }
  const { id } = await params;

  const item = await prisma.wishlistItem.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!item) {
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  }

  await prisma.wishlistItem.delete({ where: { id } });
  return NextResponse.json({ success: true });
}