import { OffsetCard } from "@/components/ui/OffsetCard";
import { Badge } from "@/components/ui/Badge";
import { BUDGET_EXHAUSTED_MESSAGE, type StudentAiAccess } from "@/lib/ai/access";

// Phase 3A — student AI access card (per-key DOLLAR-budget model). Renders
// metadata only: status, dollar budget / used / remaining, budget period,
// allowed models, and a MASKED key hint. It NEVER shows a raw key — none is
// stored. When no record exists it shows a "not issued" state; when the budget is
// spent it shows the exact exhausted message.

const STATUS_LABEL: Record<StudentAiAccess["status"], string> = {
  pending: "Pending",
  active: "Active",
  suspended: "Suspended",
  revoked: "Revoked",
  exhausted: "Exhausted",
};

const PERIOD_LABEL: Record<string, string> = {
  calendar_month: "Calendar month",
};

function usd(n: number): string {
  return `$${n.toFixed(2)}`;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-2">
      <dt className="text-brand-paper/60">{label}</dt>
      <dd className="text-right font-bold text-brand-paper">{value}</dd>
    </div>
  );
}

export function StudentAiAccessCard({
  access,
}: {
  access: StudentAiAccess | null;
}) {
  // No record yet → explicit "coming later / not issued" state.
  if (!access) {
    return (
      <OffsetCard accent>
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-2xl uppercase">AI access</h3>
          <Badge>Not issued</Badge>
        </div>
        <p className="mt-3 text-sm text-brand-paper/80">
          Your BuildAI API key isn&apos;t issued yet. Once your cohort goes live you&apos;ll get a
          key with a dollar usage budget here — you never handle raw provider keys.
        </p>
        <p className="mt-3 text-xs text-brand-paper/50">Nothing to set up right now.</p>
      </OffsetCard>
    );
  }

  const models =
    access.allowedModels && access.allowedModels.length
      ? access.allowedModels.join(", ")
      : "All available models";

  return (
    <OffsetCard accent>
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-2xl uppercase">AI access</h3>
        <Badge>{STATUS_LABEL[access.status]}</Badge>
      </div>

      {/* Budget-exhausted banner with the exact required copy. */}
      {access.isExhausted ? (
        <p className="mt-3 border-2 border-brand-yellow bg-brand-yellow/10 p-3 text-sm font-bold text-brand-yellow">
          {BUDGET_EXHAUSTED_MESSAGE}
        </p>
      ) : null}

      <dl className="mt-4 space-y-2 text-sm">
        <Row label="Status" value={STATUS_LABEL[access.status]} />
        <Row label="Monthly budget" value={usd(access.monthlyBudgetUsd)} />
        <Row label="Used" value={usd(access.usedUsd)} />
        <Row
          label="Remaining"
          value={usd(Math.max(0, access.remainingUsd))}
        />
        <Row
          label="Budget period"
          value={PERIOD_LABEL[access.budgetPeriod] ?? access.budgetPeriod}
        />
        <Row label="Models" value={models} />
        <Row label="Key" value={access.keyHint ?? "Not issued yet"} />
      </dl>

      {!access.isExhausted ? (
        <p className="mt-4 text-xs text-brand-paper/50">
          {access.status === "active"
            ? "Use your BuildAI gateway key in your apprenticeship apps — never a raw provider key."
            : access.status === "pending"
              ? "Your access is being prepared. Your key and budget will be issued shortly."
              : access.status === "suspended"
                ? "Your AI access is temporarily paused. Contact the BuildAI team if this is unexpected."
                : "Your AI access has been revoked. Contact the BuildAI team if you need it restored."}
        </p>
      ) : null}
    </OffsetCard>
  );
}
