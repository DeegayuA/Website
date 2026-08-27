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

/* ── Design ────────────────────────────────────────────────────
   A CSS veil (html[data-intro], raised by an inline script before
   first paint) hides the SSR hero until this component mounts — no
   flash of the full-size name before the intro plays.

   The intro shows the name exactly ONCE: the two English lines rise
   out of an overflow mask (staggered) straight into the position of
   the live hero heading measured beneath the veil — so the veil
   dissolves over identical pixels and the intro simply becomes the
   page. A hairline progress bar + mono counter run along the bottom.
   (The bilingual moment lives in the hero's own name rotation — the
   preloader deliberately doesn't repeat the name in two languages.)

   The veil lifts only when the intro has played AND the landing is
   actually ready (fonts + window load, capped at READY_CAP_MS).   */
const INTRO_DELAY = 120;
const EN_IN_MS = 1000;
const STAGGER_MS = 100;
const SETTLE_MS = 180;
const FADE_MS = 550;
const READY_CAP_MS = 3500;
const INTRO_EASE = [0.19, 1, 0.22, 1] as const;
const INTRO_TOTAL_MS = INTRO_DELAY + EN_IN_MS + STAGGER_MS + SETTLE_MS;

/* Must mirror the hero's English rows — the intro lands on those glyphs. */
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
 * One masked rise of the name onto the live hero glyphs; the veil then
 * dissolves over identical pixels and the rest of the page cascades in.
 */
