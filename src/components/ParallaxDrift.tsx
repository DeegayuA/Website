"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useQuality } from "@/lib/quality";

/**
 * Subtle scroll parallax — the wrapped block drifts a few px against scroll
 * so section headings move at a different rate than their bodies. Pure
 * transform (compositor-only). Still under reduced motion or the low tier.
 */
export function ParallaxDrift({
  children,
  distance = 26,
  className,
}: {
  children: React.ReactNode;
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const tier = useQuality();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const still = reduced || tier === "low";

  return (
    <motion.div ref={ref} style={still ? undefined : { y }} className={className}>
      {children}
    </motion.div>
  );
}
