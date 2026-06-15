/**
 * Phase 2 — BuildAI LLM gateway (LiteLLM).
 * Issues per-student virtual keys with budgets, reads spend, revokes keys.
 * Students point their apprenticeship apps at LITELLM_BASE_URL with their issued key —
 * they NEVER receive raw provider (Anthropic/OpenAI/...) keys.
 * Docs: https://docs.litellm.ai/docs/proxy/virtual_keys
 */
const BASE = process.env.LITELLM_BASE_URL;
const MASTER = process.env.LITELLM_MASTER_KEY;

function assertConfigured() {
  if (!BASE || !MASTER) {
    throw new Error("LiteLLM gateway env vars are not set (Phase 2).");
  }
}

export async function generateStudentKey(opts: {
  studentId: string;
  budgetInr: number;
  models?: string[];
}) {
  assertConfigured();
  const res = await fetch(`${BASE}/key/generate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${MASTER}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: opts.studentId,
      max_budget: opts.budgetInr,
      models: opts.models ?? [],
      metadata: { source: "buildai", student_id: opts.studentId },
    }),
  });
  if (!res.ok) throw new Error(`LiteLLM /key/generate failed: ${res.status}`);
  return res.json();
}

export async function getKeyInfo(key: string) {
  assertConfigured();
  const res = await fetch(`${BASE}/key/info?key=${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${MASTER}` },
  });
  if (!res.ok) throw new Error(`LiteLLM /key/info failed: ${res.status}`);
  return res.json();
}
