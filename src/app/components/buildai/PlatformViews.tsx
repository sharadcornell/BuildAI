"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ListChecks, GitBranch, MessageSquare, Award, Gauge,
  Inbox, Users, ClipboardCheck, TrendingUp, AlertTriangle, Trophy,
} from "lucide-react";
import { cn } from "../ui/utils";
import { MonoLabel, StatusDot, Tag, ProgressBar, Panel } from "./primitives";
import { MentorNoteCard } from "./cards";
import { MENTOR_NOTES, PROJECTS } from "../../lib/data";

type View = "Student" | "Mentor" | "College";
const VIEWS: View[] = ["Student", "Mentor", "College"];

export function PlatformViews({ compact = false }: { compact?: boolean }) {
  const [view, setView] = useState<View>("Student");

  return (
    <div>
      {/* tab rail */}
      <div className="inline-flex p-1 bg-ink rounded-sm gap-1">
        {VIEWS.map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={cn(
              "relative px-4 py-2 text-sm font-medium rounded-sm transition-colors font-display uppercase tracking-tight",
              view === v ? "text-paper-light" : "text-paper-light/50 hover:text-paper-light/80",
            )}
          >
            {view === v && (
              <motion.span
                layoutId={compact ? "tab-pill-compact" : "tab-pill"}
                className="absolute inset-0 bg-signal rounded-sm"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative z-10">{v} View</span>
          </button>
        ))}
      </div>

      <div className="mt-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {view === "Student" && <StudentView compact={compact} />}
            {view === "Mentor" && <MentorView compact={compact} />}
            {view === "College" && <CollegeView compact={compact} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ----------------- Student View ----------------- */
function StudentView({ compact }: { compact?: boolean }) {
  const tasks = [
    { t: "Ingest corpus & build embedding index", done: true },
    { t: "Wire retrieval into chat endpoint", done: true },
    { t: "Add confidence gate for ungrounded answers", done: false },
    { t: "Run eval set & log retrieval accuracy", done: false },
  ];
  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <Panel label="this week // wk07" status={<StatusDot tone="signal" />} className="lg:col-span-2">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <MonoLabel className="text-muted-foreground">building</MonoLabel>
              <h4 className="font-display font-semibold text-xl uppercase tracking-tight">RAG Knowledge Bot</h4>
            </div>
            <Tag tone="signal">RAG · Embeddings</Tag>
          </div>
          <div className="mt-4 space-y-2">
            {tasks.map((task) => (
              <div key={task.t} className="flex items-center gap-3 text-sm">
                <span className={cn(
                  "grid place-items-center size-5 rounded-sm border shrink-0",
                  task.done ? "bg-status-mint border-status-mint text-white" : "border-border",
                )}>
                  {task.done && <ListChecks className="size-3" />}
                </span>
                <span className={cn(task.done && "text-muted-foreground line-through")}>{task.t}</span>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      <Panel tone="ink" label="ai usage // budget" status={<Gauge className="size-3.5 text-status-mint" />}>
        <div className="p-4 space-y-3">
          <div>
            <div className="flex justify-between items-baseline">
              <MonoLabel className="text-paper-light/50">tokens used</MonoLabel>
              <span className="font-display font-bold text-lg">62%</span>
            </div>
            <ProgressBar value={62} tone="signal" className="mt-1.5" />
          </div>
          <div className="border-t border-white/10 pt-3 grid grid-cols-2 gap-3">
            <div><div className="font-display font-bold text-xl text-status-mint">3</div><MonoLabel className="text-paper-light/50">deploys</MonoLabel></div>
            <div><div className="font-display font-bold text-xl">14</div><MonoLabel className="text-paper-light/50">commits wk</MonoLabel></div>
          </div>
        </div>
      </Panel>

      {!compact && (
        <>
          <Panel label="mentor feedback // latest" status={<MessageSquare className="size-3.5 text-signal" />} className="lg:col-span-2">
            <div className="p-4">
              <MentorNoteCard note={MENTOR_NOTES[0]} className="border-0 p-0" />
            </div>
          </Panel>
          <Panel label="build log // mine" status={<GitBranch className="size-3.5 text-muted-foreground" />}>
            <div className="p-3 font-mono text-xs space-y-1.5">
              {["09:41 deploy v0.7 → prod", "08:12 fix chunk overlap", "yesterday +9 commits", "wk06 shipped ✓"].map((l) => (
                <div key={l} className="text-muted-foreground">{l}</div>
              ))}
            </div>
          </Panel>
        </>
      )}

      <Panel label="certification // progress" status={<Award className="size-3.5 text-status-mint" />} className={compact ? "lg:col-span-1" : "lg:col-span-3"}>
        <div className="p-4 flex items-center gap-4">
          <MonoLabel className="text-muted-foreground shrink-0">Apprentice tier</MonoLabel>
          <ProgressBar value={71} tone="mint" />
          <MonoLabel className="text-status-mint shrink-0">5/7 gates</MonoLabel>
        </div>
      </Panel>
    </div>
  );
}

/* ----------------- Mentor View ----------------- */
function MentorView({ compact }: { compact?: boolean }) {
  const queue = [
    { s: "Aditya Rao", p: "RAG Knowledge Bot", wk: 7, status: "pending" },
    { s: "Priya Nair", p: "Healthcare Intake", wk: 7, status: "pending" },
    { s: "Sneha Kulkarni", p: "Placement Dashboard", wk: 7, status: "done" },
  ];
  const rubric = [
    { k: "Scope", v: 4 }, { k: "Correctness", v: 5 },
    { k: "Reliability", v: 3 }, { k: "Product sense", v: 4 }, { k: "Craft", v: 4 },
  ];
  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <Panel label="review queue // 2 pending" status={<Inbox className="size-3.5 text-signal" />} className="lg:col-span-2">
        <div className="divide-y divide-border">
          {queue.map((q) => (
            <div key={q.s} className="p-4 flex items-center gap-3">
              <div className="size-9 rounded-full bg-ink text-paper-light grid place-items-center font-display font-bold text-sm shrink-0">
                {q.s.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{q.s}</div>
                <MonoLabel className="text-muted-foreground">{q.p} · wk{q.wk}</MonoLabel>
              </div>
              <Tag tone={q.status === "done" ? "mint" : "signal"}>
                {q.status === "done" ? "reviewed" : "review now"}
              </Tag>
            </div>
          ))}
        </div>
      </Panel>

      <Panel tone="ink" label="rubric // aditya rao" status={<ClipboardCheck className="size-3.5 text-status-mint" />}>
        <div className="p-4 space-y-2.5">
          {rubric.map((r) => (
            <div key={r.k} className="flex items-center gap-3">
              <MonoLabel className="text-paper-light/60 w-24 shrink-0">{r.k}</MonoLabel>
              <div className="flex gap-1 flex-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <span key={n} className={cn("h-2 flex-1 rounded-sm", n <= r.v ? "bg-status-mint" : "bg-white/10")} />
                ))}
              </div>
              <span className="font-display font-bold text-sm w-6 text-right">{r.v}.0</span>
            </div>
          ))}
        </div>
      </Panel>

      {!compact && (
        <Panel label="assigned students // 6" status={<Users className="size-3.5 text-muted-foreground" />} className="lg:col-span-2">
          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {["Aditya R", "Priya N", "Sneha K", "Irfan M", "Neha S", "Karthik V"].map((s) => (
              <div key={s} className="border border-border p-3">
                <div className="font-medium text-sm">{s}</div>
                <ProgressBar value={50 + ((s.length * 13) % 45)} tone="signal" className="mt-2" />
              </div>
            ))}
          </div>
        </Panel>
      )}

      <Panel label="demo readiness" status={<StatusDot tone="signal" />} className={compact ? "" : "lg:col-span-1"}>
        <div className="p-4">
          <div className="font-display font-bold text-3xl text-signal leading-none">68%</div>
          <MonoLabel className="text-muted-foreground">cohort demo-ready</MonoLabel>
          <ProgressBar value={68} tone="signal" className="mt-3" />
        </div>
      </Panel>
    </div>
  );
}

/* ----------------- College View ----------------- */
function CollegeView({ compact }: { compact?: boolean }) {
  const dist = [
    { tier: "Distinction", n: 12, tone: "bg-signal" },
    { tier: "Apprentice", n: 24, tone: "bg-status-mint" },
    { tier: "Participated", n: 5, tone: "bg-muted-foreground" },
  ];
  const total = dist.reduce((a, b) => a + b.n, 0);
  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <Panel tone="ink" label="cohort analytics // spring 26" status={<TrendingUp className="size-3.5 text-status-mint" />} className="lg:col-span-2">
        <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { v: "85%", l: "completion", t: "text-status-mint" },
            { v: "96%", l: "review coverage", t: "text-status-mint" },
            { v: "41", l: "shipping", t: "text-paper-light" },
            { v: "12", l: "distinction", t: "text-signal" },
          ].map((s) => (
            <div key={s.l} className="border-l-2 border-white/10 pl-3">
              <div className={cn("font-display font-bold text-2xl leading-none", s.t)}>{s.v}</div>
              <MonoLabel className="text-paper-light/50 mt-1 block">{s.l}</MonoLabel>
            </div>
          ))}
        </div>
      </Panel>

      <Panel label="certification // distribution" status={<Trophy className="size-3.5 text-signal" />}>
        <div className="p-4 space-y-3">
          {dist.map((d) => (
            <div key={d.tier}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{d.tier}</span>
                <MonoLabel className="text-muted-foreground">{d.n}</MonoLabel>
              </div>
              <div className="h-2 bg-foreground/10 rounded-sm overflow-hidden">
                <div className={cn("h-full rounded-sm", d.tone)} style={{ width: `${(d.n / total) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {!compact && (
        <>
          <Panel label="at-risk students // 5" status={<AlertTriangle className="size-3.5 text-status-amber" />}>
            <div className="divide-y divide-border">
              {[
                { s: "Rahul M", r: "missed wk6 ship" },
                { s: "Divya P", r: "2 reviews overdue" },
                { s: "Arjun T", r: "below shipping pace" },
              ].map((a) => (
                <div key={a.s} className="p-3 flex items-center justify-between">
                  <span className="text-sm font-medium">{a.s}</span>
                  <MonoLabel className="text-status-amber">{a.r}</MonoLabel>
                </div>
              ))}
            </div>
          </Panel>
          <Panel label="top projects // this week" status={<Trophy className="size-3.5 text-signal" />} className="lg:col-span-2">
            <div className="divide-y divide-border">
              {PROJECTS.slice(0, 3).map((p) => (
                <div key={p.id} className="p-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate">{p.title}</div>
                    <MonoLabel className="text-muted-foreground">{p.student} · {p.college}</MonoLabel>
                  </div>
                  <span className="font-display font-bold text-lg text-signal shrink-0">{p.rubric}</span>
                </div>
              ))}
            </div>
          </Panel>
        </>
      )}
    </div>
  );
}
