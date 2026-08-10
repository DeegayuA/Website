"use client";

import { motion } from "motion/react";
import type { ComponentType, ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
  as?: ComponentType<any> | keyof JSX.IntrinsicElements;
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
  as,
}: FadeInProps) {
  const Component = as ? motion[as as keyof typeof motion] || motion.div : motion.div;

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
  x = 0,
  y = 30,
  className,
  as,
}: FadeInProps) {
  const Component = as ? motion[as as keyof typeof motion] || motion.div : motion.div;

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
