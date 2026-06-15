import type { Metadata } from "next";
import { Section, SectionHeader } from "@/components/site/Section";
import { OffsetCard } from "@/components/ui/OffsetCard";

export const metadata: Metadata = { title: "Admin Dashboard" };

// Phase 3: gate by role=admin. Full visibility across colleges/cohorts/pods.
export default function AdminDashboard() {
  const cards = [
    ["Colleges, cohorts & pods", "Create and manage; assign mentors to students."],
    ["Usage & cost", "Per key / student / cohort spend (LiteLLM /spend + mirrored llm_events)."],
    ["All query & response logs", "Search and filter every prompt + response (Langfuse). Access audited."],
    ["Leads", "Pilot inquiries, student waitlist, mentor applications — mark handled, export CSV."],
    ["Progress & rubric", "Cohort-wide progress and 7-dimension rubric scoring."],
    ["Exports", "CSV export of usage, leads, and roster."],
  ];
  return (
    <Section>
      <div className="mb-6 inline-block border-2 border-brand-ink bg-brand-yellow px-3 py-1 text-xs font-bold uppercase text-brand-ink shadow-offset-sm">
        Preview · Phase 3
      </div>
      <SectionHeader eyebrow="Admin" title="Everything, in one place." />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cards.map(([t, b]) => (
          <OffsetCard key={t}>
            <h3 className="font-display text-xl uppercase">{t}</h3>
            <p className="mt-3 text-sm text-brand-paper/80">{b}</p>
          </OffsetCard>
        ))}
      </div>
    </Section>
  );
}
