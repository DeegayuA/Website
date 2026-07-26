"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
} from "motion/react";
import { ArrowUpRight, Download, MapPin, Mail } from "lucide-react";
import { site, socials, stats, skills } from "@/data/site";
import { projects } from "@/data/projects";
import { BrandIcon, hasBrandIcon } from "./BrandIcon";
import { SocialIcon } from "./SocialIcon";
import { Magnetic } from "./Magnetic";


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
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (isHovered || isFocused || document.hidden) return;

    const startInterval = () => {
      intervalRef.current = setInterval(
        () => setI((v) => (v + 1) % site.roles.length),
        2600,
      );
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      } else {
        startInterval();
      }
    };

    startInterval();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [reduced, isHovered, isFocused]);

  if (reduced) {
    return (
      <span className="text-accent">
        {site.roles[0]}
      </span>
    );
  }

  return (
    <span
      ref={containerRef}
      className="relative inline-flex h-[1.4em] overflow-hidden align-bottom"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <AnimatePresence mode="popLayout">
        <motion.span
          key={i}
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-110%", opacity: 0, position: "absolute" }}
          transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-accent absolute inset-0 flex items-center"
        >
          {site.roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ── Featured: cycles through featured builds (no solar/SCADA) ── */
/* Hero carousel shows only projects flagged `featured` in the data. */
const featuredList = projects.filter((p) => p.featured);

function FeaturedCarousel() {
  const [i, setI] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useInView(containerRef, { once: false, margin: "-50px" });
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || featuredList.length < 2 || !isVisible || isHovered || isFocused) return;
    if (document.hidden) return;

    const startInterval = () => {
      intervalRef.current = setInterval(
        () => setI((v) => (v + 1) % featuredList.length),
        3800,
      );
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      } else {
        startInterval();
      }
    };

    startInterval();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [reduced, isVisible, isHovered, isFocused]);

  const p = featuredList[i];
  const link = p.links.find((l) => !/github/i.test(l.label)) ?? p.links[0];

  const resetInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!reduced && !document.hidden && isVisible) {
      intervalRef.current = setInterval(
        () => setI((v) => (v + 1) % featuredList.length),
        3800,
      );
    }
  };

  return (
    <motion.div
      ref={containerRef}
      initial={false}
      onPointerMove={onGlint}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={`${TILE} relative flex min-h-[240px] flex-1 flex-col justify-end p-6`}
    >
      <span className="glint" />
      <AnimatePresence mode="wait">
        <motion.div
          key={p.image}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <Image
            src={p.image}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 380px"
            fetchPriority={p === featuredList[0] ? "high" : "auto"}
            className="object-cover object-top"
          />
        </motion.div>
      </AnimatePresence>
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-background from-20% via-background/80 via-50% to-transparent"
      />

      <div className="relative z-[4] mb-auto flex items-center justify-between gap-2">
        <span className="label text-accent">Featured build</span>
        <span className="flex gap-1.5">
          {featuredList.map((f, d) => (
            <button
              key={f.title}
              type="button"
              aria-label={`Show ${f.title}`}
              onClick={() => {
                setI(d);
                resetInterval();
              }}
              className={`inline-flex items-center justify-center p-2.5 rounded-full transition-[background-color] duration-300 ${
                d === i
                  ? "bg-accent"
                  : "bg-foreground/30 hover:bg-foreground/50"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
            </button>
          ))}
        </span>
      </div>

      <a
        href={link?.href ?? "#projects"}
        target={link ? "_blank" : undefined}
        rel={link ? "noopener noreferrer" : undefined}
        className="group/f relative z-[4] mt-4 block"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={p.title}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <p className="font-display text-lg font-semibold transition-colors group-hover/f:text-accent">
              {p.title}
            </p>
            <p className="mt-0.5 line-clamp-2 text-sm text-muted">
              {p.tagline}
            </p>
          </motion.div>
        </AnimatePresence>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent">
          View project
          <ArrowUpRight
            size={13}
            aria-hidden="true"
            className="transition-transform group-hover/f:-translate-y-0.5 group-hover/f:translate-x-0.5"
          />
        </span>
      </a>
    </motion.div>
  );
}

/* ── Animated counter ──────────────────────────────────────── */
function Counter({ to, suffix }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!inView || !ref.current) return;
    if (reduced) {
      ref.current.textContent = String(to) + (suffix ?? "");
      return;
    }

    let raf = 0;
    const start = performance.now();
    const dur = 1100;
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      if (ref.current) {
        ref.current.textContent = String(Math.round(eased * to)) + (suffix ?? "");
      }
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, suffix, reduced]);

  return (
    <span ref={ref} className="tabular-nums">
      0
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
        initial={false}
        className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-6 lg:auto-rows-min"
      >
        {/* IDENTITY ------------------------------------------------ */}
        <motion.div
          initial={false}
          onPointerMove={onGlint}
          className={`${TILE} md:col-span-2 lg:col-span-4 flex flex-col justify-between gap-8 p-7 sm:p-9`}
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

          <div className="relative z-[4] flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3">
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
                  aria-label="Download CV (PDF)"
                  className="glass glass-lens glass-button inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
                >
                  <Download size={16} aria-hidden="true" />
                  CV
                </a>
              </Magnetic>
            </div>
            <div className="flex flex-wrap items-end justify-between gap-4 border-t border-(--glass-border) pt-5">
              <div>
                <p className="label text-muted">Currently open to</p>
                <p className="mt-1.5 text-sm font-medium">
                  Freelance · Part-time
                </p>
              </div>
              <a
                href={`mailto:${site.email}`}
                className="group/mail inline-flex items-center gap-2 text-sm font-semibold text-accent"
              >
                <Mail size={15} aria-hidden="true" />
                <span className="group-hover/mail:underline">{site.email}</span>
              </a>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: elsewhere → stack → featured ------------ */}
        <motion.div
          initial={false}
          className="flex flex-col gap-3 sm:gap-4 md:col-span-2 lg:col-span-2"
        >
          {/* ELSEWHERE */}
          <motion.div
            initial={false}
            onPointerMove={onGlint}
            className={`${TILE} flex flex-col gap-3 p-6`}
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
                  className="flex aspect-square items-center justify-center rounded-2xl bg-(--surface) border border-(--glass-border) text-foreground/75 hover:text-accent transition-colors"
                >
                  <SocialIcon name={s.icon} size={18} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* STACK */}
          <motion.div
            initial={false}
            onPointerMove={onGlint}
            className={`${TILE} flex flex-col gap-4 p-6`}
          >
            <span className="glint" />
            <span className="label relative z-[4] text-muted">Stack</span>
            <div className="relative z-[4] grid grid-cols-4 gap-2.5">
              {stackLogos.map((s) => (
                <div
                  key={s}
                  title={s}
                  className="glass flex aspect-square items-center justify-center rounded-2xl text-foreground/80"
                >
                  <BrandIcon name={s} size={22} title={s} />
                </div>
              ))}
            </div>
          </motion.div>

          {/* FEATURED BUILDS (rotating image + text) */}
          <FeaturedCarousel />
        </motion.div>

        {/* STATS -------------------------------------------------- */}
        <motion.div
          initial={false}
          onPointerMove={onGlint}
          className={`${TILE} md:col-span-2 lg:col-span-6 grid grid-cols-3 divide-x divide-(--glass-border) p-2`}
        >
          <span className="glint" />
          {stats.map((s) => (
            <div
              key={s.label}
              className="relative z-[4] flex flex-col items-center justify-center gap-1 px-2 py-3 text-center"
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
