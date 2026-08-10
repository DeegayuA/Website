"use client";

import { work, education } from "@/data/experience";
import { FadeIn } from "./FadeIn";

export function Experience() {
  return (
    <section
      id="experience"
      className="relative z-10 -mt-10 rounded-t-[40px] bg-background cv-section overflow-x-clip sm:-mt-12 sm:rounded-t-[50px] md:-mt-14 md:rounded-t-[60px]"
    >
      <div className="px-5 py-20 sm:px-8 sm:py-24 md:px-10 md:py-32">
        {/* Heading */}
        <h2
          className="hero-heading mb-16 text-center font-black uppercase tracking-tight leading-none sm:mb-20 md:mb-28"
          style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
        >
          Experience
        </h2>

        {/* Groups */}
        <div className="max-w-4xl mx-auto">
          {/* Work Section */}
          <div>
            <div className="mb-8 sm:mb-10 md:mb-12">
              <span className="label text-muted uppercase tracking-widest">
                Work
              </span>
            </div>
            {work.map((entry, i) => (
              <FadeIn
                key={`work-${i}`}
                delay={i * 0.1}
                className="border-b border-[var(--line)]"
              >
                <div className="py-8 sm:py-10 md:py-12 flex gap-6 sm:gap-8 md:gap-10 items-start">
                  <div className="shrink-0 opacity-35">
                    <span
                      className="font-black uppercase tracking-tight leading-none block text-foreground"
                      style={{ fontSize: "clamp(3rem, 10vw, 140px)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-medium uppercase tracking-wide leading-tight mb-2"
                      style={{ fontSize: "clamp(1rem, 2.2vw, 2.1rem)" }}
                    >
                      {entry.title}
                    </h3>
                    <p
                      className="text-muted font-light opacity-60 mb-1"
                      style={{ fontSize: "clamp(0.85rem, 1.6vw, 1.25rem)" }}
                    >
                      {entry.org}
                    </p>
                    <p className="text-muted font-light text-sm sm:text-base mb-3">
                      {entry.period}
                    </p>
                    {entry.detail && (
                      <p
                        className="font-light leading-relaxed max-w-2xl opacity-60"
                        style={{ fontSize: "clamp(0.85rem, 1.6vw, 1.25rem)" }}
                      >
                        {entry.detail}
                      </p>
                    )}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Education Section */}
          <div>
            <div className="mb-8 sm:mb-10 md:mb-12">
              <span className="label text-muted uppercase tracking-widest">
                Education
              </span>
            </div>
            {education.map((entry, i) => (
              <FadeIn
                key={`education-${i}`}
                delay={i * 0.1}
                className="border-b border-[var(--line)]"
              >
                <div className="py-8 sm:py-10 md:py-12 flex gap-6 sm:gap-8 md:gap-10 items-start">
                  <div className="shrink-0 opacity-35">
                    <span
                      className="font-black uppercase tracking-tight leading-none block text-foreground"
                      style={{ fontSize: "clamp(3rem, 10vw, 140px)" }}
                    >
                      {String(work.length + i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-medium uppercase tracking-wide leading-tight mb-2"
                      style={{ fontSize: "clamp(1rem, 2.2vw, 2.1rem)" }}
                    >
                      {entry.title}
                    </h3>
                    <p
                      className="text-muted font-light opacity-60 mb-1"
                      style={{ fontSize: "clamp(0.85rem, 1.6vw, 1.25rem)" }}
                    >
                      {entry.org}
                    </p>
                    <p className="text-muted font-light text-sm sm:text-base mb-3">
                      {entry.period}
                    </p>
                    {entry.detail && (
                      <p
                        className="font-light leading-relaxed max-w-2xl opacity-60"
                        style={{ fontSize: "clamp(0.85rem, 1.6vw, 1.25rem)" }}
                      >
                        {entry.detail}
                      </p>
                    )}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
