"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

/**
 * Number that counts up from 0 when it enters the viewport, once.
 * Reduced motion renders the final value immediately.
 */
export function CountUp({
  value,
  suffix = "",
  duration = 1.4,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();
  // Starts at the REAL value: server HTML, crawlers, and reader modes show
  // "20+", never "0+". The animation resets to 0 only once it actually runs.
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView || reduced) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduced, value, duration]);

  // Reduced motion skips the animation entirely and shows the final value
  const shown = reduced ? value : display;

  return (
    <span ref={ref}>
      {shown}
      {suffix}
    </span>
  );
}
