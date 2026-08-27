"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { usePreloadGate } from "@/lib/preload";

/* Explicit tag map keeps the motion component union small enough for tsc
   (indexing motion[] across every intrinsic blows the union-complexity limit). */
const TAGS = {
  div: motion.div,
  section: motion.section,
  span: motion.span,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  ul: motion.ul,
  li: motion.li,
} as const;

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
  as?: keyof typeof TAGS;
  /** Hold hidden until the first-load intro has left, then play (with `delay`).
      On revisits (no intro) it plays right after mount. */
  afterPreload?: boolean;
}

/**
 * FadeIn component with scroll-triggered animation.
 * Animates opacity and position on view with easing.
 */
export function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className,
  as = "div",
  afterPreload = false,
}: FadeInProps) {
  const Component = TAGS[as];
  const ready = usePreloadGate();

  if (afterPreload) {
    return (
      <Component
        initial={{ opacity: 0, x, y }}
        animate={ready ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x, y }}
        transition={{
          delay,
          duration,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        className={className}
      >
        {children}
      </Component>
    );
  }

  return (
    <Component
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{
        delay,
        duration,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </Component>
  );
}

/**
 * FadeInStatic variant for LCP-critical content.
 * Renders without initial opacity-0, visible in server HTML.
 */
export function FadeInStatic({
  children,
  delay = 0,
  duration = 0.7,
  className,
  as = "div",
}: FadeInProps) {
  const Component = TAGS[as];

  return (
    <Component
      initial={false}
      animate={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{
        delay,
        duration,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </Component>
  );
}
