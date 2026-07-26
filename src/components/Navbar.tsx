"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Menu, X } from "lucide-react";
import { nav } from "@/data/site";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

const sectionIds = nav.map((item) => item.href.slice(1));

function useActiveSection() {
  const [active, setActive] = useState(sectionIds[0]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  return active;
}

export function Navbar() {
  const headerRef = useRef<HTMLElement>(null);
  const active = useActiveSection();
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-50">
      <motion.div
        aria-hidden="true"
        className="h-0.5 origin-left bg-gradient-to-r from-accent via-accent-2 to-accent-3"
        style={{ scaleX: progress }}
      />
      <motion.div
        initial={{ y: -18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <nav
          aria-label="Main navigation"
          className="mx-auto mt-3 flex w-[min(64rem,calc(100%-2rem))] items-center justify-between gap-2 rounded-full glass-strong glass-lens bevel px-3 py-2"
        >
          <a
            href="#home"
            className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3 text-sm font-bold"
            onClick={() => setOpen(false)}
          >
            <span
              aria-hidden="true"
              className="orb flex h-8 w-8 items-center justify-center rounded-xl font-display text-xs font-bold text-accent"
            >
              DA
            </span>
            <span className="font-display tracking-tight">Deeghayu</span>
            <span className="sr-only">— back to top</span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {nav.map((item) => {
              const isActive = active === item.href.slice(1);
              return (
                <li key={item.href} className="relative">
                  <a
                    href={item.href}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "relative z-10 block rounded-full px-4 py-2 text-sm font-medium transition-colors",
                      isActive ? "text-accent" : "text-muted hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </a>
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-accent-soft"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              type="button"
              className="glass-button flex h-10 w-10 items-center justify-center rounded-full md:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
            </button>
          </div>
        </nav>

        <div
          id="mobile-menu"
          className={cn(
            "mx-auto mt-2 w-[min(64rem,calc(100%-2rem))] origin-top rounded-3xl glass-strong glass-lens p-2 transition-[opacity,transform] duration-300 md:hidden",
            open
              ? "visible scale-100 opacity-100"
              : "invisible pointer-events-none scale-95 opacity-0",
          )}
        >
          <ul className="flex flex-col">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active === item.href.slice(1) ? "location" : undefined}
                  className={cn(
                    "block rounded-2xl px-5 py-3 text-base font-medium transition-colors",
                    active === item.href.slice(1)
                      ? "bg-accent-soft text-accent"
                      : "text-muted hover:bg-accent-soft/50 hover:text-foreground",
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </header>
  );
}
