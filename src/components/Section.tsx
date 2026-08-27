import { Reveal } from "./Reveal";
import { ParallaxDrift } from "./ParallaxDrift";
import { cn } from "@/lib/utils";

/** Shared section shell: mono eyebrow + display title, consistent rhythm. */
export function Section({
  id,
  eyebrow,
  title,
  children,
  className,
  index,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  index?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "cv-section mx-auto w-full max-w-6xl scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24",
        className,
      )}
      aria-labelledby={`${id}-title`}
    >
      <Reveal>
        {/* Headings drift a touch faster than their bodies on scroll */}
        <ParallaxDrift className="mb-10 flex items-end justify-between gap-4 sm:mb-14">
          <div>
            <p className="label mb-3 flex items-center gap-2 text-accent">
              <span
                aria-hidden="true"
                className="inline-block h-1.5 w-1.5 rounded-full bg-foreground"
              />
              {eyebrow}
            </p>
            <h2
              id={`${id}-title`}
              className="font-display text-4xl font-bold leading-[1.02] sm:text-6xl"
            >
              {title}
            </h2>
          </div>
          {index && (
            <span
              aria-hidden="true"
              className="hidden font-mono text-sm text-muted/60 sm:block"
            >
              {index}
            </span>
          )}
        </ParallaxDrift>
      </Reveal>
      {children}
    </section>
  );
}
