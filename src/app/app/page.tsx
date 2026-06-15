import type { Metadata } from "next";
import { Section, SectionHeader } from "@/components/site/Section";
import { OffsetCard } from "@/components/ui/OffsetCard";

export const metadata: Metadata = { title: "Student Dashboard" };

// Phase 2: gate by Supabase Auth (role=student). Data below is illustrative.
export default function StudentDashboard() {
  return (
    <Section>
      <div className="mb-6 inline-block border-2 border-brand-ink bg-brand-yellow px-3 py-1 text-xs font-bold uppercase text-brand-ink shadow-offset-sm">
        Preview · Phase 2 — auth + live data not wired
      </div>
      <SectionHeader eyebrow="Student" title="Your dashboard." />
      <div className="grid gap-6 lg:grid-cols-2">
        <OffsetCard>
          <h3 className="font-display text-2xl uppercase">Your BuildAI API key</h3>
          <p className="mt-2 text-sm text-brand-paper/70">
            Use this with the BuildAI gateway base URL. Never share it; rotate if leaked.
          </p>
          <code className="mt-4 block break-all border border-white/20 bg-black/40 p-3 font-mono text-sm text-brand-yellow">
            sk-buildai-•••••••••••••••••• (issued on enrollment)
          </code>
          <p className="mt-3 text-xs text-brand-paper/50">Base URL: https://gateway.buildai.global</p>
        </OffsetCard>
        <OffsetCard accent>
          <h3 className="font-display text-2xl uppercase">Usage & budget</h3>
          <div className="mt-4 h-3 w-full bg-white/10">
            <div className="h-3 w-1/3 bg-brand-yellow" />
          </div>
          <p className="mt-2 text-sm text-brand-paper/80">₹—/₹— used this month (from LiteLLM)</p>
          <ul className="mt-4 space-y-2 text-sm text-brand-paper/70">
            <li>Recent calls · model · tokens · cost (from gateway)</li>
          </ul>
        </OffsetCard>
        <OffsetCard className="lg:col-span-2">
          <h3 className="font-display text-2xl uppercase">Your progress</h3>
          <p className="mt-2 text-sm text-brand-paper/70">
            Week / module / deliverable status and tier — read from Supabase `progress`.
          </p>
        </OffsetCard>
      </div>
    </Section>
  );
}
