"use client";

import { useEffect } from "react";

/**
 * True liquid-glass refraction.
 *
 * Renders an SVG displacement filter (#glass-lens) whose map encodes
 * x-offset in the red channel and y-offset in the green channel, so the
 * backdrop "lenses" through glass elements like Apple's Liquid Glass.
 *
 * `backdrop-filter: url(#glass-lens)` only renders in Chromium, so we
 * tag <html> with `.lens` after a UA check — every other browser keeps
 * the plain frosted blur declared first in CSS.
 */

// R = x position, G = y position → uniform lens displacement field
const MAP_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'><defs><linearGradient id='r' x1='0' y1='0' x2='1' y2='0'><stop offset='0' stop-color='#000'/><stop offset='1' stop-color='#f00'/></linearGradient><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#000'/><stop offset='1' stop-color='#0f0'/></linearGradient></defs><rect width='256' height='256' fill='url(%23r)'/><rect width='256' height='256' fill='url(%23g)' style='mix-blend-mode:screen'/></svg>`;

const MAP_URI = `data:image/svg+xml;utf8,${MAP_SVG}`;

export function GlassFilter() {
  useEffect(() => {
    // Chromium-only (Chrome, Edge, Arc, Brave, Opera). Safari/Firefox
    // can't composite SVG filters inside backdrop-filter yet.
    if (/Chrome\//.test(navigator.userAgent)) {
      document.documentElement.classList.add("lens");
    }
  }, []);

  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      <defs>
        <filter
          id="glass-lens"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feImage
            href={MAP_URI}
            result="map"
            preserveAspectRatio="none"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="map"
            scale="72"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
