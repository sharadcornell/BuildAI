"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { inputCls } from "@/components/forms/fields";

const DASHBOARD_BY_ROLE: Record<string, string> = {
  admin: "/app/admin",
  mentor: "/app/mentor",
  student: "/app",
};

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = getSupabaseBrowser();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // Keep it generic — never surface raw auth internals.
        setError("Incorrect email or password.");
        setLoading(false);
        return;
      }

      // Look up role for a direct redirect; fall back to /app (the server-side
      // guards will route any role correctly regardless).
      let destination = "/app";
      const uid = data.user?.id;
      if (uid) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("user_id", uid)
          .maybeSingle();
        destination = DASHBOARD_BY_ROLE[profile?.role ?? "student"] ?? "/app";
      }

      router.replace(destination);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={onSubmit}>
      <label htmlFor="email" className="block">
        <span className="mb-1 block text-sm font-bold uppercase tracking-wide text-brand-ink">
          Email
        </span>
        <input
          id="email"
          name="email"
          className={inputCls}
          type="email"
          autoComplete="email"
          placeholder="you@college.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </label>

      <label htmlFor="password" className="block">
        <span className="mb-1 block text-sm font-bold uppercase tracking-wide text-brand-ink">
          Password
        </span>
        <input
          id="password"
          name="password"
          className={inputCls}
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
      </label>

      {error ? (
        <p
          role="alert"
          className="border-2 border-brand-red bg-brand-red/10 px-3 py-2 text-sm font-bold text-brand-red"
        >
          {error}
        </p>
      ) : null}

      <Button variant="dark" className="w-full" type="submit" disabled={loading}>
        {loading ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
