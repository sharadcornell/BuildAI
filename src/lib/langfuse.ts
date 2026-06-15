/**
 * Phase 2 — Langfuse links for full prompt + response traces in mentor/admin views.
 * LiteLLM forwards traces to Langfuse automatically when configured.
 * Docs: https://langfuse.com/docs
 */
export function langfuseTraceUrl(traceId: string) {
  const host = process.env.LANGFUSE_HOST ?? "https://cloud.langfuse.com";
  return `${host}/trace/${traceId}`;
}
