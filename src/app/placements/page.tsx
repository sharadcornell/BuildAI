import { ShieldCheck, FolderGit2, MessageSquare, Presentation, Clock } from "lucide-react";
import {
  Section, Eyebrow, SectionHeading, MonoLabel, Tag, StatusDot, CertStamp,
} from "../components/buildai/primitives";
import { PageHero, CTASection } from "../components/buildai/shared";
import { FaqAccordion } from "../components/buildai/shared";
import { FAQ } from "../lib/data";

export default function Placements() {
  return (
    <>
      <PageHero
        index="07"
        kicker="placements · phase 2"
        title={<>A future hiring network for students who prove they can ship.</>}
        intro="Hiring is based on portfolio proof, mentor validation, and demo performance — not promises. Distinction students may be surfaced to partners. Opportunities, not guarantees."
      />

      {/* Trust-safe statement */}
      <Section>
        <div className="border-2 border-signal bg-signal-soft p-6 sm:p-8 flex items-start gap-4">
          <ShieldCheck className="size-7 text-signal shrink-0 mt-1" />
          <div>
            <MonoLabel className="text-signal">our placement promise</MonoLabel>
            <h2 className="font-display font-bold text-xl sm:text-2xl uppercase tracking-tight mt-2 leading-tight max-w-2xl">
              We never promise jobs. We surface proof.
            </h2>
            <p className="text-foreground/80 mt-3 max-w-2xl">
              BuildAI does not guarantee placements. What we build is a credible signal: Distinction
              students with mentor-validated portfolios and strong demo-day performance may be surfaced
              to hiring partners as the network grows.
            </p>
          </div>
        </div>
      </Section>

      {/* How hiring is based on proof */}
      <Section className="bg-ink text-paper-light ink-grid">
        <Eyebrow tone="signal">how it works</Eyebrow>
        <SectionHeading className="mt-5 max-w-[24ch]">Hiring signal, built from evidence.</SectionHeading>
        <div className="grid sm:grid-cols-3 gap-px bg-white/10 border border-white/10 mt-10">
          {[
            { icon: FolderGit2, t: "Portfolio proof", d: "Deployed products and repos reviewed throughout the cohort." },
            { icon: MessageSquare, t: "Mentor validation", d: "Verified, rubric-based feedback from working engineers." },
            { icon: Presentation, t: "Demo performance", d: "Live demo-day evaluation by a mentor panel." },
          ].map((f) => (
            <div key={f.t} className="bg-ink p-6">
              <f.icon className="size-5 text-signal" />
              <h3 className="font-display font-semibold text-lg uppercase tracking-tight mt-4 text-paper-light">{f.t}</h3>
              <p className="text-sm text-paper-light/60 mt-2">{f.d}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-8 border border-white/10 p-5">
          <CertStamp tier="Distinction" size="sm" />
          <p className="text-paper-light/70 text-sm max-w-2xl">
            Only <span className="text-signal font-medium">Distinction</span>-tier students — those who
            shipped consistently and excelled at demo day — are candidates to be surfaced. The tier is
            the filter; the portfolio is the proof.
          </p>
        </div>
      </Section>

      {/* Coming soon hiring partners */}
      <Section>
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-muted-foreground" />
          <MonoLabel className="text-muted-foreground">coming soon · phase 2</MonoLabel>
        </div>
        <SectionHeading className="mt-4">Hiring partner network.</SectionHeading>
        <p className="text-muted-foreground mt-4 max-w-2xl">
          We&apos;re building a network of teams who want to review verified, mentor-validated portfolios.
          We don&apos;t use fake logos — these slots open as real partners join.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="border border-dashed border-border bg-card aspect-[3/2] grid place-items-center">
              <div className="text-center">
                <StatusDot tone="muted" pulse={false} className="mx-auto" />
                <MonoLabel className="text-muted-foreground mt-2 block">partner slot</MonoLabel>
                <MonoLabel className="text-muted-foreground/60">{String(i + 1).padStart(2, "0")} · open</MonoLabel>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Tag tone="signal">Hiring partner? Reach out via the apply page.</Tag>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="bg-card border-y border-border">
        <Eyebrow>placements faq</Eyebrow>
        <SectionHeading className="mt-5">Straight answers.</SectionHeading>
        <div className="mt-8 max-w-3xl">
          <FaqAccordion items={FAQ.Placements} group="placements" />
        </div>
      </Section>

      <CTASection title="Want first access to the network?" subtitle="Run a pilot cohort or apply as a mentor — the hiring network grows from the cohort floor." />
    </>
  );
}
