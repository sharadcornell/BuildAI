import { Section, SectionHeader } from "@/components/site/Section";
import { OffsetCard } from "@/components/ui/OffsetCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SITE } from "@/content/site";
import type { MentorDashboardData } from "@/lib/dashboard/mentor";
import { MentorOverviewCard } from "./MentorOverviewCard";
import { AssignedStudents } from "./AssignedStudents";
import { MentorReviewQueue } from "./MentorReviewQueue";

// Presentational shell for the mentor dashboard. All data is loaded server-side
// (see getMentorDashboardData) and passed in — this component fetches nothing.
export function MentorDashboard({ data }: { data: MentorDashboardData }) {
  const firstName = data.fullName?.trim().split(/\s+/)[0] ?? null;

  return (
    <Section>
      <SectionHeader
        eyebrow="Mentor"
        title={firstName ? `Welcome, ${firstName}.` : "Your pod."}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <MentorOverviewCard data={data} />

        {/* AI trace / review — explicitly not available yet */}
        <OffsetCard accent>
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-2xl uppercase">AI trace review</h3>
            <Badge>Coming later</Badge>
          </div>
          <p className="mt-3 text-sm text-brand-paper/80">
            Read-only access to each student&apos;s prompt/response traces (via the observability
            stack) will appear here in a later phase. Access is audited.
          </p>
          <p className="mt-3 text-xs text-brand-paper/50">Nothing to review yet.</p>
        </OffsetCard>
      </div>

      <div className="mt-6">
        <AssignedStudents data={data} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <MentorReviewQueue data={data} />

        {/* Support / help CTA */}
        <OffsetCard>
          <h3 className="font-display text-2xl uppercase">Need help?</h3>
          <p className="mt-3 text-sm text-brand-paper/80">
            Questions about your pod, reviews, or scheduling? Reach the BuildAI team and we&apos;ll
            get you sorted.
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
