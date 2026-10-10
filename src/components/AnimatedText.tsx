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
  const opacity = useTransform(progress, [start, end], [0.3, 1], {
    clamp: true,
  });
  /* Single span per character — opacity needs no placeholder/absolute
     pair, and the doubled glyphs used to reach raw-HTML crawlers as
     ~2k chars of "S S o o f f t t..." keyword noise. */
  return <motion.span style={{ opacity }}>{char}</motion.span>;
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

  /* The sentence now exists exactly once in the DOM — real text nodes in
     inline spans, so screen readers, crawlers and AI agents all read it
     clean (min opacity is 0.3, never invisible). */
  return (
    <p ref={containerRef} className={className}>
      {chars.map((char, i) => (
        <Char
          key={i}
          char={char}
          progress={scrollYProgress}
          start={i / charCount}
          end={(i + 1) / charCount}
        />
      ))}
    </p>
  );
}
