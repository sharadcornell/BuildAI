"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../ui/utils";
import { MonoLabel } from "./primitives";
import { NAV } from "../../lib/data";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 group", className)}>
      <span className="grid place-items-center size-7 bg-signal text-paper-light font-display font-bold text-sm rounded-sm -rotate-3 group-hover:rotate-0 transition-transform">
        B
      </span>
      <span className="font-display font-bold text-xl tracking-tight uppercase">
        Build<span className="text-signal">AI</span>
      </span>
    </Link>
  );
}

function isNavActive(pathname: string, to: string) {
  return to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(`${to}/`);
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors",
        scrolled ? "bg-paper/90 backdrop-blur-md border-b border-border" : "bg-paper border-b border-transparent",
      )}
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Logo />

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.slice(0, 7).map((item) => {
              const isActive = isNavActive(pathname, item.to);
              return (
                <Link
                  key={item.to}
                  href={item.to}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-sm transition-colors",
                    isActive ? "text-signal" : "text-foreground/70 hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/apply"
              className="inline-flex items-center gap-1.5 h-9 px-4 bg-ink text-paper-light text-sm font-medium rounded-sm hover:bg-signal transition-colors"
            >
              Apply / Pilot <ArrowUpRight className="size-4" />
            </Link>
          </div>

          <button
            className="lg:hidden grid place-items-center size-10 -mr-2"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden bg-paper border-t border-border"
          >
            <div className="px-5 py-4">
              <MonoLabel className="text-muted-foreground">navigate</MonoLabel>
              <nav className="mt-3 grid gap-1">
                {NAV.map((item, i) => {
                  const isActive = isNavActive(pathname, item.to);
                  return (
                    <Link
                      key={item.to}
                      href={item.to}
                      className={cn(
                        "flex items-center justify-between py-3 border-b border-dashed border-border text-base",
                        isActive ? "text-signal" : "text-foreground",
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <MonoLabel className="text-muted-foreground">{String(i + 1).padStart(2, "0")}</MonoLabel>
                        {item.label}
                      </span>
                      <ArrowUpRight className="size-4 text-muted-foreground" />
                    </Link>
                  );
                })}
              </nav>
              <Link
                href="/apply"
                className="mt-4 inline-flex w-full items-center justify-center gap-1.5 h-11 bg-signal text-paper-light font-medium rounded-sm"
              >
                Apply / Run a pilot <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
