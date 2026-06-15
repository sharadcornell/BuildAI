import { Hero } from "@/components/home/Hero";
import { Section, SectionHeader } from "@/components/site/Section";
import { TiltCard } from "@/components/ui/TiltCard";
import { OffsetCard } from "@/components/ui/OffsetCard";
import { Button } from "@/components/ui/Button";
import { MODULES, TIERS, STATS } from "@/content/site";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* The gap */}
      <Section id="goal" className="bg-brand-paper text-brand-ink">
        <SectionHeader
          dark
          eyebrow="The gap"
          title="Colleges teach AI. Startups need engineers who ship it."
          intro="Tier-2 engineering students graduate fluent in theory and certificates — and unprepared for the one thing AI-first startups actually hire for: shipping real products, fast, with judgment. BuildAI closes that gap with an apprenticeship, not another course."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ["Not a course", "No passive video lectures. You build, review, and ship every single week."],
            ["Not a bootcamp", "No toy projects. Real products, real users, real code review from working engineers."],
            ["Not a certificate mill", "Distinction is earned, not granted — and it's tied to actual shipped work."],
          ].map(([t, b]) => (
            <OffsetCard key={t} className="bg-brand-ink">
              <h3 className="font-display text-2xl uppercase">{t}</h3>
              <p className="mt-3 text-sm text-brand-paper/80">{b}</p>
            </OffsetCard>
          ))}
        </div>
      </Section>

      {/* Stats / how a week works */}
      <Section>
        <SectionHeader
          eyebrow="The shape of it"
          title="13 weeks. Async weekdays. Live Saturdays."
          intro="Students commit 15–20 hours a week inside pods of 8–12, each led by a working engineer. Bi-weekly demo days, weekly code reviews, and a weekly reading group keep the whole cohort shipping."
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

      {/* Curriculum teaser */}
      <Section className="bg-brand-paper text-brand-ink">
        <SectionHeader
          dark
          eyebrow="Curriculum"
          title="Six modules. One throughline: ship."
          intro="From an AI-native operating system in week one to a publicly launched capstone reviewed by external AI-startup engineers."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((m) => (
            <TiltCard key={m.id}>
              <div className="flex items-baseline justify-between">
                <span className="font-display text-3xl text-brand-yellow">{m.id}</span>
                <span className="text-[11px] uppercase tracking-wide text-brand-paper/50">
                  {m.weeks}
                </span>
              </div>
              <h3 className="mt-3 font-display text-xl uppercase leading-tight">{m.title}</h3>
              <p className="mt-2 text-sm text-brand-paper/80">{m.body}</p>
            </TiltCard>
          ))}
        </div>
        <div className="mt-10">
          <Button href="/curriculum" variant="dark">
            See the full curriculum
          </Button>
        </div>
      </Section>

      {/* Certification teaser */}
      <Section>
        <SectionHeader
          eyebrow="Certification"
          title="Three tiers. No job guarantee — by design."
          intro="Every apprentice is graded on shipped work across seven rubric dimensions. The top tier is fast-tracked to startup interviews. Scarcity is the point: it's what makes the signal worth trusting."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {TIERS.map((t, i) => (
            <OffsetCard key={t.name} accent={i === 2}>
              <div className="font-display text-4xl text-brand-yellow">{t.share}</div>
              <h3 className="mt-2 font-display text-2xl uppercase">{t.name}</h3>
              <p className="mt-3 text-sm text-brand-paper/80">{t.body}</p>
            </OffsetCard>
          ))}
        </div>
      </Section>

      {/* Three-sided */}
      <Section className="bg-brand-paper text-brand-ink">
        <SectionHeader dark eyebrow="Three doors in" title="Built for colleges, students, and the engineers who mentor them." />
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ["Colleges", "Run a pilot. Differentiate your placements. Keep a healthy admin margin.", "/for-colleges", "Run a pilot"],
            ["Students", "Join the waitlist. Ship a portfolio that startups actually respect.", "/for-students", "Join the waitlist"],
            ["Mentors", "Mentor a pod. Get paid, get recognized, get first look at top talent.", "/for-mentors", "Become a mentor"],
          ].map(([t, b, href, cta]) => (
            <OffsetCard key={t} className="bg-brand-ink">
              <h3 className="font-display text-2xl uppercase">{t}</h3>
              <p className="mt-3 text-sm text-brand-paper/80">{b}</p>
              <div className="mt-5">
                <Button href={href as string}>{cta as string}</Button>
              </div>
            </OffsetCard>
          ))}
        </div>
      </Section>

      {/* Final CTA */}
      <Section className="bg-brand-ink">
        <div className="text-center">
          <h2 className="display mx-auto max-w-4xl text-5xl text-brand-paper sm:text-6xl">
            Run cohort 01 at your college.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-brand-paper/80">
            We&apos;re signing a small number of pilot colleges for the first cohort. If you run
            placements or a CS/IT department, let&apos;s talk.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button href="/for-colleges">Run a Pilot</Button>
            <Button href="/contact" variant="outline">
              Talk to us
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
