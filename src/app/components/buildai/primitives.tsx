import * as React from "react";
import { cn } from "../ui/utils";

/* -------------------------------------------------------------------------- */
/*  Small building blocks for the BuildAI lab-notebook / command-center system */
/* -------------------------------------------------------------------------- */

/** Mono micro-label used for system status, log lines, section kickers. */
export function MonoLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={cn("label-mono", className)}>{children}</span>;
}

/** A live status dot, optionally pulsing. */
export function StatusDot({
  tone = "mint",
  pulse = true,
  className,
}: {
  tone?: "mint" | "signal" | "amber" | "muted";
  pulse?: boolean;
  className?: string;
}) {
  const tones: Record<string, string> = {
    mint: "bg-status-mint",
    signal: "bg-signal",
    amber: "bg-status-amber",
    muted: "bg-muted-foreground",
  };
  return (
    <span
      className={cn(
        "inline-block size-2 rounded-full",
        tones[tone],
        pulse && (tone === "signal" ? "signal-pulse" : "status-pulse"),
        className,
      )}
    />
  );
}

/** Section eyebrow: a tagged mono kicker with a tick mark. */
export function Eyebrow({
  children,
  tone = "signal",
  className,
}: {
  children: React.ReactNode;
  tone?: "signal" | "ink" | "mint";
  className?: string;
}) {
  const tones: Record<string, string> = {
    signal: "text-signal",
    ink: "text-foreground",
    mint: "text-status-mint",
  };
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={cn("h-px w-6", tone === "signal" ? "bg-signal" : "bg-foreground/40")} />
      <MonoLabel className={tones[tone]}>{children}</MonoLabel>
    </div>
  );
}

/** Big condensed section heading. */
export function SectionHeading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "font-display uppercase leading-[0.95] tracking-tight",
        "text-[clamp(2rem,4.5vw,3.5rem)] font-bold",
        className,
      )}
    >
      {children}
    </h2>
  );
}

/** Generic panel surface with a header rail — the core "command panel" look. */
export function Panel({
  label,
  status,
  tone = "paper",
  children,
  className,
  headerRight,
}: {
  label?: React.ReactNode;
  status?: React.ReactNode;
  tone?: "paper" | "ink";
  children: React.ReactNode;
  className?: string;
  headerRight?: React.ReactNode;
}) {
  const ink = tone === "ink";
  return (
    <div
      className={cn(
        "border overflow-hidden",
        ink
          ? "bg-ink-panel text-paper-light border-white/10"
          : "bg-card text-card-foreground border-border",
        className,
      )}
    >
      {(label || status || headerRight) && (
        <div
          className={cn(
            "flex items-center justify-between gap-3 px-4 py-2.5 border-b",
            ink ? "border-white/10 bg-white/[0.02]" : "border-border bg-foreground/[0.02]",
          )}
        >
          <div className="flex items-center gap-2 min-w-0">
            {status}
            <MonoLabel className={ink ? "text-paper-light/70" : "text-muted-foreground"}>
              {label}
            </MonoLabel>
          </div>
          {headerRight}
        </div>
      )}
      {children}
    </div>
  );
}

/** A small tag / chip. */
export function Tag({
  children,
  tone = "default",
  className,
}: {
  children: React.ReactNode;
  tone?: "default" | "signal" | "mint" | "ink" | "outline";
  className?: string;
}) {
  const tones: Record<string, string> = {
    default: "bg-secondary text-secondary-foreground",
    signal: "bg-signal-soft text-signal",
    mint: "bg-status-mint-soft text-status-mint",
    ink: "bg-ink text-paper-light",
    outline: "border border-current/30 text-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center font-mono text-[11px] font-medium px-2 py-0.5 rounded-sm",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Certification stamp / badge — rotated, perforated, reveals on view. */
export function CertStamp({
  tier,
  size = "md",
  reveal = false,
  className,
}: {
  tier: "Participated" | "Apprentice" | "Distinction";
  size?: "sm" | "md" | "lg";
  reveal?: boolean;
  className?: string;
}) {
  const tones: Record<string, string> = {
    Participated: "border-muted-foreground text-muted-foreground",
    Apprentice: "border-status-mint text-status-mint",
    Distinction: "border-signal text-signal",
  };
  const sizes: Record<string, string> = {
    sm: "size-16 text-[8px]",
    md: "size-24 text-[10px]",
    lg: "size-32 text-xs",
  };
  return (
    <div
      className={cn(
        "relative grid place-items-center rounded-full border-[3px] border-dashed select-none",
        "font-mono uppercase tracking-widest text-center -rotate-[8deg]",
        tones[tier],
        sizes[size],
        reveal && "stamp-reveal",
        className,
      )}
    >
      <div className="absolute inset-1.5 rounded-full border border-current/40" />
      <div className="px-1 leading-tight">
        <div className="opacity-60">BuildAI</div>
        <div className="font-display not-italic text-[1.6em] leading-none my-0.5 font-bold tracking-tight">
          {tier === "Distinction" ? "DIST" : tier === "Apprentice" ? "APPR" : "PART"}
        </div>
        <div className="opacity-60">Verified</div>
      </div>
    </div>
  );
}

/** A labelled stat figure. */
export function Stat({
  value,
  label,
  tone = "ink",
  className,
}: {
  value: React.ReactNode;
  label: React.ReactNode;
  tone?: "ink" | "signal" | "mint" | "paper";
  className?: string;
}) {
  const tones: Record<string, string> = {
    ink: "text-foreground",
    signal: "text-signal",
    mint: "text-status-mint",
    paper: "text-paper-light",
  };
  return (
    <div className={className}>
      <div className={cn("font-display font-bold leading-none text-[clamp(1.75rem,3vw,2.75rem)]", tones[tone])}>
        {value}
      </div>
      <MonoLabel className="text-muted-foreground mt-1.5 block">{label}</MonoLabel>
    </div>
  );
}

/** Thin progress bar. */
export function ProgressBar({
  value,
  tone = "signal",
  className,
}: {
  value: number;
  tone?: "signal" | "mint" | "ink";
  className?: string;
}) {
  const tones: Record<string, string> = {
    signal: "bg-signal",
    mint: "bg-status-mint",
    ink: "bg-foreground",
  };
  return (
    <div className={cn("h-1.5 w-full rounded-full bg-foreground/10 overflow-hidden", className)}>
      <div
        className={cn("h-full rounded-full transition-all duration-700", tones[tone])}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

/** Section wrapper that constrains width and pads consistently. */
export function Section({
  children,
  className,
  inner,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  inner?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("px-5 sm:px-8 py-16 sm:py-24", className)}>
      <div className={cn("mx-auto w-full max-w-[1280px]", inner)}>{children}</div>
    </section>
  );
}
