"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { site } from "@/data/site";
import { FadeIn } from "@/components/FadeIn";
import { ContactButton } from "@/components/ContactButton";
import { Magnetic } from "@/components/Magnetic";

/* ── Rotating roles line ───────────────────────────────────── */
const ROLE_CLASS =
  "whitespace-nowrap text-center text-xs uppercase tracking-[0.3em] text-muted sm:text-sm";

function RoleRotator() {
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(
      () => setI((v) => (v + 1) % site.roles.length),
      2500,
    );
    return () => clearInterval(id);
  }, [reduced]);

  if (reduced) {
    return <p className={ROLE_CLASS}>{site.roles[0]}</p>;
  }

  return (
    <div className="relative h-5 w-full sm:h-6" aria-live="polite">
      <AnimatePresence initial={false}>
        <motion.p
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className={`absolute inset-0 flex items-center justify-center ${ROLE_CLASS}`}
        >
          {site.roles[i]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

/* ── Hero ──────────────────────────────────────────────────── */
export function Hero() {
  return (
    <section
      id="home"
      aria-label="Introduction"
      className="relative flex h-screen flex-col overflow-x-clip"
    >
      {/* Heading block — h1 is SSR-visible, never opacity-animated */}
      <div className="flex flex-1 flex-col items-center justify-center pt-20 sm:pt-24">
        <h1 className="hero-heading w-full text-center text-[13vw] font-black uppercase leading-none tracking-tight sm:text-[14vw] md:text-[15vw]">
          <span className="block whitespace-nowrap">DEEGHAYU</span>
          <span className="block whitespace-nowrap">ADHIKARI</span>
        </h1>

        <FadeIn delay={0.15} className="mt-4 w-full sm:mt-6">
          <RoleRotator />
        </FadeIn>
      </div>

      {/* Bottom bar */}
      <div className="flex items-end justify-between gap-6 px-6 pb-8 md:px-10 md:pb-10">
        <FadeIn delay={0.35}>
          <p className="max-w-[160px] text-[clamp(0.75rem,1.4vw,1.5rem)] font-light uppercase leading-snug tracking-wide sm:max-w-[240px] md:max-w-[320px]">
            {site.tagline}
          </p>
        </FadeIn>

        <FadeIn delay={0.5}>
          <Magnetic>
            <ContactButton />
          </Magnetic>
        </FadeIn>
      </div>
    </section>
  );
}
