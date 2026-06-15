"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/content/site";

/**
 * Mobile-only hamburger menu. Desktop nav (in Nav.tsx) is untouched — this whole
 * component is `md:hidden`. Closes on link click and on Escape; the toggle button
 * exposes aria-expanded / aria-controls for keyboard + screen-reader users.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="inline-flex items-center justify-center border-2 border-brand-ink bg-brand-paper p-2 text-brand-ink"
      >
        {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
      </button>

      {open ? (
        <nav
          id="mobile-menu"
          className="absolute left-0 right-0 top-full border-b-4 border-brand-ink bg-brand-paper shadow-offset-sm"
        >
          <ul className="flex flex-col px-6">
            {NAV_LINKS.map((l) => (
              <li key={l.href} className="border-t border-brand-ink/15 first:border-t-0">
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-4 font-sans text-sm font-bold uppercase tracking-wide text-brand-ink hover:text-brand-red"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
