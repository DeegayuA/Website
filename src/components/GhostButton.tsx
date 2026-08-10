"use client";

import { motion } from "motion/react";

interface GhostButtonProps {
  href: string;
  children: React.ReactNode;
}

/**
 * GhostButton — transparent button with border and hover tint.
 * Automatically opens external links in new tab.
 */
export function GhostButton({ href, children }: GhostButtonProps) {
  const isExternal = href.startsWith("http://") || href.startsWith("https://");

  return (
    <motion.a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="rounded-full border-2 border-current px-8 py-3 text-current font-medium uppercase tracking-widest text-sm sm:text-base transition-colors hover:bg-current/10"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {children}
    </motion.a>
  );
}
