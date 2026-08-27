"use client";

import { certifications } from "@/data/certifications";
import { FadeIn } from "./FadeIn";
import { BrandIcon } from "./BrandIcon";

export function Certifications() {
  return (
    <section
      id="certifications"
      className="cv-section bg-slab text-slab-fg rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-28"
    >
      <FadeIn>
        <h2
          className="font-black uppercase text-center text-slab-fg mb-10 sm:mb-12 md:mb-16"
          style={{ fontSize: "clamp(2.4rem, 9vw, 120px)" }}
        >
          Certifications
        </h2>
      </FadeIn>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-10 sm:grid-cols-2 lg:gap-x-14">
        {certifications.map((cert, index) => {
          const rowNumber = String(index + 1).padStart(2, "0");

          return (
            <FadeIn
              key={cert.title}
              delay={index * 0.06}
              className="border-b border-[var(--slab-line)]"
            >
              <div className="flex items-start gap-4 py-6 sm:gap-5 sm:py-7 md:py-8">
                <div className="shrink-0">
                  <span
                    className="block font-black leading-none"
                    style={{ fontSize: "clamp(2rem, 4vw, 64px)", opacity: 0.35 }}
                  >
                    {rowNumber}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex items-center gap-3">
                    <h3
                      className="font-medium uppercase leading-tight"
                      style={{ fontSize: "clamp(1rem, 1.5vw, 1.4rem)" }}
                    >
                      {cert.title}
                    </h3>
                    {cert.issuerIcon && (
                      <BrandIcon
                        name={cert.issuerIcon}
                        size={20}
                        title={`${cert.issuer} icon`}
                        className="shrink-0"
                      />
                    )}
                  </div>
                  <p
                    className="max-w-2xl font-light leading-relaxed"
                    style={{
                      fontSize: "clamp(0.85rem, 1.1vw, 1rem)",
                      opacity: 0.6,
                    }}
                  >
                    {cert.issuer} — {cert.issued}
                  </p>
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
}
