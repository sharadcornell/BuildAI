import { OffsetCard } from "@/components/ui/OffsetCard";
import { Badge } from "@/components/ui/Badge";

const ITEMS: { title: string; body: string }[] = [
  {
    title: "AI key issuance",
    body: "Mint per-student BuildAI gateway keys with budgets and rate limits. Students never hold raw provider keys.",
  },
  {
    title: "LiteLLM usage & cost",
    body: "Per-key / per-student / per-cohort spend, with budget alerts at 80%.",
  },
  {
    title: "Langfuse traces",
    body: "Full prompt + response logs per student, searchable and access-audited.",
  },
  {
    title: "CSV export",
    body: "One-click export of leads, usage, and roster — admin-only, server-side.",
  },
];

export function AdminComingSoon() {
  return (
    <OffsetCard>
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-2xl uppercase">Operations — coming later</h3>
        <Badge>Coming later</Badge>
      </div>
      <p className="mt-2 text-sm text-brand-paper/70">
        AI gateway and observability tooling isn&apos;t wired yet. These admin operations arrive in
        later phases.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {ITEMS.map((it) => (
          <div key={it.title} className="border-2 border-dashed border-white/20 p-3">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-display text-lg uppercase">{it.title}</h4>
              <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-brand-paper/50">
                Soon
              </span>
            </div>
            <p className="mt-2 text-xs text-brand-paper/60">{it.body}</p>
          </div>
        ))}
      </div>
    </OffsetCard>
  );
}
