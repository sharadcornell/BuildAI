import type { Metadata } from "next";
import { Section, SectionHeader } from "@/components/site/Section";
import { OffsetCard } from "@/components/ui/OffsetCard";
import { TIERS, RUBRIC } from "@/content/site";

export const metadata: Metadata = { title: "Certification" };

export default function CertificationPage() {
  return (
    <>
      <Section>
        <SectionHeader
          eyebrow="Earned, not granted"
          title="Three tiers. No job guarantee."
          intro="We don't promise jobs. We build a signal worth trusting — graded on real shipped work across seven dimensions. The Distinction tier is fast-tracked to interviews with AI-first startups."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {TIERS.map((t, i) => (
            <OffsetCard key={t.name} accent={i === 2}>
              <div className="font-display text-5xl text-brand-yellow">{t.share}</div>
              <h3 className="mt-2 font-display text-2xl uppercase">{t.name}</h3>
              <p className="mt-3 text-sm text-brand-paper/80">{t.body}</p>
            </OffsetCard>
          ))}
        </div>
      </Section>
      <Section className="bg-brand-paper text-brand-ink">
        <SectionHeader dark eyebrow="The rubric" title="What we actually evaluate." />
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {RUBRIC.map((r) => (
            <li key={r} className="border-2 border-brand-ink bg-brand-ink p-4 font-bold uppercase tracking-wide text-brand-paper shadow-offset">
              {r}
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
