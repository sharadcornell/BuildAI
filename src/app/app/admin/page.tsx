import type { Metadata } from "next";
import { requireRole } from "@/lib/auth";
import { getAdminDashboardData } from "@/lib/dashboard/admin";
import { getAdminAiAccessOverview } from "@/lib/ai/access";
import { AdminDashboard } from "@/components/dashboard/admin/AdminDashboard";

export const metadata: Metadata = { title: "Admin Dashboard" };

// Admin only (requireRole redirects other roles to their own dashboard). Data is
// loaded server-side and is RLS-scoped to admins (is_admin()).
export default async function AdminDashboardPage() {
  await requireRole(["admin"]);
  const [data, aiAccess] = await Promise.all([
    getAdminDashboardData(),
    getAdminAiAccessOverview(),
  ]);
  return <AdminDashboard data={data} aiAccess={aiAccess} />;
}
