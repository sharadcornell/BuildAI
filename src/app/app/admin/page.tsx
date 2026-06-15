import type { Metadata } from "next";
import { Section, SectionHeader } from "@/components/site/Section";
import { OffsetCard } from "@/components/ui/OffsetCard";
import { requireRole } from "@/lib/auth";

export const metadata: Metadata = { title: "Admin Dashboard" };

// Accessible to admin only. All other roles are redirected to their own
// dashboard by requireRole.
export default async function AdminDashboard() {
  await requireRole(["admin"]);

  return (
    <Section>
      <SectionHeader eyebrow="Admin" title="Everything, in one place." />
      <OffsetCard>
        <h3 className="font-display text-2xl uppercase">Admin dashboard coming next</h3>
        <p className="mt-3 text-sm text-brand-paper/80">
          You&apos;re signed in as an admin. College/cohort/pod management, usage &amp; cost,
          query/response logs, and lead management will appear here (Phase 3 / 2D).
        </p>
      </OffsetCard>
    </Section>
  );
}
