import { Button } from "@/components/ui/Button";
import { PodCluster } from "./PodCluster";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b-4 border-brand-ink">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.05fr_1fr] lg:py-24">
        <div className="animate-fade-up">
          <p className="eyebrow mb-6">
            BuildAI — an apprenticeship, not a course · Cohort 01 enrolling
          </p>
          <h1 className="display text-6xl text-brand-paper sm:text-7xl lg:text-[5.5rem]">
            We don&apos;t
            <br />
            <span className="stroke-text">teach AI.</span>
            <br />
            We make
            <br />
            engineers
            <br />
            who <span className="text-brand-yellow">ship.</span>
          </h1>
          <p className="mt-8 max-w-md text-lg text-brand-paper">
            <strong className="font-bold">
              13 weeks. Real products. Working-engineer mentors.
            </strong>{" "}
            An AI-native product engineering apprenticeship run inside India&apos;s
            engineering colleges.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/for-colleges">Run a Pilot</Button>
            <Button href="#goal" variant="outline">
              The Goal ↓
            </Button>
          </div>
        </div>
        <PodCluster />
      </div>
    </section>
  );
}
