"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Buttery inertial scrolling via Lenis, plus eased anchor navigation.
 * Disabled entirely under reduced motion (native scroll remains).
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.115, smoothWheel: true, autoRaf: true });

    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest?.('a[href^="#"]');
      if (!anchor) return;
      const hash = anchor.getAttribute("href")!;
      // Skip the handler for skip-to-content link — let native jump + focus work
      if (hash === "#main") return;
      const target = hash.length > 1 && document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, {
        offset: -88,
        duration: 1.1,
        easing: (t) => 1 - Math.pow(1 - t, 4),
      });
      // Set focus on the target and update URL
      (target as HTMLElement).tabIndex = -1;
      (target as HTMLElement).focus({ preventScroll: true });
      history.replaceState(null, "", hash);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);

  return null;
}
