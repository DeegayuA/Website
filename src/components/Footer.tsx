import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { site, socials } from "@/data/site";
import { SocialIcon } from "./SocialIcon";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="px-5 py-8 sm:px-8 md:px-10">
      {/* Availability + colophon — the page should close with the same
          intent it opens, not trail off into a bare copyright row */}
      <div className="mx-auto mb-6 flex w-full max-w-6xl flex-col items-center justify-between gap-3 border-b border-line pb-6 text-center sm:flex-row sm:text-left">
        <p className="text-sm text-muted">
          Open to interesting problems —{" "}
          <a
            href={`mailto:${site.email}`}
            className="font-semibold text-foreground underline-offset-4 hover:underline"
          >
            {site.email}
          </a>
        </p>
        <p className="font-mono text-[11px] uppercase tracking-wider text-muted">
          Designed &amp; built by hand · Next.js + WebGL
        </p>
      </div>
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left md:gap-8">
        <p className="font-medium uppercase tracking-wide text-foreground">
          © {year} {site.name}
        </p>
        {/* 40px hit areas (WCAG 2.5.8 wants ≥24px) without changing the visual rhythm */}
        <ul className="flex items-center gap-1 sm:gap-2" aria-label="Social profiles">
          {socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="inline-flex h-10 w-10 items-center justify-center text-foreground/80 transition-[opacity,transform] duration-300 ease-out hover:-translate-y-1 hover:opacity-100"
              >
                <SocialIcon name={social.icon} size={18} />
              </a>
            </li>
          ))}
          <li>
            <Link
              href="/#home"
              aria-label="Back to top"
              className="inline-flex h-10 w-10 items-center justify-center text-foreground/80 transition-opacity duration-200 hover:opacity-100"
            >
              <ArrowUp size={18} aria-hidden="true" />
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
