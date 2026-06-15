import type { Metadata } from "next";
import { Section, SectionHeader } from "@/components/site/Section";
import { TiltCard } from "@/components/ui/TiltCard";
import { MODULES, RUBRIC } from "@/content/site";

export const metadata: Metadata = { title: "Curriculum" };

export default function CurriculumPage() {
  return (
    <>
      <Section>
        <SectionHeader
          eyebrow="13 weeks · 6 modules"
          title="The curriculum."
          intro="Threaded throughout: bi-weekly demo days, weekly code reviews, a weekly reading group (Anthropic blog, OpenAI cookbook, Simon Willison, Latent Space), and real-world failure exercises."
        />
        <div className="space-y-6">
          {MODULES.map((m) => (
            <TiltCard key={m.id} className="md:flex md:items-start md:gap-8">
              <div className="md:w-48 md:shrink-0">
                <div className="font-display text-5xl text-brand-yellow">{m.id}</div>
                <div className="text-[11px] uppercase tracking-wide text-brand-paper/50">{m.weeks}</div>
              </div>
              <div>
                <h3 className="font-display text-2xl uppercase leading-tight">{m.title}</h3>
                <p className="mt-2 text-sm text-brand-paper/80">{m.body}</p>
              </div>
            </TiltCard>
          ))}
        </div>
      </Section>
      <Section className="bg-brand-paper text-brand-ink">
        <SectionHeader dark eyebrow="How we grade" title="Seven rubric dimensions. All tied to shipped work." />
        <div className="flex flex-wrap gap-3">
          {RUBRIC.map((r) => (
            <span key={r} className="border-2 border-brand-ink bg-brand-yellow px-4 py-2 text-sm font-bold uppercase tracking-wide text-brand-ink shadow-offset-sm">
              {r}
            </span>
          ))}
        </div>
      </Section>
    </>
  );
}
