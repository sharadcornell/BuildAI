"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowUpRight, Calendar, Rocket, MessageSquare, Trophy, Award,
  Building2, GraduationCap, Check,
} from "lucide-react";
import {
  Section, Eyebrow, SectionHeading, MonoLabel, StatusDot, Tag, CertStamp,
} from "./components/buildai/primitives";
import {
  CohortStatusCard, SprintCard, MentorNoteCard, DemoCountdownCard,
  BuildLogCard, CertProgressCard, CollegeReportCard,
} from "./components/buildai/cards";
import {
  CTASection, CompareTable,
} from "./components/buildai/shared";
import { PlatformViews } from "./components/buildai/PlatformViews";
import { WEEKS, MENTOR_NOTES, BUILD_LOG, CERT_TIERS, COHORT } from "./lib/data";

export default function Home() {
  return (
    <>
      {/* ---------- HERO: live command center ---------- */}
      <section className="relative bg-paper paper-grid overflow-hidden">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 pt-14 sm:pt-20 pb-16">
          <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-12 items-start">
            {/* left: message */}
            <div className="lg:pt-6">
              <div className="inline-flex items-center gap-2 border border-border bg-card px-3 py-1.5 rounded-sm">
                <StatusDot tone="mint" />
                <MonoLabel className="text-muted-foreground">
                  {COHORT.name} cohort · {COHORT.status.toLowerCase()} · demo day in {COHORT.demoDayInDays} days
                </MonoLabel>
              </div>

              <h1 className="font-display font-bold uppercase tracking-tight leading-[0.9] mt-6 text-[clamp(2.75rem,6.5vw,5.25rem)]">
                Build AI-native engineers who can <span className="text-signal">actually ship.</span>
              </h1>

              <p className="text-lg text-muted-foreground mt-6 max-w-xl leading-relaxed">
                A 13-week product-engineering apprenticeship where students build real AI products,
                get reviewed by working engineers, and give colleges visible outcome proof.
              </p>

              <div className="flex flex-wrap gap-3 mt-8">
                <Link
                  href="/colleges"
                  className="group inline-flex items-center gap-2 h-12 px-6 bg-signal text-paper-light font-medium rounded-sm hover:bg-ink transition-colors"
                >
                  Run a pilot cohort
                  <ArrowUpRight className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
                <Link
                  href="/students"
                  className="inline-flex items-center gap-2 h-12 px-6 border border-foreground/20 font-medium rounded-sm hover:border-foreground hover:bg-card transition-colors"
                >
                  Join the student waitlist
                </Link>
              </div>

              <div className="flex flex-wrap gap-x-8 gap-y-3 mt-10 pt-6 border-t border-border">
                {[
                  { v: "13", l: "weeks · 13 ship cycles" },
                  { v: "100%", l: "mentor-reviewed" },
                  { v: "1", l: "final demo day" },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="font-display font-bold text-2xl leading-none">{s.v}</div>
                    <MonoLabel className="text-muted-foreground mt-1 block">{s.l}</MonoLabel>
                  </div>
                ))}
              </div>
            </div>

            {/* right: asymmetric command-center composition */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-3">
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="col-span-2">
                  <CohortStatusCard />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
                  <DemoCountdownCard />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="grid place-items-center bg-card border border-border p-4">
                  <CertStamp tier="Distinction" size="md" />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} className="col-span-2">
                  <BuildLogCard entries={BUILD_LOG.slice(0, 4)} />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="col-span-2 sm:col-span-1">
                  <MentorNoteCard note={MENTOR_NOTES[0]} />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }} className="col-span-2 sm:col-span-1">
                  <CollegeReportCard />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- What's happening inside a cohort ---------- */}
      <Section className="bg-card border-y border-border">
        <Eyebrow>what is happening inside a buildai cohort?</Eyebrow>
        <SectionHeading className="mt-5 max-w-[18ch]">A live engineering floor, not a course.</SectionHeading>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-border border border-border mt-10">
          {[
            { icon: Calendar, t: "13 weeks", d: "Thirteen structured shipping cycles from workflow to capstone." },
            { icon: Rocket, t: "Weekly shipping", d: "Every week a real product output is deployed, not just learned." },
            { icon: MessageSquare, t: "Mentor reviews", d: "Working engineers leave structured, rubric-based feedback." },
            { icon: Trophy, t: "Demo day", d: "Final live demos evaluated by a panel of mentors." },
            { icon: Award, t: "Tiered certification", d: "Participated, Apprentice, Distinction — earned, not given." },
          ].map((f) => (
            <div key={f.t} className="bg-card p-5 group hover:bg-signal-soft transition-colors">
              <f.icon className="size-5 text-signal" />
              <h3 className="font-display font-semibold text-lg uppercase tracking-tight mt-4">{f.t}</h3>
              <p className="text-sm text-muted-foreground mt-2">{f.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------- Built for colleges and students ---------- */}
      <Section>
        <Eyebrow>built for colleges and students</Eyebrow>
        <SectionHeading className="mt-5">Two audiences. One shipping floor.</SectionHeading>
        <div className="grid lg:grid-cols-2 gap-5 mt-10">
          <SplitPanel
            icon={Building2}
            kicker="for colleges & tpos"
            title="Visible outcomes, minimal faculty lift"
            points={[
              "Live weekly progress across the whole cohort",
              "A real placement story backed by portfolio proof",
              "Mentor-reviewed projects — we run the operational floor",
              "A final outcome report for your decision-makers",
            ]}
            to="/colleges"
            cta="Explore for colleges"
          />
          <SplitPanel
            icon={GraduationCap}
            kicker="for engineering students"
            title="Real projects, real feedback, real proof"
            points={[
              "Build and deploy real AI products every single week",
              "Get reviewed by engineers who ship in production",
              "Learn the modern AI-native development workflow",
              "Graduate with a defensible portfolio, not a PDF",
            ]}
            to="/students"
            cta="Explore for students"
            accent
          />
        </div>
      </Section>

      {/* ---------- 13-week apprenticeship timeline ---------- */}
      <Section className="bg-ink text-paper-light ink-grid">
        <Eyebrow tone="signal">the 13-week apprenticeship</Eyebrow>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mt-5">
          <SectionHeading className="max-w-[16ch]">Week 1 to Week 13. One mission board.</SectionHeading>
          <Link href="/programme" className="inline-flex items-center gap-2 text-signal font-medium hover:gap-3 transition-all shrink-0">
            See the full curriculum <ArrowUpRight className="size-4" />
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-[repeat(13,minmax(0,1fr))] gap-2">
          {WEEKS.map((w) => (
            <Link
              key={w.n}
              href="/programme"
              className={`group relative border p-3 transition-colors ${
                w.status === "active"
                  ? "border-signal bg-signal/10"
                  : w.status === "shipped"
                  ? "border-white/15 bg-white/[0.03] hover:border-status-mint"
                  : "border-white/10 hover:border-white/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <MonoLabel className="text-paper-light/40">wk</MonoLabel>
                <StatusDot
                  tone={w.status === "active" ? "signal" : w.status === "shipped" ? "mint" : "muted"}
                  pulse={w.status === "active"}
                />
              </div>
              <div className="font-display font-bold text-2xl leading-none mt-1">{String(w.n).padStart(2, "0")}</div>
              <p className="text-[11px] text-paper-light/60 mt-2 leading-tight line-clamp-2 lg:min-h-[2.5em]">{w.title}</p>
            </Link>
          ))}
        </div>
      </Section>

      {/* ---------- Proof over certificates ---------- */}
      <Section>
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10 items-start">
          <div className="lg:sticky lg:top-24">
            <Eyebrow>proof over certificates</Eyebrow>
            <SectionHeading className="mt-5">Stop collecting certificates.</SectionHeading>
            <p className="text-muted-foreground mt-4 max-w-md">
              A passive course gives you a PDF. An apprenticeship under shipping pressure gives you
              evidence: deployed products, mentor feedback, demo recordings, and rubric scores.
            </p>
            <Tag tone="signal" className="mt-6">evidence &gt; attendance</Tag>
          </div>
          <CompareTable
            rows={[
              { left: "Watch recorded videos", right: "Build a real product every week" },
              { left: "Pass an auto-graded quiz", right: "Pass a working-engineer review" },
              { left: "Download a certificate", right: "Deploy to production & demo live" },
              { left: "No portfolio to show", right: "Portfolio of mentor-validated proof" },
              { left: "Learn in isolation", right: "Ship on a live cohort floor" },
            ]}
          />
        </div>
      </Section>

      {/* ---------- Platform preview ---------- */}
      <Section className="bg-card border-y border-border">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <Eyebrow>platform preview</Eyebrow>
            <SectionHeading className="mt-5 max-w-[20ch]">The operational layer, three ways.</SectionHeading>
          </div>
          <Link href="/platform" className="inline-flex items-center gap-2 text-signal font-medium hover:gap-3 transition-all shrink-0">
            Open the platform <ArrowUpRight className="size-4" />
          </Link>
        </div>
        <div className="mt-8">
          <PlatformViews compact />
        </div>
      </Section>

      {/* ---------- Certification tiers ---------- */}
      <Section>
        <Eyebrow>certification tiers</Eyebrow>
        <SectionHeading className="mt-5">Earned in three tiers.</SectionHeading>
        <div className="grid md:grid-cols-3 gap-5 mt-10">
          {CERT_TIERS.map((t, i) => (
            <div
              key={t.tier}
              className={`relative border p-6 flex flex-col ${
                t.tier === "Distinction" ? "border-signal bg-signal-soft" : "border-border bg-card"
              }`}
            >
              <div className="flex items-start justify-between">
                <MonoLabel className="text-muted-foreground">tier {String(i + 1).padStart(2, "0")}</MonoLabel>
                <CertStamp tier={t.tier} size="sm" />
              </div>
              <h3 className="font-display font-bold text-2xl uppercase tracking-tight mt-4">{t.tier}</h3>
              <MonoLabel className={t.tier === "Distinction" ? "text-signal mt-1" : "text-status-mint mt-1"}>
                {t.requirement}
              </MonoLabel>
              <p className="text-sm text-muted-foreground mt-4 flex-1">{t.detail}</p>
              <div className="flex items-center gap-2 mt-5 pt-4 border-t border-dashed border-border">
                <Check className="size-4 text-status-mint" />
                <MonoLabel className="text-muted-foreground">verifiable evidence trail</MonoLabel>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <CTASection />
    </>
  );
}

function SplitPanel({
  icon: Icon, kicker, title, points, to, cta, accent,
}: {
  icon: React.ElementType;
  kicker: string;
  title: string;
  points: string[];
  to: string;
  cta: string;
  accent?: boolean;
}) {
  return (
    <div className={`group border p-7 flex flex-col ${accent ? "bg-ink text-paper-light border-ink ink-grid" : "bg-card border-border"}`}>
      <div className={`grid place-items-center size-11 rounded-sm ${accent ? "bg-signal text-paper-light" : "bg-signal-soft text-signal"}`}>
        <Icon className="size-5" />
      </div>
      <MonoLabel className={`mt-5 ${accent ? "text-signal" : "text-muted-foreground"}`}>{kicker}</MonoLabel>
      <h3 className="font-display font-bold text-2xl uppercase tracking-tight mt-2 leading-tight">{title}</h3>
      <ul className="mt-5 space-y-3 flex-1">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-3 text-sm">
            <Check className={`size-4 shrink-0 mt-0.5 ${accent ? "text-status-mint" : "text-status-mint"}`} />
            <span className={accent ? "text-paper-light/85" : "text-foreground/85"}>{p}</span>
          </li>
        ))}
      </ul>
      <Link
        href={to}
        className={`inline-flex items-center justify-between gap-2 mt-7 h-11 px-5 font-medium rounded-sm transition-colors ${
          accent ? "bg-signal text-paper-light hover:bg-paper-light hover:text-ink" : "bg-ink text-paper-light hover:bg-signal"
        }`}
      >
        {cta} <ArrowUpRight className="size-4" />
      </Link>
    </div>
  );
}
