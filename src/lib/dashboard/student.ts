import { getSessionUser, type Role } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server-auth";

// Phase 2B — student dashboard data loader.
// Reuses the existing Phase-1 schema (profiles / enrollments / cohorts / progress
// from 0001_init.sql). No new tables were added. Reads run through the cookie-bound
// SSR client, so RLS guarantees a student only ever sees their OWN rows
// (is_self(student_id)); an admin viewing /app simply sees empty states.
// Every query is wrapped so missing/empty data yields clean empty states, never errors.

export type EnrollmentInfo = {
  cohortName: string | null;
  startDate: string | null;
  weeks: number | null;
  cohortStatus: string | null;
  tierAwarded: string | null;
};

export type ProgressRow = {
  week: number | null;
  module: string | null;
  deliverable: string | null;
  status: string | null;
};

export type StudentDashboardData = {
  email: string | null;
  role: Role;
  fullName: string | null;
  /** Human-readable programme status, e.g. "Enrolled" / "Not enrolled yet". */
  programmeStatus: string;
  enrollment: EnrollmentInfo | null;
  progress: ProgressRow[];
  /** Highest in-progress week, or null when nothing is in progress yet. */
  currentWeek: number | null;
};

export async function getStudentDashboardData(): Promise<StudentDashboardData> {
  const user = await getSessionUser();

  // Identity-only default (drives clean empty states everywhere downstream).
  const base: StudentDashboardData = {
    email: user?.email ?? null,
    role: user?.role ?? "student",
    fullName: null,
    programmeStatus: "Not enrolled yet",
    enrollment: null,
    progress: [],
    currentWeek: null,
  };

  if (!user) return base;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return base;

  try {
    // The student's profile row (enrollments/progress key off profiles.id, not auth uid).
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, full_name, status")
      .eq("user_id", user.id)
      .maybeSingle();

    base.fullName = profile?.full_name ?? null;
    if (!profile?.id) return base;

    // Enrollment + its cohort (many-to-one embed). null when not enrolled yet.
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("tier_awarded, cohort:cohorts ( name, start_date, weeks, status )")
      .eq("student_id", profile.id)
      .maybeSingle();

    if (enrollment) {
      const cohort = (enrollment.cohort ?? null) as
        | { name?: string; start_date?: string; weeks?: number; status?: string }
        | null;
      base.enrollment = {
        cohortName: cohort?.name ?? null,
        startDate: cohort?.start_date ?? null,
        weeks: cohort?.weeks ?? null,
        cohortStatus: cohort?.status ?? null,
        tierAwarded: (enrollment.tier_awarded as string | null) ?? null,
      };
      base.programmeStatus = "Enrolled";
    }

    // Progress rows (own-only by RLS), ordered by week.
    const { data: progress } = await supabase
      .from("progress")
      .select("week, module, deliverable, status")
      .eq("student_id", profile.id)
      .order("week", { ascending: true });

    base.progress = (progress as ProgressRow[] | null) ?? [];
    const inProgress = base.progress.filter(
      (p) => p.status === "in_progress" && typeof p.week === "number",
    );
    base.currentWeek = inProgress.length
      ? Math.max(...inProgress.map((p) => p.week as number))
      : null;
  } catch {
    // Error-safe: return whatever was gathered (at minimum identity + empty states).
  }

  return base;
}
