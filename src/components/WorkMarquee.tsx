"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-driven double marquee of motion web design previews, bridging the
 * hero and About. Decorative — rows drift horizontally with page scroll.
 * Transforms are written straight to the row elements via refs inside a
 * rAF-throttled passive scroll listener, so scrolling never re-renders React.
 * Reduced motion: rows render static and no listeners are attached.
 */

const GIFS = [
  "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
  "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
  "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
  "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
  "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
  "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif",
  "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif",
  "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
  "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
  "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
  "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif",
  "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
  "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
  "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
  "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif",
  "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif",
  "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
  "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif",
  "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif",
] as const;

const ROW_ONE = GIFS.slice(0, 11);
const ROW_TWO = GIFS.slice(11);

function tripled(row: readonly string[]) {
  return [...row, ...row, ...row];
}

function MarqueeRow({
  sources,
  rowRef,
}: {
  sources: readonly string[];
  rowRef: React.Ref<HTMLDivElement>;
}) {
  return (
    <div className="flex justify-center">
      <div ref={rowRef} className="flex w-max shrink-0 gap-3 will-change-transform">
        {tripled(sources).map((src, i) => (
          <img
            key={`${src}-${i}`}
            src={src}
            alt="Motion web design preview"
            loading="lazy"
            decoding="async"
            width={420}
            height={270}
            className="h-[270px] w-[420px] max-w-none shrink-0 rounded-2xl object-cover"
          />
        ))}
      </div>
    </div>
  );
}

export function WorkMarquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowOneRef = useRef<HTMLDivElement>(null);
  const rowTwoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const rowOne = rowOneRef.current;
    const rowTwo = rowTwoRef.current;
    if (!section || !rowOne || !rowTwo) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let sectionTop = 0;
    let raf = 0;

    const measure = () => {
      sectionTop = section.getBoundingClientRect().top + window.scrollY;
    };

    const update = () => {
      raf = 0;
      const offset = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      rowOne.style.transform = `translateX(${offset - 200}px)`;
      rowTwo.style.transform = `translateX(${-(offset - 200)}px)`;
    };

    const onScroll = () => {
      if (raf === 0) raf = requestAnimationFrame(update);
    };

    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-hidden="true"
      className="cv-section select-none overflow-x-clip bg-background pb-10 pt-24 sm:pt-32 md:pt-40"
    >
      <div className="flex flex-col gap-3">
        <MarqueeRow sources={ROW_ONE} rowRef={rowOneRef} />
        <MarqueeRow sources={ROW_TWO} rowRef={rowTwoRef} />
      </div>
    </section>
  );
}
