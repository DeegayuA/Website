"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { site } from "@/data/site";
import { FadeIn } from "@/components/FadeIn";
import { ContactButton } from "@/components/ContactButton";
import { HeroFluid } from "@/components/HeroFluid";
import { Magnetic } from "@/components/Magnetic";

/* ── Rotating roles line ───────────────────────────────────── */
const ROLE_CLASS =
  "whitespace-nowrap text-center text-xs uppercase tracking-[0.3em] text-muted sm:text-sm";

function RoleRotator() {
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(
      () => setI((v) => (v + 1) % site.roles.length),
      2500,
    );
    return () => clearInterval(id);
  }, [reduced]);

  /* No structural branch on `reduced` — useReducedMotion is null during SSR
     but true on the first client render, and a different tree would be a
     hydration mismatch. The effect above already skips rotation, so reduced
     users simply keep the first role rendered statically. */
  return (
    <div className="relative h-5 w-full sm:h-6">
      {/* Static list for screen readers — the rotating copy would otherwise
          re-announce itself every 2.5s via a live region */}
      <p className="sr-only">{site.roles.join(", ")}</p>
      <span aria-hidden="true">
        <AnimatePresence initial={false}>
          <motion.p
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`absolute inset-0 flex items-center justify-center ${ROLE_CLASS}`}
          >
            {site.roles[i]}
          </motion.p>
        </AnimatePresence>
      </span>
    </div>
  );
}

/* ── Bilingual name — SSR paints English; after mount it alternates
      with the Sinhala spelling. The h1 itself never opacity-animates,
      keeping the hero SSR-visible. ─────────────────────────────── */
const NAME = {
  en: ["DEEGHAYU", "ADHIKARI"],
  si: ["දිඝායු", "අධිකාරි"],
} as const;

const NAME_TILT = 7; // deg — subtle 3D lean toward the pointer

