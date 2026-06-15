import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role admin client for server-side writes (API routes only).
 * Returns null when env is not configured so dev still runs before setup.
 * NOTE: never import this into a Client Component.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
