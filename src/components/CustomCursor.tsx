"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useQuality } from "@/lib/quality";

/** True on mouse-driven, motion-friendly devices; false on server/touch. */
function useFinePointer() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(pointer: fine)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () =>
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

/**
 * Custom pointer: a precise accent dot plus a lagging glass ring that
 * swells over interactive elements and squeezes on press.
 * Mouse-only — disabled on touch, under reduced motion, and over text
 * fields (where the native caret matters).
 */
export function CustomCursor() {
  const enabled = useFinePointer();
  const tier = useQuality();
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 320, damping: 28, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 320, damping: 28, mass: 0.6 });
  // Laggier follower for the high-tier comet trail
  const trailX = useSpring(x, { stiffness: 120, damping: 20, mass: 1 });
  const trailY = useSpring(y, { stiffness: 120, damping: 20, mass: 1 });

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("cursor-none");

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement;
      // native caret beats custom dot inside form fields
      setVisible(!t.closest?.("input, textarea, select"));
      setHovering(!!t.closest?.("a, button, [role='button'], summary, label"));
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.documentElement.addEventListener("pointerenter", onEnter);
    return () => {
      document.documentElement.classList.remove("cursor-none");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.removeEventListener("pointerenter", onEnter);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[1000]">
      {/* High-tier comet trail — a self-contained soft glow (filter blurs the
          glow itself, never the text behind it, unlike backdrop-blur). */}
      {tier === "high" && (
        <motion.div
          className="absolute h-7 w-7 rounded-full bg-accent/20 blur-md"
          style={{ x: trailX, y: trailY, translateX: "-50%", translateY: "-50%" }}
          animate={{ opacity: visible ? 1 : 0, scale: hovering ? 1.7 : 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 24 }}
        />
      )}
      {/* precise dot */}
      <motion.div
        className="absolute h-2 w-2 rounded-full bg-accent"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: visible ? 1 : 0, scale: pressed ? 0.6 : 1 }}
        transition={{ duration: 0.15 }}
      />
      {/* trailing ring — crisp outline + faint tint, NO backdrop-filter so it
          never frosts the text it passes over */}
      <motion.div
        className="absolute h-9 w-9 rounded-full border border-foreground/40 bg-accent-soft/25"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: pressed ? 1.05 : hovering ? 1.8 : 1,
        }}
        transition={{ type: "spring", stiffness: 380, damping: 26 }}
      />
    </div>
  );
}
