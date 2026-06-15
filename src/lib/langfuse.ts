/**
 * Phase 2 — Langfuse links for full prompt + response traces in mentor/admin views.
 * LiteLLM forwards traces to Langfuse automatically when configured.
 * Docs: https://langfuse.com/docs
 */
export function langfuseTraceUrl(traceId: string) {
  const host =
    process.env.LANGFUSE_OTEL_HOST ??
    process.env.LANGFUSE_HOST ??
    "https://cloud.langfuse.com";
  return `${host}/trace/${traceId}`;
}

/**
 * Phase 3A — server-side config check for the admin dashboard.
 * True only when both Langfuse keys are present. Reads server env only; the
 * secret key is never sent to the client (this is only ever called server-side).
 */
export function isLangfuseConfigured(): boolean {
  return Boolean(
    process.env.LANGFUSE_PUBLIC_KEY && process.env.LANGFUSE_SECRET_KEY,
  );
}
