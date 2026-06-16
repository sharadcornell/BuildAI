"use client";

import { useState } from "react";
import { Github, Globe, MessageSquare, Video, Gauge, Flag } from "lucide-react";
import {
  Section, Eyebrow, SectionHeading, MonoLabel, Tag, StatusDot,
} from "../components/buildai/primitives";
import { SprintCard } from "../components/buildai/cards";
import { PageHero, CTASection, ToolsRow } from "../components/buildai/shared";
import { WEEKS, TOOLS } from "../lib/data";

export default function Programme() {
  const [open, setOpen] = useState<number | null>(7);

  return (
    <>
      <PageHero
        index="02"
        kicker="programme · curriculum"
        title={<>13 weeks. 13 shipping cycles. One final demo.</>}
        intro="A mission board, not a syllabus. Every week pairs a skill focus with a real product output, a mentor checkpoint, and a shipping artifact you can show."
        meta={[
          { value: "13", label: "weeks" },
          { value: "13", label: "ship cycles" },
          { value: "1", label: "demo day" },
          { value: "9", label: "core tools" },
        ]}
      />

      {/* Interactive timeline */}
      <Section>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <Eyebrow>curriculum timeline</Eyebrow>
            <SectionHeading className="mt-5 max-w-[20ch]">Click any week to open the build brief.</SectionHeading>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><StatusDot tone="mint" pulse={false} /><MonoLabel className="text-muted-foreground">shipped</MonoLabel></span>
            <span className="flex items-center gap-1.5"><StatusDot tone="signal" pulse={false} /><MonoLabel className="text-muted-foreground">active</MonoLabel></span>
            <span className="flex items-center gap-1.5"><StatusDot tone="muted" pulse={false} /><MonoLabel className="text-muted-foreground">upcoming</MonoLabel></span>
          </div>
        </div>

        <div className="grid gap-2.5 mt-10">
          {WEEKS.map((w) => (
            <SprintCard
              key={w.n}
              week={w}
              expanded={open === w.n}
              onToggle={() => setOpen(open === w.n ? null : w.n)}
            />
          ))}
        </div>
      </Section>

      {/* Build artifacts */}
      <Section className="bg-ink text-paper-light ink-grid">
        <Eyebrow tone="signal">build artifacts</Eyebrow>
        <SectionHeading className="mt-5 max-w-[24ch]">Every cycle produces evidence.</SectionHeading>
        <p className="text-paper-light/70 max-w-2xl mt-4">
          By demo day, each student has a portfolio of artifacts — not notes. This is what colleges,
          mentors, and future hiring partners actually review.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-white/10 border border-white/10 mt-10">
          {[
            { icon: Github, t: "GitHub repo", d: "Versioned source for every build." },
            { icon: Globe, t: "Deployed app", d: "A live URL, in production." },
            { icon: MessageSquare, t: "Mentor feedback", d: "Structured review notes." },
            { icon: Video, t: "Demo video", d: "Recorded walkthrough." },
            { icon: Gauge, t: "Rubric score", d: "Scored against 5 criteria." },
          ].map((a) => (
            <div key={a.t} className="bg-ink p-5 group hover:bg-white/[0.04] transition-colors">
              <a.icon className="size-5 text-signal" />
              <h3 className="font-display font-semibold text-lg uppercase tracking-tight mt-4 text-paper-light">{a.t}</h3>
              <p className="text-sm text-paper-light/60 mt-2">{a.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Tools */}
      <Section>
        <Eyebrow>the ai-native stack</Eyebrow>
        <SectionHeading className="mt-5 max-w-[22ch]">Tools they&apos;ll use like working engineers.</SectionHeading>
        <p className="text-muted-foreground mt-4 max-w-2xl">
          Students don&apos;t just read about the modern stack — they build with it under shipping pressure,
          from first commit to final demo.
        </p>
        <div className="mt-8">
          <ToolsRow tools={TOOLS} />
        </div>
      </Section>

      {/* Capstone / demo day */}
      <Section className="bg-card border-y border-border">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-10 items-center">
          <div>
            <Eyebrow tone="signal">capstone · demo day</Eyebrow>
            <SectionHeading className="mt-5">The final two weeks change everything.</SectionHeading>
            <p className="text-muted-foreground mt-4 max-w-lg">
              Weeks 11–13 compress into a capstone build sprint, demo preparation, and a live demo day
              evaluated by a mentor panel. This is where Distinction is earned.
            </p>
            <div className="flex flex-wrap gap-2 mt-6">
              <Tag tone="signal">Capstone sprint</Tag>
              <Tag tone="default">Demo rehearsal</Tag>
              <Tag tone="mint">Panel evaluation</Tag>
              <Tag tone="ink">Certification</Tag>
            </div>
          </div>
          <div className="border border-border bg-ink text-paper-light ink-grid p-6">
            <div className="flex items-center gap-2">
              <Flag className="size-4 text-signal" />
              <MonoLabel className="text-signal">demo day // run sheet</MonoLabel>
            </div>
            <div className="mt-5 space-y-3">
              {[
                { w: "Week 11", t: "Capstone build sprint", d: "Feature-complete candidate" },
                { w: "Week 12", t: "Demo preparation", d: "Narrative + recorded walkthrough" },
                { w: "Week 13", t: "Demo day & certification", d: "Live panel + final rubric" },
              ].map((r) => (
                <div key={r.w} className="flex items-start gap-4 border-l-2 border-signal/40 pl-4 py-1">
                  <MonoLabel className="text-paper-light/50 w-16 shrink-0 mt-1">{r.w}</MonoLabel>
                  <div>
                    <div className="font-display font-semibold uppercase tracking-tight">{r.t}</div>
                    <p className="text-sm text-paper-light/60">{r.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <CTASection title="Bring this curriculum to your campus." subtitle="Run a pilot cohort next term and give your students 13 shipping cycles of real proof." />
    </>
  );
}
