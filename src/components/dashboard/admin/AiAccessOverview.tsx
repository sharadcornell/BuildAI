import { OffsetCard } from "@/components/ui/OffsetCard";
import { Badge } from "@/components/ui/Badge";
import { createAiAccessRecord, setAiAccessStatus } from "@/lib/ai/access-actions";
import type { AdminAiAccessOverview } from "@/lib/ai/access";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function fmtDate(value: string | null): string {
  if (!value) return "—";
  const m = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return value;
  const [, y, mo, d] = m;
  return `${Number(d)} ${MONTHS[Number(mo) - 1] ?? mo} ${y}`;
}

function ConfigPill({ label, configured }: { label: string; configured: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 border-2 border-dashed border-white/20 p-3">
      <span className="font-display text-lg uppercase">{label}</span>
      <span
        className={
          "shrink-0 border px-2 py-0.5 text-xs font-bold uppercase tracking-wide " +
          (configured
            ? "border-brand-yellow text-brand-yellow"
            : "border-white/30 text-brand-paper/60")
        }
      >
        {configured ? "Configured" : "Not configured"}
      </span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-white/15 p-3 text-center">
      <div className="font-display text-3xl">{value}</div>
      <div className="mt-1 text-[10px] font-bold uppercase tracking-wide text-brand-paper/55">
        {label}
      </div>
    </div>
  );
}

// Phase 3A — admin AI access control-plane overview. Shows config status,
// per-status counts, recent metadata records, and non-destructive admin actions
// (create a planned record; suspend / revoke / reactivate). No raw keys are ever
// shown — only masked hints — and no real LiteLLM key is issued in this phase.
export function AiAccessOverview({ data }: { data: AdminAiAccessOverview }) {
  const { config, counts, recent, unassigned } = data;

  return (
    <OffsetCard>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-2xl uppercase">AI access</h3>
        <Badge>{counts.total} record{counts.total === 1 ? "" : "s"}</Badge>
      </div>

      {/* Infra config status */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <ConfigPill label="LiteLLM gateway" configured={config.litellmConfigured} />
        <ConfigPill label="Langfuse traces" configured={config.langfuseConfigured} />
      </div>
      {!config.litellmConfigured ? (
        <p className="mt-3 text-xs text-brand-paper/55">
          LiteLLM isn&apos;t configured, so no live virtual keys are issued. Records created here are{" "}
          <span className="font-bold">planned (pending)</span> metadata only — they don&apos;t mint a
          real key. Live issuance arrives once the proxy is connected.
        </p>
      ) : null}

      {/* Status counts */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Active" value={counts.active} />
        <Stat label="Pending" value={counts.pending} />
        <Stat label="Suspended" value={counts.suspended} />
        <Stat label="Revoked" value={counts.revoked} />
      </div>

      {/* Create a planned record */}
      <div className="mt-6 border-2 border-dashed border-white/20 p-3">
        <h4 className="font-display text-lg uppercase">Plan access for a student</h4>
        {unassigned.length === 0 ? (
          <p className="mt-2 text-xs text-brand-paper/60">
            Every student profile already has an AI access record (or there are no student
            profiles yet).
          </p>
        ) : (
          <form action={createAiAccessRecord} className="mt-3 flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1 text-xs uppercase tracking-wide text-brand-paper/60">
              Student
              <select
                name="profile_id"
                required
                className="min-w-[200px] border border-white/30 bg-transparent px-2 py-1 text-sm text-brand-paper"
              >
                {unassigned.map((s) => (
                  <option key={s.profileId} value={s.profileId} className="text-black">
                    {s.fullName ?? s.profileId.slice(0, 8)}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs uppercase tracking-wide text-brand-paper/60">
              Budget (USD/mo)
              <input
                type="number"
                name="monthly_budget_usd"
                min="0"
                step="1"
                placeholder="optional"
                className="w-28 border border-white/30 bg-transparent px-2 py-1 text-sm text-brand-paper placeholder:text-brand-paper/30"
              />
            </label>
            <button
              type="submit"
              className="border border-white/30 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-paper/80 hover:border-brand-yellow hover:text-brand-yellow"
            >
              Create pending record
            </button>
          </form>
        )}
      </div>

      {/* Recent records */}
      {recent.length === 0 ? (
        <p className="mt-5 border-2 border-dashed border-white/20 p-3 text-sm text-brand-paper/70">
          No AI access records yet. Plan one above, or they&apos;ll appear here once issued.
        </p>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b-2 border-white/20 text-xs uppercase tracking-wide text-brand-paper/60">
                <th className="py-2 pr-4 font-bold">Student</th>
                <th className="py-2 pr-4 font-bold">Status</th>
                <th className="py-2 pr-4 font-bold">Budget</th>
                <th className="py-2 pr-4 font-bold">Key</th>
                <th className="py-2 pr-4 font-bold">Created</th>
                <th className="py-2 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((r) => (
                <tr key={r.id} className="border-b border-white/10 align-top">
                  <td className="py-2 pr-4 text-brand-paper/90">{r.studentName ?? "—"}</td>
                  <td className="py-2 pr-4">
                    <span className="inline-block border border-white/30 px-2 py-0.5 text-xs font-bold uppercase text-brand-paper/80">
                      {r.status}
                    </span>
                  </td>
                  <td className="py-2 pr-4 text-brand-paper/70">
                    {r.monthlyBudgetUsd != null ? `$${r.monthlyBudgetUsd}` : "—"}
                  </td>
                  <td className="py-2 pr-4 text-brand-paper/70">{r.keyHint ?? "—"}</td>
                  <td className="py-2 pr-4 text-brand-paper/70">{fmtDate(r.createdAt)}</td>
                  <td className="py-2">
                    <div className="flex flex-wrap gap-2">
                      {(["active", "suspended", "revoked"] as const)
                        .filter((s) => s !== r.status)
                        .map((s) => (
                          <form key={s} action={setAiAccessStatus}>
                            <input type="hidden" name="id" value={r.id} />
                            <input type="hidden" name="status" value={s} />
                            <button
                              type="submit"
                              className="border border-white/30 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-brand-paper/80 hover:border-brand-yellow hover:text-brand-yellow"
                            >
                              {s === "active" ? "Activate" : s === "suspended" ? "Suspend" : "Revoke"}
                            </button>
                          </form>
                        ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </OffsetCard>
  );
}
