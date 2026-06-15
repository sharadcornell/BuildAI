import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "dark";

const base =
  "inline-flex items-center justify-center gap-2 border-2 px-6 py-3 font-sans text-sm font-bold uppercase tracking-wide transition-transform active:translate-y-0.5";

const variants: Record<Variant, string> = {
  primary:
    "border-brand-ink bg-brand-yellow text-brand-ink shadow-offset-sm hover:-translate-y-0.5",
  outline:
    "border-brand-paper bg-transparent text-brand-paper hover:bg-brand-paper hover:text-brand-ink",
  dark: "border-brand-ink bg-brand-ink text-brand-paper hover:-translate-y-0.5",
};

type Props = {
  href?: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  href,
  variant = "primary",
  className,
  children,
  ...rest
}: Props) {
  const cls = cn(base, variants[variant], className);
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
