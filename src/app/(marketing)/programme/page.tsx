import type { Metadata } from "next";
import { Section, SectionHeader } from "@/components/site/Section";
import { OffsetCard } from "@/components/ui/OffsetCard";
import { STATS } from "@/content/site";

export const metadata: Metadata = { title: "Programme" };

export default function ProgrammePage() {
  const week = [
    ["Mon–Fri", "Async build", "Self-paced project work in your pod, with Cursor + Claude Code. Push code daily."],
    ["Saturday", "Live session (90 min)", "Lead mentor walks the week's concept, then live builds and answers."],
    ["Sunday", "Peer review", "Structured code review across the pod. You read and critique real PRs."],
    ["Every 2 weeks", "Demo Day", "Ship in public to the whole cohort. No slides — running software only."],
  ];
  return (
    <>
      <Section className="bg-brand-paper text-brand-ink">
        <SectionHeader
          dark
          eyebrow="How it works"
          title="An apprenticeship rhythm, not a lecture schedule."
          intro="Pods of 8–12 students, each led by a working engineer from an AI startup. The week is built around shipping and review — the way real teams operate."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="border-2 border-brand-ink bg-brand-ink p-6 shadow-offset">
              <div className="font-display text-5xl text-brand-yellow">{s.value}</div>
              <div className="mt-2 text-sm text-brand-paper/80">{s.label}</div>
            </div>
          ))}
        </div>
      </Section>
      <Section>
        <SectionHeader eyebrow="A week in a pod" title="What every week looks like." />
        <div className="grid gap-6 md:grid-cols-2">
          {week.map(([when, title, body]) => (
            <OffsetCard key={title}>
              <span className="text-[11px] font-bold uppercase tracking-wide text-brand-yellow">{when}</span>
              <h3 className="mt-2 font-display text-2xl uppercase">{title}</h3>
              <p className="mt-3 text-sm text-brand-paper/80">{body}</p>
            </OffsetCard>
          ))}
        </div>
      </Section>
    </>
  );
}
