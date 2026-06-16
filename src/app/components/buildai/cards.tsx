"use client";

import * as React from "react";
import { motion } from "motion/react";
import {
  GitBranch, CheckCircle2, MessageSquare, Rocket, AlertTriangle,
  Terminal, Clock, ArrowUpRight, FileCheck2, CircleDot,
} from "lucide-react";
import { cn } from "../ui/utils";
import { MonoLabel, StatusDot, Tag, Panel, ProgressBar, CertStamp } from "./primitives";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import type { Week, MentorNote, Project, BuildLogEntry } from "../../lib/data";
import { COHORT } from "../../lib/data";

/* -------- Cohort status strip (top operational rail) -------- */
export function CohortStatusStrip({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full bg-ink text-paper-light ink-grid border-b border-white/10",
        className,
      )}
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="flex items-center gap-x-6 gap-y-1 py-2 overflow-x-auto no-scrollbar whitespace-nowrap text-paper-light/80">
          <span className="flex items-center gap-2">
            <StatusDot tone="mint" />
            <MonoLabel>{COHORT.name} cohort · {COHORT.status}</MonoLabel>
          </span>
          <span className="h-3 w-px bg-white/15" />
          <MonoLabel className="text-paper-light/60">
            {COHORT.weeks} weeks · {COHORT.mode}
          </MonoLabel>
          <span className="h-3 w-px bg-white/15" />
          <span className="flex items-center gap-2 text-signal">
            <StatusDot tone="signal" />
            <MonoLabel>Demo day in {COHORT.demoDayInDays} days</MonoLabel>
          </span>
        </div>
      </div>
    </div>
  );
}

