"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { ArrowUpRight, Download, MapPin, Mail } from "lucide-react";
import { site, socials, stats, skills } from "@/data/site";
import { work } from "@/data/experience";
import { BrandIcon, hasBrandIcon } from "./BrandIcon";
import { SocialIcon } from "./SocialIcon";
import { Magnetic } from "./Magnetic";

/* Tiles rise + settle into the grid on load. */
const grid: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const tile: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(8px)", scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

/** Sets a tile's local specular coordinates for the .glint highlight. */
function onGlint(e: React.PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--spot-x", `${((e.clientX - r.left) / r.width) * 100}%`);
  el.style.setProperty("--spot-y", `${((e.clientY - r.top) / r.height) * 100}%`);
}

const TILE =
  "group glint-host relative overflow-hidden rounded-[1.6rem] glass glass-lens bevel";

/* ── Rotating role ─────────────────────────────────────────── */
function RoleRotator() {
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setI((v) => (v + 1) % site.roles.length), 2600);
    return () => clearInterval(id);
  }, [reduced]);
  return (
    <span className="relative inline-flex h-[1.4em] overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-110%", opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-accent"
        >
          {site.roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ── Animated counter ──────────────────────────────────────── */
function Counter({ to, suffix }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduced) return setN(to);
    let raf = 0;
    const start = performance.now();
    const dur = 1100;
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, reduced]);
  return (
    <span ref={ref} className="tabular-nums">
      {n}
      {suffix}
    </span>
  );
}

/* ── Live Colombo clock (hydration-guarded) ────────────────── */
function LiveClock() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState("");
  useEffect(() => {
    setMounted(true);
    const fmt = () =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Asia/Colombo",
      }).format(new Date());
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="font-mono tabular-nums" suppressHydrationWarning>
      {mounted ? time : "--:--:--"}
    </span>
  );
}

const stackLogos = skills.filter(hasBrandIcon).slice(0, 8);

