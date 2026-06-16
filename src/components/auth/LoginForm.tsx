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

// Feature flag (Phase 4B). Google sign-in stays fully disabled unless this is
// exactly "true" AND the Supabase Google provider has been configured. Read at
// build time from a NEXT_PUBLIC_ var so the client bundle can gate cleanly.
const GOOGLE_ENABLED = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";

/**
 * Where Google should send the user back to after auth — our SSR callback route.
 * Prefer an explicit override, else the configured site URL, else the live origin.
 */
function oauthRedirectUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL;
  if (explicit) return explicit;
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (typeof window !== "undefined" ? window.location.origin : "");
  return `${base.replace(/\/$/, "")}/auth/callback`;
}

export function LoginForm({ initialNotice = null }: { initialNotice?: string | null }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(initialNotice);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function onGoogle() {
    // Belt-and-suspenders: never call OAuth when the flag is off.
    if (!GOOGLE_ENABLED) return;
    setError(null);
    setGoogleLoading(true);
    try {
      const supabase = getSupabaseBrowser();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: oauthRedirectUrl() },
      });
      if (oauthError) {
        setError("Could not start Google sign-in. Please try again.");
        setGoogleLoading(false);
        return;
      }
      // On success the browser is redirected to Google; nothing else to do here.
    } catch {
      setError("Something went wrong. Please try again.");
      setGoogleLoading(false);
    }
  }

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

      {/* Divider */}
      <div className="flex items-center gap-3 py-1" aria-hidden="true">
        <span className="h-px flex-1 bg-brand-ink/20" />
        <span className="text-xs font-bold uppercase tracking-wide text-brand-ink/50">or</span>
        <span className="h-px flex-1 bg-brand-ink/20" />
      </div>

      {/* Google sign-in — config-gated (Phase 4B). When disabled, the button is
          inert (no handler, disabled) and a small note explains it's coming. */}
      {GOOGLE_ENABLED ? (
        <button
          type="button"
          onClick={onGoogle}
          disabled={loading || googleLoading}
          className="flex w-full items-center justify-center gap-2 border-2 border-brand-ink bg-white px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-brand-ink transition hover:bg-brand-ink hover:text-white disabled:opacity-50"
        >
          {googleLoading ? "Redirecting…" : "Continue with Google"}
        </button>
      ) : (
        <>
          <button
            type="button"
            disabled
            aria-disabled="true"
            title="Google sign-in is not enabled yet"
            className="flex w-full cursor-not-allowed items-center justify-center gap-2 border-2 border-brand-ink/30 bg-white/50 px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-brand-ink/40"
          >
            Continue with Google
          </button>
          <p className="text-center text-xs text-brand-ink/50">Google sign-in coming soon.</p>
        </>
      )}
    </form>
  );
}
