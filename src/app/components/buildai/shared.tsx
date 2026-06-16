"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../ui/utils";
import { Eyebrow, MonoLabel, Section, StatusDot } from "./primitives";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import type { FaqItem } from "../../lib/data";

/* -------- Page hero (consistent across inner pages) -------- */
export function PageHero({
  index,
  kicker,
  title,
  intro,
  meta,
  children,
}: {
  index: string;
  kicker: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  meta?: { label: string; value: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="relative bg-ink text-paper-light ink-grid overflow-hidden">
      <div className="absolute top-0 right-0 font-display font-bold text-[22vw] leading-none text-white/[0.03] pointer-events-none select-none -mt-8 -mr-4">
        {index}
      </div>
      <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8 pt-16 sm:pt-24 pb-14 sm:pb-20">
        <Eyebrow tone="signal">{kicker}</Eyebrow>
        <h1 className="font-display font-bold uppercase tracking-tight leading-[0.92] mt-5 text-[clamp(2.5rem,6.5vw,5.5rem)] max-w-[16ch]">
          {title}
        </h1>
        {intro && (
          <p className="text-paper-light/70 text-lg max-w-2xl mt-6 leading-relaxed">{intro}</p>
        )}
        {meta && (
          <div className="flex flex-wrap gap-x-10 gap-y-4 mt-10 pt-6 border-t border-white/10">
            {meta.map((m) => (
              <div key={m.label}>
                <div className="font-display font-bold text-2xl leading-none text-signal">{m.value}</div>
                <MonoLabel className="text-paper-light/50 mt-1 block">{m.label}</MonoLabel>
              </div>
            ))}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

/* -------- CTA section / cards -------- */
export function CTASection({
  title = "Ready to run the first cohort?",
  subtitle = "Bring a live, mentor-reviewed AI apprenticeship to your campus this term.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <Section className="bg-signal text-paper-light relative overflow-hidden">
      <div className="absolute inset-0 ink-grid opacity-40" />
      <div className="relative grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
        <div>
          <Eyebrow tone="ink">final call · spring 26</Eyebrow>
          <h2 className="font-display font-bold uppercase tracking-tight leading-[0.95] mt-4 text-[clamp(2.25rem,5vw,4rem)]">
            {title}
          </h2>
          <p className="text-paper-light/90 text-lg mt-4 max-w-xl">{subtitle}</p>
        </div>
        <div className="grid gap-3">
          <CTALink to="/colleges" title="Run a pilot cohort" desc="For colleges & TPOs" primary />
          <CTALink to="/students" title="Join the student waitlist" desc="For engineering students" />
          <CTALink to="/mentors" title="Apply as a mentor" desc="For working engineers" />
        </div>
      </div>
    </Section>
  );
}

export function CTALink({
  to, title, desc, primary,
}: { to: string; title: string; desc: string; primary?: boolean }) {
  return (
    <Link
      href={to}
      className={cn(
        "group flex items-center justify-between gap-4 px-5 py-4 border transition-colors",
        primary
          ? "bg-ink text-paper-light border-ink hover:bg-ink-panel-2"
          : "bg-paper-light/10 border-paper-light/30 text-paper-light hover:bg-paper-light hover:text-ink",
      )}
    >
      <div>
        <div className="font-display font-semibold text-lg uppercase tracking-tight leading-tight">{title}</div>
        <MonoLabel className="opacity-70">{desc}</MonoLabel>
      </div>
      <ArrowUpRight className="size-5 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
    </Link>
  );
}

/* -------- FAQ accordion -------- */
export function FaqAccordion({ items, group }: { items: FaqItem[]; group?: string }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((item, i) => (
        <AccordionItem key={i} value={`${group ?? "faq"}-${i}`} className="border-border">
          <AccordionTrigger className="hover:no-underline group py-5">
            <span className="flex items-start gap-3 pr-4">
              <MonoLabel className="text-signal mt-1 shrink-0">{String(i + 1).padStart(2, "0")}</MonoLabel>
              <span className="font-display font-semibold text-lg uppercase tracking-tight leading-tight text-left group-hover:text-signal transition-colors">
                {item.q}
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="pl-9 pr-4">
            <p className="text-muted-foreground leading-relaxed text-[15px]">{item.a}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

/* -------- Comparison table: passive course vs BuildAI -------- */
export function CompareTable({
  leftTitle = "Typical course",
  rightTitle = "BuildAI apprenticeship",
  rows,
}: {
  leftTitle?: string;
  rightTitle?: string;
  rows: { left: string; right: string }[];
}) {
  return (
    <div className="grid sm:grid-cols-2 border border-border bg-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border bg-foreground/[0.03]">
        <MonoLabel className="text-muted-foreground">{leftTitle}</MonoLabel>
      </div>
      <div className="px-5 py-4 border-b border-border bg-signal-soft sm:border-l border-border">
        <MonoLabel className="text-signal">{rightTitle}</MonoLabel>
      </div>
      {rows.map((r, i) => (
        <React.Fragment key={i}>
          <div className="px-5 py-4 border-b border-border flex items-start gap-2.5 text-muted-foreground">
            <X className="size-4 shrink-0 mt-0.5 text-muted-foreground/60" />
            <span className="text-sm line-through decoration-muted-foreground/30">{r.left}</span>
          </div>
          <div className="px-5 py-4 border-b border-border sm:border-l flex items-start gap-2.5">
            <Check className="size-4 shrink-0 mt-0.5 text-status-mint" />
            <span className="text-sm font-medium">{r.right}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

/* -------- Tools row -------- */
export function ToolsRow({ tools }: { tools: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tools.map((t) => (
        <span
          key={t}
          className="inline-flex items-center gap-2 border border-border bg-card px-3 py-2 font-mono text-sm hover:border-signal hover:text-signal transition-colors"
        >
          <StatusDot tone="mint" pulse={false} />
          {t}
        </span>
      ))}
    </div>
  );
}

/* ----------------------- Forms ----------------------- */
export interface FieldDef {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "number" | "textarea" | "select";
  placeholder?: string;
  required?: boolean;
  options?: string[];
  half?: boolean;
}

export function ApplyForm({
  title,
  fields,
  submitLabel = "Submit",
  note,
}: {
  title: string;
  fields: FieldDef[];
  submitLabel?: string;
  note?: string;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const set = (name: string, v: string) => {
    setValues((p) => ({ ...p, [name]: v }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: false }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, boolean> = {};
    fields.forEach((f) => {
      if (f.required && !values[f.name]?.trim()) errs[f.name] = true;
      if (f.type === "email" && values[f.name] && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values[f.name])) errs[f.name] = true;
    });
    setErrors(errs);
    if (Object.keys(errs).length === 0) setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-status-mint bg-status-mint-soft p-8 text-center"
      >
        <CheckCircle2 className="size-10 text-status-mint mx-auto" />
        <h3 className="font-display font-bold text-2xl uppercase tracking-tight mt-4">Submission received</h3>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          Thanks, {values.name?.split(" ")[0] || "there"}. Our team will review your details and
          reach out shortly. This is a prototype — no data was sent anywhere.
        </p>
        <MonoLabel className="text-status-mint mt-4 inline-flex items-center gap-2">
          <StatusDot tone="mint" /> queued · ref #{Math.random().toString(36).slice(2, 8).toUpperCase()}
        </MonoLabel>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="border border-border bg-card">
      <div className="px-5 py-3 border-b border-border bg-foreground/[0.03] flex items-center justify-between">
        <MonoLabel className="text-muted-foreground">{title}</MonoLabel>
        <MonoLabel className="text-signal flex items-center gap-1.5"><StatusDot tone="signal" pulse={false} /> intake form</MonoLabel>
      </div>
      <div className="p-5 grid sm:grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f.name} className={cn("flex flex-col gap-1.5", !f.half && "sm:col-span-2")}>
            <label htmlFor={f.name} className="text-sm flex items-center gap-1">
              {f.label}
              {f.required && <span className="text-signal">*</span>}
            </label>
            {f.type === "textarea" ? (
              <textarea
                id={f.name}
                rows={4}
                placeholder={f.placeholder}
                value={values[f.name] || ""}
                onChange={(e) => set(f.name, e.target.value)}
                className={cn(fieldCls(errors[f.name]), "!h-auto py-2.5 resize-none")}
              />
            ) : f.type === "select" ? (
              <select
                id={f.name}
                value={values[f.name] || ""}
                onChange={(e) => set(f.name, e.target.value)}
                className={cn(fieldCls(errors[f.name]), "appearance-none")}
              >
                <option value="">Select…</option>
                {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : (
              <input
                id={f.name}
                type={f.type || "text"}
                placeholder={f.placeholder}
                value={values[f.name] || ""}
                onChange={(e) => set(f.name, e.target.value)}
                className={fieldCls(errors[f.name])}
              />
            )}
            {errors[f.name] && (
              <span className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="size-3" /> Please enter a valid {f.label.toLowerCase()}.
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="px-5 pb-5 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        {note && <MonoLabel className="text-muted-foreground">{note}</MonoLabel>}
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 h-11 px-6 bg-signal text-paper-light font-medium rounded-sm hover:bg-ink transition-colors sm:ml-auto"
        >
          {submitLabel} <ArrowUpRight className="size-4" />
        </button>
      </div>
    </form>
  );
}

function fieldCls(error?: boolean) {
  return cn(
    "h-11 px-3 bg-input-background border rounded-sm outline-none transition-colors text-sm",
    "focus:border-signal focus:ring-2 focus:ring-signal/20",
    "[&]:resize-none data-[textarea]:h-auto",
    error ? "border-destructive ring-2 ring-destructive/15" : "border-border",
  );
}
