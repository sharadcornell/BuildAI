"use client";
import { useState } from "react";
import { pilotInquirySchema } from "@/lib/validation";
import { Field, inputCls } from "./fields";
import { useSubmit } from "./useSubmit";
import { Button } from "@/components/ui/Button";

type Errors = Record<string, string[] | undefined>;

export function PilotInquiryForm() {
  const { status, error, submit } = useSubmit("/api/pilot-inquiry");
  const [errors, setErrors] = useState<Errors>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const raw = Object.fromEntries(fd.entries());
    (raw as Record<string, unknown>).consent = fd.get("consent") === "on";
    const parsed = pilotInquirySchema.safeParse(raw);
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
        <h3 className="font-display text-2xl uppercase">Thanks — we&apos;ll be in touch.</h3>
        <p className="mt-2 text-sm">We reply to pilot inquiries within two working days.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 border-2 border-brand-ink bg-brand-muted p-6 text-brand-ink shadow-offset">
      <input type="text" name="hp" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="College / Institution" htmlFor="college" required error={errors.college}>
          <input id="college" name="college" className={inputCls} required />
        </Field>
        <Field label="Your name" htmlFor="contactName" required error={errors.contactName}>
          <input id="contactName" name="contactName" className={inputCls} required />
        </Field>
        <Field label="Your role" htmlFor="role" required error={errors.role}>
          <select id="role" name="role" className={inputCls} defaultValue="TPO">
            <option value="TPO">TPO / Placement Officer</option>
            <option value="Dean">Dean</option>
            <option value="HOD">HOD (CS / IT)</option>
            <option value="Principal">Principal</option>
            <option value="Other">Other</option>
          </select>
        </Field>
        <Field label="Work email" htmlFor="email" required error={errors.email}>
          <input id="email" name="email" type="email" className={inputCls} required />
        </Field>
        <Field label="Phone" htmlFor="phone" required error={errors.phone}>
          <input id="phone" name="phone" className={inputCls} required />
        </Field>
        <Field label="City / State" htmlFor="city" required error={errors.city}>
          <input id="city" name="city" className={inputCls} required />
        </Field>
        <Field label="Approx. eligible students" htmlFor="students" required error={errors.students}>
          <input id="students" name="students" className={inputCls} placeholder="e.g. 60" required />
        </Field>
        <Field label="Earliest start (term)" htmlFor="startTerm" error={errors.startTerm}>
          <input id="startTerm" name="startTerm" className={inputCls} placeholder="e.g. Aug 2026" />
        </Field>
      </div>
      <Field label="Anything we should know?" htmlFor="message" error={errors.message}>
        <textarea id="message" name="message" rows={3} className={inputCls} />
      </Field>
      <label className="flex items-start gap-3 text-sm text-brand-ink">
        <input type="checkbox" name="consent" className="mt-1 h-4 w-4" />
        <span>I agree to be contacted about a BuildAI pilot. {errors.consent ? <span className="font-bold text-brand-red">{errors.consent[0]}</span> : null}</span>
      </label>
      {status === "error" ? <p className="text-sm font-bold text-brand-red">{error}</p> : null}
      <Button variant="dark" type="submit" className="w-full sm:w-auto">
        {status === "loading" ? "Sending…" : "Request a pilot"}
      </Button>
    </form>
  );
}
