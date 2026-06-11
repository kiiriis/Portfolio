import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/session";
import { AdminNav } from "@/components/admin/admin-nav";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdmin())) {
    redirect("/login?from=/admin");
  }
  return (
    <div className="min-h-screen pb-24">
      <AdminNav />
      <main className="container py-8">{children}</main>
    </div>
  );
}
