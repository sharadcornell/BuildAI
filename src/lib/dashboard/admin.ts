import { getSessionUser, type Role } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server-auth";

// Phase 2D — admin dashboard data loader.
// Reads run through the cookie-bound SSR client, so the existing admin-only RLS
// (is_admin()) on the lead tables / profiles / cohorts / enrollments is what
// authorizes every query — defense in depth on top of the route's requireRole.
// All queries are bounded (head counts + recent-N) and error-wrapped so missing
// data yields clean empty states, never an error.

const RECENT_LIMIT = 12;

export type PilotLead = {
  id: string;
  college: string | null;
  contactName: string | null;
  email: string | null;
  role: string | null;
  city: string | null;
  handled: boolean;
  createdAt: string | null;
};
export type StudentLead = {
  id: string;
  fullName: string | null;
  college: string | null;
  year: string | null;
  branch: string | null;
  email: string | null;
  handled: boolean;
  createdAt: string | null;
};
export type MentorLead = {
  id: string;
  fullName: string | null;
  company: string | null;
  role: string | null;
  email: string | null;
  handled: boolean;
  createdAt: string | null;
};

export type AdminDashboardData = {
  email: string | null;
  role: Role;
  fullName: string | null;
  counts: { pilot: number; student: number; mentor: number };
  pilots: PilotLead[];
  students: StudentLead[];
  mentors: MentorLead[];
  users: { total: number; student: number; mentor: number; admin: number };
  cohortOverview: {
    cohortCount: number;
    enrollmentCount: number;
    cohorts: { name: string | null; status: string | null }[];
  };
};

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const user = await getSessionUser();

  const base: AdminDashboardData = {
    email: user?.email ?? null,
    role: user?.role ?? "admin",
    fullName: null,
    counts: { pilot: 0, student: 0, mentor: 0 },
    pilots: [],
    students: [],
    mentors: [],
    users: { total: 0, student: 0, mentor: 0, admin: 0 },
    cohortOverview: { cohortCount: 0, enrollmentCount: 0, cohorts: [] },
  };

  if (!user) return base;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return base;

  const headCount = async (table: string, col?: string, val?: string) => {
    let q = supabase.from(table).select("id", { count: "exact", head: true });
    if (col && val) q = q.eq(col, val);
    const { count } = await q;
    return count ?? 0;
  };

  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("user_id", user.id)
      .maybeSingle();
    base.fullName = (profile?.full_name as string | null) ?? null;

    const [
      pilotCount,
      studentCount,
      mentorCount,
      pilots,
      students,
      mentors,
      usersTotal,
      usersStudent,
      usersMentor,
      usersAdmin,
      cohortCount,
      enrollmentCount,
      cohorts,
    ] = await Promise.all([
      headCount("pilot_inquiries"),
      headCount("student_waitlist"),
      headCount("mentor_applications"),
      supabase
        .from("pilot_inquiries")
        .select("id, college, contact_name, email, role, city, handled, created_at")
        .order("created_at", { ascending: false })
        .limit(RECENT_LIMIT),
      supabase
        .from("student_waitlist")
        .select("id, full_name, college, year, branch, email, handled, created_at")
        .order("created_at", { ascending: false })
        .limit(RECENT_LIMIT),
      supabase
        .from("mentor_applications")
        .select("id, full_name, company, role, email, handled, created_at")
        .order("created_at", { ascending: false })
        .limit(RECENT_LIMIT),
      headCount("profiles"),
      headCount("profiles", "role", "student"),
      headCount("profiles", "role", "mentor"),
      headCount("profiles", "role", "admin"),
      headCount("cohorts"),
      headCount("enrollments"),
      supabase
        .from("cohorts")
        .select("name, status, created_at")
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    base.counts = { pilot: pilotCount, student: studentCount, mentor: mentorCount };
    base.users = { total: usersTotal, student: usersStudent, mentor: usersMentor, admin: usersAdmin };
    base.cohortOverview = {
      cohortCount,
      enrollmentCount,
      cohorts: (cohorts.data ?? []).map((c) => ({
        name: (c.name as string | null) ?? null,
        status: (c.status as string | null) ?? null,
      })),
    };

    base.pilots = (pilots.data ?? []).map((r) => ({
      id: r.id as string,
      college: (r.college as string | null) ?? null,
      contactName: (r.contact_name as string | null) ?? null,
      email: (r.email as string | null) ?? null,
      role: (r.role as string | null) ?? null,
      city: (r.city as string | null) ?? null,
      handled: Boolean(r.handled),
      createdAt: (r.created_at as string | null) ?? null,
    }));
    base.students = (students.data ?? []).map((r) => ({
      id: r.id as string,
      fullName: (r.full_name as string | null) ?? null,
      college: (r.college as string | null) ?? null,
      year: (r.year as string | null) ?? null,
      branch: (r.branch as string | null) ?? null,
      email: (r.email as string | null) ?? null,
      handled: Boolean(r.handled),
      createdAt: (r.created_at as string | null) ?? null,
    }));
    base.mentors = (mentors.data ?? []).map((r) => ({
      id: r.id as string,
      fullName: (r.full_name as string | null) ?? null,
      company: (r.company as string | null) ?? null,
      role: (r.role as string | null) ?? null,
      email: (r.email as string | null) ?? null,
      handled: Boolean(r.handled),
      createdAt: (r.created_at as string | null) ?? null,
    }));
  } catch {
    // Error-safe: return whatever was gathered (at minimum identity + empty states).
  }

  return base;
}
