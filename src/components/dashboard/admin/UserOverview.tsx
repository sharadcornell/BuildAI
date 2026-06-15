import { OffsetCard } from "@/components/ui/OffsetCard";
import type { AdminDashboardData } from "@/lib/dashboard/admin";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-2">
      <dt className="text-brand-paper/60">{label}</dt>
      <dd className="text-right font-bold text-brand-paper">{value}</dd>
    </div>
  );
}

export function UserOverview({ data }: { data: AdminDashboardData }) {
  const { users, cohortOverview } = data;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <OffsetCard>
        <h3 className="font-display text-2xl uppercase">Users &amp; roles</h3>
        <dl className="mt-4 space-y-2 text-sm">
          <Row label="Total profiles" value={String(users.total)} />
          <Row label="Students" value={String(users.student)} />
          <Row label="Mentors" value={String(users.mentor)} />
          <Row label="Admins" value={String(users.admin)} />
        </dl>
        {users.total === 0 ? (
          <p className="mt-4 border-2 border-dashed border-white/20 p-3 text-sm text-brand-paper/70">
            No user profiles yet.
          </p>
        ) : null}
      </OffsetCard>

      <OffsetCard>
        <h3 className="font-display text-2xl uppercase">Cohorts &amp; enrollment</h3>
        <dl className="mt-4 space-y-2 text-sm">
          <Row label="Cohorts" value={String(cohortOverview.cohortCount)} />
          <Row label="Enrollments" value={String(cohortOverview.enrollmentCount)} />
        </dl>
        {cohortOverview.cohorts.length > 0 ? (
          <ul className="mt-4 space-y-2 text-sm">
            {cohortOverview.cohorts.map((c, i) => (
              <li key={i} className="flex items-center justify-between gap-3 border border-white/15 px-3 py-2">
                <span className="text-brand-paper/90">{c.name ?? "Unnamed cohort"}</span>
                <span className="text-xs font-bold uppercase tracking-wide text-brand-paper/60">
                  {c.status ?? "—"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 border-2 border-dashed border-white/20 p-3 text-sm text-brand-paper/70">
            No cohorts created yet. Cohorts and enrollments will appear here once a pilot starts.
          </p>
        )}
      </OffsetCard>
    </div>
  );
}
