"use client";

import Image from "next/image";
import { site, stats } from "@/data/site";
import { FadeIn } from "@/components/FadeIn";
import { AnimatedText } from "@/components/AnimatedText";
import { ContactButton } from "@/components/ContactButton";

const cornerTiles = [
  {
    id: "top-left",
    src: "/images/web_scada.png",
    position: "top-[4%] left-[2%]",
    rotation: "-rotate-6",
    delay: 0.1,
    x: -80,
  },
  {
    id: "bottom-left",
    src: "/images/greenwing.jpg",
    position: "bottom-[8%] left-[2%] sm:left-[10%]",
    rotation: "rotate-3",
    delay: 0.25,
    x: -80,
  },
  {
    id: "top-right",
    src: "/images/web_lifesight.png",
    position: "top-[4%] right-[2%] sm:right-[10%]",
    rotation: "rotate-6",
    delay: 0.15,
    x: 80,
  },
  {
    id: "bottom-right",
    src: "/images/idh.jpg",
    position: "bottom-[8%] right-[2%]",
    rotation: "-rotate-3",
    delay: 0.3,
    x: 80,
  },
];

export function About() {
  return (
    <section
      id="about"
      className="cv-section relative min-h-screen w-full bg-background px-5 py-20 sm:px-8 md:px-10"
    >
      {/* Corner decorative tiles — hidden below sm */}
      <div className="pointer-events-none absolute inset-0 hidden sm:block">
        {cornerTiles.map((tile) => (
          <FadeIn
            key={tile.id}
            delay={tile.delay}
            x={tile.x}
            className={`absolute ${tile.position}`}
          >
            <div className={`relative h-40 w-40 overflow-hidden rounded-2xl md:h-52 md:w-52 ${tile.rotation}`}>
              <Image
                src={tile.src}
                alt="Project showcase"
                fill
                className="object-cover"
              />
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Centered content */}
      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-10 sm:gap-14 md:gap-16">
        {/* Heading */}
        <FadeIn>
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-center text-[clamp(3rem,12vw,160px)]">
            About Me
          </h2>
        </FadeIn>

        {/* Bio paragraph with animated text */}
        <FadeIn delay={0.1}>
          <AnimatedText className="text-center font-medium leading-relaxed text-[clamp(1rem,2vw,1.35rem)]">
            {site.bio}
          </AnimatedText>
        </FadeIn>

        {/* Stats row with hairline separators */}
        <FadeIn delay={0.2}>
          <div className="flex items-center justify-center gap-6 sm:gap-8 md:gap-10 divide-x divide-line">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center px-4 first:pl-0 last:pr-0">
                <p className="font-black text-[clamp(1.5rem,3vw,2.5rem)] leading-none">
                  {stat.value}
                  {stat.suffix}
                </p>
                <p className="mt-2 text-center text-xs uppercase tracking-widest text-muted sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Contact button */}
        <FadeIn delay={0.3}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
}
