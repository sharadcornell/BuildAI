"use client";
import { createBrowserClient } from "@supabase/ssr";

/** Browser Supabase client (Phase 2: auth + RLS reads from dashboards). */
export function getSupabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Prefer the newer publishable key name; fall back to the legacy anon key.
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase public env vars are not set.");
  return createBrowserClient(url, key);
}
