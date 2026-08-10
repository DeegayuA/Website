"use client";

import { useState } from "react";
import { LoaderCircle, Check } from "lucide-react";
import { site, socials } from "@/data/site";
import { FadeIn } from "./FadeIn";
import { SocialIcon } from "./SocialIcon";

const FORM_ENDPOINT = "https://formspree.io/f/xnqljrpj";

type Status = "idle" | "sending" | "success" | "error";

const inputClasses =
  "w-full border-b border-[var(--line)] bg-transparent py-3 text-base font-light placeholder:text-muted/60 transition-colors focus:border-foreground focus:outline-none";

const labelClasses =
  "mb-1 block text-xs font-medium uppercase tracking-widest text-muted";

const contactRows = [
  {
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}?subject=Hello%20from%20your%20website`,
    external: false,
  },
  {
    label: "Phone",
    value: site.phone,
    href: site.phoneHref,
    external: false,
  },
  {
    label: "WhatsApp",
    value: "Chat on WhatsApp",
    href: site.whatsapp,
    external: true,
  },
  {
    label: "Telegram",
    value: "Message on Telegram",
    href: site.telegram,
    external: true,
  },
  {
    label: "Location",
    value: site.location,
    href: site.locationUrl,
    external: true,
  },
  {
    label: "CV",
    value: "Download CV",
    href: site.cv,
    external: false,
    download: true,
  },
] as const;

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`Formspree responded ${res.status}`);
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      id="contact"
      className="relative z-10 -mt-10 bg-background cv-section overflow-x-clip sm:-mt-12 md:-mt-14"
      style={{
        borderRadius: "clamp(40px, 5vw, 60px) clamp(40px, 5vw, 60px) 0 0",
      }}
    >
      <div className="px-5 py-20 sm:px-8 sm:py-24 md:px-10 md:py-32">
        {/* Heading */}
        <FadeIn as="h2" className="hero-heading mb-16 text-center font-black uppercase tracking-tight leading-none sm:mb-20 md:mb-28">
          <span style={{ fontSize: "clamp(3rem, 12vw, 160px)" }} className="block">
            Let&apos;s Talk
          </span>
        </FadeIn>

        {/* Two columns */}
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Left: contact rows */}
          <div>
            {contactRows.map((row, i) => (
              <FadeIn key={row.label} delay={i * 0.05} className="border-b border-[var(--line)]">
                <a
                  href={row.href}
                  {...(row.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  {...("download" in row && row.download ? { download: "" } : {})}
                  className="group flex items-baseline justify-between gap-6 py-5 sm:py-6"
                >
                  <span className="text-xs font-medium uppercase tracking-widest text-muted">
                    {row.label}
                  </span>
                  <span className="min-w-0 break-words text-right text-sm font-medium transition-opacity duration-200 group-hover:opacity-70 sm:text-base">
                    {row.value}
                  </span>
                </a>
              </FadeIn>
            ))}
          </div>

          {/* Right: Formspree form */}
          <FadeIn delay={0.1}>
            <form onSubmit={onSubmit} aria-label="Contact form">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className={labelClasses}>
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Your name"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className={labelClasses}>
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={inputClasses}
                  />
                </div>
              </div>
              <div className="mt-6">
                <label htmlFor="contact-topic" className={labelClasses}>
                  Topic
                </label>
                <input
                  id="contact-topic"
                  name="reason"
                  type="text"
                  placeholder="What's this about?"
                  className={inputClasses}
                />
              </div>
              <div className="mt-6">
                <label htmlFor="contact-message" className={labelClasses}>
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={6}
                  placeholder="Tell me about your project or just say hi…"
                  className={`${inputClasses} resize-y`}
                />
              </div>
              {/* Honeypot — hidden from real users, catches bots */}
              <input
                type="text"
                name="_gotcha"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="cta-pill inline-flex items-center gap-2 rounded-full px-8 py-3 text-xs font-medium uppercase tracking-widest text-white disabled:cursor-wait disabled:opacity-70 sm:px-10 sm:py-3.5 sm:text-sm"
                >
                  {status === "sending" ? (
                    <LoaderCircle size={16} aria-hidden="true" className="animate-spin" />
                  ) : status === "success" ? (
                    <Check size={16} aria-hidden="true" />
                  ) : null}
                  {status === "sending"
                    ? "Sending…"
                    : status === "success"
                      ? "Message sent"
                      : "Send message"}
                </button>
                <p role="status" aria-live="polite" className="text-sm text-muted">
                  {status === "success" &&
                    "Thanks! I'll get back to you soon."}
                  {status === "error" && (
                    <>
                      Something went wrong — please{" "}
                      <a
                        href={`mailto:${site.email}`}
                        className="underline transition-opacity duration-200 hover:opacity-70"
                      >
                        email me directly
                      </a>{" "}
                      instead.
                    </>
                  )}
                </p>
              </div>
            </form>
          </FadeIn>
        </div>

        {/* Socials row */}
        <FadeIn delay={0.2} className="mx-auto mt-16 max-w-6xl sm:mt-20">
          <ul className="flex flex-wrap items-center justify-center gap-6 border-t border-[var(--line)] pt-10 sm:gap-8">
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted transition-opacity duration-200 hover:opacity-70"
                >
                  <SocialIcon name={social.icon} />
                  <span className="hidden sm:inline">{social.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}
