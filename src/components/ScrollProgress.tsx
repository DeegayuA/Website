"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";

/**
 * Thin scroll-progress hairline pinned above the navbar — the one place the
 * CTA gradient reappears, tying the chrome to the ContactButton accent.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 28,
    restDelta: 0.001,
  });
  const reduced = useReducedMotion();

  if (reduced) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left"
      style={{
        scaleX,
        background:
          "linear-gradient(90deg, #B600A8 0%, #7621B0 55%, #BE4C00 100%)",
      }}
    />
  );
}
