import type { Metadata } from "next";
import { Section, SectionHeader } from "@/components/site/Section";
import { OffsetCard } from "@/components/ui/OffsetCard";

export const metadata: Metadata = { title: "Mentor Dashboard" };

// Phase 3: gate by role=mentor; show only assigned students (mentor_assignments + RLS).
export default function MentorDashboard() {
  return (
    <Section>
      <div className="mb-6 inline-block border-2 border-brand-ink bg-brand-yellow px-3 py-1 text-xs font-bold uppercase text-brand-ink shadow-offset-sm">
        Preview · Phase 3
      </div>
      <SectionHeader eyebrow="Mentor" title="Your pod." />
      <div className="grid gap-6 md:grid-cols-2">
        <OffsetCard>
          <h3 className="font-display text-2xl uppercase">Assigned students</h3>
          <p className="mt-2 text-sm text-brand-paper/70">
            Each student&apos;s progress, latest deliverables, and usage. From `mentor_assignments`.
          </p>
        </OffsetCard>
        <OffsetCard>
          <h3 className="font-display text-2xl uppercase">Query &amp; response history</h3>
          <p className="mt-2 text-sm text-brand-paper/70">
            Read-only view of each student&apos;s prompts and responses (Langfuse traces). Access is
            logged.
          </p>
        </OffsetCard>
      </div>
    </Section>
  );
}
