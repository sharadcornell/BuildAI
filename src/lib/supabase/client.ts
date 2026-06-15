"use client";
import { createBrowserClient } from "@supabase/ssr";

/** Browser Supabase client (Phase 2: auth + RLS reads from dashboards). */
export function getSupabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase public env vars are not set.");
  return createBrowserClient(url, key);
}