export function Preloader() {
  const canPlay = useSyncExternalStore(emptySubscribe, getCanPlay, getServerCanPlay);
  const [shouldShow, setShouldShow] = useState(true);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);
  const lineARef = useRef<HTMLSpanElement>(null);
  const lineBRef = useRef<HTMLSpanElement>(null);
  // Where the hero heading actually sits — measured after fonts load
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
      delete document.documentElement.dataset.intro; // drop the CSS veil too
      document.documentElement.dataset.preloaded = "true";
      window.dispatchEvent(new Event(PRELOAD_EVENT));
    }
  }, [canPlay]);

  /* Lifecycle: measurement, readiness gating, progress, veil handoff. */
  useEffect(() => {
    if (!show) return;

    document.documentElement.style.overflow = "hidden";
    const mainElement = document.getElementById("main");
    mainElement?.setAttribute("inert", "");

    let cancelled = false;
    let introPlayed = false;
    let assetsOk = false;
    let fadeTimer: ReturnType<typeof setTimeout> | undefined;
    let doneTimer: ReturnType<typeof setTimeout> | undefined;
    let introTimer: ReturnType<typeof setTimeout> | undefined;
    let measureRaf = 0;

    const maybeFinish = () => {
      if (cancelled || !introPlayed || !assetsOk) return;
      // The pre-paint CSS veil sits beneath this component's veil — drop it
      // now so the fade reveals the live hero, not a second opaque layer
      delete document.documentElement.dataset.intro;
      setProgress(100);
      // Hand off AT fade start, not after: gated entrances (navbar, roles,
      // CTA, ink burst) cascade in WHILE the veil dissolves — one continuous
      // motion from intro to page, no dead beat between them.
      sessionStorage.setItem(PRELOAD_KEY, "1");
      document.documentElement.dataset.preloaded = "true";
      window.dispatchEvent(new Event(PRELOAD_EVENT));
      setFading(true);
      doneTimer = setTimeout(() => {
        setShouldShow(false); // unmounts over identical hero pixels
      }, FADE_MS + 60);
    };

    // Measure the hero's English rows once glyph geometry is final
    // (the hero name is a dual-layer stack; EN is the layer we land on)
    document.fonts.ready.then(() => {
      if (cancelled) return;
      measureRaf = requestAnimationFrame(() => {
        const heroRows = document.querySelectorAll<HTMLElement>(
          '#home [data-fluid-layer="en"] [data-fluid-text]',
        );
        if (heroRows.length > 0) {
          setTarget(
            unionRect(Array.from(heroRows, (r) => r.getBoundingClientRect())),
          );
        }
        introTimer = setTimeout(() => {
          introPlayed = true;
          maybeFinish();
        }, INTRO_TOTAL_MS);
      });
    });

    // Honest-ish progress: eases toward 90 across the intro window and
    // snaps to 100 when the veil actually lifts
    const counter = animate(0, 90, {
      duration: (INTRO_TOTAL_MS + FADE_MS) / 1000,
      ease: "easeOut",
      onUpdate: (v) => {
        if (!cancelled) setProgress(Math.round(v));
      },
    });

    // Landing readiness: fonts + full window load, with a hard cap
    const winLoaded =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((resolve) =>
            window.addEventListener("load", () => resolve(), { once: true }),
          );
    const cap = new Promise<void>((resolve) => {
      fadeTimer = setTimeout(resolve, READY_CAP_MS);
    });
    Promise.race([
      Promise.all([document.fonts.ready, winLoaded]).then(() => undefined),
      cap,
    ]).then(() => {
      assetsOk = true;
      maybeFinish();
    });

    return () => {
      cancelled = true;
      counter.stop();
      cancelAnimationFrame(measureRaf);
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
      clearTimeout(introTimer);
      document.documentElement.style.overflow = "";
      mainElement?.removeAttribute("inert");
    };
  }, [show]);

  /* One deterministic rise onto the hero position — no swaps, no phases. */
  useEffect(() => {
    if (!show || !target) return;
    const lines = [lineARef.current, lineBRef.current];
    if (lines.some((l) => !l)) return;

    const controls = lines.map((el, i) =>
      animate(
        el!,
        { transform: ["translateY(112%)", "translateY(0%)"] },
        {
          duration: EN_IN_MS / 1000,
          delay: (INTRO_DELAY + i * STAGGER_MS) / 1000,
          ease: INTRO_EASE,
        },
      ),
    );
    return () => controls.forEach((c) => c.stop());
  }, [show, target]);

  if (!show) return null;

  return (
    <div
      role="status"
      aria-label="Loading"
      className="fixed inset-0 z-[999] overflow-hidden"
    >
      {/* Veil */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-background"
        initial={false}
        animate={{ opacity: fading ? 0 : 1 }}
        transition={{ duration: FADE_MS / 1000, ease: "easeInOut" }}
      >
        <div aria-hidden="true" className="noise" />
      </motion.div>

      {/* The name — masked line rises straight into the hero position.
          Fades with the veil; the identical hero heading is beneath. */}
      <motion.div
        aria-hidden="true"
        initial={false}
        animate={{ opacity: fading ? 0 : 1 }}
        transition={{ duration: FADE_MS / 1000, ease: "easeInOut" }}
      >
        {target && (
          <div
            className="absolute flex flex-col justify-center"
            style={{
              left: target.left,
              top: target.top,
              width: target.width,
              height: target.height,
            }}
          >
            {LINES.map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <span
                  ref={i === 0 ? lineARef : lineBRef}
                  className="hero-heading block whitespace-nowrap text-center text-[13vw] font-black uppercase leading-none tracking-tight will-change-transform sm:text-[14vw] md:text-[15vw]"
                  style={{ transform: "translateY(112%)" }}
                >
                  {line}
                </span>
              </span>
            ))}
          </div>
        )}
      </motion.div>

      {/* Progress — gradient hairline + mono counter, fades with the veil */}
      <motion.div
        aria-hidden="true"
        initial={false}
        animate={{ opacity: fading ? 0 : 1 }}
        transition={{ duration: FADE_MS / 1000, ease: "easeInOut" }}
      >
        <div className="absolute inset-x-0 bottom-0 h-px bg-line">
          <div
            className="h-full origin-left bg-foreground transition-transform duration-200 ease-out"
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </div>
        <div className="absolute bottom-5 left-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted md:left-10">
          Portfolio · Colombo, Sri Lanka
        </div>
        <div className="absolute bottom-5 right-6 font-mono text-[10px] tabular-nums uppercase tracking-[0.2em] text-muted md:right-10">
          {String(progress).padStart(3, "0")}
        </div>
      </motion.div>

      <span className="sr-only">Loading portfolio</span>
    </div>
  );
}
