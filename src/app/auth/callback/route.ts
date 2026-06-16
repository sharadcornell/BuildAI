import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-auth";
import { dashboardPathForRole, type Role } from "@/lib/auth";

// Phase 4B — Supabase OAuth (Google) callback for the @supabase/ssr PKCE flow.
//
// The provider redirects here with a `?code=…` that must be exchanged for a
// session cookie server-side. This route is INERT until Google sign-in is enabled
// (NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true) and the Supabase Google provider is
// configured — nothing reaches it otherwise. It performs NO auto-elevation: the
// post-login destination is purely the role already stored in `profiles` (which
// the auth trigger seeds as the least-privileged 'student'); a missing role falls
// back to the student dashboard, never mentor/admin.

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const oauthError = searchParams.get("error");

  // Provider returned an error, or there's no code → back to login with a notice.
  if (oauthError || !code) {
    return NextResponse.redirect(`${origin}/login?error=oauth`);
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    // Supabase public env not configured — can't complete a session.
    return NextResponse.redirect(`${origin}/login?error=config`);
  }

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/login?error=oauth`);
  }

  // Role-based redirect. The cookie-bound client reads under RLS as the new user.
  // A missing profile/role is NOT auto-elevated — fall back to the student
  // dashboard (least privilege); the auth trigger normally seeds a 'student' row.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", data.user.id)
    .maybeSingle();

  const role = (profile?.role as Role | undefined) ?? null;
  const destination = role ? dashboardPathForRole(role) : "/app";
  return NextResponse.redirect(`${origin}${destination}`);
}
