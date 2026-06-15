import { Section, SectionHeader } from "@/components/site/Section";
import { OffsetCard } from "@/components/ui/OffsetCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SITE } from "@/content/site";
import type { StudentDashboardData } from "@/lib/dashboard/student";
import { StudentOverviewCard } from "./StudentOverviewCard";
import { ProgrammeTimeline } from "./ProgrammeTimeline";
import { StudentTasks } from "./StudentTasks";

// Presentational shell for the student dashboard. All data is loaded server-side
// (see getStudentDashboardData) and passed in — this component fetches nothing.
export function StudentDashboard({ data }: { data: StudentDashboardData }) {
  const firstName = data.fullName?.trim().split(/\s+/)[0] ?? null;

  return (
    <Section>
      <SectionHeader
        eyebrow="Student"
        title={firstName ? `Welcome, ${firstName}.` : "Your dashboard."}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <StudentOverviewCard data={data} />

        {/* AI access — explicitly not available yet */}
        <OffsetCard accent>
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-2xl uppercase">AI access</h3>
            <Badge>Coming later</Badge>
          </div>
          <p className="mt-3 text-sm text-brand-paper/80">
            Your BuildAI API key, model gateway, and usage &amp; budget aren&apos;t issued yet.
            They&apos;ll appear here in a later phase — you never handle raw provider keys.
          </p>
          <p className="mt-3 text-xs text-brand-paper/50">
            Nothing to set up right now.
          </p>
        </OffsetCard>
      </div>

      <div className="mt-6">
        <ProgrammeTimeline data={data} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <StudentTasks data={data} />

        {/* Support / help CTA */}
        <OffsetCard>
          <h3 className="font-display text-2xl uppercase">Need help?</h3>
          <p className="mt-3 text-sm text-brand-paper/80">
            Questions about onboarding, your cohort, or the programme? Reach the BuildAI team and
            we&apos;ll get you to the right mentor.
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
