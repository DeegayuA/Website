"use client";

import { useState } from "react";
import { motion, type Variants } from "motion/react";
import { certifications } from "@/data/certifications";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";
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

const brand: Record<string, { label: string; color: string }> = {
  nvidia: { label: "NVIDIA", color: "#76B900" },
  aws: { label: "AWS", color: "#FF9900" },
  freecodecamp: { label: "freeCodeCamp", color: "#0A0A23" },
};

export function Certifications() {
  const [expanded, setExpanded] = useState(false);

  return (
    <Section id="certifications" eyebrow="Credentials &amp; Badges" title="Licenses &amp; Certifications">
      <Reveal>
        <p className="-mt-6 mb-10 max-w-2xl text-pretty text-base text-muted sm:text-lg">
          Verified professional certifications in Artificial Intelligence, Deep Learning, AWS Cloud Engineering, and Full-Stack Software Engineering.
        </p>
      </Reveal>

      <motion.ul
        variants={gridVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {certifications.map((cert, i) => {
          const b = cert.issuerIcon ? brand[cert.issuerIcon] : undefined;

          return (
            <motion.li
              key={cert.title}
              variants={itemVariants}
              className={cn("h-full", i >= 4 && !expanded && "hidden sm:block")}
            >
              <article className="glass glass-lens glass-sheen group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-glass-border p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    {b && (
                      <span
                        className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold shadow-sm"
                        style={{
                          color: b.color,
                          backgroundColor: `${b.color}1A`,
                          border: `1px solid ${b.color}4D`,
                        }}
                      >
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: b.color }}
                        />
                        {b.label}
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-muted/70 glass px-2 py-0.5 rounded-full border border-glass-border">
                      {cert.issued}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-foreground group-hover:text-accent transition-colors leading-snug">
                      {cert.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted font-medium">
                      {cert.issuer}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 pt-3 border-t border-glass-border/40 text-[11px]">
                  {cert.credentialId && (
                    <div className="flex items-center justify-between text-muted/80 font-mono">
                      <span className="truncate max-w-[170px]">ID: {cert.credentialId}</span>
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    </div>
                  )}

                  {cert.skills && cert.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {cert.skills.map((sk) => (
                        <span
                          key={sk}
                          className="rounded-md bg-surface-strong/40 px-2 py-0.5 text-[10px] font-medium text-muted border border-glass-border/30"
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
            className="glass glass-lens glass-button inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-bold text-accent border border-glass-border shadow-md"
          >
            <span>{expanded ? "Show Less" : `Show All ${certifications.length} Certifications`}</span>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      )}
    </Section>
  );
}
