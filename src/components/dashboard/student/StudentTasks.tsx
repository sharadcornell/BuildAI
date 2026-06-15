import { OffsetCard } from "@/components/ui/OffsetCard";
import { Badge } from "@/components/ui/Badge";
import type { StudentDashboardData } from "@/lib/dashboard/student";

// Upcoming tasks / milestones + a clearly-labelled submission placeholder.
// There is no tasks table yet, so this shows real per-student data when progress
// rows exist, and an honest empty state otherwise. No fabricated assignments.

export function StudentTasks({ data }: { data: StudentDashboardData }) {
  const { progress, enrollment } = data;

  // Derive "open" items from live progress (anything not completed).
  const openItems = progress
    .filter((p) => p.status !== "completed" && (p.deliverable || p.module))
    .slice(0, 5);

  return (
    <OffsetCard>
      <h3 className="font-display text-2xl uppercase">Tasks &amp; milestones</h3>

      {openItems.length > 0 ? (
        <ul className="mt-4 space-y-3 text-sm">
          {openItems.map((p, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-3 border-b border-white/10 pb-2"
            >
              <span className="text-brand-paper/90">
                {p.deliverable ?? p.module ?? "Deliverable"}
                {p.week ? (
                  <span className="text-brand-paper/50"> · Week {p.week}</span>
                ) : null}
              </span>
              <span className="shrink-0 text-xs font-bold uppercase tracking-wide text-brand-paper/60">
                {p.status === "in_progress" ? "In progress" : "To do"}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 border-2 border-dashed border-white/20 p-3 text-sm text-brand-paper/70">
          {enrollment
            ? "No tasks assigned yet. Weekly deliverables appear here as your cohort moves through the programme."
            : "Your weekly deliverables and milestones will show up here once you're enrolled in a cohort."}
        </p>
      )}

      <div className="mt-5 border-t border-white/10 pt-4">
        <div className="flex items-center justify-between gap-3">
          <h4 className="font-display text-lg uppercase">Project submissions</h4>
          <Badge>Coming soon</Badge>
        </div>
        <p className="mt-2 text-sm text-brand-paper/60">
          Submitting your shipped projects and capstone for mentor review will be enabled in a
          later phase.
        </p>
      </div>
    </OffsetCard>
  );
}
