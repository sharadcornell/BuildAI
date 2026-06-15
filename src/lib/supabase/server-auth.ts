import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

type CookieToSet = { name: string; value: string; options: CookieOptions };

/**
 * Supabase client bound to the request's auth cookies — runs as the logged-in
 * user, so RLS applies. Use in Server Components, Server Actions, and Route
 * Handlers (NOT for privileged writes — that's the service-role client in
 * ./server.ts). Returns null when public env isn't configured so the app still
 * renders (protected pages then treat the visitor as logged out).
 */
export async function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Prefer the newer publishable key name; fall back to the legacy anon key.
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component where cookies are read-only.
          // The middleware refreshes the session cookie, so this is safe to ignore.
        }
      },
    },
  });
}
