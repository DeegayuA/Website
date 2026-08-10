import { ArrowUp } from "lucide-react";
import { site, socials } from "@/data/site";
import { SocialIcon } from "./SocialIcon";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line px-5 py-8 sm:px-8 md:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left md:gap-8">
        <p className="font-medium uppercase tracking-wide text-foreground">
          © {year} {site.name}
        </p>
        <ul className="flex items-center gap-4 sm:gap-6" aria-label="Social profiles">
          {socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="text-foreground/80 transition-opacity duration-200 hover:opacity-100"
              >
                <SocialIcon name={social.icon} size={18} />
              </a>
            </li>
          ))}
          <li>
            <a
              href="#home"
              aria-label="Back to top"
              className="text-foreground/80 transition-opacity duration-200 hover:opacity-100"
            >
              <ArrowUp size={18} aria-hidden="true" />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
