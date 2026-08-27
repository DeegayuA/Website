"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

interface AnimatedTextProps {
  children: string;
  className?: string;
}

/* One component per character so useTransform runs at a hook-legal top level
   (calling it inside a loop over chars violates the Rules of Hooks). */
function Char({
  char,
  progress,
  start,
  end,
}: {
  char: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const opacity = useTransform(progress, [start, end], [0.2, 1], {
    clamp: true,
  });
  return (
    <span className="relative inline">
      {/* Placeholder span — invisible but reserves space */}
      <span className="invisible">{char}</span>
      {/* Animated span — absolutely positioned, fades in on scroll */}
      <motion.span className="absolute left-0 top-0" style={{ opacity }}>
        {char}
      </motion.span>
    </span>
  );
}

/**
 * AnimatedText — character-by-character scroll-driven opacity animation.
 * As the section scrolls into view, each character fades from 0.2 to 1 opacity.
 */
export function AnimatedText({ children, className }: AnimatedTextProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.2"],
  });

  const chars = children.split("");
  const charCount = chars.length;

  return (
    <p ref={containerRef} className={className}>
      {/* Screen readers get the intact sentence; the per-character split
          (and its scroll-dimmed opacity) is presentation only */}
      <span className="sr-only">{children}</span>
      <span aria-hidden="true">
        {chars.map((char, i) => (
          <Char
            key={i}
            char={char}
            progress={scrollYProgress}
            start={i / charCount}
            end={(i + 1) / charCount}
          />
        ))}
      </span>
    </p>
  );
}
