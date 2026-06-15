import Link from "next/link";
import { NAV_LINKS } from "@/content/site";
import { Button } from "@/components/ui/Button";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b-4 border-brand-ink bg-brand-paper text-brand-ink">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/" className="font-display text-2xl uppercase tracking-tight">
          Build<span className="text-brand-red">AI</span>
        </Link>
        <nav className="hidden gap-7 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-sans text-sm font-bold uppercase tracking-wide hover:text-brand-red"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Button href="/for-colleges" className="px-4 py-2 shadow-none">
          Run a Pilot
        </Button>
      </div>
    </header>
  );
}
