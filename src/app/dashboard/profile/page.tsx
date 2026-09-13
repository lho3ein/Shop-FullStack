import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/dashboard/profile-form";

export const metadata: Metadata = {
  title: "پروفایل",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 mb-6">پروفایل</h1>
      <ProfileForm
        name={user?.name ?? ""}
        email={user?.email ?? ""}
        phone={user?.phone ?? ""}
      />
    </div>
  );
}