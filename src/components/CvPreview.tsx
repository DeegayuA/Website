"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Download, ArrowUpRight, X } from "lucide-react";
import { site } from "@/data/site";

/**
 * CV teaser card — the top slice of the actual PDF in a paper card. Clicking
 * the card opens the full PDF in an in-page popup; the embed points straight
 * at the file in /public, so replacing the PDF updates preview and popup.
 * Rendered inside the Contact section's right column.
 */
export function CvCard() {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, close]);

  return (
    <div id="cv">
      <div className="mb-4 flex items-baseline justify-between">
        <span className="label uppercase tracking-widest text-muted">
          Curriculum Vitae
        </span>
        <a
          href={site.cv}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted transition-opacity duration-200 hover:opacity-70"
        >
          Open full CV
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </div>

      <div className="group relative overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_-24px_rgba(12,12,12,0.35)] ring-1 ring-[var(--line)] transition-transform duration-500 ease-out hover:-translate-y-1">
        {/* Click-to-open popup trigger — covers the preview area */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-label="Open the full CV in a popup"
          className="block w-full cursor-pointer"
        >
          {/* Top slice of the A4 page. The embed is scaled up a touch so the
              PDF viewer's dark edge chrome is cropped outside the frame. */}
          <span className="pointer-events-none block aspect-[210/52] w-full overflow-hidden bg-white">
            <object
              data={`${site.cv}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
              type="application/pdf"
              aria-hidden="true"
              className="block aspect-[210/297] w-full origin-top scale-[1.06]"
            >
              <span className="flex aspect-[210/52] w-full items-center justify-center bg-white">
                <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">
                  {site.name} — Curriculum Vitae
                </span>
              </span>
            </object>
          </span>
        </button>

        {/* Paper fades out; CTA floats on the fade */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background via-background/75 to-transparent"
        />
        <div className="absolute inset-x-0 bottom-4 flex justify-center">
          <a
            href={site.cv}
            download
            className="inline-flex items-center gap-2 rounded-full bg-slab px-6 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-slab-fg shadow-lg transition-transform duration-300 ease-out hover:scale-[1.04] active:scale-95"
          >
            <Download size={14} aria-hidden="true" />
            Download CV
          </a>
        </div>
      </div>

      {/* Full-CV popup */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Curriculum vitae PDF"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4 sm:p-8"
            onClick={close}
          >
            <motion.div
              initial={{ y: 24, scale: 0.97 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 24, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="relative h-[88vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={`${site.cv}#view=FitH`}
                title="Curriculum vitae PDF"
                className="h-full w-full"
              />
              <button
                type="button"
                onClick={close}
                aria-label="Close CV popup"
                className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slab text-slab-fg shadow-lg transition-transform duration-200 hover:scale-110 active:scale-95"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
