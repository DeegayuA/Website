"use client";

import { FadeIn } from "@/components/FadeIn";

const capabilities = [
  {
    number: "01",
    title: "Full-Stack Web",
    description:
      "Production platforms in Next.js, React and TypeScript — commercial SCADA dashboards, factory management systems and solar portals serving real operations daily.",
  },
  {
    number: "02",
    title: "AI / ML Systems",
    description:
      "Machine-learning products from notebook to deployment: computer vision, NLP, forecasting and AI-assisted tooling built on TensorFlow and cloud AI services.",
  },
  {
    number: "03",
    title: "IoT & Embedded",
    description:
      "ESP32 firmware, OPC UA integrations, inverter and weather-station telemetry — hardware wired end to end into live web interfaces.",
  },
  {
    number: "04",
    title: "Industrial SCADA",
    description:
      "Multi-plant solar monitoring and mini-grid management: real-time telemetry, device control and load optimization for utility-scale energy systems.",
  },
  {
    number: "05",
    title: "Data Engineering",
    description:
      "Realtime pipelines, microservices and analytics — from Firebase realtime sync to batch-processing platforms and factory-floor data models.",
  },
  {
    number: "06",
    title: "Teaching & Lecturing",
    description:
      "Visiting lecturer in web development, mobile apps and AI — turning production experience into curriculum for the next cohort of engineers.",
  },
];

export function Capabilities() {
  return (
    <section
      id="capabilities"
      className="cv-section bg-slab text-slab-fg rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
    >
      <FadeIn>
        <h2
          className="font-black uppercase text-center text-slab-fg mb-16 sm:mb-20 md:mb-28"
          style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
        >
          Capabilities
        </h2>
      </FadeIn>

      <div className="max-w-5xl mx-auto space-y-0">
        {capabilities.map((capability, index) => (
          <FadeIn key={capability.title} delay={index * 0.1}>
            <div className="border-b border-[var(--slab-line)] py-8 sm:py-10 md:py-12 flex gap-8 sm:gap-12">
              <div className="shrink-0">
                <span
                  className="font-black leading-none"
                  style={{ fontSize: "clamp(3rem, 10vw, 140px)", opacity: 0.35 }}
                >
                  {capability.number}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className="font-medium uppercase mb-3"
                  style={{ fontSize: "clamp(1rem, 2.2vw, 2.1rem)" }}
                >
                  {capability.title}
                </h3>
                <p
                  className="font-light leading-relaxed max-w-2xl"
                  style={{
                    fontSize: "clamp(0.85rem, 1.6vw, 1.25rem)",
                    opacity: 0.6,
                  }}
                >
                  {capability.description}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
