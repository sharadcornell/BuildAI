import type { Metadata } from "next";
import { Section, SectionHeader } from "@/components/site/Section";
import { OffsetCard } from "@/components/ui/OffsetCard";
import { requireRole } from "@/lib/auth";

export const metadata: Metadata = { title: "Mentor Dashboard" };

// Accessible to mentor + admin. Other roles are redirected to their own
// dashboard by requireRole.
export default async function MentorDashboard() {
  await requireRole(["mentor", "admin"]);

  return (
    <Section>
      <SectionHeader eyebrow="Mentor" title="Your pod." />
      <OffsetCard>
        <h3 className="font-display text-2xl uppercase">Mentor dashboard coming next</h3>
        <p className="mt-3 text-sm text-brand-paper/80">
          You&apos;re signed in. Your assigned students, their progress, and their
          query/response history will appear here (Phase 3).
        </p>
      </OffsetCard>
    </Section>
  );
}
