"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, Building2, GraduationCap, UserCheck } from "lucide-react";
import {
  Section, Eyebrow, SectionHeading, MonoLabel,
} from "../components/buildai/primitives";
import { PageHero, FaqAccordion } from "../components/buildai/shared";
import { FAQ } from "../lib/data";
import { cn } from "../components/ui/utils";

const GROUPS = Object.keys(FAQ);

export default function Apply() {
  const [group, setGroup] = useState<string>(GROUPS[0]);

  return (
    <>
      <PageHero
        index="08"
        kicker="faq · apply"
        title={<>Everything you need to decide.</>}
        intro="Answers grouped by who's asking — colleges, students, mentors, and the programme itself — plus three ways to get started."
      />

      {/* CTA cards */}
      <Section>
        <Eyebrow>get started</Eyebrow>
        <SectionHeading className="mt-5">Pick your path.</SectionHeading>
        <div className="grid md:grid-cols-3 gap-5 mt-10">
          <CtaCard
            icon={Building2}
            kicker="colleges & tpos"
            title="Run a pilot cohort"
            desc="Bring a live, mentor-reviewed apprenticeship to your campus and get an outcome report."
            to="/colleges"
            primary
          />
          <CtaCard
            icon={GraduationCap}
            kicker="engineering students"
            title="Join student waitlist"
            desc="Build real AI products, get mentor-reviewed, and graduate with portfolio proof."
            to="/students"
          />
          <CtaCard
            icon={UserCheck}
            kicker="working engineers"
            title="Apply as a mentor"
            desc="Review a small group of student builders and shape the next generation."
            to="/mentors"
          />
        </div>
      </Section>

      {/* Grouped FAQ */}
      <Section className="bg-card border-y border-border">
        <Eyebrow>frequently asked</Eyebrow>
        <SectionHeading className="mt-5">Questions, by audience.</SectionHeading>

        <div className="flex flex-wrap gap-2 mt-8">
          {GROUPS.map((g) => (
            <button
              key={g}
              onClick={() => setGroup(g)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-sm transition-colors font-display uppercase tracking-tight border",
                group === g
                  ? "bg-signal text-paper-light border-signal"
                  : "bg-card text-muted-foreground border-border hover:border-foreground/40 hover:text-foreground",
              )}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="mt-6 max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={group}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <FaqAccordion items={FAQ[group]} group={group.toLowerCase()} />
            </motion.div>
          </AnimatePresence>
        </div>
      </Section>

      {/* Final reassurance strip */}
      <Section className="bg-ink text-paper-light ink-grid text-center">
        <Eyebrow tone="signal" className="justify-center">still deciding?</Eyebrow>
        <SectionHeading className="mt-5 mx-auto max-w-[20ch]">Proof beats promises. Always.</SectionHeading>
        <p className="text-paper-light/70 mt-4 max-w-xl mx-auto">
          BuildAI is a live, mentor-reviewed AI engineering apprenticeship. No job guarantees, no fake
          logos, no hype — just students shipping real products on a real cohort floor.
        </p>
        <div className="flex flex-wrap gap-3 justify-center mt-8">
          <Link href="/programme" className="inline-flex items-center gap-2 h-12 px-6 bg-signal text-paper-light font-medium rounded-sm hover:bg-paper-light hover:text-ink transition-colors">
            See the curriculum <ArrowUpRight className="size-4" />
          </Link>
          <Link href="/platform" className="inline-flex items-center gap-2 h-12 px-6 border border-white/20 font-medium rounded-sm hover:border-white transition-colors">
            Explore the platform
          </Link>
        </div>
      </Section>
    </>
  );
}

function CtaCard({
  icon: Icon, kicker, title, desc, to, primary,
}: {
  icon: React.ElementType;
  kicker: string;
  title: string;
  desc: string;
  to: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={to}
      className={cn(
        "group border p-6 flex flex-col transition-colors",
        primary ? "bg-ink text-paper-light border-ink ink-grid hover:border-signal" : "bg-card border-border hover:border-signal",
      )}
    >
      <div className={cn("grid place-items-center size-11 rounded-sm", primary ? "bg-signal text-paper-light" : "bg-signal-soft text-signal")}>
        <Icon className="size-5" />
      </div>
      <MonoLabel className={cn("mt-5", primary ? "text-signal" : "text-muted-foreground")}>{kicker}</MonoLabel>
      <h3 className="font-display font-bold text-2xl uppercase tracking-tight mt-2 leading-tight">{title}</h3>
      <p className={cn("text-sm mt-3 flex-1", primary ? "text-paper-light/70" : "text-muted-foreground")}>{desc}</p>
      <span className="inline-flex items-center gap-2 mt-6 font-medium text-signal group-hover:gap-3 transition-all">
        Get started <ArrowUpRight className="size-4" />
      </span>
    </Link>
  );
}
