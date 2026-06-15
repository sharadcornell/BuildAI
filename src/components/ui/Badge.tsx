import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block border-2 border-brand-ink bg-brand-yellow px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-ink shadow-offset-sm",
        className,
      )}
    >
      {children}
    </span>
  );
}
