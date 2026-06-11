import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

/** Shared section shell: eyebrow + big title + content, consistent rhythm. */
export function Section({
  id,
  eyebrow,
  title,
  children,
  className,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn("cv-section mx-auto w-full max-w-6xl scroll-mt-24 px-5 py-14 sm:px-8 sm:py-20", className)}
      aria-labelledby={`${id}-title`}
    >
      <Reveal>
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </p>
        <h2
          id={`${id}-title`}
          className="text-3xl font-bold tracking-tight sm:text-5xl"
        >
          {title}
        </h2>
        <span
          aria-hidden="true"
          className="mt-4 mb-8 block h-1 w-16 rounded-full bg-gradient-to-r from-accent via-accent-2 to-accent-3 sm:mb-10"
        />
      </Reveal>
      {children}
    </section>
  );
}
