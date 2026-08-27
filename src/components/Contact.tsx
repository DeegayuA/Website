"use client";

import { useState } from "react";
import { LoaderCircle, Check } from "lucide-react";
import { site } from "@/data/site";
import { FadeIn } from "./FadeIn";
import { ParallaxDrift } from "./ParallaxDrift";
import { CvCard } from "./CvPreview";

const contactRows = [
  {
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}?subject=Hello%20from%20your%20website`,
    external: false,
  },
  { label: "Phone", value: site.phone, href: site.phoneHref, external: false },
  { label: "WhatsApp", value: "Chat on WhatsApp", href: site.whatsapp, external: true },
  { label: "Location", value: site.location, href: site.locationUrl, external: true },
] as const;

const FORM_ENDPOINT = "https://formspree.io/f/xnqljrpj";

type Status = "idle" | "sending" | "success" | "error";

const inputClasses =
  "w-full rounded-xl border border-[var(--line)] bg-foreground/[0.04] px-4 py-3 text-base font-light placeholder:text-muted/70 transition-[border-color,box-shadow] duration-200 focus:border-foreground focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--foreground)_12%,transparent)] focus:outline-none";

const labelClasses =
  "mb-1 block text-xs font-medium uppercase tracking-widest text-muted";

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
      className="relative cv-section overflow-x-clip"
    >
      <div className="px-5 py-16 sm:px-8 sm:py-20 md:px-10 md:py-24">
        {/* Heading — drifts against scroll like the other section titles */}
        <ParallaxDrift distance={34}>
          <FadeIn as="h2" className="hero-heading mb-10 text-center font-black uppercase tracking-tight leading-none sm:mb-12 md:mb-14">
            <span style={{ fontSize: "clamp(3rem, 12vw, 160px)" }} className="block">
              Let&apos;s Talk
            </span>
          </FadeIn>
        </ParallaxDrift>

        {/* Form on the left; CV + direct channels stacked on the right —
            one viewport instead of three stacked sections */}
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-16">
          <FadeIn delay={0.1}>
            <form
              onSubmit={onSubmit}
              aria-label="Contact form"
              className="glass glass-sheen bevel rounded-2xl p-6 sm:p-8"
            >
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

          {/* Right column: CV card + direct channels */}
          <FadeIn delay={0.15} className="flex flex-col gap-10">
            <CvCard />
            <div className="glass glass-sheen bevel rounded-2xl p-6 sm:p-8">
              <span className="label mb-1 block uppercase tracking-widest text-muted">
                Contact info
              </span>
              {contactRows.map((row) => (
                <a
                  key={row.label}
                  href={row.href}
                  {...(row.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="group flex items-baseline justify-between gap-6 border-b border-[var(--line)] py-3.5"
                >
                  <span className="text-xs font-medium uppercase tracking-widest text-muted">
                    {row.label}
                  </span>
                  <span className="min-w-0 break-words text-right text-sm font-medium transition-[opacity,transform] duration-300 ease-out group-hover:-translate-x-0.5 group-hover:opacity-70 sm:text-base">
                    {row.value}
                  </span>
                </a>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
