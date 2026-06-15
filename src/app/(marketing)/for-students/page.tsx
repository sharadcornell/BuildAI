import type { Metadata } from "next";
import { Section, SectionHeader } from "@/components/site/Section";
import { OffsetCard } from "@/components/ui/OffsetCard";
import { StudentWaitlistForm } from "@/components/forms/StudentWaitlistForm";

export const metadata: Metadata = { title: "For Students" };

export default function ForStudentsPage() {
  return (
    <>
      <Section>
        <SectionHeader
          eyebrow="For students"
          title="Graduate with proof you can ship."
          intro="13 weeks. Real products. Code reviewed by working engineers from AI startups. You leave with a portfolio that startups actually respect — and, if you make Distinction, a fast-track to interviews."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ["Ship from week one", "No passive lectures. You're building and deploying real software immediately."],
            ["Mentored by pros", "A working AI-startup engineer leads your pod of 8–12 and reviews your code weekly."],
            ["A portfolio that counts", "Public capstone, real PRs, real evals — the evidence that gets you hired."],
          ].map(([t, b]) => (
            <OffsetCard key={t}>
              <h3 className="font-display text-2xl uppercase">{t}</h3>
              <p className="mt-3 text-sm text-brand-paper/80">{b}</p>
            </OffsetCard>
          ))}
        </div>
      </Section>
      <Section className="bg-brand-paper text-brand-ink">
        <SectionHeader dark eyebrow="Join the waitlist" title="Be first when Cohort 01 opens at your college." />
        <div className="max-w-3xl">
          <StudentWaitlistForm />
        </div>
      </Section>
    </>
  );
}
