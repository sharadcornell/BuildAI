import type { Metadata } from "next";
import { Section, SectionHeader } from "@/components/site/Section";
import { PilotInquiryForm } from "@/components/forms/PilotInquiryForm";
import { SITE } from "@/content/site";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <Section>
      <SectionHeader
        eyebrow="Contact"
        title="Let's talk."
        intro="Running placements or a CS/IT department? Want to mentor, or partner with us? Use the form, or email us directly."
      />
      <p className="mb-8">
        <a href={`mailto:${SITE.email}`} className="font-display text-2xl uppercase text-brand-yellow hover:underline">
          {SITE.email} →
        </a>
      </p>
      <div className="max-w-3xl">
        <PilotInquiryForm />
      </div>
    </Section>
  );
}
