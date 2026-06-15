import { cn } from "@/lib/utils";

export function OffsetCard({
  className,
  children,
  accent = false,
  as: Tag = "div",
}: {
  className?: string;
  children: React.ReactNode;
  accent?: boolean;
  as?: React.ElementType;
}) {
  return (
    <Tag
      className={cn(
        "border-2 border-brand-ink bg-brand-ink p-5 text-brand-paper",
        accent ? "shadow-offset-yellow" : "shadow-offset",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
