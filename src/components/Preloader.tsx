"use client";

import { useEffect, useState } from "react";
import { animate, motion, AnimatePresence, type Variants } from "motion/react";

const letter: Variants = {
  hidden: { y: "115%", rotate: 4 },
  visible: (i: number) => ({
    y: 0,
    rotate: 0,
    transition: {
      duration: 0.55,
      delay: 0.12 + i * 0.035,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  }),
};

/**
 * Entry sequence: monogram pop, per-letter name rise, percentage
 * count-up, then the sheet sweeps away with a curved hem.
 * Collapses instantly under reduced motion.
 */
export function Preloader() {
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!reduced) {
      document.documentElement.style.overflow = "hidden";
    }
    const counter = reduced
      ? null
      : animate(0, 100, {
          duration: 1.5,
          ease: [0.6, 0.05, 0.3, 1],
          onUpdate: (v) => setCount(Math.round(v)),
        });
    const t = setTimeout(
      () => {
        setDone(true);
        document.documentElement.style.overflow = "";
      },
      reduced ? 0 : 1700,
    );
    return () => {
      counter?.stop();
      clearTimeout(t);
      document.documentElement.style.overflow = "";
    };
  }, []);

  const chars = "Software + electronics".split("");

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          role="status"
          aria-label="Loading"
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center overflow-hidden bg-background"
          exit={{
            y: "-100%",
            borderBottomLeftRadius: ["0%", "45%", "8%"],
            borderBottomRightRadius: ["0%", "45%", "8%"],
          }}
          transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
        >
          <div aria-hidden="true" className="noise" />

          <motion.div
            aria-hidden="true"
            initial={{ scale: 0.5, opacity: 0, rotate: -8 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 230, damping: 20 }}
            className="orb flex h-18 w-18 items-center justify-center rounded-[1.5rem] font-display text-2xl font-bold text-accent"
          >
            DA
          </motion.div>

          <p
            aria-hidden="true"
            className="mt-7 flex max-w-[92vw] justify-center overflow-hidden text-balance px-4 font-display text-2xl font-bold tracking-tight sm:text-4xl"
          >
            {chars.map((ch, i) =>
              ch === " " ? (
                <span key={i} className="w-[0.35em]" />
              ) : (
                <span key={i} className="inline-block overflow-hidden pb-1">
                  <motion.span
                    className="inline-block"
                    variants={letter}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                  >
                    {ch}
                  </motion.span>
                </span>
              ),
            )}
          </p>

          <motion.div
            aria-hidden="true"
            className="mt-8 h-0.5 w-44 overflow-hidden rounded-full bg-foreground/10"
          >
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-accent via-accent-2 to-accent-3"
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 1.5, ease: [0.6, 0.05, 0.3, 1] }}
            />
          </motion.div>

          <motion.span
            aria-hidden="true"
            className="absolute bottom-6 right-8 font-mono text-7xl font-bold tabular-nums tracking-tighter text-foreground/15 sm:text-8xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {count}
            <span className="align-top text-3xl sm:text-4xl">%</span>
          </motion.span>

          <span className="sr-only">Loading portfolio</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
