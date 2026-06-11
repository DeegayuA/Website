"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "motion/react";
import { ArrowDown, FileDown, Send } from "lucide-react";
import { site, socials } from "@/data/site";
import { useQuality } from "@/lib/quality";
import { Magnetic } from "./Magnetic";
import { SocialIcon } from "./SocialIcon";
import { cn } from "@/lib/utils";

function RotatingRole() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % site.roles.length),
      3200,
    );
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <span className="relative inline-flex justify-center">
      {/* Full list for screen readers; animation is decorative */}
      <span className="sr-only">{site.roles.join(" · ")}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={index}
          aria-hidden="true"
          className="inline-block"
          initial={{ y: 14, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            transition: { duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] },
          }}
          exit={{
            y: -14,
            opacity: 0,
            transition: { duration: 0.2, ease: "easeIn" },
          }}
        >
          {/* Gradient lives on a non-transformed child: bg-clip-text doesn't
              paint reliably on composited (animated) layers */}
          <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text font-semibold text-transparent">
            {site.roles[index]}
          </span>
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Decorative element that drifts opposite the pointer at a given depth. */
function Parallax({
  mx,
  my,
  depth,
  className,
  children,
}: {
  mx: MotionValue<number>;
  my: MotionValue<number>;
  depth: number;
  className?: string;
  children?: React.ReactNode;
}) {
  const x = useSpring(useTransform(mx, (v) => v * depth), {
    stiffness: 55,
    damping: 16,
  });
  const y = useSpring(useTransform(my, (v) => v * depth), {
    stiffness: 55,
    damping: 16,
  });
  return (
    <motion.div aria-hidden="true" style={{ x, y }} className={cn("absolute", className)}>
      {children}
    </motion.div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const tier = useQuality();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -90]);

  // pointer position → -0.5..0.5, drives orb parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  // High-tier only: the whole hero block tilts a few degrees toward the
  // cursor for a tactile, 3D-poster feel. Springs stay mounted (0°) elsewhere.
  const tilt = tier === "high" && !reduced;
  const rotateX = useSpring(useTransform(my, (v) => (tilt ? v * -7 : 0)), {
    stiffness: 60,
    damping: 14,
  });
  const rotateY = useSpring(useTransform(mx, (v) => (tilt ? v * 7 : 0)), {
    stiffness: 60,
    damping: 14,
  });
  const onPointerMove = (e: React.PointerEvent) => {
    if (reduced || e.pointerType !== "mouse") return;
    mx.set(e.clientX / window.innerWidth - 0.5);
    my.set(e.clientY / window.innerHeight - 0.5);
  };

  // Hold the entrance until the preloader curtain starts lifting
  const baseDelay = reduced ? 0 : 1.7;
  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.09, delayChildren: baseDelay },
    },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] },
    },
  };

  const [firstName, lastName] = site.name.split(" ");

  return (
    <section
      ref={ref}
      id="home"
      aria-label="Introduction"
      onPointerMove={onPointerMove}
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 pt-24 pb-28"
    >
      {/* Floating glass orbs + tech chips, layered by parallax depth */}
      <Parallax mx={mx} my={my} depth={-46} className="left-[8%] top-[22%] hidden lg:block">
        <div className="orb float-slow h-28 w-28 rounded-full" />
      </Parallax>
      <Parallax mx={mx} my={my} depth={-70} className="right-[10%] top-[18%] hidden lg:block">
        <div className="orb float-slower h-16 w-16 rounded-full" />
      </Parallax>
      <Parallax mx={mx} my={my} depth={-30} className="bottom-[24%] right-[16%] hidden lg:block">
        <div className="orb float-fast h-20 w-20 rounded-full" />
      </Parallax>
      <Parallax mx={mx} my={my} depth={-58} className="left-[14%] bottom-[30%] hidden lg:block">
        <span className="glass glass-lens float-slower inline-block rounded-full px-4 py-2 text-sm font-semibold">
          ⚛️ Electronics
        </span>
      </Parallax>
      <Parallax mx={mx} my={my} depth={-38} className="right-[20%] top-[34%] hidden lg:block">
        <span className="glass glass-lens float-slow inline-block rounded-full px-4 py-2 text-sm font-semibold">
          🤖 AI / ML
        </span>
      </Parallax>
      <Parallax mx={mx} my={my} depth={-52} className="left-[20%] top-[14%] hidden xl:block">
        <span className="glass glass-lens float-fast inline-block rounded-full px-4 py-2 text-sm font-semibold">
          📡 AIoT
        </span>
      </Parallax>

      <motion.div
        style={
          reduced
            ? undefined
            : { opacity, y, rotateX, rotateY, transformPerspective: 1200 }
        }
        className="flex w-full flex-col items-center"
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="flex w-full max-w-5xl flex-col items-center text-center"
        >
          <motion.p variants={item}>
            <span className="glass glass-lens glass-sheen inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium">
              <span aria-hidden="true" className="inline-block origin-[70%_70%] text-base motion-safe:animate-[wave_2.2s_ease-in-out_2.2s_2]">
                👋🏻
              </span>
              <span lang="si">ආයුබෝවන්</span>
              <span aria-hidden="true">·</span>
              <span>Hi, I&apos;m</span>
            </span>
          </motion.p>

          {/* Poster-scale, two-line name */}
          <motion.h1
            variants={item}
            className="mt-6 text-balance text-6xl font-bold leading-[0.95] tracking-tighter sm:text-8xl lg:text-9xl"
          >
            <span className="text-shine block">{firstName}</span>
            <span className="text-shine block">{lastName}</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 text-xl font-medium sm:text-2xl"
          >
            <RotatingRole />
          </motion.p>

          <motion.p
            variants={item}
            className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-lg"
          >
            {site.tagline}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <Magnetic>
              <a
                href="#contact"
                className="group glass-button glass-sheen relative inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/30"
              >
                <Send
                  size={16}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:rotate-12"
                />
                Get in touch
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href={site.cv}
                download
                className="group glass glass-lens glass-button glass-sheen inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold"
              >
                <FileDown
                  size={16}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-y-0.5"
                />
                Download CV
              </a>
            </Magnetic>
          </motion.div>

          <motion.p variants={item} className="mt-6">
            <span className="glass glass-lens inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted">
              <span
                aria-hidden="true"
                className="pulse-dot h-2 w-2 rounded-full bg-emerald-500"
              />
              Open to opportunities
            </span>
          </motion.p>

          <motion.ul
            variants={item}
            className="mt-7 flex items-center gap-2.5"
            aria-label="Social profiles"
          >
            {socials.map((social) => (
              <li key={social.label}>
                <Magnetic strength={0.35}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="glass glass-lens glass-button flex h-11 w-11 items-center justify-center rounded-full text-foreground/75 hover:text-accent"
                  >
                    <SocialIcon name={social.icon} />
                  </a>
                </Magnetic>
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        aria-label="Scroll to about section"
        className="glass glass-lens absolute bottom-7 left-1/2 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full text-muted hover:text-accent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduced ? 0.2 : 2.9, duration: 0.8 }}
      >
        <ArrowDown size={18} aria-hidden="true" className="scroll-cue" />
      </motion.a>
    </section>
  );
}
