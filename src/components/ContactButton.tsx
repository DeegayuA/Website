"use client";

import { motion } from "motion/react";

interface ContactButtonProps {
  label?: string;
  href?: string;
}

/**
 * ContactButton — styled CTA pill with gradient background.
 * Wraps default link to #contact with scale hover effect.
 */
export function ContactButton({
  label = "Contact Me",
  href = "#contact",
}: ContactButtonProps) {
  return (
    <motion.a
      href={href}
      className="cta-pill inline-flex items-center justify-center rounded-full px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs font-medium uppercase tracking-widest text-white sm:text-sm md:text-base"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {label}
    </motion.a>
  );
}
