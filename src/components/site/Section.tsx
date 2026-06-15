import { cn } from "@/lib/utils";
import { Container } from "./Container";

export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("border-b-4 border-brand-ink py-16 lg:py-24", className)}>
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  intro,
  dark = false,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  dark?: boolean;
}) {
  return (
    <div className="mb-12 max-w-3xl">
      {eyebrow ? <p className="eyebrow mb-4">{eyebrow}</p> : null}
      <h2 className={cn("display text-4xl sm:text-5xl", dark ? "text-brand-ink" : "text-brand-paper")}>
        {title}
      </h2>
      {intro ? (
        <p className={cn("mt-5 text-lg", dark ? "text-brand-ink/80" : "text-brand-paper/90")}>
          {intro}
        </p>
      ) : null}
    </div>
  );
}
