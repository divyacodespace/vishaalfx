import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/adminAuth";
import { AdminEnrollmentsTable } from "@/components/admin/AdminEnrollmentsTable";
import { LogoutButton } from "@/components/admin/LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <main className="min-h-screen bg-grid-fade px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Enrollment Requests</h1>
            <p className="text-sm text-white/50">Signed in as {session.email}</p>
          </div>
          <LogoutButton />
        </div>
        <AdminEnrollmentsTable />
      </div>
    </main>
  );
}
