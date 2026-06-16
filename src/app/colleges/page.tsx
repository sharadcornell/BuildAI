import {
  Eye, FolderGit2, Feather, ShieldCheck, Presentation, FileBarChart,
  UserPlus, Boxes, RefreshCw, MessageSquare, Trophy, FileCheck2,
} from "lucide-react";
import {
  Section, Eyebrow, SectionHeading, MonoLabel, Panel, StatusDot, ProgressBar,
} from "../components/buildai/primitives";
import { PageHero, ApplyForm, FaqAccordion } from "../components/buildai/shared";
import { FAQ } from "../lib/data";

export default function Colleges() {
  return (
    <>
      <PageHero
        index="03"
        kicker="for colleges & tpos"
        title={<>Give your students an AI apprenticeship they can prove.</>}
        intro="Visible weekly progress, real student portfolios, and a final outcome report — with minimal faculty lift. BuildAI runs the operational floor; your team sees the results."
        meta={[
          { value: "Weekly", label: "progress visibility" },
          { value: "96%", label: "mentor review coverage" },
          { value: "1", label: "outcome report" },
        ]}
      />

      {/* Value grid */}
      <Section>
        <Eyebrow>the college value</Eyebrow>
        <SectionHeading className="mt-5 max-w-[22ch]">Credible, operational, low-lift.</SectionHeading>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border mt-10">
          {[
            { icon: Eye, t: "Visible weekly progress", d: "Track shipping across the entire cohort, week by week." },
            { icon: FolderGit2, t: "Real student portfolios", d: "Deployed products and repos, not attendance sheets." },
            { icon: Feather, t: "Minimal faculty lift", d: "We run mentoring, reviews, and operations end-to-end." },
            { icon: ShieldCheck, t: "Mentor-reviewed projects", d: "Every build is reviewed by working engineers." },
            { icon: Presentation, t: "Final demo day", d: "A panel-evaluated showcase of cohort work." },
            { icon: FileBarChart, t: "Outcome report", d: "A decision-maker-ready summary of results." },
          ].map((f) => (
            <div key={f.t} className="bg-card p-6 hover:bg-signal-soft transition-colors">
              <f.icon className="size-5 text-signal" />
              <h3 className="font-display font-semibold text-lg uppercase tracking-tight mt-4">{f.t}</h3>
              <p className="text-sm text-muted-foreground mt-2">{f.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* College command center mockup */}
      <Section className="bg-ink text-paper-light ink-grid">
        <Eyebrow tone="signal">college command center</Eyebrow>
        <SectionHeading className="mt-5 max-w-[24ch]">The view your TPO cell gets.</SectionHeading>
        <div className="grid lg:grid-cols-3 gap-4 mt-10">
          <Panel tone="ink" label="cohort completion" status={<StatusDot tone="mint" />}>
            <div className="p-5">
              <div className="font-display font-bold text-5xl leading-none text-status-mint">85%</div>
              <MonoLabel className="text-paper-light/50 mt-1 block">on track to certify</MonoLabel>
              <ProgressBar value={85} tone="mint" className="mt-4" />
            </div>
          </Panel>
          <Panel tone="ink" label="weekly progress" status={<StatusDot tone="signal" />}>
            <div className="p-5">
              <div className="flex items-end gap-1.5 h-20">
                {[40, 55, 50, 70, 65, 85, 78].map((h, i) => (
                  <div key={i} className="flex-1 bg-signal/80 rounded-sm" style={{ height: `${h}%` }} />
                ))}
              </div>
              <MonoLabel className="text-paper-light/50 mt-3 block">ship rate · last 7 weeks</MonoLabel>
            </div>
          </Panel>
          <Panel tone="ink" label="mentor review coverage" status={<MessageSquare className="size-3.5 text-status-mint" />}>
            <div className="p-5">
              <div className="font-display font-bold text-5xl leading-none">96%</div>
              <MonoLabel className="text-paper-light/50 mt-1 block">submissions reviewed</MonoLabel>
              <ProgressBar value={96} tone="mint" className="mt-4" />
            </div>
          </Panel>
          <Panel tone="ink" label="at-risk students" status={<StatusDot tone="amber" />}>
            <div className="p-5 divide-y divide-white/10">
              {[{ s: "Rahul M", r: "missed wk6 ship" }, { s: "Divya P", r: "reviews overdue" }, { s: "Arjun T", r: "below pace" }].map((a) => (
                <div key={a.s} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
                  <span className="text-sm">{a.s}</span>
                  <MonoLabel className="text-status-amber">{a.r}</MonoLabel>
                </div>
              ))}
            </div>
          </Panel>
          <Panel tone="ink" label="top projects" status={<Trophy className="size-3.5 text-signal" />}>
            <div className="p-5 divide-y divide-white/10">
              {[{ t: "AI Research Agent", s: 92 }, { t: "RAG Knowledge Bot", s: 90 }, { t: "Placement Dashboard", s: 88 }].map((p) => (
                <div key={p.t} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
                  <span className="text-sm truncate">{p.t}</span>
                  <span className="font-display font-bold text-signal">{p.s}</span>
                </div>
              ))}
            </div>
          </Panel>
          <Panel tone="ink" label="certification distribution" status={<FileCheck2 className="size-3.5 text-status-mint" />}>
            <div className="p-5 space-y-3">
              {[{ k: "Distinction", n: 12, c: "bg-signal" }, { k: "Apprentice", n: 24, c: "bg-status-mint" }, { k: "Participated", n: 5, c: "bg-white/30" }].map((d) => (
                <div key={d.k}>
                  <div className="flex justify-between text-sm mb-1"><span>{d.k}</span><MonoLabel className="text-paper-light/50">{d.n}</MonoLabel></div>
                  <div className="h-2 bg-white/10 rounded-sm overflow-hidden"><div className={`h-full ${d.c}`} style={{ width: `${(d.n / 41) * 100}%` }} /></div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </Section>

      {/* Pilot flow */}
      <Section>
        <Eyebrow>pilot cohort flow</Eyebrow>
        <SectionHeading className="mt-5">Six steps from nomination to outcome report.</SectionHeading>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
          {[
            { icon: UserPlus, t: "Select students", d: "Nominate your cohort. We handle the rest." },
            { icon: Boxes, t: "Onboard cohort", d: "Students get accounts, mentors, and tooling." },
            { icon: RefreshCw, t: "Weekly build cycles", d: "Ship a real product output every week." },
            { icon: MessageSquare, t: "Mentor reviews", d: "Working engineers review every submission." },
            { icon: Presentation, t: "Demo day", d: "A live, panel-evaluated final showcase." },
            { icon: FileBarChart, t: "Outcome report", d: "A decision-maker-ready summary of results." },
          ].map((s, i) => (
            <div key={s.t} className="border border-border bg-card p-5 relative">
              <MonoLabel className="text-signal">step {String(i + 1).padStart(2, "0")}</MonoLabel>
              <s.icon className="size-5 text-foreground mt-3" />
              <h3 className="font-display font-semibold text-lg uppercase tracking-tight mt-3">{s.t}</h3>
              <p className="text-sm text-muted-foreground mt-1.5">{s.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Inquiry form */}
      <Section className="bg-card border-y border-border">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 items-start">
          <div className="lg:sticky lg:top-24">
            <Eyebrow tone="signal">pilot inquiry</Eyebrow>
            <SectionHeading className="mt-5">Run a pilot cohort.</SectionHeading>
            <p className="text-muted-foreground mt-4 max-w-md">
              Tell us about your campus and we&apos;ll share how a BuildAI pilot would run for your students
              next term. No commitment — just a conversation.
            </p>
            <div className="flex items-center gap-2 mt-6">
              <StatusDot tone="mint" />
              <MonoLabel className="text-muted-foreground">spring 26 pilots · selection open</MonoLabel>
            </div>
          </div>
          <ApplyForm
            title="college pilot inquiry"
            submitLabel="Request a pilot"
            note="Prototype form — no data is sent."
            fields={[
              { name: "name", label: "Your name", required: true, half: true },
              { name: "role", label: "Role", placeholder: "e.g. TPO, HOD, Director", required: true, half: true },
              { name: "college", label: "College / institution", required: true },
              { name: "email", label: "Work email", type: "email", required: true, half: true },
              { name: "phone", label: "Phone", type: "tel", half: true },
              { name: "students", label: "Estimated students", type: "number", placeholder: "e.g. 40", half: true },
              { name: "term", label: "Preferred term", type: "select", options: ["Spring 26", "Monsoon 26", "Spring 27", "Not sure yet"], half: true },
              { name: "message", label: "Anything we should know?", type: "textarea", placeholder: "Goals, constraints, calendar…" },
            ]}
          />
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <Eyebrow>college faq</Eyebrow>
        <SectionHeading className="mt-5">Questions from decision-makers.</SectionHeading>
        <div className="mt-8 max-w-3xl">
          <FaqAccordion items={FAQ.Colleges} group="colleges" />
        </div>
      </Section>
    </>
  );
}
