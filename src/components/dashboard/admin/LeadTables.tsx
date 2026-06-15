import { OffsetCard } from "@/components/ui/OffsetCard";
import { Badge } from "@/components/ui/Badge";
import { setLeadHandled } from "@/lib/dashboard/admin-actions";
import type { AdminDashboardData } from "@/lib/dashboard/admin";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Deterministic timestamp -> "DD Mon YYYY" (no locale/timezone surprises in RSC).
function fmtDate(value: string | null): string {
  if (!value) return "—";
  const m = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return value;
  const [, y, mo, d] = m;
  return `${Number(d)} ${MONTHS[Number(mo) - 1] ?? mo} ${y}`;
}

type Col = { header: string; render: (row: Record<string, unknown>) => React.ReactNode };

function LeadTable({
  title,
  table,
  rows,
  total,
  cols,
}: {
  title: string;
  table: string;
  rows: Array<Record<string, unknown> & { id: string; handled: boolean; createdAt: string | null }>;
  total: number;
  cols: Col[];
}) {
  return (
    <OffsetCard>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-2xl uppercase">{title}</h3>
        <Badge>{total} total</Badge>
      </div>

      {rows.length === 0 ? (
        <p className="mt-4 border-2 border-dashed border-white/20 p-3 text-sm text-brand-paper/70">
          No {title.toLowerCase()} yet. New submissions from the public forms will appear here.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b-2 border-white/20 text-xs uppercase tracking-wide text-brand-paper/60">
                {cols.map((c) => (
                  <th key={c.header} className="py-2 pr-4 font-bold">{c.header}</th>
                ))}
                <th className="py-2 pr-4 font-bold">Received</th>
                <th className="py-2 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-white/10 align-top">
                  {cols.map((c) => (
                    <td key={c.header} className="py-2 pr-4 text-brand-paper/90">{c.render(row)}</td>
                  ))}
                  <td className="py-2 pr-4 text-brand-paper/70">{fmtDate(row.createdAt)}</td>
                  <td className="py-2">
                    <form action={setLeadHandled} className="flex items-center gap-2">
                      <input type="hidden" name="table" value={table} />
                      <input type="hidden" name="id" value={row.id} />
                      <input type="hidden" name="handled" value={(!row.handled).toString()} />
                      <span
                        className={
                          "inline-block border px-2 py-0.5 text-xs font-bold uppercase " +
                          (row.handled
                            ? "border-brand-yellow text-brand-yellow"
                            : "border-white/30 text-brand-paper/70")
                        }
                      >
                        {row.handled ? "Handled" : "Open"}
                      </span>
                      <button
                        type="submit"
                        className="border border-white/30 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-brand-paper/80 hover:border-brand-yellow hover:text-brand-yellow"
                      >
                        {row.handled ? "Reopen" : "Mark handled"}
                      </button>
                    </form>
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

export function LeadTables({ data }: { data: AdminDashboardData }) {
  return (
    <div className="space-y-6">
      <LeadTable
        title="Pilot inquiries"
        table="pilot_inquiries"
        total={data.counts.pilot}
        rows={data.pilots}
        cols={[
          { header: "Contact", render: (r) => (r.contactName as string) ?? "—" },
          { header: "Email", render: (r) => (r.email as string) ?? "—" },
          { header: "College", render: (r) => (r.college as string) ?? "—" },
          { header: "Role", render: (r) => (r.role as string) ?? "—" },
        ]}
      />
      <LeadTable
        title="Student waitlist"
        table="student_waitlist"
        total={data.counts.student}
        rows={data.students}
        cols={[
          { header: "Name", render: (r) => (r.fullName as string) ?? "—" },
          { header: "Email", render: (r) => (r.email as string) ?? "—" },
          { header: "College", render: (r) => (r.college as string) ?? "—" },
          { header: "Year/Branch", render: (r) => `${(r.year as string) ?? "—"} · ${(r.branch as string) ?? "—"}` },
        ]}
      />
      <LeadTable
        title="Mentor applications"
        table="mentor_applications"
        total={data.counts.mentor}
        rows={data.mentors}
        cols={[
          { header: "Name", render: (r) => (r.fullName as string) ?? "—" },
          { header: "Email", render: (r) => (r.email as string) ?? "—" },
          { header: "Company", render: (r) => (r.company as string) ?? "—" },
          { header: "Role", render: (r) => (r.role as string) ?? "—" },
        ]}
      />
    </div>
  );
}
