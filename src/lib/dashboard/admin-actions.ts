"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";

// Allowlisted lead tables — guards against the action being driven against any
// other table via a tampered form field.
const LEAD_TABLES = new Set([
  "pilot_inquiries",
  "student_waitlist",
  "mentor_applications",
]);

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Toggle a lead's `handled` flag. Admin-only and non-destructive.
 * Security: re-checks the caller is an admin (requireRole) on every call, only
 * touches allowlisted lead tables, validates the id, and performs the write with
 * the server-only service-role client (the lead tables have no admin UPDATE RLS
 * policy by design — so this stays server-side and never needs the key in the
 * browser). No row is ever deleted.
 */
export async function setLeadHandled(formData: FormData) {
  await requireRole(["admin"]);

  const table = String(formData.get("table") ?? "");
  const id = String(formData.get("id") ?? "");
  const handled = String(formData.get("handled") ?? "") === "true";

  if (!LEAD_TABLES.has(table) || !UUID_RE.test(id)) return;

  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  await supabase.from(table).update({ handled }).eq("id", id);
  revalidatePath("/app/admin");
}
