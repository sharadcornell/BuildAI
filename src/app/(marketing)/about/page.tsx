import type { Metadata } from "next";
import { Section, SectionHeader } from "@/components/site/Section";
import { OffsetCard } from "@/components/ui/OffsetCard";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <Section>
        <SectionHeader
          eyebrow="Why we exist"
          title="We make engineers who ship."
          intro="India graduates a vast number of engineers every year. AI-first startups still struggle to hire ones who can ship. BuildAI is the apprenticeship infrastructure that turns capable tier-2 students into engineers startups fight to hire."
        />
        <div className="grid gap-6 md:grid-cols-2">
          <OffsetCard>
            <h3 className="font-display text-2xl uppercase">The founder</h3>
            <p className="mt-3 text-sm text-brand-paper/80">
              BuildAI is founded by Sharad Agrawal — IIT Bombay (Masters), Cornell MBA, and
              currently founder of an AI-native company in the US. BuildAI brings that
              ship-or-die startup standard to India&apos;s classrooms.
            </p>
          </OffsetCard>
          <OffsetCard accent>
            <h3 className="font-display text-2xl uppercase">The principle</h3>
            <p className="mt-3 text-sm text-brand-paper/80">
              Earned, not granted. We don&apos;t sell certificates or guarantee jobs. We build a
              signal worth trusting — and we keep it scarce on purpose.
            </p>
          </OffsetCard>
        </div>
      </Section>
    </>
  );
}
