import type { Metadata } from "next";
import { Section, SectionHeader } from "@/components/site/Section";
import { OffsetCard } from "@/components/ui/OffsetCard";
import { requireRole } from "@/lib/auth";

export const metadata: Metadata = { title: "Student Dashboard" };

// Accessible to student + admin. Other roles are redirected to their own
// dashboard by requireRole.
export default async function StudentDashboard() {
  await requireRole(["student", "admin"]);

  return (
    <Section>
      <SectionHeader eyebrow="Student" title="Your dashboard." />
      <OffsetCard>
        <h3 className="font-display text-2xl uppercase">Student dashboard coming next</h3>
        <p className="mt-3 text-sm text-brand-paper/80">
          You&apos;re signed in. Your BuildAI API key, usage &amp; budget, and apprenticeship
          progress will appear here as the platform comes online (Phase 2B).
        </p>
      </OffsetCard>
    </Section>
  );
}