export function Hero() {
  return (
    <section
      id="home"
      aria-label="Introduction"
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-5 pb-10 pt-28 sm:px-8 sm:pt-32"
    >
      <motion.div
        variants={grid}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-6 lg:auto-rows-fr"
      >
        {/* IDENTITY ------------------------------------------------ */}
        <motion.div
          variants={tile}
          onPointerMove={onGlint}
          className={`${TILE} md:col-span-2 lg:col-span-4 lg:row-span-2 flex flex-col justify-between gap-8 p-7 sm:p-9`}
        >
          <span className="glint" />
          <div className="relative z-[4] flex items-center justify-between gap-4">
            <span className="label inline-flex items-center gap-2 text-muted">
              <MapPin size={13} aria-hidden="true" />
              {site.location}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-(--glass-border) bg-spark-soft px-3 py-1 text-xs font-semibold text-spark">
              <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-spark" />
              Available for work
            </span>
          </div>

          <div className="relative z-[4]">
            <p className="mb-3 flex items-center gap-2 text-base text-muted sm:text-lg">
              <span className="wave" aria-hidden="true">
                👋
              </span>
              Hi, I&apos;m
            </p>
            <h1 className="font-display text-[clamp(2.6rem,8vw,5.6rem)] font-bold leading-[0.95]">
              <span className="text-shine">Deeghayu</span>
              <br />
              <span className="text-foreground">Adhikari</span>
            </h1>
            <p
              className="mt-3 font-mono text-sm text-muted"
              lang="si"
              aria-label="Name in Sinhala"
            >
              {site.sinhalaName}
            </p>
            <p className="mt-6 max-w-xl text-lg font-semibold sm:text-2xl">
              <RoleRotator />
            </p>
            <p className="mt-3 max-w-lg text-pretty text-base text-muted">
              {site.tagline}
            </p>
          </div>

          <div className="relative z-[4] flex flex-wrap items-center gap-3">
            <Magnetic>
              <a
                href="#projects"
                className="glass-button glass-sheen inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background shadow-lg shadow-accent/25"
              >
                View work
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </Magnetic>
            <Magnetic strength={0.2}>
              <a
                href="#contact"
                className="glass glass-lens glass-button inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
              >
                <Mail size={16} aria-hidden="true" />
                Get in touch
              </a>
            </Magnetic>
            <Magnetic strength={0.2}>
              <a
                href={site.cv}
                target="_blank"
                rel="noopener noreferrer"
                className="glass glass-lens glass-button inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
              >
                <Download size={16} aria-hidden="true" />
                CV
              </a>
            </Magnetic>
          </div>
        </motion.div>

        {/* STATUS / NOW ------------------------------------------- */}
        <motion.div
          variants={tile}
          onPointerMove={onGlint}
          className={`${TILE} md:col-span-1 lg:col-span-2 flex flex-col justify-between gap-4 p-6`}
        >
          <span className="glint" />
          <div className="relative z-[4] flex items-center justify-between">
            <span className="label text-muted">Now</span>
            <span className="eq" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
            </span>
          </div>
          <div className="relative z-[4]">
            <p className="text-3xl font-semibold tracking-tight">
              <LiveClock />
            </p>
            <p className="mt-1 text-xs text-muted">Colombo · GMT+5:30</p>
          </div>
          <div className="relative z-[4] border-t border-(--glass-border) pt-3">
            <p className="text-sm font-semibold">{work[0].title}</p>
            <p className="text-xs text-muted">{work[0].org}</p>
          </div>
        </motion.div>

        {/* STACK -------------------------------------------------- */}
        <motion.div
          variants={tile}
          onPointerMove={onGlint}
          className={`${TILE} md:col-span-1 lg:col-span-2 flex flex-col gap-4 p-6`}
        >
          <span className="glint" />
          <span className="label relative z-[4] text-muted">Stack</span>
          <div className="relative z-[4] grid grid-cols-4 gap-2.5">
            {stackLogos.map((s) => (
              <div
                key={s}
                title={s}
                className="glass flex aspect-square items-center justify-center rounded-2xl text-foreground/80 transition-colors duration-300 hover:text-accent"
              >
                <BrandIcon name={s} size={22} title={s} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* FEATURED WORK ------------------------------------------ */}
        <motion.a
          variants={tile}
          href="#projects"
          onPointerMove={onGlint}
          className={`${TILE} glint-host group md:col-span-2 lg:col-span-4 min-h-[210px] flex items-end p-6`}
        >
          <span className="glint" />
          <Image
            src="/images/web_amperearc.png"
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 640px"
            className="object-cover object-top opacity-45 transition-transform duration-700 ease-out group-hover:scale-105 dark:opacity-35"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent"
          />
          <div className="relative z-[4] flex w-full items-end justify-between gap-4">
            <div>
              <span className="label text-accent">Featured build</span>
              <p className="mt-1 font-display text-xl font-semibold">
                AmpereArc Production Floor
              </p>
              <p className="text-sm text-muted">
                Factory management platform for BESS manufacturing
              </p>
            </div>
            <span className="glass glass-button flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-accent">
              <ArrowUpRight size={18} aria-hidden="true" />
            </span>
          </div>
        </motion.a>

        {/* SOCIALS ------------------------------------------------ */}
        <motion.div
          variants={tile}
          onPointerMove={onGlint}
          className={`${TILE} md:col-span-2 lg:col-span-2 flex flex-col justify-between gap-4 p-6`}
        >
          <span className="glint" />
          <span className="label relative z-[4] text-muted">Elsewhere</span>
          <div className="relative z-[4] grid grid-cols-5 gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="glass glass-button flex aspect-square items-center justify-center rounded-2xl text-foreground/75 hover:text-accent"
              >
                <SocialIcon name={s.icon} size={18} />
              </a>
            ))}
          </div>
        </motion.div>

        {/* STATS -------------------------------------------------- */}
        <motion.div
          variants={tile}
          onPointerMove={onGlint}
          className={`${TILE} md:col-span-2 lg:col-span-6 grid grid-cols-3 divide-x divide-(--glass-border) p-2`}
        >
          <span className="glint" />
          {stats.map((s) => (
            <div
              key={s.label}
              className="relative z-[4] flex flex-col items-center justify-center gap-1 px-2 py-4 text-center"
            >
              <p className="font-display text-3xl font-bold sm:text-4xl">
                <span className="text-accent">
                  <Counter to={s.value} suffix={s.suffix} />
                </span>
              </p>
              <p className="text-xs text-muted sm:text-sm">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
