"use client";

import { motion, type Variants } from "motion/react";

/* Automated browsers never scroll — reveal immediately for them so
   full-page captures and AI agents see the content (see FadeIn.tsx). */
const isBot = typeof navigator !== "undefined" && navigator.webdriver;

const variants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] },
  }),
};

/** Scroll-into-view reveal. Respects reduced motion via MotionConfig. */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "span";
}) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      variants={variants}
      initial="hidden"
      animate={isBot ? "visible" : undefined}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      custom={delay}
      data-fade=""
    >
      {children}
    </Tag>
  );
}
