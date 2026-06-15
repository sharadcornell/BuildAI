import { OffsetCard } from "@/components/ui/OffsetCard";
import { Badge } from "@/components/ui/Badge";
import type { StudentAiAccess } from "@/lib/ai/access";

// Phase 3A — student AI access status card. Renders metadata only (status,
// budget, allowed models, MASKED key hint). It NEVER shows a raw key — none is
// stored. When no record exists yet, it shows a clear "not issued" state.

const STATUS_LABEL: Record<StudentAiAccess["status"], string> = {
  pending: "Pending",
  active: "Active",
  suspended: "Suspended",
  revoked: "Revoked",
};

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
          Your BuildAI API key, model gateway, and usage &amp; budget aren&apos;t issued yet.
          They&apos;ll appear here once your cohort goes live — you never handle raw provider keys.
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

      <dl className="mt-4 space-y-2 text-sm">
        <Row label="Status" value={STATUS_LABEL[access.status]} />
        <Row
          label="Monthly budget"
          value={
            access.monthlyBudgetUsd != null
              ? `$${access.monthlyBudgetUsd}`
              : "To be set"
          }
        />
        <Row label="Models" value={models} />
        <Row label="Key" value={access.keyHint ?? "Not issued yet"} />
      </dl>

      <p className="mt-4 text-xs text-brand-paper/50">
        {access.status === "active"
          ? "Use your BuildAI gateway key in your apprenticeship apps — never a raw provider key."
          : access.status === "pending"
            ? "Your access is being prepared. Your key and budget will be issued shortly."
            : access.status === "suspended"
              ? "Your AI access is temporarily paused. Contact the BuildAI team if this is unexpected."
              : "Your AI access has been revoked. Contact the BuildAI team if you need it restored."}
      </p>
    </OffsetCard>
  );
}
