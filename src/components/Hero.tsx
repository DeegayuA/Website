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
    <div className="relative h-5 w-full sm:h-6">
      {/* Static list for screen readers — the rotating copy would otherwise
          re-announce itself every 2.5s via a live region */}
      <p className="sr-only">{site.roles.join(", ")}</p>
      <span aria-hidden="true">
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
      </span>
    </div>
  );
}

/* ── Bilingual name — SSR paints English; after mount it alternates
      with the Sinhala spelling. The h1 itself never opacity-animates,
      keeping the hero SSR-visible. ─────────────────────────────── */
const NAME = {
  en: ["DEEGHAYU", "ADHIKARI"],
  si: ["දිඝායු", "අධිකාරි"],
} as const;

function NameRotator() {
  const [lang, setLang] = useState<keyof typeof NAME>("en");
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(
      () => setLang((v) => (v === "en" ? "si" : "en")),
      5000,
    );
    return () => clearInterval(id);
  }, [reduced]);

  const isSi = lang === "si";

  return (
    <h1
      className={
        isSi
          ? // Sinhala glyphs carry tall ascenders/descenders — much looser
            // leading and a smaller size so the two lines never collide
            "hero-heading w-full text-center text-[9vw] font-black leading-[1.45] tracking-normal sm:text-[10vw] md:text-[11vw]"
          : "hero-heading w-full text-center text-[13vw] font-black uppercase leading-none tracking-tight sm:text-[14vw] md:text-[15vw]"
      }
      style={
        isSi
          ? { fontFamily: "var(--font-sinhala), var(--font-kanit), sans-serif" }
          : undefined
      }
    >
      {NAME[lang].map((line, row) => (
        <span key={row} aria-hidden="true" className="relative block">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={`${lang}-${row}`}
              initial={{ opacity: 0, y: "0.28em", scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: "-0.28em", scale: 0.985 }}
              transition={{
                duration: 0.7,
                ease: [0.21, 0.47, 0.32, 0.98],
                delay: row * 0.08,
              }}
              className="block whitespace-nowrap"
            >
              {line}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
      <span className="sr-only">Deeghayu Adhikari</span>
    </h1>
  );
}

/* ── Hero ──────────────────────────────────────────────────── */
export function Hero() {
  return (
    <section
      id="home"
      aria-label="Introduction"
      className="relative flex h-dvh flex-col overflow-x-clip"
    >
      {/* Heading block — h1 is SSR-visible, never opacity-animated */}
      <div className="flex flex-1 flex-col items-center justify-center pt-20 sm:pt-24">
        <NameRotator />

        <FadeIn delay={0.15} className="mt-4 w-full sm:mt-6">
          <RoleRotator />
        </FadeIn>
      </div>

      {/* Bottom bar */}
      <div className="flex items-end justify-between gap-6 px-6 pb-8 md:px-10 md:pb-10">
        <FadeIn delay={0.35}>
          <p className="max-w-[230px] text-[clamp(0.8rem,1.1vw,1.05rem)] font-light leading-relaxed text-muted sm:max-w-[320px] md:max-w-[380px]">
            Software + electronic engineer crafting{" "}
            <span className="font-medium text-foreground">AI-driven platforms</span>,{" "}
            <span className="font-medium text-foreground">embedded IoT systems</span>, and{" "}
            <span className="font-medium text-foreground">premium web products</span>.
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
