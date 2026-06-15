import { cache } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server-auth";

export type Role = "student" | "mentor" | "admin";

export type SessionUser = {
  id: string;
  email: string | null;
  role: Role;
};

/** The dashboard a given role lands on. */
export function dashboardPathForRole(role: Role): string {
  if (role === "admin") return "/app/admin";
  if (role === "mentor") return "/app/mentor";
  return "/app";
}

/**
 * The logged-in user + their role, or null if logged out / Supabase unconfigured.
 * Wrapped in React `cache` so repeated calls within one request render only hit
 * Supabase once (layout + page both call into this).
 */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  // Default to the least-privileged role if a profile row is somehow missing
  // (the auth trigger normally creates one). Never silently elevate.
  const role: Role = (profile?.role as Role) ?? "student";
  return { id: user.id, email: user.email ?? null, role };
});

/** Require a logged-in user; redirect to /login otherwise. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}

/**
 * Require one of `roles`; if the user has a different role, redirect them to
 * their own dashboard (so no wrong-role data is ever rendered).
 */
export async function requireRole(roles: Role[]): Promise<SessionUser> {
  const user = await requireUser();
  if (!roles.includes(user.role)) redirect(dashboardPathForRole(user.role));
  return user;
}
