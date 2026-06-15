"use client";
import { useState } from "react";
import { studentWaitlistSchema } from "@/lib/validation";
import { Field, inputCls } from "./fields";
import { useSubmit } from "./useSubmit";
import { Button } from "@/components/ui/Button";

type Errors = Record<string, string[] | undefined>;

export function StudentWaitlistForm() {
  const { status, error, submit } = useSubmit("/api/student-waitlist");
  const [errors, setErrors] = useState<Errors>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const raw = Object.fromEntries(fd.entries());
    (raw as Record<string, unknown>).consent = fd.get("consent") === "on";
    const parsed = studentWaitlistSchema.safeParse(raw);
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
        <h3 className="font-display text-2xl uppercase">You&apos;re on the list.</h3>
        <p className="mt-2 text-sm">We&apos;ll email you when Cohort 01 opens at your college.</p>
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
        <Field label="College" htmlFor="college" required error={errors.college}>
          <input id="college" name="college" className={inputCls} required />
        </Field>
        <Field label="Year" htmlFor="year" required error={errors.year}>
          <select id="year" name="year" className={inputCls} defaultValue="2">
            <option value="2">2nd year</option>
            <option value="3">3rd year</option>
            <option value="4">4th year</option>
          </select>
        </Field>
        <Field label="Branch" htmlFor="branch" required error={errors.branch}>
          <input id="branch" name="branch" className={inputCls} placeholder="CS / IT / ECE…" required />
        </Field>
        <Field label="Email" htmlFor="email" required error={errors.email}>
          <input id="email" name="email" type="email" className={inputCls} required />
        </Field>
        <Field label="Phone (optional)" htmlFor="phone" error={errors.phone}>
          <input id="phone" name="phone" className={inputCls} />
        </Field>
      </div>
      <Field label="GitHub / portfolio (optional)" htmlFor="portfolio" error={errors.portfolio}>
        <input id="portfolio" name="portfolio" className={inputCls} placeholder="github.com/…" />
      </Field>
      <Field label="Why do you want in?" htmlFor="why" error={errors.why}>
        <textarea id="why" name="why" rows={3} className={inputCls} />
      </Field>
      <label className="flex items-start gap-3 text-sm text-brand-ink">
        <input type="checkbox" name="consent" className="mt-1 h-4 w-4" />
        <span>I agree to be contacted about BuildAI. {errors.consent ? <span className="font-bold text-brand-red">{errors.consent[0]}</span> : null}</span>
      </label>
      {status === "error" ? <p className="text-sm font-bold text-brand-red">{error}</p> : null}
      <Button variant="dark" type="submit" className="w-full sm:w-auto">
        {status === "loading" ? "Joining…" : "Join the waitlist"}
      </Button>
    </form>
  );
}
