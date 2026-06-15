import { OffsetCard } from "@/components/ui/OffsetCard";
import type { AdminDashboardData } from "@/lib/dashboard/admin";

function Stat({ value, label, accent = false }: { value: number | string; label: string; accent?: boolean }) {
  return (
    <OffsetCard accent={accent} className="text-center">
      <p className="font-display text-4xl text-brand-yellow">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-wide text-brand-paper/70">{label}</p>
    </OffsetCard>
  );
}

export function AdminOverviewCards({ data }: { data: AdminDashboardData }) {
  const totalLeads = data.counts.pilot + data.counts.student + data.counts.mentor;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      <Stat value={totalLeads} label="Total leads" accent />
      <Stat value={data.counts.pilot} label="Pilot inquiries" />
      <Stat value={data.counts.student} label="Student waitlist" />
      <Stat value={data.counts.mentor} label="Mentor applies" />
      <Stat value={data.users.total} label="Users" />
      <Stat value={data.cohortOverview.cohortCount} label="Cohorts" />
    </div>
  );
}
