"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, MessageCircle, LoaderCircle, Check } from "lucide-react";
import { site } from "@/data/site";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { SocialIcon } from "./SocialIcon";
import { cn } from "@/lib/utils";

const FORM_ENDPOINT = "https://formspree.io/f/xnqljrpj";

type Status = "idle" | "sending" | "success" | "error";

const inputClasses =
  "w-full rounded-2xl border border-(--glass-border) bg-(--surface) px-5 py-3.5 text-base placeholder:text-muted/70 backdrop-blur-xl transition-shadow focus:shadow-[0_0_0_3px_var(--accent-soft)]";

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass glass-lens glass-sheen flex items-start gap-4 rounded-3xl p-5 transition-transform duration-300 hover:-translate-y-1">
      <span className="glass flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-accent">
        {icon}
      </span>
      <div className="min-w-0">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
          {title}
        </h3>
        <div className="mt-1 text-base font-medium break-words">{children}</div>
      </div>
    </div>
  );
}

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
    <Section id="contact" eyebrow="Feel free to" title="Get in touch">
      <div className="grid gap-5 lg:grid-cols-5">
        <div className="grid content-start gap-5 lg:col-span-2">
          <Reveal>
            <InfoCard icon={<MapPin size={19} aria-hidden="true" />} title="Location">
              <a href={site.locationUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                {site.location}
              </a>
            </InfoCard>
          </Reveal>
          <Reveal delay={0.06}>
            <InfoCard icon={<Phone size={19} aria-hidden="true" />} title="Phone">
              <a href={site.phoneHref} className="hover:text-accent">{site.phone}</a>
            </InfoCard>
          </Reveal>
          <Reveal delay={0.12}>
            <InfoCard icon={<Mail size={19} aria-hidden="true" />} title="Email">
              <a
                href={`mailto:${site.email}?subject=Hello%20from%20your%20website`}
                className="hover:text-accent"
              >
                {site.email}
              </a>
            </InfoCard>
          </Reveal>
          <Reveal delay={0.18}>
            <InfoCard icon={<MessageCircle size={19} aria-hidden="true" />} title="Chat">
              <div className="flex gap-2 pt-1">
                <a
                  href={site.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="glass glass-lens glass-button flex h-10 w-10 items-center justify-center rounded-full text-foreground/75 hover:text-accent"
                >
                  <SocialIcon name="whatsapp" />
                </a>
                <a
                  href={site.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                  className="glass glass-lens glass-button flex h-10 w-10 items-center justify-center rounded-full text-foreground/75 hover:text-accent"
                >
                  <SocialIcon name="telegram" />
                </a>
              </div>
            </InfoCard>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-3" delay={0.1}>
          <form
            onSubmit={onSubmit}
            className="glass glass-lens rounded-3xl p-6 sm:p-8"
            aria-label="Contact form"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className="mb-1.5 block text-sm font-semibold">
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
                <label htmlFor="contact-email" className="mb-1.5 block text-sm font-semibold">
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
            <div className="mt-4">
              <label htmlFor="contact-topic" className="mb-1.5 block text-sm font-semibold">
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
            <div className="mt-4">
              <label htmlFor="contact-message" className="mb-1.5 block text-sm font-semibold">
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={6}
                placeholder="Tell me about your project or just say hi…"
                className={cn(inputClasses, "resize-y")}
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
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={status === "sending"}
                className={cn(
                  "glass-button glass-sheen relative inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/30 disabled:cursor-wait disabled:opacity-70",
                  status === "success" ? "bg-emerald-500" : "bg-accent",
                )}
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
                {status === "error" &&
                  "Something went wrong — please email me directly instead."}
              </p>
            </div>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}
