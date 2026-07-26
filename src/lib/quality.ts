"use client";

import { createContext, createElement, useContext, useEffect, useState } from "react";

/**
 * Adaptive visual-quality tiers.
 *
 * "high"   — desktop-class GPU/CPU: every effect, plus the heavy flourishes
 *            (cursor comet, hero 3D tilt, full aurora + spotlight).
 * "medium" — capable but modest: full glass + aurora, no extra per-frame work.
 * "low"    — weak/old/mobile or reduced-motion: trimmed decoration, cheap
 *            blurs, no cursor/spotlight work. Nothing is removed — it's the
 *            same layout, just rasterized for frame rate.
 *
 * The tier is also mirrored onto <html data-quality> so CSS can scale the
 * purely-decorative layers without React having to gate every element.
 */
export type QualityTier = "high" | "medium" | "low";

export function detectTier(): QualityTier {
  if (typeof window === "undefined") return "low";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "low";

  const fine = window.matchMedia("(pointer: fine)").matches;
  const wideEnough = window.matchMedia("(min-width: 768px)").matches;
  // Not universally supported, so treat absence as a middling 4.
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory =
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;

  let score = 0;
  if (cores >= 8) score += 2;
  else if (cores >= 4) score += 1;
  if (memory >= 8) score += 2;
  else if (memory >= 4) score += 1;
  if (fine) score += 1;
  if (wideEnough) score += 1;

  if (score >= 5) return "high";
  if (score >= 3) return "medium";
  return "low";
}

const QualityContext = createContext<QualityTier>("low");

export function useQuality(): QualityTier {
  return useContext(QualityContext);
}

export function QualityProvider({ children }: { children: React.ReactNode }) {
  // Start "low" so the server and first client paint agree (no hydration
  // mismatch); upgrade after mount once we can measure the device. Heavy
  // effects therefore enhance in progressively, never block first paint.
  const [tier, setTier] = useState<QualityTier>("low");

  useEffect(() => {
    const update = () => {
      const next = detectTier();
      setTier(next);
      document.documentElement.dataset.quality = next;
    };
    update();

    // Re-evaluate if the user toggles reduced-motion or switches pointer type
    // (e.g. plugs in a mouse, rotates a 2-in-1).
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = window.matchMedia("(pointer: fine)");
    motion.addEventListener("change", update);
    pointer.addEventListener("change", update);
    return () => {
      motion.removeEventListener("change", update);
      pointer.removeEventListener("change", update);
    };
  }, []);

  return createElement(QualityContext.Provider, { value: tier }, children);
}
