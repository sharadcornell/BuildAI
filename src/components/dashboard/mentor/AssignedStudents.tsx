import { OffsetCard } from "@/components/ui/OffsetCard";
import type { MentorDashboardData } from "@/lib/dashboard/mentor";

function statusLabel(status: string | null): string {
  if (status === "completed") return "Completed";
  if (status === "in_progress") return "In progress";
  if (status) return status;
  return "Not started";
}

export function AssignedStudents({ data }: { data: MentorDashboardData }) {
  const { students, namesUnavailable } = data;

  return (
    <OffsetCard>
      <h3 className="font-display text-2xl uppercase">Assigned students</h3>

      {students.length === 0 ? (
        <p className="mt-4 border-2 border-dashed border-white/20 p-3 text-sm text-brand-paper/70">
          No assigned students yet. When an admin places students in your pod, each student&apos;s
          cohort and progress summary will show here.
        </p>
      ) : (
        <>
          <ul className="mt-4 space-y-3 text-sm">
            {students.map((s, i) => (
              <li
                key={s.profileId}
                className="flex flex-col gap-1 border-2 border-white/15 p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-bold text-brand-paper">{s.name ?? `Assigned student ${i + 1}`}</p>
                  <p className="text-xs text-brand-paper/60">
                    {s.cohortName ? `${s.cohortName} · ` : ""}
                    {s.deliverables > 0 ? `${s.deliverables} deliverable(s)` : "No progress recorded"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wide text-brand-paper/60">
                    {s.currentWeek ? `Week ${s.currentWeek}` : "—"}
                  </span>
                  <span className="border border-white/20 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-brand-paper/80">
                    {statusLabel(s.lastStatus)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          {namesUnavailable ? (
            <p className="mt-3 text-xs text-brand-paper/50">
              Student names appear once the mentor read policy (migration 0003) is applied. Progress
              and cohort data above are live.
            </p>
          ) : null}
        </>
      )}
    </OffsetCard>
  );
}
