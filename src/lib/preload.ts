"use client";

import { useEffect, useState } from "react";

/** Session gate shared by the preloader and everything that sequences after it. */
export const PRELOAD_KEY = "dw-preloaded";
export const PRELOAD_EVENT = "dw:preloaded";

/** Resolves once the preloader has fully left (immediately when skipped). */
export function preloadDone(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return; // never resolves on the server
    if (document.documentElement.dataset.preloaded === "true") {
      resolve();
      return;
    }
    const onDone = () => {
      window.removeEventListener(PRELOAD_EVENT, onDone);
      resolve();
    };
    window.addEventListener(PRELOAD_EVENT, onDone);
  });
}

/**
 * False until the preloader is gone (+ optional extra ms), then true.
 * Starts false on the server and first client paint, so gated entrances
 * hold their hidden pose under the veil and cascade after it lifts.
 * On revisits (no preloader) it flips true right after mount.
 */
export function usePreloadGate(extraDelayMs = 0): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let timer: number | undefined;
    let alive = true;
    preloadDone().then(() => {
      if (!alive) return;
      if (extraDelayMs > 0) {
        timer = window.setTimeout(() => setReady(true), extraDelayMs);
      } else {
        setReady(true);
      }
    });
    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, [extraDelayMs]);
  return ready;
}
