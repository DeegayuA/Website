"use client";

import { useEffect, useRef } from "react";

/**
 * Moving mesh-gradient backdrop.
 *
 * Large color fields drift on slow CSS keyframe paths while a JS lerp loop
 * eases each field toward the cursor at a different depth, so the whole mesh
 * leans lazily after the mouse. A slow hue-rotate keyframe shifts the palette
 * over the course of a minute.
 *
 * Perf: every field is a pre-painted radial moved only by `transform`
 * (GPU-composited, no per-frame repaint); the JS loop writes 5 transforms and
 * touches no layout. Parallax and spotlight are skipped on touch devices and
 * under reduced motion; `[data-quality="low"]` hides the fields entirely.
 */

/** Per-field parallax depth — how far each leans toward the cursor. */
const DEPTHS = [0.035, 0.055, 0.045, 0.07, 0.028];
const FOLLOW = 0.045; // lerp factor per frame — lower = lazier
const SPOT_FOLLOW = 0.09;

export function AuroraBackground() {
  const blobRefs = useRef<(HTMLDivElement | null)[]>([]);
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const spot = spotRef.current;
    const blobs = blobRefs.current.filter(Boolean) as HTMLDivElement[];
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    let raf = 0;
    let running = false;
    // Pointer offset from viewport centre, and the eased positions chasing it
    const target = { x: 0, y: 0 };
    const eased = DEPTHS.map(() => ({ x: 0, y: 0 }));
    const spotPos = { x: -2000, y: -2000 };
    const spotTarget = { x: -2000, y: -2000 };

    const tick = () => {
      let settled = true;
      blobs.forEach((el, i) => {
        const e = eased[i];
        const tx = target.x * DEPTHS[i];
        const ty = target.y * DEPTHS[i];
        e.x += (tx - e.x) * FOLLOW;
        e.y += (ty - e.y) * FOLLOW;
        if (Math.abs(tx - e.x) > 0.1 || Math.abs(ty - e.y) > 0.1) settled = false;
        el.style.transform = `translate3d(${e.x}px, ${e.y}px, 0)`;
      });
      if (spot) {
        spotPos.x += (spotTarget.x - spotPos.x) * SPOT_FOLLOW;
        spotPos.y += (spotTarget.y - spotPos.y) * SPOT_FOLLOW;
        if (
          Math.abs(spotTarget.x - spotPos.x) > 0.2 ||
          Math.abs(spotTarget.y - spotPos.y) > 0.2
        ) {
          settled = false;
        }
        spot.style.transform = `translate3d(${spotPos.x - 640}px, ${spotPos.y - 640}px, 0)`;
      }
      if (settled) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX - window.innerWidth / 2;
      target.y = e.clientY - window.innerHeight / 2;
      spotTarget.x = e.clientX;
      spotTarget.y = e.clientY;
      if (spot) spot.style.opacity = "1";
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
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
      <div className="mesh-grid" />
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          ref={(el) => {
            blobRefs.current[i] = el;
          }}
          className="absolute inset-0 will-change-transform"
        >
          <div className={`mesh-blob mesh-blob--${"abcde"[i]}`} />
        </div>
      ))}
      <div className="mesh-vignette" />
      <div ref={spotRef} className="spotlight" />
      <div className="noise" />
    </div>
  );
}