/* -------- Live cohort status card -------- */
export function CohortStatusCard({ className }: { className?: string }) {
  const pct = Math.round((COHORT.currentWeek / COHORT.weeks) * 100);
  return (
    <Panel
      tone="ink"
      label={`cohort // ${COHORT.name.toLowerCase()}`}
      status={<StatusDot tone="mint" />}
      headerRight={<MonoLabel className="text-status-mint">LIVE</MonoLabel>}
      className={className}
    >
      <div className="p-4 space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <MonoLabel className="text-paper-light/50">current week</MonoLabel>
            <div className="font-display font-bold text-5xl leading-none mt-1">
              {COHORT.currentWeek}
              <span className="text-paper-light/30 text-2xl">/{COHORT.weeks}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-display font-bold text-3xl leading-none text-status-mint">{COHORT.shipping}</div>
            <MonoLabel className="text-paper-light/50">shipping</MonoLabel>
          </div>
        </div>
        <ProgressBar value={pct} tone="signal" />
        <div className="grid grid-cols-3 gap-3 pt-1">
          {[
            { v: COHORT.enrolled, l: "enrolled" },
            { v: `${COHORT.mentorCoverage}%`, l: "reviewed" },
            { v: COHORT.atRisk, l: "at-risk" },
          ].map((s) => (
            <div key={s.l} className="border-t border-white/10 pt-2">
              <div className="font-display font-bold text-xl leading-none">{s.v}</div>
              <MonoLabel className="text-paper-light/50">{s.l}</MonoLabel>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

/* -------- Weekly sprint card -------- */
export function SprintCard({
  week,
  expanded,
  onToggle,
  className,
}: {
  week: Week;
  expanded?: boolean;
  onToggle?: () => void;
  className?: string;
}) {
  const tone =
    week.status === "shipped"
      ? { dot: "mint" as const, tag: "mint" as const, label: "SHIPPED" }
      : week.status === "active"
      ? { dot: "signal" as const, tag: "signal" as const, label: "IN PROGRESS" }
      : { dot: "muted" as const, tag: "default" as const, label: "UPCOMING" };

  return (
    <motion.div
      layout
      className={cn(
        "group border bg-card transition-colors",
        week.status === "active" ? "border-signal/60 shadow-[0_2px_0_0_var(--signal)]" : "border-border hover:border-foreground/30",
        className,
      )}
    >
      <button
        onClick={onToggle}
        className="w-full text-left p-4 flex items-start gap-4"
      >
        <div className="shrink-0 text-center">
          <MonoLabel className="text-muted-foreground">wk</MonoLabel>
          <div className="font-display font-bold text-3xl leading-none">{String(week.n).padStart(2, "0")}</div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <StatusDot tone={tone.dot} pulse={week.status === "active"} />
            <MonoLabel className={cn(
              week.status === "shipped" ? "text-status-mint" : week.status === "active" ? "text-signal" : "text-muted-foreground",
            )}>{tone.label}</MonoLabel>
          </div>
          <h4 className="font-display font-semibold text-lg leading-tight uppercase tracking-tight">{week.title}</h4>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{week.focus}</p>
        </div>
        <ArrowUpRight className={cn("size-4 shrink-0 text-muted-foreground transition-transform", expanded && "rotate-90")} />
      </button>
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="px-4 pb-4 -mt-1"
        >
          <div className="border-t border-dashed border-border pt-3 grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <LogLine k="skill focus" v={week.focus} />
            <LogLine k="product output" v={week.output} />
            <LogLine k="mentor checkpoint" v={week.checkpoint} />
            <LogLine k="shipping artifact" v={week.artifact} icon />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function LogLine({ k, v, icon }: { k: string; v: string; icon?: boolean }) {
  return (
    <div>
      <MonoLabel className="text-muted-foreground flex items-center gap-1">
        {icon && <FileCheck2 className="size-3" />}{k}
      </MonoLabel>
      <p className="text-foreground/90 mt-0.5">{v}</p>
    </div>
  );
}

/* -------- Mentor review note card -------- */
const verdictMap = {
  approved: { tag: "mint" as const, label: "APPROVED", icon: CheckCircle2 },
  changes: { tag: "signal" as const, label: "CHANGES REQ", icon: AlertTriangle },
  review: { tag: "default" as const, label: "RE-REVIEW", icon: CircleDot },
};

export function MentorNoteCard({ note, className }: { note: MentorNote; className?: string }) {
  const v = verdictMap[note.verdict];
  const Icon = v.icon;
  return (
    <div className={cn("relative bg-card border border-border p-4", className)}>
      {/* pinned corner */}
      <span className="absolute -top-1.5 -right-1.5 size-3 rounded-full bg-signal shadow-sm ring-2 ring-card" />
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="size-8 rounded-full bg-ink text-paper-light grid place-items-center font-display font-bold text-sm shrink-0">
            {note.mentor.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="min-w-0">
            <div className="font-medium text-sm leading-tight truncate">{note.mentor}</div>
            <MonoLabel className="text-muted-foreground">{note.role}</MonoLabel>
          </div>
        </div>
        <Tag tone={v.tag} className="shrink-0 gap-1">
          <Icon className="size-3" /> {v.label}
        </Tag>
      </div>
      <p className="text-sm text-foreground/90 leading-relaxed border-l-2 border-signal/50 pl-3 italic">
        “{note.note}”
      </p>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-dashed border-border">
        <MonoLabel className="text-muted-foreground">re: {note.student} · wk{note.week}</MonoLabel>
        <MonoLabel className="text-muted-foreground flex items-center gap-1"><Clock className="size-3" />{note.time}</MonoLabel>
      </div>
    </div>
  );
}

/* -------- Student project evidence card -------- */
export function ProjectCard({ project, className }: { project: Project; className?: string }) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      className={cn("group bg-card border border-border overflow-hidden flex flex-col", className)}
    >
      <div className="relative aspect-[3/2] bg-muted overflow-hidden">
        <ImageWithFallback
          src={project.image}
          alt={project.title}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-1.5">
          {project.tags.slice(0, 2).map((t) => (
            <Tag key={t} tone="ink" className="backdrop-blur">{t}</Tag>
          ))}
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <MonoLabel className="text-paper-light/90">wk{project.week} · {project.college}</MonoLabel>
          <span className="flex items-center gap-1 text-paper-light">
            <span className="font-display font-bold text-lg leading-none">{project.rubric}</span>
            <MonoLabel className="text-paper-light/70">rubric</MonoLabel>
          </span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-display font-semibold text-lg uppercase tracking-tight leading-tight">{project.title}</h4>
          <Tag tone={project.tier === "Distinction" ? "signal" : "mint"}>{project.tier}</Tag>
        </div>
        <p className="text-sm text-muted-foreground mt-2 flex-1">{project.blurb}</p>
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-dashed border-border">
          <div className="size-6 rounded-full bg-secondary grid place-items-center font-display font-bold text-[10px]">
            {project.student.split(" ").map((n) => n[0]).join("")}
          </div>
          <MonoLabel className="text-muted-foreground">{project.student}</MonoLabel>
          <ArrowUpRight className="size-4 ml-auto text-muted-foreground group-hover:text-signal transition-colors" />
        </div>
      </div>
    </motion.article>
  );
}

/* -------- Demo day countdown -------- */
export function DemoCountdownCard({ days = COHORT.demoDayInDays, className }: { days?: number; className?: string }) {
  const blocks = [
    { v: String(days).padStart(2, "0"), l: "days" },
    { v: "14", l: "hrs" },
    { v: "32", l: "min" },
  ];
  return (
    <Panel tone="ink" label="demo day // countdown" status={<StatusDot tone="signal" />} className={className}>
      <div className="p-4">
        <div className="flex items-center gap-2">
          {blocks.map((b, i) => (
            <React.Fragment key={b.l}>
              <div className="text-center">
                <div className="font-display font-bold text-4xl leading-none text-signal tabular-nums">{b.v}</div>
                <MonoLabel className="text-paper-light/50">{b.l}</MonoLabel>
              </div>
              {i < blocks.length - 1 && <span className="font-display text-3xl text-paper-light/20 -mt-2">:</span>}
            </React.Fragment>
          ))}
        </div>
        <p className="text-sm text-paper-light/70 mt-3 border-t border-white/10 pt-3">
          Final demos to the mentor panel. {COHORT.shipping} builds in the pipeline.
        </p>
      </div>
    </Panel>
  );
}

/* -------- Build / shipping log -------- */
const logIcon = {
  ship: { Icon: Rocket, tone: "text-status-mint" },
  review: { Icon: MessageSquare, tone: "text-signal" },
  commit: { Icon: GitBranch, tone: "text-paper-light/60" },
  deploy: { Icon: Rocket, tone: "text-status-mint" },
  flag: { Icon: AlertTriangle, tone: "text-status-amber" },
};

export function BuildLogCard({ entries, className }: { entries: BuildLogEntry[]; className?: string }) {
  return (
    <Panel
      tone="ink"
      label="build log // live"
      status={<Terminal className="size-3.5 text-status-mint" />}
      headerRight={<StatusDot tone="mint" />}
      className={className}
    >
      <div className="p-3 font-mono text-xs space-y-1.5 ink-grid">
        {entries.map((e, i) => {
          const { Icon, tone } = logIcon[e.kind];
          return (
            <div key={i} className="flex items-start gap-2 py-0.5">
              <span className="text-paper-light/30 tabular-nums shrink-0">{e.time}</span>
              <Icon className={cn("size-3.5 shrink-0 mt-0.5", tone)} />
              <span className="text-signal/90 shrink-0">{e.who}</span>
              <span className="text-paper-light/70">{e.event}</span>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

/* -------- Certification progress stamp card -------- */
export function CertProgressCard({ className }: { className?: string }) {
  return (
    <Panel label="certification // track" className={className}>
      <div className="p-4 flex items-center gap-4">
        <CertStamp tier="Apprentice" size="md" />
        <div className="flex-1">
          <MonoLabel className="text-muted-foreground">current tier</MonoLabel>
          <div className="font-display font-bold text-2xl uppercase tracking-tight text-status-mint leading-none my-1">Apprentice</div>
          <p className="text-sm text-muted-foreground">5 of 7 review gates passed. 2 distinction criteria remaining.</p>
          <ProgressBar value={71} tone="mint" className="mt-2" />
        </div>
      </div>
    </Panel>
  );
}

/* -------- College outcome report preview -------- */
export function CollegeReportCard({ className }: { className?: string }) {
  const rows = [
    { l: "cohort completion", v: "85%", tone: "mint" as const },
    { l: "mentor review coverage", v: "96%", tone: "mint" as const },
    { l: "distinction tier", v: "12", tone: "signal" as const },
    { l: "at-risk students", v: "5", tone: "amber" as const },
  ];
  return (
    <Panel label="college // outcome report" status={<FileCheck2 className="size-3.5 text-muted-foreground" />} className={className}>
      <div className="p-4 space-y-2.5">
        {rows.map((r) => (
          <div key={r.l} className="flex items-center justify-between">
            <MonoLabel className="text-muted-foreground">{r.l}</MonoLabel>
            <span className={cn(
              "font-display font-bold text-lg leading-none",
              r.tone === "mint" ? "text-status-mint" : r.tone === "signal" ? "text-signal" : "text-status-amber",
            )}>{r.v}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
