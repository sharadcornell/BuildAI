"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { DEFAULT_BUDGET_USD } from "@/lib/ai/access";

// Phase 3A — admin-only, non-destructive AI access metadata actions
// (per-key DOLLAR-budget model).
//
// These manage the `student_ai_access` control-plane METADATA only. They do NOT
// call LiteLLM and do NOT mint real virtual keys in this phase — "create" records
// a PLANNED API key (status 'pending', budget $5); the rest are simple updates.
// Nothing here ever stores a raw key, and no row is ever deleted (suspend/revoke/
// exhaust are status changes, not deletes). Writes use the server-only
// service-role client, so the master/service keys never touch the browser.

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const STATUSES = new Set(["pending", "active", "suspended", "revoked", "exhausted"]);

/** Parse a non-negative dollar amount; returns null when blank/invalid. */
function parseBudget(raw: string): number | null {
  const t = raw.trim();
  if (!t) return null;
  const n = Number(t);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

/**
 * Create a PLANNED API-key record (status 'pending') for a student. Defaults to a
 * $5 monthly dollar budget on the calendar month. Idempotent: the table's
 * unique(profile_id) + on-conflict-do-nothing means re-submitting is harmless.
 * No real key is issued — this only records intent for Phase 3B.
 */
export async function createAiAccessRecord(formData: FormData) {
  await requireRole(["admin"]);

  const profileId = String(formData.get("profile_id") ?? "");
  if (!UUID_RE.test(profileId)) return;

  const budget = parseBudget(String(formData.get("monthly_budget_usd") ?? ""));

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

  await supabase.from("student_ai_access").upsert(
    {
      profile_id: profileId,
      user_id: userId,
      label: "Default API key",
      status: "pending",
      monthly_budget_usd: budget ?? DEFAULT_BUDGET_USD,
      budget_period: "calendar_month",
    },
    { onConflict: "profile_id", ignoreDuplicates: true },
  );

  revalidatePath("/app/admin");
}

/**
 * Update an API key's monthly dollar budget. Non-destructive. A blank/invalid
 * value is ignored (no write).
 */
export async function updateAiAccessBudget(formData: FormData) {
  await requireRole(["admin"]);

  const id = String(formData.get("id") ?? "");
  const budget = parseBudget(String(formData.get("monthly_budget_usd") ?? ""));
  if (!UUID_RE.test(id) || budget == null) return;

  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  await supabase
    .from("student_ai_access")
    .update({ monthly_budget_usd: budget })
    .eq("id", id);
  revalidatePath("/app/admin");
}

/**
 * Update an API key's allowed-models list. Accepts a comma/whitespace-separated
 * list; an empty value clears it (null = "all available models"). Non-destructive.
 */
export async function updateAiAccessModels(formData: FormData) {
  await requireRole(["admin"]);

  const id = String(formData.get("id") ?? "");
  if (!UUID_RE.test(id)) return;

  const raw = String(formData.get("allowed_models") ?? "");
  const models = raw
    .split(/[\n,]+/)
    .map((m) => m.trim())
    .filter(Boolean);

  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  await supabase
    .from("student_ai_access")
    .update({ allowed_models: models.length ? models : null })
    .eq("id", id);
  revalidatePath("/app/admin");
}

/**
 * Change an API key's status (pending / active / suspended / revoked / exhausted).
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
