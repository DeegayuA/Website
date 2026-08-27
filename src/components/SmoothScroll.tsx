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
      // Nav links are "/#section" so they also work from sub-pages; match
      // both forms and only intercept when the anchor targets THIS page
      const anchor = (e.target as HTMLElement).closest?.('a[href*="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute("href")!;
      const [path, id] = href.split("#");
      if (!id) return;
      if (path && path !== "/" && path !== window.location.pathname) return;
      if (path === "/" && window.location.pathname !== "/") return;
      // Skip the handler for skip-to-content link — let native jump + focus work
      if (id === "main") return;
      const hash = `#${id}`;
      const target = document.getElementById(id);
      if (!target) return;
      // Capture-phase interception: stop next/link's delegated handler from
      // ALSO router.push-ing the hash (double scroll fight), then ease.
      e.preventDefault();
      e.stopPropagation();
      lenis.scrollTo(target as HTMLElement, {
        offset: -88,
        duration: 1.1,
        easing: (t) => 1 - Math.pow(1 - t, 4),
        // cv-section heights are only estimated until first render, so the
        // document can shift while easing past them — settle on the real
        // position once the animation lands
        onComplete: () => {
          lenis.scrollTo(target as HTMLElement, { offset: -88, immediate: true });
        },
      });
      // Set focus on the target and update URL
      (target as HTMLElement).tabIndex = -1;
      (target as HTMLElement).focus({ preventScroll: true });
      history.replaceState(null, "", hash);
    };
    document.addEventListener("click", onClick, true);

    return () => {
      document.removeEventListener("click", onClick, true);
      lenis.destroy();
    };
  }, []);

  return null;
}
