"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { animate, motion } from "motion/react";
import { PRELOAD_EVENT, PRELOAD_KEY } from "@/lib/preload";

// Client-only gate: skip on revisits and under reduced motion. Server
// snapshot is `false`, so SSR renders nothing and hydration matches.
const emptySubscribe = () => () => {};
const getCanPlay = () =>
  !(
    sessionStorage.getItem(PRELOAD_KEY) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
const getServerCanPlay = () => false;

/* ── Timeline (ms) ─────────────────────────────────────────────
   zoom   80 → 1580   the name scales 0 → 1 into the exact spot the
                      hero heading occupies beneath the veil
   settle 1580 → 1730 beat of stillness at full size
   fade   1730 → 2130 veil dissolves; the revealed heading is pixel-
                      identical, so the loader's exit is invisible —
                      the intro simply becomes the page
   then the navbar / roles / CTA / ink burst cascade in via
   usePreloadGate listening for PRELOAD_EVENT.                    */
const ZOOM_DELAY = 80;
const ZOOM_MS = 1500;
const T_FADE = ZOOM_DELAY + ZOOM_MS + 150;
const FADE_MS = 400;
const T_DONE = T_FADE + FADE_MS + 60;

/* Must mirror the hero's NAME.en — the zoom lands on those glyphs. */
const LINES = ["DEEGHAYU", "ADHIKARI"] as const;

function unionRect(rects: DOMRect[]) {
  const left = Math.min(...rects.map((r) => r.left));
  const top = Math.min(...rects.map((r) => r.top));
  const right = Math.max(...rects.map((r) => r.right));
  const bottom = Math.max(...rects.map((r) => r.bottom));
  return { left, top, width: right - left, height: bottom - top };
}

/**
 * First-load intro that continues end-to-end into the landing page.
 * The page opens with nothing but the canvas; the name zooms in from
 * scale 0 to full hero size, positioned over the live hero heading
 * measured beneath the opaque veil. The veil then dissolves over
 * identical pixels and everything else cascades in after.
 */
export function Preloader() {
  const nameRef = useRef<HTMLDivElement>(null);
  const canPlay = useSyncExternalStore(emptySubscribe, getCanPlay, getServerCanPlay);
  const [shouldShow, setShouldShow] = useState(true);
  const [fading, setFading] = useState(false);
  // Where the hero heading actually sits — measured after mount
  const [target, setTarget] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const show = canPlay && shouldShow;

  // Mark as preloaded when skipped so gated entrances open immediately
  useEffect(() => {
    if (!canPlay) {
      document.documentElement.dataset.preloaded = "true";
      window.dispatchEvent(new Event(PRELOAD_EVENT));
    }
  }, [canPlay]);

  useEffect(() => {
    if (!show) return;

    document.documentElement.style.overflow = "hidden";
    const mainElement = document.getElementById("main");
    mainElement?.setAttribute("inert", "");

    // The hero h1 is SSR-visible and still English at this point (its
    // first language swap is seconds away), so the target is stable.
    const heroRows = document.querySelectorAll<HTMLElement>(
      "#home h1 [data-fluid-text]",
    );
    if (heroRows.length > 0) {
      setTarget(unionRect(Array.from(heroRows, (r) => r.getBoundingClientRect())));
    }

    const fadeTimer = setTimeout(() => setFading(true), T_FADE);
    const doneTimer = setTimeout(() => {
      sessionStorage.setItem(PRELOAD_KEY, "1");
      document.documentElement.dataset.preloaded = "true";
      window.dispatchEvent(new Event(PRELOAD_EVENT));
      setShouldShow(false); // unmounts over identical hero pixels
    }, T_DONE);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
      document.documentElement.style.overflow = "";
      mainElement?.removeAttribute("inert");
    };
  }, [show]);

  // Zoom once the clone is laid out over the measured hero rect
  useEffect(() => {
    if (!show || !target || !nameRef.current) return;
    const controls = animate(
      nameRef.current,
      { transform: ["scale(0)", "scale(1)"] },
      { duration: ZOOM_MS / 1000, delay: ZOOM_DELAY / 1000, ease: [0.19, 1, 0.22, 1] },
    );
    return () => controls.stop();
  }, [show, target]);

  if (!show) return null;

  return (
    <div
      role="status"
      aria-label="Loading"
      className="fixed inset-0 z-[999] overflow-hidden"
    >
      {/* Veil — nothing on it but the canvas itself */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-background"
        initial={false}
        animate={{ opacity: fading ? 0 : 1 }}
        transition={{ duration: FADE_MS / 1000, ease: "easeInOut" }}
      >
        <div aria-hidden="true" className="noise" />
      </motion.div>

      {/* The name — hero glyphs, zooming 0 → full size in place.
          Fades with the veil; the identical hero heading is beneath. */}
      <motion.div
        aria-hidden="true"
        initial={false}
        animate={{ opacity: fading ? 0 : 1 }}
        transition={{ duration: FADE_MS / 1000, ease: "easeInOut" }}
      >
        {target && (
          <div
            className="absolute"
            style={{ left: target.left, top: target.top, width: target.width }}
          >
            <div
              ref={nameRef}
              className="hero-heading w-full text-center text-[13vw] font-black uppercase leading-none tracking-tight will-change-transform sm:text-[14vw] md:text-[15vw]"
              style={{ transform: "scale(0)" }}
            >
              {LINES.map((line) => (
                <span key={line} className="block whitespace-nowrap">
                  {line}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      <span className="sr-only">Loading portfolio</span>
    </div>
  );
}
