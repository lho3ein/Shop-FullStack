import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-[250px_1fr] gap-8">
        <DashboardNav userName={session.user.name} userEmail={session.user.email} userImage={session.user.image} isAdmin={session.user.role === "ADMIN"} />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}