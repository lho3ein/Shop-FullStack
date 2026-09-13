import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CheckoutView } from "@/components/checkout/checkout-view";

export const metadata: Metadata = {
  title: "تسویه حساب",
  description: "تسویه حساب و پرداخت سفارش",
};

export default async function CheckoutPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/checkout");
  }

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: { isDefault: "desc" },
  });

  return <CheckoutView addresses={addresses} />;
}
