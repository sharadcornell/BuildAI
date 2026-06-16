import type { Metadata } from "next";
import { Section } from "@/components/site/Section";
import { SITE } from "@/content/site";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <Section className="bg-brand-paper text-brand-ink">
      <div className="prose-invert max-w-3xl">
        <h1 className="display text-4xl text-brand-ink">Privacy Policy</h1>
        <p className="mt-4 text-sm text-brand-ink/70">
          <strong>Draft — not a final legal document.</strong> This is a pre-launch placeholder and
          requires professional legal review before public launch, and specifically before we collect
          personal data at scale or enable query logging (India DPDP Act 2023). See
          docs/BuildAI_Website_Build_Brief.md §13.
        </p>
        <div className="mt-6 space-y-4 text-brand-ink/90">
          <p>
            <strong>What we collect.</strong> Information you submit through our forms (name,
            email, college, role) and, for enrolled apprentices, platform usage and the prompts
            and responses generated through BuildAI-issued API keys.
          </p>
          <p>
            <strong>Why.</strong> To run the apprenticeship, mentor students, evaluate work, and
            improve the programme.
          </p>
          <p>
            <strong>Your choices.</strong> Contact{" "}
            <a className="font-bold text-brand-red" href={`mailto:${SITE.email}`}>
              {SITE.email}
            </a>{" "}
            to access or delete your data.
          </p>
        </div>
      </div>
    </Section>
  );
}
