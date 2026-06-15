import { OffsetCard } from "@/components/ui/OffsetCard";
import { Badge } from "@/components/ui/Badge";
import type { StudentDashboardData } from "@/lib/dashboard/student";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Deterministic YYYY-MM-DD -> "DD Mon YYYY" (no locale/timezone surprises in RSC).
function formatDate(value: string | null): string | null {
  if (!value) return null;
  const m = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return value;
  const [, y, mo, d] = m;
  const month = MONTHS[Number(mo) - 1] ?? mo;
  return `${Number(d)} ${month} ${y}`;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-2">
      <dt className="text-brand-paper/60">{label}</dt>
      <dd className="text-right font-bold text-brand-paper">{value}</dd>
    </div>
  );
}

export function StudentOverviewCard({ data }: { data: StudentDashboardData }) {
  const { email, role, fullName, programmeStatus, enrollment } = data;

  return (
    <OffsetCard>
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-2xl uppercase">Your profile</h3>
        <Badge>{programmeStatus}</Badge>
      </div>

      <dl className="mt-4 space-y-2 text-sm">
        <Row label="Name" value={fullName ?? "—"} />
        <Row label="Email" value={email ?? "—"} />
        <Row label="Role" value={role} />
        {enrollment ? (
          <>
            <Row label="Cohort" value={enrollment.cohortName ?? "Assigned"} />
            <Row label="Starts" value={formatDate(enrollment.startDate) ?? "To be scheduled"} />
            <Row
              label="Length"
              value={enrollment.weeks ? `${enrollment.weeks} weeks` : "13 weeks"}
            />
            <Row
              label="Certification tier"
              value={enrollment.tierAwarded ?? "Not yet awarded"}
            />
          </>
        ) : null}
      </dl>

      {!enrollment ? (
        <p className="mt-4 border-2 border-dashed border-white/20 p-3 text-sm text-brand-paper/70">
          {role === "admin"
            ? "You're viewing the student dashboard as an admin — there's no cohort enrollment on this account."
            : "You're not in a cohort yet. Once your college pilot places you, your cohort, start date, and certification tier will appear here."}
        </p>
      ) : null}
    </OffsetCard>
  );
}
