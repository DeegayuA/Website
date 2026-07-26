"use client";

import { useState } from "react";
import { motion, type Variants } from "motion/react";
import { certifications } from "@/data/certifications";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { BrandIcon } from "./BrandIcon";
import { ChevronDown, ChevronUp, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

/** Official issuer marks + brand accent (mark rendered white on a brand-tile). */
const issuer: Record<string, { label: string; hex: string }> = {
  nvidia: { label: "NVIDIA", hex: "#76B900" },
  aws: { label: "AWS", hex: "#FF9900" },
  freecodecamp: { label: "freeCodeCamp", hex: "#0A0A23" },
};

export function Certifications() {
  const [expanded, setExpanded] = useState(false);

  return (
    <Section
      id="certifications"
      eyebrow="Credentials"
      title="Licenses & Certifications"
      index="04 / Proof"
    >
      <Reveal>
        <p className="-mt-4 mb-10 max-w-2xl text-pretty text-base text-muted sm:text-lg">
          Verified certifications across AI, deep learning, cloud data
          engineering, and full-stack software — from NVIDIA, AWS, and
          freeCodeCamp.
        </p>
      </Reveal>

      <motion.ul
        id="certifications-list"
        variants={gridVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {certifications.map((cert, i) => {
          const meta = cert.issuerIcon ? issuer[cert.issuerIcon] : undefined;
          return (
            <motion.li
              key={cert.title}
              variants={itemVariants}
              className={cn("h-full", i >= 4 && !expanded && "hidden sm:block")}
            >
              <article
                className="glass glass-lens glass-sheen bevel glint-host group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-5"
                style={
                  meta
                    ? ({
                        ["--spot" as string]: meta.hex,
                      } as React.CSSProperties)
                    : undefined
                }
              >
                <span aria-hidden="true" className="glint" />
                {meta && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-0.5 ring-1 ring-(--glass-border)"
                    style={{ backgroundColor: meta.hex }}
                  />
                )}

                <div className="relative z-[4] space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    {meta && cert.issuerIcon ? (
                      <span className="flex items-center gap-2">
                        <span
                          className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-sm"
                          style={{ backgroundColor: meta.hex }}
                        >
                          <BrandIcon
                            name={cert.issuerIcon}
                            size={18}
                            title={`${meta.label} logo`}
                          />
                        </span>
                        <span className="text-xs font-bold">{meta.label}</span>
                      </span>
                    ) : (
                      <span />
                    )}
                    <span className="glass rounded-full px-2 py-0.5 font-mono text-[10px] text-muted">
                      {cert.issued.replace("Issued ", "")}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold leading-snug">
                      {cert.title}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-muted">
                      {cert.issuer}
                    </p>
                  </div>
                </div>

                <div className="relative z-[4] mt-4 space-y-2 border-t border-(--glass-border) pt-3 text-[11px]">
                  {cert.credentialId && (
                    <div className="flex items-center justify-between gap-2 font-mono text-muted/80">
                      <span className="max-w-[170px] truncate">
                        ID: {cert.credentialId}
                      </span>
                      <BadgeCheck
                        className="h-3.5 w-3.5 shrink-0 text-accent"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                  {cert.skills && cert.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {cert.skills.map((sk) => (
                        <span
                          key={sk}
                          className="rounded-full border border-(--glass-border) px-2 py-0.5 text-[10px] font-medium text-muted"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            </motion.li>
          );
        })}
      </motion.ul>

      {certifications.length > 4 && (
        <div className="mt-8 flex justify-center sm:hidden">
          <button
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-controls="certifications-list"
            className="glass glass-lens glass-button inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-bold text-accent"
          >
            <span>
              {expanded
                ? "Show less"
                : `Show all ${certifications.length} certifications`}
            </span>
            {expanded ? <ChevronUp size={16} aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}
          </button>
        </div>
      )}
    </Section>
  );
}
