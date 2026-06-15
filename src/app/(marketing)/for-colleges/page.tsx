import type { Metadata } from "next";
import { Section, SectionHeader } from "@/components/site/Section";
import { OffsetCard } from "@/components/ui/OffsetCard";
import { PilotInquiryForm } from "@/components/forms/PilotInquiryForm";

export const metadata: Metadata = { title: "For Colleges" };

export default function ForCollegesPage() {
  const steps = [
    ["1 · Intro call", "30 minutes with your TPO / HOD. We map BuildAI to your academic calendar."],
    ["2 · Pilot agreement", "Lock a cohort (min 30 students), pricing, and an integration model."],
    ["3 · Select students", "We help you identify the top 20–30% — the builders who'll thrive."],
    ["4 · Run cohort 01", "13 weeks, fully run by us. Your team gets weekly progress visibility."],
  ];
  return (
    <>
      <Section>
        <SectionHeader
          eyebrow="For colleges"
          title="Differentiate your placements. Keep your margin."
          intro="BuildAI plugs an industry-grade, AI-native apprenticeship into your existing programme — run end to end by working engineers. You add a credible outcome story; you keep a healthy per-student admin margin."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ["Done-for-you", "We run mentoring, reviews, demo days, and certification. Minimal load on your faculty."],
            ["Flexible integration", "Elective, credit-linked, summer/winter, or co-curricular — we fit your structure."],
            ["Visible outcomes", "Weekly progress dashboards and a public capstone showcase your students can point to."],
          ].map(([t, b]) => (
            <OffsetCard key={t}>
              <h3 className="font-display text-2xl uppercase">{t}</h3>
              <p className="mt-3 text-sm text-brand-paper/80">{b}</p>
            </OffsetCard>
          ))}
        </div>
      </Section>

      <Section className="bg-brand-paper text-brand-ink">
        <SectionHeader dark eyebrow="How to get started" title="Four steps to cohort 01." />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map(([t, b]) => (
            <OffsetCard key={t} className="bg-brand-ink">
              <h3 className="font-display text-xl uppercase">{t}</h3>
              <p className="mt-3 text-sm text-brand-paper/80">{b}</p>
            </OffsetCard>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="Run a pilot" title="Tell us about your college." intro="We're signing a small number of pilot colleges for Cohort 01. We reply within two working days." />
        <div className="max-w-3xl">
          <PilotInquiryForm />
        </div>
      </Section>
    </>
  );
}
