import { Briefcase, GraduationCap } from "lucide-react";
import { work, education, type TimelineEntry } from "@/data/experience";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

function Timeline({
  heading,
  icon,
  entries,
}: {
  heading: string;
  icon: React.ReactNode;
  entries: TimelineEntry[];
}) {
  return (
    <div>
      <h3 className="mb-6 flex items-center gap-3 font-display text-xl font-bold">
        <span className="glass flex h-11 w-11 items-center justify-center rounded-2xl text-accent">
          {icon}
        </span>
        {heading}
      </h3>
      <ol className="relative ml-4 space-y-4 border-l border-(--glass-border) pl-7">
        {entries.map((entry, i) => {
          const live = /present/i.test(entry.period);
          return (
            <li key={entry.title} className="relative">
              <span
                aria-hidden="true"
                className={
                  live
                    ? "pulse-dot absolute -left-[34px] top-7 h-3 w-3 rounded-full bg-spark"
                    : "absolute -left-[34px] top-7 h-3 w-3 rounded-full border-2 border-accent bg-background"
                }
              />
              <Reveal delay={i * 0.06}>
                <div className="glass glass-lens glass-sheen bevel glint-host group rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1">
                  <span aria-hidden="true" className="glint" />
                  <div className="relative z-[4] flex items-center justify-between gap-3">
                    <span className="font-mono text-xs text-accent">
                      {entry.period}
                    </span>
                    {live && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-spark-soft px-2.5 py-0.5 text-[11px] font-semibold text-spark">
                        Current
                      </span>
                    )}
                  </div>
                  <h4 className="relative z-[4] mt-2 text-base font-bold sm:text-lg">
                    {entry.title}
                  </h4>
                  <p className="relative z-[4] mt-1 text-sm font-medium text-muted">
                    {entry.org}
                  </p>
                  {entry.detail && (
                    <p className="relative z-[4] mt-3 text-sm leading-relaxed text-muted">
                      {entry.detail}
                    </p>
                  )}
                </div>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function Experience() {
  return (
    <Section
      id="experience"
      eyebrow="Trajectory"
      title="Experience & Education"
      index="03 / Path"
    >
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-10">
        <Timeline
          heading="Work"
          icon={<Briefcase size={20} aria-hidden="true" />}
          entries={work}
        />
        <Timeline
          heading="Education"
          icon={<GraduationCap size={20} aria-hidden="true" />}
          entries={education}
        />
      </div>
    </Section>
  );
}
