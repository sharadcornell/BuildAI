import type { Metadata } from "next";
import { Container } from "@/components/site/Container";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Log in" };

// Phase 2A: Supabase Auth (email + password) with role-based redirect to
// /app, /app/mentor, or /app/admin.
export default function LoginPage() {
  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-20">
      <div className="w-full max-w-md border-2 border-brand-ink bg-brand-muted p-8 text-brand-ink shadow-offset">
        <h1 className="display text-4xl text-brand-ink">Log in</h1>
        <p className="mt-2 text-sm text-brand-ink/70">
          Students, mentors, and admins. Accounts are created by BuildAI — there
          is no public sign-up.
        </p>
        <LoginForm />
      </div>
    </Container>
  );
}
