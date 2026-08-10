"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

interface AnimatedTextProps {
  children: string;
  className?: string;
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

  // Map each character to a specific range of scroll progress
  const getCharOpacity = (index: number) => {
    const charStart = index / charCount;
    const charEnd = (index + 1) / charCount;

    return useTransform(scrollYProgress, [charStart, charEnd], [0.2, 1], {
      clamp: true,
    });
  };

  return (
    <p ref={containerRef} className={className}>
      {chars.map((char, i) => (
        <span key={i} className="relative inline">
          {/* Placeholder span — invisible but reserves space */}
          <span className="invisible">{char}</span>
          {/* Animated span — absolutely positioned, fades in on scroll */}
          <motion.span
            className="absolute left-0 top-0"
            style={{ opacity: getCharOpacity(i) }}
          >
            {char}
          </motion.span>
        </span>
      ))}
    </p>
  );
}
