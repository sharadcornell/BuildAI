import { OffsetCard } from "@/components/ui/OffsetCard";
import { Badge } from "@/components/ui/Badge";
import type { MentorDashboardData } from "@/lib/dashboard/mentor";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-2">
      <dt className="text-brand-paper/60">{label}</dt>
      <dd className="text-right font-bold text-brand-paper">{value}</dd>
    </div>
  );
}

export function MentorOverviewCard({ data }: { data: MentorDashboardData }) {
  const { email, role, fullName, studentCount, cohorts } = data;
  const cohortLabel =
    cohorts.length === 0
      ? "—"
      : cohorts.map((c) => c.name).join(", ");

  return (
    <OffsetCard>
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-2xl uppercase">Mentor profile</h3>
        <Badge>{studentCount > 0 ? `${studentCount} assigned` : "No pod yet"}</Badge>
      </div>

      <dl className="mt-4 space-y-2 text-sm">
        <Row label="Name" value={fullName ?? "—"} />
        <Row label="Email" value={email ?? "—"} />
        <Row label="Role" value={role} />
        <Row label="Assigned students" value={String(studentCount)} />
        <Row label="Cohort(s)" value={cohortLabel} />
      </dl>

      {studentCount === 0 ? (
        <p className="mt-4 border-2 border-dashed border-white/20 p-3 text-sm text-brand-paper/70">
          {role === "admin"
            ? "You're viewing the mentor dashboard as an admin — no students are assigned to this account."
            : "No students are assigned to you yet. Once an admin assigns you a pod, your students and their cohort will appear here."}
        </p>
      ) : null}
    </OffsetCard>
  );
}
