"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
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
  const [hasScroll, setHasScroll] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setHasScroll(window.scrollY > 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-50">
      <motion.div
        aria-hidden="true"
        className={cn(
          "h-px origin-left bg-line transition-opacity duration-200",
          hasScroll ? "opacity-100" : "opacity-0",
        )}
      />
      <motion.div
        initial={{ y: -18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <nav
          aria-label="Main navigation"
          className="mx-auto mt-3 flex w-[min(64rem,calc(100%-2rem))] items-center justify-between gap-4 px-3 py-2"
        >
          <a
            href="#home"
            className="font-black uppercase tracking-tight text-foreground"
          >
            DA
            <span className="sr-only">— back to home</span>
          </a>

          <ul className="flex items-center gap-4 sm:gap-6 md:gap-8">
            {nav.map((item) => {
              const isActive = active === item.href.slice(1);
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "uppercase font-medium tracking-wider text-xs sm:text-sm md:text-base transition-opacity duration-200",
                      isActive ? "opacity-100" : "opacity-70 hover:opacity-100",
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <ThemeToggle />
        </nav>
      </motion.div>
    </header>
  );
}
