import type { Metadata } from "next";
import { Section, SectionHeader } from "@/components/site/Section";
import { OffsetCard } from "@/components/ui/OffsetCard";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Placements" };

export default function PlacementsPage() {
  return (
    <>
      <Section>
        <SectionHeader
          eyebrow="Placements"
          title="Opportunities, not guarantees."
          intro="BuildAI does not guarantee jobs. What we do is build a credible signal and put our strongest apprentices in front of the startups that hire for it."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ["Distinction fast-track", "The top ~10% of each cohort are fast-tracked to interviews with AI-first startups in our hiring network."],
            ["A portfolio that holds up", "Every apprentice graduates with shipped products and reviewed PRs — the evidence startups actually ask for."],
            ["Phase 2: the hiring side", "We're building the employer side of the network — AI startups that hire certified grads directly."],
          ].map(([t, b]) => (
            <OffsetCard key={t}>
              <h3 className="font-display text-2xl uppercase">{t}</h3>
              <p className="mt-3 text-sm text-brand-paper/80">{b}</p>
            </OffsetCard>
          ))}
        </div>
        <p className="mt-8 max-w-2xl text-sm text-brand-paper/70">
          Note: placement outcomes depend on each apprentice&apos;s performance and market
          conditions. Nothing on this page is a promise of employment.
        </p>
        <div className="mt-8">
          <Button href="/for-students">Join the student waitlist</Button>
        </div>
      </Section>
    </>
  );
}
