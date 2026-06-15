"use client";
import { useState } from "react";
import { mentorApplicationSchema } from "@/lib/validation";
import { Field, inputCls } from "./fields";
import { useSubmit } from "./useSubmit";
import { Button } from "@/components/ui/Button";

type Errors = Record<string, string[] | undefined>;

export function MentorApplicationForm() {
  const { status, error, submit } = useSubmit("/api/mentor-application");
  const [errors, setErrors] = useState<Errors>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const raw = Object.fromEntries(fd.entries());
    (raw as Record<string, unknown>).consent = fd.get("consent") === "on";
    const parsed = mentorApplicationSchema.safeParse(raw);
    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors as Errors);
      return;
    }
    setErrors({});
    const ok = await submit(parsed.data);
    if (ok) form.reset();
  }

  if (status === "success") {
    return (
      <div className="border-2 border-brand-ink bg-brand-yellow p-6 text-brand-ink shadow-offset">
        <h3 className="font-display text-2xl uppercase">Application received.</h3>
        <p className="mt-2 text-sm">We review every mentor application personally and reply within a week.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 border-2 border-brand-ink bg-brand-muted p-6 text-brand-ink shadow-offset">
      <input type="text" name="hp" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" htmlFor="fullName" required error={errors.fullName}>
          <input id="fullName" name="fullName" className={inputCls} required />
        </Field>
        <Field label="Current company" htmlFor="company" required error={errors.company}>
          <input id="company" name="company" className={inputCls} required />
        </Field>
        <Field label="Role / title" htmlFor="role" required error={errors.role}>
          <input id="role" name="role" className={inputCls} required />
        </Field>
        <Field label="Years of experience" htmlFor="yearsExp" required error={errors.yearsExp}>
          <input id="yearsExp" name="yearsExp" className={inputCls} placeholder="e.g. 4" required />
        </Field>
        <Field label="LinkedIn" htmlFor="linkedin" error={errors.linkedin}>
          <input id="linkedin" name="linkedin" className={inputCls} />
        </Field>
        <Field label="GitHub" htmlFor="github" error={errors.github}>
          <input id="github" name="github" className={inputCls} />
        </Field>
        <Field label="Hours / week" htmlFor="hoursPerWeek" required error={errors.hoursPerWeek}>
          <input id="hoursPerWeek" name="hoursPerWeek" className={inputCls} placeholder="4–6" required />
        </Field>
        <Field label="Email" htmlFor="email" required error={errors.email}>
          <input id="email" name="email" type="email" className={inputCls} required />
        </Field>
      </div>
      <Field label="Focus areas" htmlFor="areas" error={errors.areas}>
        <input id="areas" name="areas" className={inputCls} placeholder="LLM apps, RAG, agents, infra, product…" />
      </Field>
      <Field label="Anything else?" htmlFor="note" error={errors.note}>
        <textarea id="note" name="note" rows={3} className={inputCls} />
      </Field>
      <label className="flex items-start gap-3 text-sm text-brand-ink">
        <input type="checkbox" name="consent" className="mt-1 h-4 w-4" />
        <span>I&apos;m interested in mentoring a BuildAI pod. {errors.consent ? <span className="font-bold text-brand-red">{errors.consent[0]}</span> : null}</span>
      </label>
      {status === "error" ? <p className="text-sm font-bold text-brand-red">{error}</p> : null}
      <Button variant="dark" type="submit" className="w-full sm:w-auto">
        {status === "loading" ? "Submitting…" : "Apply to mentor"}
      </Button>
    </form>
  );
}
