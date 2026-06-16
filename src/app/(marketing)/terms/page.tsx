import type { Metadata } from "next";
import { Section } from "@/components/site/Section";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <Section className="bg-brand-paper text-brand-ink">
      <div className="max-w-3xl">
        <h1 className="display text-4xl text-brand-ink">Terms of Service</h1>
        <p className="mt-4 text-sm text-brand-ink/70">
          <strong>Draft — not a final legal document.</strong> This is a pre-launch placeholder and
          requires professional legal review before public launch.
        </p>
        <div className="mt-6 space-y-4 text-brand-ink/90">
          <p>
            BuildAI provides an applied engineering apprenticeship. We do not guarantee
            employment. Certification tiers are awarded on the basis of evaluated, shipped work.
          </p>
          <p>
            API keys issued through the BuildAI platform are for apprenticeship use only and are
            subject to usage budgets and fair-use limits. Misuse may result in revocation.
          </p>
        </div>
      </div>
    </Section>
  );
}
