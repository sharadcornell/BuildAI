/**
 * Phase 3A — server-only LiteLLM control-plane helper.
 *
 * This module reads the LiteLLM proxy env vars (URL + master key) and exposes a
 * SMALL, SAFE surface for the AI access control plane. It is SERVER-ONLY: never
 * import it into a Client Component. The master key is read from a non-public env
 * var (`LITELLM_MASTER_KEY`), so it can never reach the browser bundle.
 *
 * Design rules for this phase:
 *  - If the proxy is NOT configured, every function returns a typed
 *    `{ ok: false, reason: "not_configured" }` result — it NEVER throws and never
 *    pretends an action happened. Callers render a clean "not configured" state.
 *  - We never log the master key or a returned raw virtual key.
 *  - If live issuance returns a raw key, it is returned ONCE to the caller (the
 *    admin action) to show the admin a single time; it is never persisted to
 *    Supabase. Only a masked hint + the proxy's key id are stored.
 *
 * Docs: https://docs.litellm.ai/docs/proxy/virtual_keys
 */

// Prefer the Phase-3 name; fall back to the legacy LITELLM_BASE_URL from the
// Phase-2 stub so an existing setup keeps working.
const BASE = process.env.LITELLM_PROXY_BASE_URL ?? process.env.LITELLM_BASE_URL;
const MASTER = process.env.LITELLM_MASTER_KEY;

/** True only when both the proxy URL and master key are present. */
export function isLiteLLMConfigured(): boolean {
  return Boolean(BASE && MASTER);
}

export type LiteLLMNotConfigured = { ok: false; reason: "not_configured" };
export type LiteLLMError = { ok: false; reason: "error"; status?: number };

export type CreatedVirtualKey = {
  ok: true;
  /** The proxy's identifier for the key (safe to store — NOT the secret). */
  keyId: string | null;
  /** Masked display hint, e.g. "sk-…a1b2". Safe to store/show. */
  keyHint: string | null;
  /**
   * The raw virtual key, returned ONCE for a single admin display.
   * NEVER persist this. Omitted entirely once shown.
   */
  rawKey: string | null;
};

export type RevokedVirtualKey = { ok: true };

/** Mask a raw key down to a safe, storable hint: keeps a prefix + last 4 chars. */
export function maskKey(raw: string): string {
  if (!raw) return "";
  const tail = raw.slice(-4);
  const head = raw.startsWith("sk-") ? "sk-" : raw.slice(0, 2);
  return `${head}…${tail}`;
}

/**
 * Issue a LiteLLM virtual key for a student. Returns the proxy key id + a masked
 * hint + the raw key (for one-time admin display only). Returns a not-configured
 * result when the proxy env is absent — it does NOT throw and does NOT fabricate.
 */
export async function createVirtualKeyForStudent(opts: {
  studentProfileId: string;
  budgetUsd?: number | null;
  models?: string[] | null;
}): Promise<CreatedVirtualKey | LiteLLMNotConfigured | LiteLLMError> {
  if (!isLiteLLMConfigured()) return { ok: false, reason: "not_configured" };

  try {
    const res = await fetch(`${BASE}/key/generate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MASTER}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: opts.studentProfileId,
        ...(opts.budgetUsd != null ? { max_budget: opts.budgetUsd } : {}),
        ...(opts.models && opts.models.length ? { models: opts.models } : {}),
        metadata: { source: "buildai", student_profile_id: opts.studentProfileId },
      }),
    });

    if (!res.ok) {
      // Log status only — never the body (could echo secrets/PII).
      console.error(`[litellm] /key/generate failed: ${res.status}`);
      return { ok: false, reason: "error", status: res.status };
    }

    const json = (await res.json()) as { key?: string; key_name?: string; token?: string };
    const raw = json.key ?? null;
    return {
      ok: true,
      keyId: json.key_name ?? json.token ?? null,
      keyHint: raw ? maskKey(raw) : null,
      rawKey: raw,
    };
  } catch {
    // Never leak the error object (could contain the URL/headers).
    console.error("[litellm] /key/generate threw");
    return { ok: false, reason: "error" };
  }
}

/**
 * Revoke a LiteLLM virtual key by its proxy key id. Returns a not-configured
 * result when the proxy env is absent — never throws.
 */
export async function revokeVirtualKey(
  keyId: string,
): Promise<RevokedVirtualKey | LiteLLMNotConfigured | LiteLLMError> {
  if (!isLiteLLMConfigured()) return { ok: false, reason: "not_configured" };

  try {
    const res = await fetch(`${BASE}/key/delete`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MASTER}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ keys: [keyId] }),
    });
    if (!res.ok) {
      console.error(`[litellm] /key/delete failed: ${res.status}`);
      return { ok: false, reason: "error", status: res.status };
    }
    return { ok: true };
  } catch {
    console.error("[litellm] /key/delete threw");
    return { ok: false, reason: "error" };
  }
}
