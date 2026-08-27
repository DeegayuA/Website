"use client";

import Image from "next/image";
import { work, education, type TimelineEntry } from "@/data/experience";
import { FadeIn } from "./FadeIn";

/* "Sep 2025 — Present" → "1 yr 0 mos" (LinkedIn-style duration) */
const MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

function duration(period: string): string | null {
  const m = /^(\w{3}) (\d{4}) — (?:(\w{3}) (\d{4})|Present)$/.exec(period);
  if (!m) return null;
  const start = new Date(Number(m[2]), MONTHS[m[1]] ?? 0);
  const end = m[3]
    ? new Date(Number(m[4]), MONTHS[m[3]] ?? 0)
    : new Date();
  const total =
    (end.getFullYear() - start.getFullYear()) * 12 +
    end.getMonth() -
    start.getMonth() +
    1;
  if (total < 1) return null;
  const yrs = Math.floor(total / 12);
  const mos = total % 12;
  if (yrs === 0) return `${mos} mo${mos === 1 ? "" : "s"}`;
  if (mos === 0) return `${yrs} yr${yrs === 1 ? "" : "s"}`;
  return `${yrs} yr${yrs === 1 ? "" : "s"} ${mos} mo${mos === 1 ? "" : "s"}`;
}

/* Timeline entry: org logo as the node on a fading rail, compact content */
function EntryRow({
  entry,
  number,
  delay,
}: {
  entry: TimelineEntry;
  number: string;
  delay: number;
}) {
  const dur = duration(entry.period);

  return (
    <FadeIn delay={delay} className="group relative pl-14 sm:pl-16">
      {/* Rail — fades out downward so grid-row height differences never jar */}
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-5 top-12 w-px bg-gradient-to-b from-[var(--line)] to-transparent"
      />
      {/* Node */}
      <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-[var(--line)] transition-transform duration-300 ease-out group-hover:scale-110">
        {entry.logo ? (
          <Image
            src={entry.logo}
            alt=""
            width={40}
            height={40}
            className="h-full w-full object-contain p-1"
          />
        ) : (
          <span className="h-2 w-2 rounded-full bg-foreground/60" />
        )}
      </span>

      <div className="pb-10 sm:pb-12">
        <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted/70">
          {number}
        </p>
        <h3
          className="font-medium uppercase leading-tight tracking-wide"
          style={{ fontSize: "clamp(1rem, 1.5vw, 1.35rem)" }}
        >
          {entry.title}
        </h3>
        <p
          className="mt-1 font-light text-muted"
          style={{ fontSize: "clamp(0.85rem, 1.1vw, 1rem)" }}
        >
          {entry.org}
        </p>

        <p className="mt-2 flex flex-wrap items-center gap-2 text-sm font-light text-muted">
          <span>{entry.period}</span>
          {dur && (
            <span className="rounded-full bg-foreground/[0.06] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted">
              {dur}
            </span>
          )}
          {entry.ongoing && (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--line)] px-2.5 py-0.5 text-[11px] font-semibold text-muted">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              In progress
            </span>
          )}
        </p>

        {entry.detail && (
          <p
            className="mt-2.5 max-w-2xl font-light leading-relaxed text-foreground/70"
            style={{ fontSize: "clamp(0.85rem, 1.1vw, 1rem)" }}
          >
            {entry.detail}
          </p>
        )}
      </div>
    </FadeIn>
  );
}

function Group({
  label,
  entries,
}: {
  label: string;
  entries: readonly TimelineEntry[];
}) {
  return (
    <div>
      <div className="mb-8 flex items-center gap-3 sm:mb-10">
        <span className="label uppercase tracking-widest text-muted">
          {label}
        </span>
        <span aria-hidden="true" className="h-px flex-1 bg-[var(--line)]" />
      </div>
      <div className="grid grid-cols-1 gap-x-12 sm:grid-cols-2 lg:gap-x-16">
        {entries.map((entry, i) => (
          <EntryRow
            key={`${label}-${i}`}
            entry={entry}
            number={String(i + 1).padStart(2, "0")}
            delay={i * 0.06}
          />
        ))}
      </div>
    </div>
  );
}

export function Experience() {
  return (
    <section
      id="experience"
      className="relative cv-section overflow-x-clip"
    >
      <div className="px-5 py-20 sm:px-8 sm:py-24 md:px-10 md:py-28">
        {/* Heading */}
        <h2
          className="hero-heading mb-10 text-center font-black uppercase tracking-tight leading-none sm:mb-12 md:mb-16"
          style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
        >
          Experience
        </h2>

        <div className="mx-auto max-w-6xl">
          <Group label="Work" entries={work} />
          <div className="mt-6 sm:mt-8">
            <Group label="Education" entries={education} />
          </div>
        </div>
      </div>
    </section>
  );
}
