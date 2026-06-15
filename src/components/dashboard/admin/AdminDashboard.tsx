import { Section, SectionHeader } from "@/components/site/Section";
import { OffsetCard } from "@/components/ui/OffsetCard";
import { Button } from "@/components/ui/Button";
import { SITE } from "@/content/site";
import type { AdminDashboardData } from "@/lib/dashboard/admin";
import { AdminOverviewCards } from "./AdminOverviewCards";
import { LeadTables } from "./LeadTables";
import { UserOverview } from "./UserOverview";
import { AdminComingSoon } from "./AdminComingSoon";

// Presentational shell for the admin dashboard. All data is loaded server-side
// (see getAdminDashboardData) and passed in — this component fetches nothing.
export function AdminDashboard({ data }: { data: AdminDashboardData }) {
  return (
    <Section>
      <SectionHeader eyebrow="Admin" title="Everything, in one place." />

      <AdminOverviewCards data={data} />

      <div className="mt-8">
        <h2 className="eyebrow mb-4">Lead management</h2>
        <LeadTables data={data} />
      </div>

      <div className="mt-8">
        <h2 className="eyebrow mb-4">Platform overview</h2>
        <UserOverview data={data} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AdminComingSoon />
        </div>
        <OffsetCard>
          <h3 className="font-display text-2xl uppercase">Need help?</h3>
          <p className="mt-3 text-sm text-brand-paper/80">
            Signed in as <span className="font-bold">{data.email ?? "admin"}</span> ({data.role}).
            Reach the BuildAI team for anything platform-related.
          </p>
          <div className="mt-5">
            <Button href={`mailto:${SITE.email}`} variant="primary">
              Contact support
            </Button>
          </div>
          <p className="mt-3 text-xs text-brand-paper/50">{SITE.email}</p>
        </OffsetCard>
      </div>
    </Section>
  );
}
