import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-[240px_1fr] gap-6">
          <AdminSidebar />
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}