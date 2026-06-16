import {
  Users, Inbox, MessageSquare, ClipboardCheck, Presentation, CheckCircle2, AlertTriangle, CircleDot,
} from "lucide-react";
import {
  Section, Eyebrow, SectionHeading, MonoLabel, Panel, StatusDot, Tag,
} from "../components/buildai/primitives";
import { PageHero, ApplyForm, FaqAccordion } from "../components/buildai/shared";
import { FAQ } from "../lib/data";
import { cn } from "../components/ui/utils";

export default function Mentors() {
  return (
    <>
      <PageHero
        index="05"
        kicker="for mentors"
        title={<>Review the next generation of AI builders.</>}
        intro="Spend a focused block each week giving specific, high-signal feedback to a small group of student engineers shipping real AI products under pressure."
        meta={[
          { value: "5–6", label: "students assigned" },
          { value: "1×", label: "review block / week" },
          { value: "5", label: "rubric criteria" },
        ]}
      />

      {/* Workflow */}
      <Section>
        <Eyebrow>mentor workflow</Eyebrow>
        <SectionHeading className="mt-5">Five steps, every week.</SectionHeading>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-border border border-border mt-10">
          {[
            { icon: Users, t: "Assigned students", d: "A small group you follow across the cohort." },
            { icon: Inbox, t: "Weekly submissions", d: "Each student ships a build for review." },
            { icon: MessageSquare, t: "Review notes", d: "Leave specific, structured feedback." },
            { icon: ClipboardCheck, t: "Rubric scoring", d: "Score against five clear criteria." },
            { icon: Presentation, t: "Demo day eval", d: "Help evaluate final demos on the panel." },
          ].map((f, i) => (
            <div key={f.t} className="bg-card p-5 hover:bg-signal-soft transition-colors">
              <MonoLabel className="text-signal">step {String(i + 1).padStart(2, "0")}</MonoLabel>
              <f.icon className="size-5 text-foreground mt-3" />
              <h3 className="font-display font-semibold text-lg uppercase tracking-tight mt-3">{f.t}</h3>
              <p className="text-sm text-muted-foreground mt-2">{f.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Review queue mockup */}
      <Section className="bg-ink text-paper-light ink-grid">
        <Eyebrow tone="signal">mentor review queue</Eyebrow>
        <SectionHeading className="mt-5 max-w-[22ch]">Your queue, the way you&apos;ll work it.</SectionHeading>
        <div className="grid lg:grid-cols-3 gap-4 mt-10">
          <Panel tone="ink" label="review queue // 3 pending" status={<Inbox className="size-3.5 text-signal" />} className="lg:col-span-2">
            <div className="divide-y divide-white/10">
              {[
                { s: "Aditya Rao", p: "RAG Knowledge Bot", wk: 7, status: "pending", v: "review" as const },
                { s: "Priya Nair", p: "Healthcare Intake Assistant", wk: 7, status: "pending", v: "review" as const },
                { s: "Mohammed Irfan", p: "Knowledge Bot v2", wk: 7, status: "pending", v: "changes" as const },
                { s: "Sneha Kulkarni", p: "Placement Dashboard", wk: 7, status: "done", v: "approved" as const },
              ].map((q) => (
                <div key={q.s} className="p-4 flex items-center gap-3">
                  <div className="size-9 rounded-full bg-white/10 grid place-items-center font-display font-bold text-sm shrink-0">
                    {q.s.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{q.s}</div>
                    <MonoLabel className="text-paper-light/50">{q.p} · wk{q.wk}</MonoLabel>
                  </div>
                  <Verdict v={q.v} />
                </div>
              ))}
            </div>
          </Panel>

          <Panel tone="ink" label="rubric // scoring" status={<ClipboardCheck className="size-3.5 text-status-mint" />}>
            <div className="p-4 space-y-2.5">
              {[
                { k: "Scope", v: 4 }, { k: "Correctness", v: 5 }, { k: "Reliability", v: 3 },
                { k: "Product sense", v: 4 }, { k: "Craft", v: 4 },
              ].map((r) => (
                <div key={r.k} className="flex items-center gap-3">
                  <MonoLabel className="text-paper-light/60 w-24 shrink-0">{r.k}</MonoLabel>
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span key={n} className={cn("h-2 flex-1 rounded-sm", n <= r.v ? "bg-status-mint" : "bg-white/10")} />
                    ))}
                  </div>
                </div>
              ))}
              <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                <MonoLabel className="text-paper-light/50">overall</MonoLabel>
                <span className="font-display font-bold text-2xl text-signal">4.0</span>
              </div>
            </div>
          </Panel>
        </div>
      </Section>

      {/* Application form */}
      <Section>
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 items-start">
          <div className="lg:sticky lg:top-24">
            <Eyebrow tone="signal">mentor application</Eyebrow>
            <SectionHeading className="mt-5">Apply to mentor.</SectionHeading>
            <p className="text-muted-foreground mt-4 max-w-md">
              We look for working engineers who ship AI products in production and can give kind,
              specific, high-signal feedback. If that&apos;s you, we&apos;d love to talk.
            </p>
            <div className="flex flex-wrap gap-2 mt-6">
              <Tag tone="signal">Production experience</Tag>
              <Tag tone="default">High-signal feedback</Tag>
              <Tag tone="mint">~1 block / week</Tag>
            </div>
          </div>
          <ApplyForm
            title="mentor application"
            submitLabel="Apply as a mentor"
            note="Prototype form — no data is sent."
            fields={[
              { name: "name", label: "Full name", required: true, half: true },
              { name: "email", label: "Email", type: "email", required: true, half: true },
              { name: "company", label: "Current company", required: true, half: true },
              { name: "title", label: "Title / role", placeholder: "e.g. Staff Engineer", half: true },
              { name: "linkedin", label: "LinkedIn / GitHub", placeholder: "Profile link", half: true },
              { name: "expertise", label: "Primary expertise", type: "select", options: ["Frontend", "Backend", "ML / AI", "Full-stack", "DevOps / Infra", "Product"], half: true },
              { name: "experience", label: "Years shipping in production", type: "number", placeholder: "e.g. 6", half: true },
              { name: "capacity", label: "Weekly review capacity", type: "select", options: ["3–4 students", "5–6 students", "7+ students"], half: true },
              { name: "why", label: "Why do you want to mentor?", type: "textarea", placeholder: "What do you want to pass on?", required: true },
            ]}
          />
        </div>
      </Section>

      {/* FAQ */}
      <Section className="bg-card border-t border-border">
        <Eyebrow>mentor faq</Eyebrow>
        <SectionHeading className="mt-5">How mentoring works.</SectionHeading>
        <div className="mt-8 max-w-3xl">
          <FaqAccordion items={FAQ.Mentors} group="mentors" />
        </div>
      </Section>
    </>
  );
}

function Verdict({ v }: { v: "approved" | "changes" | "review" }) {
  const map = {
    approved: { tag: "mint" as const, label: "approved", Icon: CheckCircle2 },
    changes: { tag: "signal" as const, label: "changes", Icon: AlertTriangle },
    review: { tag: "default" as const, label: "review now", Icon: CircleDot },
  };
  const { tag, label, Icon } = map[v];
  return <Tag tone={tag} className="shrink-0 gap-1"><Icon className="size-3" />{label}</Tag>;
}
