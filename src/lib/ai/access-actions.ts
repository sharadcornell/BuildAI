"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";

// Phase 3A — admin-only, non-destructive AI access metadata actions.
//
// These manage the `student_ai_access` control-plane METADATA only. They do NOT
// call LiteLLM and do NOT mint real virtual keys in this phase — "create" records
// a PLANNED access row (status 'pending'); status changes are simple updates.
// Nothing here ever stores a raw key, and no row is ever deleted (revoke is a
// status, not a delete). Writes use the server-only service-role client, so the
// master/service keys never touch the browser.

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const STATUSES = new Set(["pending", "active", "suspended", "revoked"]);

/**
 * Create a PLANNED AI access record (status 'pending') for a student. Idempotent:
 * the table's unique(profile_id) + on-conflict-do-nothing means re-submitting is
 * harmless. No real key is issued — this only records intent for a later phase.
 */
export async function createAiAccessRecord(formData: FormData) {
  await requireRole(["admin"]);

  const profileId = String(formData.get("profile_id") ?? "");
  const budgetRaw = String(formData.get("monthly_budget_usd") ?? "").trim();

  if (!UUID_RE.test(profileId)) return;

  let budget: number | null = null;
  if (budgetRaw) {
    const n = Number(budgetRaw);
    if (Number.isFinite(n) && n >= 0) budget = n;
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  // Resolve user_id from the profile server-side, so the form only submits a
  // profile_id (a <select> can't carry a second value). Also confirms the
  // profile exists before we write.
  const { data: profile } = await supabase
    .from("profiles")
    .select("user_id")
    .eq("id", profileId)
    .maybeSingle();

  const userId = (profile?.user_id as string | null) ?? null;
  if (!userId || !UUID_RE.test(userId)) return;

  await supabase
    .from("student_ai_access")
    .upsert(
      {
        profile_id: profileId,
        user_id: userId,
        status: "pending",
        monthly_budget_usd: budget,
      },
      { onConflict: "profile_id", ignoreDuplicates: true },
    );

  revalidatePath("/app/admin");
}

/**
 * Change an AI access record's status (pending / active / suspended / revoked).
 * Non-destructive — only the status (+ issued_at / revoked_at stamps) change; the
 * row is never deleted. No key is issued or revoked at the proxy in this phase.
 */
export async function setAiAccessStatus(formData: FormData) {
  await requireRole(["admin"]);

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!UUID_RE.test(id) || !STATUSES.has(status)) return;

  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  const patch: Record<string, unknown> = { status };
  if (status === "active") {
    // Stamp first activation; harmless to re-stamp on re-activate.
    patch.issued_at = new Date().toISOString();
    patch.revoked_at = null;
  }
  if (status === "revoked") {
    patch.revoked_at = new Date().toISOString();
  }

  await supabase.from("student_ai_access").update(patch).eq("id", id);
  revalidatePath("/app/admin");
}
