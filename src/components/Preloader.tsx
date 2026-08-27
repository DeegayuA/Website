"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { animate, motion, AnimatePresence, type Variants } from "motion/react";

const KEY = "dw-preloaded";

// Client-only gate: skip on revisits and under reduced motion. Server
// snapshot is `false`, so SSR renders nothing and hydration matches.
const emptySubscribe = () => () => {};
const getCanPlay = () =>
  !(
    sessionStorage.getItem(KEY) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
const getServerCanPlay = () => false;

const letter: Variants = {
  hidden: { y: "115%", rotate: 4 },
  visible: (i: number) => ({
    y: 0,
    rotate: 0,
    transition: {
      duration: 0.55,
      delay: 0.12 + i * 0.035,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  }),
};

/**
 * Entry sequence: monogram pop, per-letter name rise, percentage
 * count-up, then the sheet sweeps away with a static rounded bottom.
 * Skips on revisits or under reduced motion.
 */
export function Preloader() {
  const countRef = useRef<HTMLSpanElement>(null);
  const canPlay = useSyncExternalStore(emptySubscribe, getCanPlay, getServerCanPlay);
  const [shouldShow, setShouldShow] = useState(true);
  const show = canPlay && shouldShow;

  // Mark as preloaded when skipped
  useEffect(() => {
    if (!canPlay) {
      document.documentElement.dataset.preloaded = "true";
    }
  }, [canPlay]);

  // Handle animation and lifecycle when showing
  useEffect(() => {
    if (!show) return;

    document.documentElement.style.overflow = "hidden";
    const mainElement = document.getElementById("main");
    if (mainElement) {
      mainElement.setAttribute("inert", "");
    }

    // Animate counter via motion value: zero React re-renders
    let animationControl: ReturnType<typeof animate> | null = null;
    if (countRef.current) {
      animationControl = animate(0, 100, {
        duration: 1.05,
        ease: [0.6, 0.05, 0.3, 1],
        onUpdate: (v) => {
          if (countRef.current) {
            countRef.current.textContent = String(Math.round(v));
          }
        },
      });
    }

    // Exit timing: counter ends at 1050ms, then exit animation plays
    const exitTimer = setTimeout(() => {
      sessionStorage.setItem(KEY, "1");
      setShouldShow(false);
    }, 1050);

    return () => {
      animationControl?.stop();
      clearTimeout(exitTimer);
      document.documentElement.style.overflow = "";
      if (mainElement) {
        mainElement.removeAttribute("inert");
      }
    };
  }, [show]);

  const chars = "Deeghayu Adhikari".split("");

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="status"
          aria-label="Loading"
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center overflow-hidden bg-background rounded-b-[3rem]"
          exit={{
            y: "-100%",
            opacity: 0,
          }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          onAnimationComplete={() => {
            document.documentElement.dataset.preloaded = "true";
            const mainElement = document.getElementById("main");
            if (mainElement) {
              mainElement.removeAttribute("inert");
            }
          }}
        >
          <div aria-hidden="true" className="noise" />

          <motion.div
            aria-hidden="true"
            initial={{ scale: 0.5, opacity: 0, rotate: -8 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 230, damping: 20 }}
            className="orb flex h-18 w-18 items-center justify-center overflow-hidden rounded-[1.5rem] font-display text-2xl font-bold"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- preloader paints before hydration; skip Image optimization */}
            <img
              src="/images/profile.webp"
              alt=""
              width={72}
              height={72}
              className="h-full w-full object-cover"
            />
          </motion.div>

          <p
            aria-hidden="true"
            className="mt-7 flex max-w-[92vw] justify-center overflow-hidden text-balance px-4 font-display text-2xl font-bold tracking-tight sm:text-4xl"
          >
            {chars.map((ch, i) =>
              ch === " " ? (
                <span key={i} className="w-[0.35em]" />
              ) : (
                <span key={i} className="inline-block overflow-hidden pb-1">
                  <motion.span
                    className="inline-block"
                    variants={letter}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                  >
                    {ch}
                  </motion.span>
                </span>
              ),
            )}
          </p>

          <motion.div
            aria-hidden="true"
            className="mt-8 h-0.5 w-44 overflow-hidden rounded-full bg-foreground/10"
          >
            <motion.div
              className="h-full rounded-full bg-[linear-gradient(90deg,#B600A8,#7621B0,#BE4C00)]"
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 1.05, ease: [0.6, 0.05, 0.3, 1] }}
            />
          </motion.div>

          <motion.span
            aria-hidden="true"
            className="absolute bottom-6 right-8 font-mono text-7xl font-bold tabular-nums tracking-tighter text-foreground/15 sm:text-8xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <span ref={countRef}>0</span>
            <span className="align-top text-3xl sm:text-4xl">%</span>
          </motion.span>

          <span className="sr-only">Loading portfolio</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
