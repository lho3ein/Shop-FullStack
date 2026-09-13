import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AddressList } from "@/components/dashboard/address-list";

export const metadata: Metadata = {
  title: "آدرس‌ها",
  robots: { index: false, follow: false },
};

export default async function AddressesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 mb-6">آدرس‌های من</h1>
      <AddressList addresses={addresses} />
    </div>
  );
}