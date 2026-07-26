"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { site, stats, skills } from "@/data/site";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || reduced) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduced, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {reduced ? value : display}
      {suffix}
    </span>
  );
}

export function About() {
  return (
    <Section id="about" eyebrow="A little context" title="About me">
      <div className="grid gap-5 lg:grid-cols-5">
        <Reveal className="lg:col-span-3">
          <div className="glass glass-lens glass-sheen h-full rounded-3xl p-7 sm:p-9">
            <p className="text-pretty text-lg leading-relaxed sm:text-xl">
              {site.bio}
            </p>
            <h3 className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-muted">
              Tools I reach for
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Skills">
              {skills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-full border border-(--glass-border) bg-accent-soft px-3.5 py-1.5 text-sm font-medium"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <div className="grid gap-5 lg:col-span-2">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.1}>
              <div className="glass glass-lens glass-sheen flex h-full items-center gap-5 rounded-3xl px-7 py-6">
                <span className="bg-gradient-to-br from-accent to-accent-2 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </span>
                <span className="text-base font-medium text-muted">
                  {stat.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
