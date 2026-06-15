import { OffsetCard } from "@/components/ui/OffsetCard";
import { Badge } from "@/components/ui/Badge";
import { MODULES } from "@/content/site";
import type { StudentDashboardData } from "@/lib/dashboard/student";

// Static 13-week / 6-module programme overview (source: src/content/site.ts — the
// same curriculum data the public site uses). When the student has live `progress`
// rows, per-module status and the current week are layered on top; otherwise it
// renders as a clean, clearly-labelled programme preview.

// First/last week covered by each module id (drives "current module" highlighting).
const MODULE_WEEKS: Record<string, [number, number]> = {
  M0: [1, 1],
  M1: [2, 4],
  M2: [5, 7],
  M3: [8, 8],
  M4: [9, 10],
  M5: [11, 13],
};

function statusLabel(status: string | null): string {
  if (status === "completed") return "Completed";
  if (status === "in_progress") return "In progress";
  return "Upcoming";
}

export function ProgrammeTimeline({ data }: { data: StudentDashboardData }) {
  const { currentWeek, progress } = data;

  // Map module id -> live status (if any progress rows exist).
  const statusByModule = new Map<string, string | null>();
  for (const p of progress) {
    if (p.module) statusByModule.set(p.module, p.status ?? null);
  }
  const hasLiveProgress = statusByModule.size > 0 || currentWeek !== null;

  return (
    <OffsetCard>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-2xl uppercase">13-week programme</h3>
        <Badge>{currentWeek ? `Current: Week ${currentWeek}` : "Not started"}</Badge>
      </div>

      {!hasLiveProgress ? (
        <p className="mt-3 text-sm text-brand-paper/70">
          Programme overview — your live week-by-week progress unlocks once your cohort begins.
        </p>
      ) : null}

      <ol className="mt-5 space-y-3">
        {MODULES.map((m) => {
          const [from, to] = MODULE_WEEKS[m.id] ?? [0, 0];
          const isCurrent =
            currentWeek !== null && currentWeek >= from && currentWeek <= to;
          const liveStatus = statusByModule.get(m.id);
          const label = liveStatus
            ? statusLabel(liveStatus)
            : isCurrent
              ? "In progress"
              : "Upcoming";

          return (
            <li
              key={m.id}
              className={
                "flex flex-col gap-1 border-2 p-3 sm:flex-row sm:items-center sm:justify-between " +
                (isCurrent
                  ? "border-brand-yellow bg-brand-yellow/10"
                  : "border-white/15")
              }
            >
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-bold text-brand-yellow">{m.id}</span>
                <div>
                  <p className="font-bold text-brand-paper">{m.title}</p>
                  <p className="text-xs text-brand-paper/60">{m.weeks}</p>
                </div>
              </div>
              <span className="shrink-0 text-xs font-bold uppercase tracking-wide text-brand-paper/70">
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </OffsetCard>
  );
}
