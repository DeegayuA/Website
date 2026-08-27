"use client";

import { work, education, type TimelineEntry } from "@/data/experience";
import { FadeIn } from "./FadeIn";

/* Compact row shared by Work + Education. Two columns from sm up keeps the
   section short; numbers stay decorative but no longer dominate the height. */
function EntryRow({
  entry,
  number,
  delay,
}: {
  entry: TimelineEntry;
  number: string;
  delay: number;
}) {
  return (
    <FadeIn delay={delay} className="border-b border-[var(--line)]">
      <div className="flex items-start gap-4 py-6 sm:gap-5 sm:py-7 md:py-8">
        <div className="shrink-0 opacity-35">
          <span
            className="block font-black uppercase leading-none tracking-tight text-foreground"
            style={{ fontSize: "clamp(2rem, 4vw, 64px)" }}
          >
            {number}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h3
            className="mb-1.5 flex flex-wrap items-center gap-2 font-medium uppercase leading-tight tracking-wide"
            style={{ fontSize: "clamp(1rem, 1.5vw, 1.4rem)" }}
          >
            {entry.title}
            {entry.ongoing && (
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--line)] px-2.5 py-0.5 text-[11px] font-semibold normal-case tracking-normal text-muted">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                In progress
              </span>
            )}
          </h3>
          <p
            className="mb-0.5 font-light text-muted opacity-60"
            style={{ fontSize: "clamp(0.85rem, 1.1vw, 1rem)" }}
          >
            {entry.org}
          </p>
          <p className="mb-2 text-sm font-light text-muted">{entry.period}</p>
          {entry.detail && (
            <p
              className="max-w-2xl font-light leading-relaxed opacity-60"
              style={{ fontSize: "clamp(0.85rem, 1.1vw, 1rem)" }}
            >
              {entry.detail}
            </p>
          )}
        </div>
      </div>
    </FadeIn>
  );
}

export function Experience() {
  return (
    <section
      id="experience"
      className="relative z-10 -mt-10 rounded-t-[40px] bg-background cv-section overflow-x-clip sm:-mt-12 sm:rounded-t-[50px] md:-mt-14 md:rounded-t-[60px]"
    >
      <div className="px-5 py-20 sm:px-8 sm:py-24 md:px-10 md:py-28">
        {/* Heading */}
        <h2
          className="hero-heading mb-10 text-center font-black uppercase tracking-tight leading-none sm:mb-12 md:mb-16"
          style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
        >
          Experience
        </h2>

        {/* Groups */}
        <div className="mx-auto max-w-6xl">
          {/* Work Section */}
          <div>
            <div className="mb-6 sm:mb-8">
              <span className="label uppercase tracking-widest text-muted">
                Work
              </span>
            </div>
            <div className="grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:gap-x-14">
              {work.map((entry, i) => (
                <EntryRow
                  key={`work-${i}`}
                  entry={entry}
                  number={String(i + 1).padStart(2, "0")}
                  delay={i * 0.06}
                />
              ))}
            </div>
          </div>

          {/* Education Section */}
          <div className="mt-12 sm:mt-14">
            <div className="mb-6 sm:mb-8">
              <span className="label uppercase tracking-widest text-muted">
                Education
              </span>
            </div>
            <div className="grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:gap-x-14">
              {education.map((entry, i) => (
                <EntryRow
                  key={`education-${i}`}
                  entry={entry}
                  number={String(i + 1).padStart(2, "0")}
                  delay={i * 0.06}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
