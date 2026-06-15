import { OffsetCard } from "@/components/ui/OffsetCard";
import { Badge } from "@/components/ui/Badge";
import {
  createAiAccessRecord,
  setAiAccessStatus,
  updateAiAccessBudget,
  updateAiAccessModels,
} from "@/lib/ai/access-actions";
import { DEFAULT_BUDGET_USD, type AdminAiAccessOverview } from "@/lib/ai/access";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function fmtDate(value: string | null): string {
  if (!value) return "—";
  const m = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return value;
  const [, y, mo, d] = m;
  return `${Number(d)} ${MONTHS[Number(mo) - 1] ?? mo} ${y}`;
}

function usd(n: number): string {
  return `$${n.toFixed(2)}`;
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

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border border-white/15 p-3 text-center">
      <div className="font-display text-2xl">{value}</div>
      <div className="mt-1 text-[10px] font-bold uppercase tracking-wide text-brand-paper/55">
        {label}
      </div>
    </div>
  );
}

// Phase 3A — admin AI access control-plane overview (per-key DOLLAR-budget model).
// Shows config status, per-status counts, an aggregate dollar usage summary, and
// recent API-key records with budget / used / remaining. Admin actions are
// non-destructive: create a planned record ($5 default), edit budget, edit
// allowed models, and activate / suspend / revoke / exhaust. No raw keys are ever
// shown — only masked hints — and no real LiteLLM key is issued in this phase.
export function AiAccessOverview({ data }: { data: AdminAiAccessOverview }) {
  const { config, counts, usage, recent, unassigned } = data;

  return (
    <OffsetCard>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-2xl uppercase">AI access</h3>
        <Badge>{counts.total} key{counts.total === 1 ? "" : "s"}</Badge>
      </div>

      {/* Infra config status */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <ConfigPill label="LiteLLM gateway" configured={config.litellmConfigured} />
        <ConfigPill label="Langfuse traces" configured={config.langfuseConfigured} />
      </div>
      {!config.litellmConfigured ? (
        <p className="mt-3 text-xs text-brand-paper/55">
          LiteLLM isn&apos;t configured, so no live keys are issued and spend isn&apos;t synced.
          Records created here are <span className="font-bold">planned (pending)</span> metadata with
          a dollar budget — they don&apos;t mint a real key.{" "}
          <span className="font-bold">Live issuance and spend sync arrive in Phase 3B.</span>
        </p>
      ) : null}

      {/* Status counts */}
      <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-5">
        <Stat label="Active" value={counts.active} />
        <Stat label="Pending" value={counts.pending} />
        <Stat label="Suspended" value={counts.suspended} />
        <Stat label="Revoked" value={counts.revoked} />
        <Stat label="Exhausted" value={counts.exhausted} />
      </div>

      {/* Aggregate dollar usage summary */}
      <div className="mt-3 grid grid-cols-3 gap-3">
        <Stat label="Total budget" value={usd(usage.totalBudgetUsd)} />
        <Stat label="Total used" value={usd(usage.totalUsedUsd)} />
        <Stat label="Total remaining" value={usd(usage.totalRemainingUsd)} />
      </div>

      {/* Create a planned record */}
      <div className="mt-6 border-2 border-dashed border-white/20 p-3">
        <h4 className="font-display text-lg uppercase">Issue a key for a student</h4>
        {unassigned.length === 0 ? (
          <p className="mt-2 text-xs text-brand-paper/60">
            Every student profile already has an API-key record (or there are no student
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
                step="0.01"
                defaultValue={DEFAULT_BUDGET_USD}
                className="w-28 border border-white/30 bg-transparent px-2 py-1 text-sm text-brand-paper placeholder:text-brand-paper/30"
              />
            </label>
            <button
              type="submit"
              className="border border-white/30 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-paper/80 hover:border-brand-yellow hover:text-brand-yellow"
            >
              Create pending key
            </button>
          </form>
        )}
        <p className="mt-2 text-[11px] text-brand-paper/45">
          New keys default to a {usd(DEFAULT_BUDGET_USD)} monthly budget on the calendar month.
        </p>
      </div>

      {/* Recent records */}
      {recent.length === 0 ? (
        <p className="mt-5 border-2 border-dashed border-white/20 p-3 text-sm text-brand-paper/70">
          No API-key records yet. Issue one above, or they&apos;ll appear here once created.
        </p>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b-2 border-white/20 text-xs uppercase tracking-wide text-brand-paper/60">
                <th className="py-2 pr-4 font-bold">Student</th>
                <th className="py-2 pr-4 font-bold">Status</th>
                <th className="py-2 pr-4 font-bold">Budget / Used / Left</th>
                <th className="py-2 pr-4 font-bold">Models</th>
                <th className="py-2 pr-4 font-bold">Synced</th>
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
                  <td className="py-2 pr-4 text-brand-paper/80">
                    {usd(r.monthlyBudgetUsd)} / {usd(r.usedUsd)} /{" "}
                    <span className={r.remainingUsd <= 0 ? "text-brand-yellow" : ""}>
                      {usd(Math.max(0, r.remainingUsd))}
                    </span>
                    <form action={updateAiAccessBudget} className="mt-1 flex items-center gap-1">
                      <input type="hidden" name="id" value={r.id} />
                      <input
                        type="number"
                        name="monthly_budget_usd"
                        min="0"
                        step="0.01"
                        defaultValue={r.monthlyBudgetUsd}
                        className="w-20 border border-white/20 bg-transparent px-1 py-0.5 text-xs text-brand-paper"
                      />
                      <button
                        type="submit"
                        className="border border-white/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-brand-paper/70 hover:border-brand-yellow hover:text-brand-yellow"
                      >
                        Set
                      </button>
                    </form>
                  </td>
                  <td className="py-2 pr-4 text-brand-paper/70">
                    {r.allowedModels && r.allowedModels.length ? r.allowedModels.join(", ") : "All"}
                    <form action={updateAiAccessModels} className="mt-1 flex items-center gap-1">
                      <input type="hidden" name="id" value={r.id} />
                      <input
                        type="text"
                        name="allowed_models"
                        defaultValue={(r.allowedModels ?? []).join(", ")}
                        placeholder="comma-separated; blank = all"
                        className="w-40 border border-white/20 bg-transparent px-1 py-0.5 text-xs text-brand-paper placeholder:text-brand-paper/30"
                      />
                      <button
                        type="submit"
                        className="border border-white/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-brand-paper/70 hover:border-brand-yellow hover:text-brand-yellow"
                      >
                        Set
                      </button>
                    </form>
                  </td>
                  <td className="py-2 pr-4 text-brand-paper/70">{fmtDate(r.lastSyncedAt)}</td>
                  <td className="py-2">
                    <div className="flex flex-wrap gap-2">
                      {(["active", "suspended", "revoked", "exhausted"] as const)
                        .filter((s) => s !== r.status)
                        .map((s) => (
                          <form key={s} action={setAiAccessStatus}>
                            <input type="hidden" name="id" value={r.id} />
                            <input type="hidden" name="status" value={s} />
                            <button
                              type="submit"
                              className="border border-white/30 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-brand-paper/80 hover:border-brand-yellow hover:text-brand-yellow"
                            >
                              {s === "active"
                                ? "Activate"
                                : s === "suspended"
                                  ? "Suspend"
                                  : s === "revoked"
                                    ? "Revoke"
                                    : "Exhaust"}
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
