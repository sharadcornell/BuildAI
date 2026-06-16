import {
  Rocket, Workflow, MessageSquare, Globe, FolderGit2,
} from "lucide-react";
import {
  Section, Eyebrow, SectionHeading, MonoLabel, Panel, StatusDot, ProgressBar, Tag,
} from "../components/buildai/primitives";
import { ProjectCard, MentorNoteCard } from "../components/buildai/cards";
import { PageHero, ApplyForm, CompareTable } from "../components/buildai/shared";
import { PROJECTS, MENTOR_NOTES, FAQ } from "../lib/data";
import { FaqAccordion } from "../components/buildai/shared";

export default function Students() {
  return (
    <>
      <PageHero
        index="04"
        kicker="for engineering students"
        title={<>Stop collecting certificates. Start shipping proof.</>}
        intro="Build real AI products every week, get reviewed by working engineers, deploy to production, and graduate with a portfolio you can actually defend in any interview."
        meta={[
          { value: "13", label: "products shipped" },
          { value: "100%", label: "mentor-reviewed" },
          { value: "1", label: "demo day stage" },
        ]}
      />

      {/* Value */}
      <Section>
        <Eyebrow>what you get</Eyebrow>
        <SectionHeading className="mt-5 max-w-[20ch]">Real work. Real feedback. Real proof.</SectionHeading>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-border border border-border mt-10">
          {[
            { icon: Rocket, t: "Build real AI products", d: "Ship working products, not toy exercises." },
            { icon: Workflow, t: "AI-native workflows", d: "Work the way modern engineers actually do." },
            { icon: MessageSquare, t: "Mentor reviewed", d: "Structured feedback from working engineers." },
            { icon: Globe, t: "Deploy every week", d: "A live URL in production, every cycle." },
            { icon: FolderGit2, t: "Portfolio evidence", d: "Graduate with proof, not just a PDF." },
          ].map((f) => (
            <div key={f.t} className="bg-card p-5 hover:bg-signal-soft transition-colors">
              <f.icon className="size-5 text-signal" />
              <h3 className="font-display font-semibold text-lg uppercase tracking-tight mt-4">{f.t}</h3>
              <p className="text-sm text-muted-foreground mt-2">{f.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Student build log mockup */}
      <Section className="bg-ink text-paper-light ink-grid">
        <Eyebrow tone="signal">your build log</Eyebrow>
        <SectionHeading className="mt-5 max-w-[22ch]">This is your week, on the floor.</SectionHeading>
        <div className="grid lg:grid-cols-3 gap-4 mt-10">
          <Panel tone="ink" label="current week // wk07" status={<StatusDot tone="signal" />} className="lg:col-span-2">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <MonoLabel className="text-paper-light/50">building</MonoLabel>
                  <h3 className="font-display font-semibold text-xl uppercase tracking-tight">RAG Knowledge Bot</h3>
                </div>
                <Tag tone="signal">RAG · Embeddings</Tag>
              </div>
              <div className="mt-4 space-y-2.5">
                {[
                  { t: "Ingest corpus & build embedding index", done: true },
                  { t: "Wire retrieval into chat endpoint", done: true },
                  { t: "Add confidence gate for ungrounded answers", done: false },
                  { t: "Run eval set & log retrieval accuracy", done: false },
                ].map((task) => (
                  <div key={task.t} className="flex items-center gap-3 text-sm">
                    <span className={`grid place-items-center size-5 rounded-sm border shrink-0 ${task.done ? "bg-status-mint border-status-mint" : "border-white/20"}`}>
                      {task.done && <span className="size-2 bg-white rounded-[1px]" />}
                    </span>
                    <span className={task.done ? "text-paper-light/40 line-through" : "text-paper-light/90"}>{task.t}</span>
                  </div>
                ))}
              </div>
            </div>
          </Panel>
          <Panel tone="ink" label="ai budget // status" status={<StatusDot tone="mint" />}>
            <div className="p-5 space-y-4">
              <div>
                <div className="flex justify-between items-baseline"><MonoLabel className="text-paper-light/50">tokens</MonoLabel><span className="font-display font-bold text-lg">62%</span></div>
                <ProgressBar value={62} tone="signal" className="mt-1.5" />
              </div>
              <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
                <div><div className="font-display font-bold text-2xl text-status-mint">3</div><MonoLabel className="text-paper-light/50">deploys</MonoLabel></div>
                <div><div className="font-display font-bold text-2xl">14</div><MonoLabel className="text-paper-light/50">commits</MonoLabel></div>
              </div>
            </div>
          </Panel>
          <div className="lg:col-span-2">
            <Panel tone="ink" label="mentor feedback // latest" status={<MessageSquare className="size-3.5 text-signal" />}>
              <div className="p-4">
                <MentorNoteCard note={MENTOR_NOTES[0]} className="bg-transparent border-white/10 text-paper-light [&_p]:text-paper-light/90 [&_.label-mono]:text-paper-light/50" />
              </div>
            </Panel>
          </div>
          <Panel tone="ink" label="certification // progress" status={<StatusDot tone="mint" />}>
            <div className="p-5">
              <div className="font-display font-bold text-2xl uppercase tracking-tight text-status-mint">Apprentice</div>
              <MonoLabel className="text-paper-light/50">5 of 7 gates passed</MonoLabel>
              <ProgressBar value={71} tone="mint" className="mt-3" />
            </div>
          </Panel>
        </div>
      </Section>

      {/* Project examples */}
      <Section>
        <Eyebrow>project examples</Eyebrow>
        <SectionHeading className="mt-5 max-w-[22ch]">The kind of thing you&apos;ll actually ship.</SectionHeading>
        <p className="text-muted-foreground mt-4 max-w-2xl">
          Real student builds from the cohort floor — each deployed, reviewed, and scored.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
          {PROJECTS.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </Section>

      {/* Comparison */}
      <Section className="bg-card border-y border-border">
        <Eyebrow>course vs apprenticeship</Eyebrow>
        <SectionHeading className="mt-5">Which one would you put on your CV?</SectionHeading>
        <div className="mt-10">
          <CompareTable
            leftTitle="Typical course"
            rightTitle="BuildAI apprenticeship"
            rows={[
              { left: "Watch videos", right: "Build real AI products" },
              { left: "Take a quiz", right: "Ship to production" },
              { left: "Auto-graded", right: "Reviewed by working engineers" },
              { left: "Get a certificate", right: "Demo live on demo day" },
            ]}
          />
        </div>
      </Section>

      {/* Waitlist form */}
      <Section>
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 items-start">
          <div className="lg:sticky lg:top-24">
            <Eyebrow tone="signal">student waitlist</Eyebrow>
            <SectionHeading className="mt-5">Join the next cohort.</SectionHeading>
            <p className="text-muted-foreground mt-4 max-w-md">
              Selection is open for the Spring 26 cohort. Tell us about yourself and what you want to
              build — we&apos;ll be in touch with next steps for your campus.
            </p>
            <div className="flex items-center gap-2 mt-6">
              <StatusDot tone="mint" />
              <MonoLabel className="text-muted-foreground">spring 26 · selection open</MonoLabel>
            </div>
          </div>
          <ApplyForm
            title="student waitlist"
            submitLabel="Join the waitlist"
            note="Prototype form — no data is sent."
            fields={[
              { name: "name", label: "Full name", required: true, half: true },
              { name: "email", label: "Email", type: "email", required: true, half: true },
              { name: "college", label: "College", required: true, half: true },
              { name: "year", label: "Year", type: "select", options: ["1st year", "2nd year", "3rd year", "4th year", "Final year"], half: true },
              { name: "branch", label: "Branch", placeholder: "e.g. CSE, IT, ECE", half: true },
              { name: "portfolio", label: "GitHub / portfolio", placeholder: "github.com/you", half: true },
              { name: "why", label: "Why do you want to join?", type: "textarea", placeholder: "What do you want to build, and why now?", required: true },
            ]}
          />
        </div>
      </Section>

      {/* FAQ */}
      <Section className="bg-card border-t border-border">
        <Eyebrow>student faq</Eyebrow>
        <SectionHeading className="mt-5">Before you apply.</SectionHeading>
        <div className="mt-8 max-w-3xl">
          <FaqAccordion items={FAQ.Students} group="students" />
        </div>
      </Section>
    </>
  );
}
