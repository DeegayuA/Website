import { Briefcase, GraduationCap, CalendarDays } from "lucide-react";
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
      <h3 className="mb-6 flex items-center gap-3 text-xl font-bold tracking-tight">
        <span className="glass flex h-11 w-11 items-center justify-center rounded-2xl text-accent">
          {icon}
        </span>
        {heading}
      </h3>
      <ol className="relative ml-5 space-y-5 border-l border-(--glass-border) pl-7">
        {entries.map((entry, i) => (
          <li key={entry.title} className="relative">
            <span
              aria-hidden="true"
              className="absolute -left-[35.5px] top-7 h-3.5 w-3.5 rounded-full border-2 border-accent bg-background"
            />
            <Reveal delay={i * 0.08}>
              <div className="glass glass-lens glass-sheen rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1">
                <h4 className="text-base font-bold sm:text-lg">{entry.title}</h4>
                <p className="mt-1 text-sm font-medium text-muted">{entry.org}</p>
                <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
                  <CalendarDays size={13} aria-hidden="true" />
                  {entry.period}
                </p>
                {entry.detail && (
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {entry.detail}
                  </p>
                )}
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function Experience() {
  return (
    <Section
      id="experience"
      eyebrow="Where I've been"
      title="Experience & Education"
    >
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
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
