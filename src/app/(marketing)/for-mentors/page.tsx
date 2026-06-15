import type { Metadata } from "next";
import { Section, SectionHeader } from "@/components/site/Section";
import { OffsetCard } from "@/components/ui/OffsetCard";
import { MentorApplicationForm } from "@/components/forms/MentorApplicationForm";

export const metadata: Metadata = { title: "For Mentors" };

export default function ForMentorsPage() {
  return (
    <>
      <Section>
        <SectionHeader
          eyebrow="For mentors"
          title="Mentor the engineers you'll want to hire."
          intro="Lead a pod of 8–12 students for one cohort. 4–6 hours a week. Get paid, get recognized, and get first look at India's most promising builders before anyone else."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ["Real comp", "Paid per cohort for ~4–6 hrs/week of focused mentoring and review."],
            ["Recognition", "Public mentor profile and recognition tiers across cohorts."],
            ["Hiring access", "First look at Distinction-tier apprentices for your own team or network."],
          ].map(([t, b]) => (
            <OffsetCard key={t}>
              <h3 className="font-display text-2xl uppercase">{t}</h3>
              <p className="mt-3 text-sm text-brand-paper/80">{b}</p>
            </OffsetCard>
          ))}
        </div>
      </Section>
      <Section className="bg-brand-paper text-brand-ink">
        <SectionHeader dark eyebrow="Apply to mentor" title="Tell us about yourself." />
        <div className="max-w-3xl">
          <MentorApplicationForm />
        </div>
      </Section>
    </>
  );
}
