"use client";

import { motion } from "motion/react";
import { MessageCircle } from "lucide-react";
import { site } from "@/data/site";

interface ContactButtonProps {
  label?: string;
  href?: string;
}

/**
 * ContactButton — styled CTA pill with gradient background.
 * Responsive label: full text from sm up, "Contact" on small phones, and a
 * round WhatsApp chat button on the very narrowest screens (≤340px).
 */
export function ContactButton({
  label = "Contact Me",
  href = "#contact",
}: ContactButtonProps) {
  return (
    <>
      <motion.a
        href={href}
        className="cta-pill hidden items-center justify-center whitespace-nowrap rounded-full px-6 py-3 text-xs font-medium uppercase tracking-widest text-white min-[341px]:inline-flex sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <span className="hidden sm:inline">{label}</span>
        <span className="sm:hidden">Contact</span>
      </motion.a>

      {/* ≤340px — icon-only chat button straight to WhatsApp */}
      <motion.a
        href={site.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="cta-pill inline-flex h-12 w-12 items-center justify-center rounded-full text-white min-[341px]:hidden"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <MessageCircle size={20} aria-hidden="true" />
      </motion.a>
    </>
  );
}
