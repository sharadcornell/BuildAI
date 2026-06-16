import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Eyebrow, MonoLabel } from "./components/buildai/primitives";

export default function NotFound() {
  return (
    <div className="bg-ink text-paper-light ink-grid min-h-[70vh] grid place-items-center px-5">
      <div className="text-center">
        <Eyebrow tone="signal" className="justify-center">error · route not found</Eyebrow>
        <div className="font-display font-bold text-[clamp(5rem,20vw,12rem)] leading-none text-signal mt-4">404</div>
        <p className="text-paper-light/70 max-w-sm mx-auto">
          This artifact never shipped. The page you&apos;re looking for isn&apos;t on the cohort floor.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-8 h-11 px-6 bg-signal text-paper-light font-medium rounded-sm hover:bg-paper-light hover:text-ink transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to command center
        </Link>
        <MonoLabel className="block text-paper-light/30 mt-6">buildai // status 404</MonoLabel>
      </div>
    </div>
  );
}
