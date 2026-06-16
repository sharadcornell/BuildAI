"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Resets scroll to top on every route change. */
export function ScrollToTop() {
  const pathname = usePathname();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}
