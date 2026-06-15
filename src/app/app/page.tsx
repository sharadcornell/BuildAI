import type { Metadata } from "next";
import { requireRole } from "@/lib/auth";
import { getStudentDashboardData } from "@/lib/dashboard/student";
import { getStudentAiAccess } from "@/lib/ai/access";
import { StudentDashboard } from "@/components/dashboard/student/StudentDashboard";

export const metadata: Metadata = { title: "Student Dashboard" };

// Accessible to student + admin (requireRole redirects other roles to their own
// dashboard). Data is loaded server-side and is RLS-scoped to the current user.
export default async function StudentDashboardPage() {
  await requireRole(["student", "admin"]);
  const [data, aiAccess] = await Promise.all([
    getStudentDashboardData(),
    getStudentAiAccess(),
  ]);
  return <StudentDashboard data={data} aiAccess={aiAccess} />;
}
