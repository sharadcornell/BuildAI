import type { Metadata } from "next";
import { Section, SectionHeader } from "@/components/site/Section";
import { OffsetCard } from "@/components/ui/OffsetCard";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Partners" };

// NOTE: Do not list institutions as "clients" until a pilot is actually signed.
// Populate PARTNERS once real partnerships exist. See docs/BuildAI_Website_Build_Brief.md §13.
const PARTNERS: { name: string }[] = [];

const MENTOR_ORIGINS = [
  "Anthropic",
  "OpenAI",
  "Sarvam",
  "CoRover",
  "Razorpay",
  "CRED",
  "Zomato",
  "YC-backed AI startups",
];

export default function PartnersPage() {
  return (
    <>
      <Section>
        <SectionHeader
          eyebrow="Mentors & partners"
          title="Mentored by engineers who actually ship."
          intro="Our mentor bench is drawn from the teams building AI in production. (Recruiting in progress for Cohort 01.)"
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {MENTOR_ORIGINS.map((m) => (
            <div key={m} className="flex items-center justify-center border-2 border-brand-ink bg-brand-ink p-6 text-center font-bold uppercase tracking-wide text-brand-paper shadow-offset">
              {m}
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-brand-paper text-brand-ink">
        <SectionHeader dark eyebrow="Partner colleges" title="Built for India's tier-2 engineering colleges." />
        {PARTNERS.length === 0 ? (
          <OffsetCard className="bg-brand-ink">
            <h3 className="font-display text-2xl uppercase">Cohort 01 — pilot colleges forming now</h3>
            <p className="mt-3 max-w-2xl text-sm text-brand-paper/80">
              We&apos;re signing a small number of pilot colleges for the first cohort. Partner
              logos will appear here as pilots go live. Want your college to be one of the first?
            </p>
            <div className="mt-5">
              <Button href="/for-colleges">Run a pilot</Button>
            </div>
          </OffsetCard>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {PARTNERS.map((p) => (
              <div key={p.name} className="flex items-center justify-center border-2 border-brand-ink p-6 text-center font-bold uppercase">
                {p.name}
              </div>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
