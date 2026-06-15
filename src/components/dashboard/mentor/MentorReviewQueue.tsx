import { OffsetCard } from "@/components/ui/OffsetCard";
import { Badge } from "@/components/ui/Badge";
import type { MentorDashboardData } from "@/lib/dashboard/mentor";

// Review queue + upcoming check-ins + cohort health. These are forward-looking
// mentor workflows that aren't wired to data yet — shown as clearly-labelled
// placeholders, with a light live signal (student count) where it's honest to.
export function MentorReviewQueue({ data }: { data: MentorDashboardData }) {
  const { studentCount } = data;

  return (
    <OffsetCard>
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-2xl uppercase">Review queue</h3>
        <Badge>Coming soon</Badge>
      </div>
      <p className="mt-2 text-sm text-brand-paper/70">
        Deliverables awaiting your review and rubric scoring will queue here once submissions are
        enabled.
      </p>

      <div className="mt-5 border-t border-white/10 pt-4">
        <h4 className="font-display text-lg uppercase">Upcoming check-ins</h4>
        <p className="mt-2 text-sm text-brand-paper/60">
          {studentCount > 0
            ? "Weekly pod check-ins and 1:1s will be scheduled here as the cohort runs."
            : "Check-ins appear once a pod is assigned to you."}
        </p>
      </div>

      <div className="mt-5 border-t border-white/10 pt-4">
        <div className="flex items-center justify-between gap-3">
          <h4 className="font-display text-lg uppercase">Cohort health</h4>
          <Badge>Coming soon</Badge>
        </div>
        <p className="mt-2 text-sm text-brand-paper/60">
          At-a-glance velocity, blockers, and at-risk students — summarised here as progress data
          accumulates.
        </p>
      </div>
    </OffsetCard>
  );
}
