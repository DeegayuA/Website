import { ArrowUp } from "lucide-react";
import { site, socials } from "@/data/site";
import { SocialIcon } from "./SocialIcon";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mx-auto w-full max-w-6xl px-5 pb-8 sm:px-8">
      <div className="glass glass-lens bevel flex flex-col items-center gap-5 rounded-[1.6rem] px-8 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-display font-bold tracking-tight">
            © {site.name}
          </p>
          <p className="mt-1 font-mono text-xs text-muted">
            2021–{year} · Software + electronic engineer · Built with Next.js,
            hosted on Netlify
          </p>
        </div>
        <ul className="flex items-center gap-2" aria-label="Social profiles">
          {socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="glass glass-lens glass-button flex h-10 w-10 items-center justify-center rounded-full text-foreground/75 hover:text-accent"
              >
                <SocialIcon name={social.icon} size={16} />
              </a>
            </li>
          ))}
          <li>
            <a
              href="#home"
              aria-label="Back to top"
              className="glass glass-button flex h-10 w-10 items-center justify-center rounded-full text-foreground/75 hover:text-accent"
            >
              <ArrowUp size={16} aria-hidden="true" />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
