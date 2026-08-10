"use client";

import { certifications } from "@/data/certifications";
import { FadeIn } from "./FadeIn";
import { BrandIcon } from "./BrandIcon";

export function Certifications() {
  return (
    <section
      id="certifications"
      className="cv-section bg-slab text-slab-fg rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
    >
      <FadeIn>
        <h2
          className="font-black uppercase text-center text-slab-fg mb-16 sm:mb-20 md:mb-28"
          style={{ fontSize: "clamp(2.4rem, 9vw, 120px)" }}
        >
          Certifications
        </h2>
      </FadeIn>

      <div className="max-w-5xl mx-auto space-y-0">
        {certifications.map((cert, index) => {
          const rowNumber = String(index + 1).padStart(2, "0");

          return (
            <FadeIn
              key={cert.title}
              delay={index * 0.1}
              className="border-b border-[var(--slab-line)]"
            >
              <div className="py-8 sm:py-10 md:py-12 flex gap-8 sm:gap-12">
                <div className="shrink-0">
                  <span
                    className="font-black leading-none"
                    style={{ fontSize: "clamp(3rem, 10vw, 140px)", opacity: 0.35 }}
                  >
                    {rowNumber}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3
                      className="font-medium uppercase"
                      style={{ fontSize: "clamp(1rem, 2.2vw, 2.1rem)" }}
                    >
                      {cert.title}
                    </h3>
                    {cert.issuerIcon && (
                      <BrandIcon
                        name={cert.issuerIcon}
                        size={24}
                        title={`${cert.issuer} icon`}
                        className="shrink-0"
                      />
                    )}
                  </div>
                  <p
                    className="font-light leading-relaxed max-w-2xl"
                    style={{
                      fontSize: "clamp(0.85rem, 1.6vw, 1.25rem)",
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