function NameRotator() {
  const [lang, setLang] = useState<keyof typeof NAME>("en");
  // The dual-layer name stack — HeroFluid rasterises its rows for the mask
  const headingRef = useRef<HTMLDivElement>(null);
  // The pointer-pause hit area — the tilting wrapper around heading + ink
  const areaRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // 3D tilt — springs chase the pointer, settle to flat when it leaves
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 120, damping: 18 });
  const sry = useSpring(ry, { stiffness: 120, damping: 18 });

  /* Language-swap timer with true pause/resume. Hovering the heading (or
     the same 80px margin the fluid ink stirs in) freezes the countdown —
     the swap never fires mid-play. On leave the countdown resumes where it
     stopped, and if less than 1s remains it gets 2s of grace so the name
     never swaps the instant the pointer walks away. */
  useEffect(() => {
    if (reduced) return;
    const PERIOD = 5000;
    const MIN_REMAINING = 1000;
    const GRACE = 2000;
    const MARGIN = 80;
    let timer: number | undefined;
    let startedAt = performance.now();
    let remaining = PERIOD;
    let paused = false;

    const fire = () => {
      setLang((v) => (v === "en" ? "si" : "en"));
      remaining = PERIOD;
      startedAt = performance.now();
      timer = window.setTimeout(fire, PERIOD);
    };
    const pause = () => {
      if (paused) return;
      paused = true;
      window.clearTimeout(timer);
      remaining = Math.max(0, remaining - (performance.now() - startedAt));
    };
    const resume = () => {
      if (!paused) return;
      paused = false;
      if (remaining < MIN_REMAINING) remaining += GRACE;
      startedAt = performance.now();
      timer = window.setTimeout(fire, remaining);
    };

    const onMove = (e: PointerEvent) => {
      const el = areaRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const inside =
        e.clientX > r.left - MARGIN &&
        e.clientX < r.right + MARGIN &&
        e.clientY > r.top - MARGIN &&
        e.clientY < r.bottom + MARGIN;
      if (inside) pause();
      else resume();
    };
    const away = () => resume();
    /* No swaps in background tabs — timers keep firing there while paints
       don't, which is how crossfade states used to pile up. */
    const onVisibility = () => {
      if (document.hidden) pause();
      else resume();
    };

    timer = window.setTimeout(fire, PERIOD);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", away);
    window.addEventListener("blur", away);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", away);
      window.removeEventListener("blur", away);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  const onPointerMove = (e: React.PointerEvent) => {
    if (reduced || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * NAME_TILT * 2);
    rx.set(-py * NAME_TILT * 2);
  };

  return (
    <motion.div
      ref={areaRef}
      className="relative w-full"
      style={{
        rotateX: srx,
        rotateY: sry,
        transformPerspective: 1100,
        transformStyle: "preserve-3d",
      }}
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      <h1 className="sr-only">Deeghayu Adhikari</h1>

      {/* Both language layers stay mounted forever; the swap is a pure CSS
          opacity/transform crossfade driven by one class toggle. CSS
          transitions always converge to their target state — a janked
          frame or hidden tab can delay the fade but can never strand two
          fully-visible layers on top of each other (which mount/unmount
          crossfades could). The grid stack keeps the container at the
          taller layer's height, so nothing below ever reflows on swap. */}
      <div ref={headingRef} aria-hidden="true" className="grid w-full">
        {(Object.keys(NAME) as Array<keyof typeof NAME>).map((l) => {
          const active = l === lang;
          const sizing =
            l === "si"
              ? // Sinhala glyphs carry tall ascenders/descenders — much looser
                // leading and a smaller size so the two lines never collide
                "text-[9vw] leading-[1.45] tracking-normal sm:text-[10vw] md:text-[11vw]"
              : "text-[13vw] uppercase leading-none tracking-tight sm:text-[14vw] md:text-[15vw]";
          return (
            <div
              key={l}
              data-fluid-layer={l}
              className={`hero-heading hero-3d col-start-1 row-start-1 w-full self-center text-center font-black transition-[opacity,transform] duration-[850ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${sizing} ${
                active
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-[0.12em]"
              }`}
              style={
                l === "si"
                  ? { fontFamily: "var(--font-sinhala), var(--font-kanit), sans-serif" }
                  : undefined
              }
            >
              {NAME[l].map((line) => (
                <span key={line} data-fluid-text className="block whitespace-nowrap">
                  {line}
                </span>
              ))}
            </div>
          );
        })}
      </div>

      {/* Fluid ink revealed through the glyphs — noth.in-style, no video */}
      <HeroFluid headingRef={headingRef} lang={lang} />
    </motion.div>
  );
}

/* ── Hero ──────────────────────────────────────────────────── */
export function Hero() {
  return (
    <section
      id="home"
      aria-label="Introduction"
      className="relative flex h-dvh flex-col overflow-x-clip"
    >
      {/* Heading block — h1 is SSR-visible, never opacity-animated */}
      <div className="flex flex-1 flex-col items-center justify-center pt-20 sm:pt-24">
        <NameRotator />

        <FadeIn afterPreload delay={0.05} className="mt-4 w-full sm:mt-6">
          <RoleRotator />
        </FadeIn>
      </div>

      {/* Bottom bar */}
      <div className="flex items-end justify-between gap-6 px-6 pb-8 md:px-10 md:pb-10">
        <FadeIn afterPreload delay={0.15}>
          <p className="max-w-[230px] text-[clamp(0.8rem,1.1vw,1.05rem)] font-light leading-relaxed text-muted sm:max-w-[320px] md:max-w-[380px]">
            Software + electronic engineer crafting{" "}
            <span className="font-medium text-foreground">AI-driven platforms</span>,{" "}
            <span className="font-medium text-foreground">embedded IoT systems</span>, and{" "}
            <span className="font-medium text-foreground">premium web products</span>.
          </p>
        </FadeIn>

        <FadeIn afterPreload delay={0.25}>
          <Magnetic>
            <ContactButton />
          </Magnetic>
        </FadeIn>
      </div>
    </section>
  );
}
