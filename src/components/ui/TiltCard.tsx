import { cn } from "@/lib/utils";

/** Pure-CSS 3D tilt on hover. No JS, GPU-cheap, respects reduced-motion. */
export function TiltCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("tilt card-offset p-5", className)}>{children}</div>;
}
