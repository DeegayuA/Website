"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Download, ArrowUpRight, X } from "lucide-react";
import { site } from "@/data/site";

/**
 * CV teaser card — the top slice of page 1, pre-rendered to a static image
 * (`npm run render-cv` regenerates it whenever the PDF changes). An <object>
 * PDF embed showed browser chrome and rendered nothing on iOS Safari; a plain
 * image is identical everywhere and cheaper. Clicking opens the full PDF in a
 * focus-trapped popup. Rendered inside the Contact section's right column.
 */
export function CvCard() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      // Focus trap — Tab cycles within the dialog
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button, iframe, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    // Move focus into the dialog once it exists
    requestAnimationFrame(() => {
      dialogRef.current
        ?.querySelector<HTMLElement>("[data-autofocus]")
        ?.focus();
    });
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      returnFocusRef.current?.focus();
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
          aria-expanded={open}
          aria-label="Open the full CV in a popup"
          className="block w-full cursor-pointer"
        >
          {/* Top slice of the A4 page, cropped from the pre-rendered page 1 */}
          <span className="pointer-events-none block aspect-[210/52] w-full overflow-hidden bg-white">
            <Image
              src="/cv/cv-preview.webp"
              alt=""
              width={1241}
              height={1754}
              sizes="(max-width: 640px) 100vw, 560px"
              className="block w-full"
            />
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

      {/* Full-CV popup — portaled to <body> so no animated/transformed
          ancestor (FadeIn) can trap the fixed overlay; z above every layer */}
      {typeof document !== "undefined" &&
        createPortal(
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
            className="fixed inset-0 z-[1200] bg-black/80"
            onClick={close}
          >
            <motion.div
              ref={dialogRef}
              initial={{ y: 24, scale: 0.99 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 24, scale: 0.99 }}
              transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="relative h-full w-full overflow-hidden bg-[#323639]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* toolbar=0 strips the viewer chrome; the container matches the
                  viewer's gutter color so the page reads edge-to-edge */}
              <iframe
                src={`${site.cv}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                title="Curriculum vitae PDF"
                className="h-full w-full"
              />
              <button
                type="button"
                onClick={close}
                data-autofocus
                aria-label="Close CV popup"
                className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slab text-slab-fg shadow-lg transition-transform duration-200 hover:scale-110 active:scale-95"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </motion.div>
          </motion.div>
        )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
