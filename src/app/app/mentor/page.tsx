import type { Metadata } from "next";
import { requireRole } from "@/lib/auth";
import { getMentorDashboardData } from "@/lib/dashboard/mentor";
import { MentorDashboard } from "@/components/dashboard/mentor/MentorDashboard";

export const metadata: Metadata = { title: "Mentor Dashboard" };

// Accessible to mentor + admin (requireRole redirects other roles to their own
// dashboard). Data is loaded server-side and is RLS-scoped to the current mentor.
export default async function MentorDashboardPage() {
  await requireRole(["mentor", "admin"]);
  const data = await getMentorDashboardData();
  return <MentorDashboard data={data} />;
}
