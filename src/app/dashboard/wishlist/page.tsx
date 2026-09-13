import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { WishlistItems } from "@/components/dashboard/wishlist-items";

export const metadata: Metadata = {
  title: "علاقه‌مندی‌ها",
  robots: { index: false, follow: false },
};

export default async function WishlistPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const wishlist = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 mb-6">علاقه‌مندی‌های من</h1>
      <WishlistItems items={wishlist} />
    </div>
  );
}