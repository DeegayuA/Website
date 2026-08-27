"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { nav } from "@/data/site";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

/* hrefs are "/#about" form — take the fragment after "#" for element ids */
const sectionIds = nav.map((item) => item.href.split("#")[1]);

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
          className={cn(
            "mx-auto mt-3 flex w-[min(64rem,calc(100%-2rem))] items-center justify-between gap-4 rounded-full px-3 py-2 transition-[background-color,box-shadow] duration-300 sm:px-5",
            hasScroll && "nav-glass shadow-lg shadow-black/[0.06]",
          )}
        >
          <Link
            href="/#home"
            className="group flex items-center gap-2.5 font-black uppercase tracking-tight text-foreground"
            style={{ fontFamily: "var(--font-sinhala), var(--font-kanit), sans-serif" }}
          >
            <Image
              src="/images/profile.webp"
              alt=""
              width={34}
              height={34}
              priority
              className="rounded-full ring-1 ring-[var(--line)] transition-transform duration-300 ease-out group-hover:scale-110"
            />
            <span lang="si" className="hidden sm:inline">දිඝායු</span>
            <span className="sr-only">— back to home</span>
          </Link>

          <ul className="flex items-center gap-2 sm:gap-6 md:gap-8">
            {nav.map((item) => {
              const isActive = active === item.href.split("#")[1];
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "relative whitespace-nowrap uppercase font-medium text-[11px] tracking-normal sm:text-sm sm:tracking-wider md:text-base transition-opacity duration-200",
                      "after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:bg-current after:transition-transform after:duration-300 after:ease-out",
                      isActive
                        ? "opacity-100 after:scale-x-100"
                        : "opacity-70 after:scale-x-0 hover:opacity-100 hover:after:scale-x-100",
                    )}
                  >
                    {item.label}
                  </Link>
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
