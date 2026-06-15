import { getSessionUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server-auth";
import { isLiteLLMConfigured } from "@/lib/ai/litellm";
import { isLangfuseConfigured } from "@/lib/langfuse";

// Phase 3A — AI access control-plane loaders (per-key DOLLAR-budget model).
// Reads run through the cookie-bound SSR client, so the RLS on `student_ai_access`
// (0004_ai_access.sql) is what authorizes every query: a student sees only their
// own row; an admin sees all. Everything is error-wrapped so a missing table
// (migration not yet run) or empty data yields a clean state, never a 500.
// NOTE: this table holds METADATA + a MASKED key hint + dollar budget/spend only
// — never a raw key. Spend is dollar-based; RPM/TPM/daily limits are out of scope.

/** Default dollar budget for a newly-issued BuildAI API key. */
export const DEFAULT_BUDGET_USD = 5;

/** Exact copy shown to a student whose key budget is used up. */
export const BUDGET_EXHAUSTED_MESSAGE =
  "Budget exhausted. Please contact your BuildAI admin.";

export type AiAccessStatus =
  | "pending"
  | "active"
  | "suspended"
  | "revoked"
  | "exhausted";

/** Safe, client-passable shape — contains no raw key, only a masked hint. */
export type StudentAiAccess = {
  label: string | null;
  status: AiAccessStatus;
  keyHint: string | null;
  monthlyBudgetUsd: number;
  budgetPeriod: string;
  usedUsd: number;
  remainingUsd: number;
  /** True when the budget is spent (remaining <= 0) or status is 'exhausted'. */
  isExhausted: boolean;
  allowedModels: string[] | null;
  issuedAt: string | null;
  revokedAt: string | null;
  lastSyncedAt: string | null;
};

export type AiConfigStatus = {
  litellmConfigured: boolean;
  langfuseConfigured: boolean;
};

export function getAiConfigStatus(): AiConfigStatus {
  return {
    litellmConfigured: isLiteLLMConfigured(),
    langfuseConfigured: isLangfuseConfigured(),
  };
}

type AiAccessRow = {
  label: string | null;
  status: string | null;
  litellm_virtual_key_hint: string | null;
  monthly_budget_usd: number | null;
  budget_period: string | null;
  last_synced_spend_usd: number | null;
  allowed_models: string[] | null;
  issued_at: string | null;
  revoked_at: string | null;
  last_synced_at: string | null;
};

/** Round to cents to avoid float noise in the UI. */
function money(n: number): number {
  return Math.round(n * 100) / 100;
}

function mapRow(r: AiAccessRow): StudentAiAccess {
  const budget = r.monthly_budget_usd ?? 0;
  const used = r.last_synced_spend_usd ?? 0;
  const remaining = money(budget - used);
  const status = (r.status as AiAccessStatus) ?? "pending";
  return {
    label: r.label ?? null,
    status,
    keyHint: r.litellm_virtual_key_hint ?? null,
    monthlyBudgetUsd: money(budget),
    budgetPeriod: r.budget_period ?? "calendar_month",
    usedUsd: money(used),
    remainingUsd: remaining,
    isExhausted: status === "exhausted" || remaining <= 0,
    allowedModels: r.allowed_models ?? null,
    issuedAt: r.issued_at ?? null,
    revokedAt: r.revoked_at ?? null,
    lastSyncedAt: r.last_synced_at ?? null,
  };
}

const ROW_COLS =
  "label, status, litellm_virtual_key_hint, monthly_budget_usd, budget_period, last_synced_spend_usd, allowed_models, issued_at, revoked_at, last_synced_at";

/**
 * The current student's own AI access record, or null when none has been issued
 * yet (RLS-scoped to the caller). Returns null on any error / unconfigured env.
 */
export async function getStudentAiAccess(): Promise<StudentAiAccess | null> {
  const user = await getSessionUser();
  if (!user) return null;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  try {
    const { data } = await supabase
      .from("student_ai_access")
      .select(ROW_COLS)
      .eq("user_id", user.id)
      .maybeSingle();

    return data ? mapRow(data as AiAccessRow) : null;
  } catch {
    return null;
  }
}

export type AdminAiAccessRecord = {
  id: string;
  studentName: string | null;
  studentEmailHint: string | null;
  status: AiAccessStatus;
  keyHint: string | null;
  monthlyBudgetUsd: number;
  usedUsd: number;
  remainingUsd: number;
  allowedModels: string[] | null;
  lastSyncedAt: string | null;
  createdAt: string | null;
};

export type AdminAiAccessOverview = {
  config: AiConfigStatus;
  counts: {
    pending: number;
    active: number;
    suspended: number;
    revoked: number;
    exhausted: number;
    total: number;
  };
  /** Aggregate dollar budget + spend across all records (admin usage summary). */
  usage: { totalBudgetUsd: number; totalUsedUsd: number; totalRemainingUsd: number };
  recent: AdminAiAccessRecord[];
  /** Students (profiles) with no AI access record yet — candidates for issuance. */
  unassigned: { profileId: string; userId: string; fullName: string | null }[];
};

const RECENT_LIMIT = 12;
const UNASSIGNED_LIMIT = 25;

/**
 * Admin overview of AI access metadata: per-status counts, an aggregate dollar
 * usage summary, recent records (budget/used/remaining), the LiteLLM/Langfuse
 * config status, and the list of students without a record yet (so an admin can
 * create one). RLS-scoped to admins; error-safe.
 */
export async function getAdminAiAccessOverview(): Promise<AdminAiAccessOverview> {
  const base: AdminAiAccessOverview = {
    config: getAiConfigStatus(),
    counts: { pending: 0, active: 0, suspended: 0, revoked: 0, exhausted: 0, total: 0 },
    usage: { totalBudgetUsd: 0, totalUsedUsd: 0, totalRemainingUsd: 0 },
    recent: [],
    unassigned: [],
  };

  const user = await getSessionUser();
  if (!user) return base;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return base;

  const headCount = async (status?: AiAccessStatus) => {
    try {
      let q = supabase
        .from("student_ai_access")
        .select("id", { count: "exact", head: true });
      if (status) q = q.eq("status", status);
      const { count } = await q;
      return count ?? 0;
    } catch {
      return 0;
    }
  };

  try {
    const [total, pending, active, suspended, revoked, exhausted, recent, students, all] =
      await Promise.all([
        headCount(),
        headCount("pending"),
        headCount("active"),
        headCount("suspended"),
        headCount("revoked"),
        headCount("exhausted"),
        supabase
          .from("student_ai_access")
          .select(
            "id, status, litellm_virtual_key_hint, monthly_budget_usd, last_synced_spend_usd, allowed_models, last_synced_at, created_at, profile:profiles ( full_name )",
          )
          .order("created_at", { ascending: false })
          .limit(RECENT_LIMIT),
        // student profiles, to compute the "no record yet" candidates
        supabase
          .from("profiles")
          .select("id, user_id, full_name, role")
          .eq("role", "student")
          .limit(200),
        // budget/spend totals across ALL records for the usage summary
        supabase
          .from("student_ai_access")
          .select("monthly_budget_usd, last_synced_spend_usd"),
      ]);

    base.counts = { pending, active, suspended, revoked, exhausted, total };

    const allRows = (all.data ?? []) as {
      monthly_budget_usd: number | null;
      last_synced_spend_usd: number | null;
    }[];
    const totalBudget = allRows.reduce((s, r) => s + (r.monthly_budget_usd ?? 0), 0);
    const totalUsed = allRows.reduce((s, r) => s + (r.last_synced_spend_usd ?? 0), 0);
    base.usage = {
      totalBudgetUsd: money(totalBudget),
      totalUsedUsd: money(totalUsed),
      totalRemainingUsd: money(totalBudget - totalUsed),
    };

    base.recent = (recent.data ?? []).map((r) => {
      const profile = (r.profile ?? null) as { full_name?: string | null } | null;
      const budget = (r.monthly_budget_usd as number | null) ?? 0;
      const used = (r.last_synced_spend_usd as number | null) ?? 0;
      return {
        id: r.id as string,
        studentName: profile?.full_name ?? null,
        studentEmailHint: null,
        status: ((r.status as AiAccessStatus) ?? "pending"),
        keyHint: (r.litellm_virtual_key_hint as string | null) ?? null,
        monthlyBudgetUsd: money(budget),
        usedUsd: money(used),
        remainingUsd: money(budget - used),
        allowedModels: (r.allowed_models as string[] | null) ?? null,
        lastSyncedAt: (r.last_synced_at as string | null) ?? null,
        createdAt: (r.created_at as string | null) ?? null,
      };
    });

    // Candidates = student profiles with no access row yet.
    try {
      const { data: existing } = await supabase
        .from("student_ai_access")
        .select("profile_id");
      const taken = new Set((existing ?? []).map((e) => e.profile_id as string));
      base.unassigned = (students.data ?? [])
        .filter((p) => !taken.has(p.id as string))
        .slice(0, UNASSIGNED_LIMIT)
        .map((p) => ({
          profileId: p.id as string,
          userId: p.user_id as string,
          fullName: (p.full_name as string | null) ?? null,
        }));
    } catch {
      base.unassigned = [];
    }
  } catch {
    // Error-safe: return whatever was gathered (counts default to 0).
  }

  return base;
}
