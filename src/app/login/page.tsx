import type { Metadata } from "next";
import { Container } from "@/components/site/Container";
import { Button } from "@/components/ui/Button";
import { inputCls } from "@/components/forms/fields";

export const metadata: Metadata = { title: "Log in" };

// Phase 2: wire Supabase Auth (magic link) + role-based redirect to /app, /app/mentor, /app/admin.
export default function LoginPage() {
  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-20">
      <div className="w-full max-w-md border-2 border-brand-ink bg-brand-muted p-8 text-brand-ink shadow-offset">
        <h1 className="display text-4xl text-brand-ink">Log in</h1>
        <p className="mt-2 text-sm text-brand-ink/70">
          Students, mentors, and admins. (Auth is wired in Phase 2.)
        </p>
        <form className="mt-6 space-y-4" action="#">
          <input className={inputCls} type="email" placeholder="you@college.edu" disabled />
          <Button variant="dark" className="w-full" type="button">
            Send magic link
          </Button>
        </form>
        <p className="mt-4 text-xs text-brand-ink/60">
          Placeholder UI — see docs/BuildAI_Website_Build_Brief.md §8 (Phase 2).
        </p>
      </div>
    </Container>
  );
}
