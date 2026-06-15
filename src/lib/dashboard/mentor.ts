import { getSessionUser, type Role } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server-auth";

// Phase 2C — mentor dashboard data loader.
// Reuses existing Phase-1 schema (mentor_assignments / progress / enrollments /
// cohorts / pods from 0001_init.sql). Reads run through the cookie-bound SSR
// client, so RLS guarantees a mentor only ever sees their OWN assignments and
// their assigned students' progress/enrollments. Student names require the
// additive policy in 0003_mentor_dashboard.sql; until that's applied, names fall
// back to a neutral label and everything else still works.
// Every query is wrapped so missing/empty data yields clean empty states.

export type AssignedStudent = {
  profileId: string;
  name: string | null;
  cohortName: string | null;
  currentWeek: number | null;
  lastStatus: string | null;
  deliverables: number;
};

export type CohortInfo = { name: string; status: string | null };

export type MentorDashboardData = {
  email: string | null;
  role: Role;
  fullName: string | null;
  students: AssignedStudent[];
  studentCount: number;
  cohorts: CohortInfo[];
  /** True when some assigned students exist but their names aren't readable yet
   * (i.e. 0003_mentor_dashboard.sql hasn't been applied). UI-only hint. */
  namesUnavailable: boolean;
};

export async function getMentorDashboardData(): Promise<MentorDashboardData> {
  const user = await getSessionUser();

  const base: MentorDashboardData = {
    email: user?.email ?? null,
    role: user?.role ?? "mentor",
    fullName: null,
    students: [],
    studentCount: 0,
    cohorts: [],
    namesUnavailable: false,
  };

  if (!user) return base;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return base;

  try {
    // Mentor's own profile (assignments key off profiles.id).
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, full_name")
      .eq("user_id", user.id)
      .maybeSingle();

    base.fullName = profile?.full_name ?? null;
    if (!profile?.id) return base;

    // Assigned students (own rows only by RLS).
    const { data: assignments } = await supabase
      .from("mentor_assignments")
      .select("student_id")
      .eq("mentor_id", profile.id);

    const studentIds = Array.from(
      new Set((assignments ?? []).map((a) => a.student_id).filter(Boolean) as string[]),
    );
    base.studentCount = studentIds.length;
    if (studentIds.length === 0) return base;

    // Names (only readable for assigned students once 0003 is applied).
    const { data: studentProfiles } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", studentIds);
    const nameById = new Map<string, string | null>(
      (studentProfiles ?? []).map((p) => [p.id as string, (p.full_name as string | null) ?? null]),
    );

    // Enrollments → cohort per student (+ distinct cohort list for the mentor).
    const { data: enrollments } = await supabase
      .from("enrollments")
      .select("student_id, cohort:cohorts ( name, status )")
      .in("student_id", studentIds);
    const cohortByStudent = new Map<string, string | null>();
    const cohortSeen = new Map<string, CohortInfo>();
    for (const e of enrollments ?? []) {
      const cohort = (e.cohort ?? null) as { name?: string; status?: string } | null;
      const name = cohort?.name ?? null;
      cohortByStudent.set(e.student_id as string, name);
      if (name && !cohortSeen.has(name)) {
        cohortSeen.set(name, { name, status: cohort?.status ?? null });
      }
    }
    base.cohorts = Array.from(cohortSeen.values());

    // Progress per assigned student (readable via mentors_student RLS).
    const { data: progress } = await supabase
      .from("progress")
      .select("student_id, week, status")
      .in("student_id", studentIds)
      .order("week", { ascending: true });
    const progByStudent = new Map<string, { week: number | null; status: string | null }[]>();
    for (const p of progress ?? []) {
      const sid = p.student_id as string;
      if (!progByStudent.has(sid)) progByStudent.set(sid, []);
      progByStudent.get(sid)!.push({ week: p.week as number | null, status: p.status as string | null });
    }

    base.students = studentIds.map((id) => {
      const rows = progByStudent.get(id) ?? [];
      const inProgress = rows.filter((r) => r.status === "in_progress" && typeof r.week === "number");
      const currentWeek = inProgress.length ? Math.max(...inProgress.map((r) => r.week as number)) : null;
      const lastStatus = rows.length ? rows[rows.length - 1].status : null;
      return {
        profileId: id,
        name: nameById.get(id) ?? null,
        cohortName: cohortByStudent.get(id) ?? null,
        currentWeek,
        lastStatus,
        deliverables: rows.length,
      };
    });

    base.namesUnavailable =
      base.students.length > 0 && base.students.every((s) => !s.name);
  } catch {
    // Error-safe: return whatever was gathered (at minimum identity + empty states).
  }

  return base;
}
