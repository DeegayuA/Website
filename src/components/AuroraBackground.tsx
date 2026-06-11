"use client";

import { useEffect, useRef } from "react";

/**
 * Moving mesh-gradient backdrop.
 *
 * Large, vivid color fields drift across the viewport on independent paths,
 * giving the frosted-glass surfaces above a rich, ever-changing backdrop to
 * refract. Replaces the old aurora (conic sweep + dot grid) for a cleaner,
 * higher-contrast look.
 *
 * Perf: every field is a pre-painted radial moved only by `transform`
 * (GPU-composited, no per-frame repaint). The cursor spotlight is likewise a
 * pre-painted circle nudged with transform. On weak devices the
 * `[data-quality="low"]` rules in globals.css soften the blur automatically.
 */
export function AuroraBackground() {
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const spot = spotRef.current;
    if (!spot) return;
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        spot.style.transform = `translate3d(${e.clientX - 640}px, ${e.clientY - 640}px, 0)`;
        spot.style.opacity = "1";
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden">
      <div className="mesh-base" />
      <div className="mesh-blob mesh-blob--a" />
      <div className="mesh-blob mesh-blob--b" />
      <div className="mesh-blob mesh-blob--c" />
      <div className="mesh-blob mesh-blob--d" />
      <div ref={spotRef} className="spotlight" />
      <div className="noise" />
    </div>
  );
}
