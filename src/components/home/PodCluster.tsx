import { OffsetCard } from "@/components/ui/OffsetCard";
import { Badge } from "@/components/ui/Badge";

/** The 3D-looking card cluster from the Swiss RedBlock hero. */
export function PodCluster() {
  return (
    <div className="relative grid gap-5 lg:block lg:h-[460px]">
      {/* Pod conversation */}
      <OffsetCard className="lg:absolute lg:left-0 lg:top-2 lg:w-[58%] lg:-rotate-1">
        <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-brand-yellow">
          <span className="h-2 w-2 rounded-full bg-brand-yellow" /> Pod 03 · Week 6 — M2
        </div>
        <div className="space-y-3 text-sm">
          <div className="border border-white/15 bg-white/5 p-3">
            <p className="mb-1 text-[11px] uppercase tracking-wide text-brand-paper/50">
              Priya · Student
            </p>
            Shipping a RAG chatbot for the placement cell — pgvector or pinecone?
          </div>
          <div className="border border-white/15 bg-white/5 p-3">
            <p className="mb-1 text-[11px] uppercase tracking-wide text-brand-paper/50">
              Lead Mentor · Pod 03
            </p>
            pgvector. You already run Postgres. Ship the simple thing first.{" "}
            <span className="text-brand-yellow">Demo it Friday.</span>
          </div>
        </div>
        <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-brand-paper/50">
          Pods of 8–12 · 1 mentor
        </p>
      </OffsetCard>

      {/* Module card */}
      <OffsetCard
        accent
        className="lg:absolute lg:right-0 lg:top-0 lg:w-[42%] lg:rotate-2"
      >
        <p className="text-[11px] font-bold uppercase tracking-wide text-brand-yellow">
          M2 · AI Product Patterns
        </p>
        <p className="mt-2 font-display text-xl uppercase leading-tight">
          RAG Chatbot → Production
        </p>
        <div className="mt-3 h-2 w-full bg-white/10">
          <div className="h-2 w-2/3 bg-brand-yellow" />
        </div>
        <p className="mt-2 text-[11px] uppercase tracking-wide text-brand-paper/50">
          Week 6 of 13 · On track
        </p>
      </OffsetCard>

      {/* Student terminal */}
      <OffsetCard className="font-mono lg:absolute lg:bottom-0 lg:right-6 lg:w-[60%] lg:rotate-1">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-brand-yellow">
          ● Student terminal
        </p>
        <pre className="whitespace-pre-wrap text-[12px] leading-relaxed text-brand-paper/90">
{`$ git push origin main
  Building… ✓ compiled in 2.1s
  Deployed → placement-bot.vercel.app
$ npm run evals
  24 checks passing`}
        </pre>
      </OffsetCard>

      {/* Floating badges */}
      <div className="lg:absolute lg:left-[44%] lg:top-[-14px]">
        <Badge>Demo day every Friday</Badge>
      </div>
      <div className="lg:absolute lg:bottom-[-14px] lg:left-2">
        <Badge>Ship from week one</Badge>
      </div>
    </div>
  );
}
