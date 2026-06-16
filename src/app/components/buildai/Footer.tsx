import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "./Navbar";
import { MonoLabel, StatusDot } from "./primitives";
import { NAV, COHORT } from "../../lib/data";

export function Footer() {
  return (
    <footer className="bg-ink text-paper-light ink-grid border-t border-white/10">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Logo className="[&_span:last-child]:text-paper-light" />
            <p className="text-paper-light/60 text-sm mt-4 max-w-sm leading-relaxed">
              A 13-week AI product-engineering apprenticeship run inside India's engineering
              colleges. Students don't just learn AI — they ship real products, get
              mentor-reviewed, and build portfolio proof.
            </p>
            <div className="flex items-center gap-2 mt-5">
              <StatusDot tone="mint" />
              <MonoLabel className="text-paper-light/70">
                {COHORT.name} cohort · {COHORT.status.toLowerCase()}
              </MonoLabel>
            </div>
          </div>

          <div>
            <MonoLabel className="text-paper-light/40">sitemap</MonoLabel>
            <ul className="mt-4 space-y-2.5">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link
                    href={item.to}
                    className="text-sm text-paper-light/75 hover:text-signal transition-colors inline-flex items-center gap-1"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <MonoLabel className="text-paper-light/40">get started</MonoLabel>
            <div className="mt-4 grid gap-2.5">
              <Link href="/colleges" className="group flex items-center justify-between border border-white/10 px-3 py-2.5 hover:border-signal transition-colors">
                <span className="text-sm">Run a pilot cohort</span>
                <ArrowUpRight className="size-4 text-paper-light/50 group-hover:text-signal" />
              </Link>
              <Link href="/students" className="group flex items-center justify-between border border-white/10 px-3 py-2.5 hover:border-signal transition-colors">
                <span className="text-sm">Join student waitlist</span>
                <ArrowUpRight className="size-4 text-paper-light/50 group-hover:text-signal" />
              </Link>
              <Link href="/mentors" className="group flex items-center justify-between border border-white/10 px-3 py-2.5 hover:border-signal transition-colors">
                <span className="text-sm">Apply as a mentor</span>
                <ArrowUpRight className="size-4 text-paper-light/50 group-hover:text-signal" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <MonoLabel className="text-paper-light/40">
            © {new Date().getFullYear()} BuildAI · opportunities, not guarantees
          </MonoLabel>
          <MonoLabel className="text-paper-light/40">
            built for colleges · students · mentors
          </MonoLabel>
        </div>
      </div>
    </footer>
  );
}
