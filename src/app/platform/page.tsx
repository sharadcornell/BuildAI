import { Section, Eyebrow, SectionHeading, MonoLabel, StatusDot } from "../components/buildai/primitives";
import { PageHero, CTASection } from "../components/buildai/shared";
import { PlatformViews } from "../components/buildai/PlatformViews";

export default function Platform() {
  return (
    <>
      <PageHero
        index="06"
        kicker="the platform"
        title={<>The operational layer behind the apprenticeship.</>}
        intro="One system, three lenses. Students track their build, mentors run their review queue, and colleges watch the whole cohort — all from realistic, illustrative data."
        meta={[
          { value: "3", label: "role-based views" },
          { value: "Live", label: "cohort data" },
          { value: "0", label: "real APIs (prototype)" },
        ]}
      />

      <Section>
        <div className="flex items-center gap-2">
          <StatusDot tone="mint" />
          <MonoLabel className="text-muted-foreground">interactive · switch views below · mock data only</MonoLabel>
        </div>
        <SectionHeading className="mt-4 max-w-[22ch]">Switch between Student, Mentor & College.</SectionHeading>
        <div className="mt-8">
          <PlatformViews />
        </div>
      </Section>

      <Section className="bg-card border-y border-border">
        <Eyebrow>why one platform</Eyebrow>
        <SectionHeading className="mt-5 max-w-[24ch]">Everyone sees the same shipping floor.</SectionHeading>
        <div className="grid sm:grid-cols-3 gap-px bg-border border border-border mt-10">
          {[
            { t: "Student view", d: "Weekly tasks, build log, mentor feedback, AI usage, and certification progress in one place." },
            { t: "Mentor view", d: "A review queue, assigned students, feedback cards, rubric scoring, and demo readiness." },
            { t: "College view", d: "Cohort analytics, progress distribution, at-risk flags, top projects, and the demo-day report." },
          ].map((c) => (
            <div key={c.t} className="bg-card p-6">
              <h3 className="font-display font-semibold text-lg uppercase tracking-tight">{c.t}</h3>
              <p className="text-sm text-muted-foreground mt-2">{c.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <CTASection title="See it run with your cohort." subtitle="Run a pilot and give every role on your campus the view they need." />
    </>
  );
}
