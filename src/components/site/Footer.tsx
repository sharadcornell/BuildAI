import Link from "next/link";
import { SITE, FOOTER_LINKS } from "@/content/site";

export function Footer() {
  return (
    <footer className="bg-brand-ink text-brand-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Link href="/" className="font-display text-3xl uppercase tracking-tight">
            Build<span className="text-brand-red">AI</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-brand-paper/70">{SITE.tagline}</p>
          <a
            href={`mailto:${SITE.email}`}
            className="mt-4 inline-block text-sm font-bold text-brand-yellow hover:underline"
          >
            {SITE.email} →
          </a>
        </div>
        {FOOTER_LINKS.map((col) => (
          <div key={col.heading}>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-brand-paper/50">
              {col.heading}
            </h3>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-brand-paper/80 hover:text-brand-yellow">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-xs text-brand-paper/50 sm:flex-row sm:justify-between">
          <span>
            © {new Date().getFullYear()} {SITE.name}. {SITE.founder}, Founder.
          </span>
          <span>Cohort 01 enrolling · Built for India&apos;s engineering colleges.</span>
        </div>
      </div>
    </footer>
  );
}
