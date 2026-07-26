import { BRAND_ICONS, type BrandGlyph } from "./brand-icons";

/**
 * Real, single-path brand marks (simple-icons geometry, official hex).
 * `brand` renders the mark in its official colour; otherwise it inherits
 * `currentColor` so it adapts to the theme. Unknown names render nothing,
 * so callers can safely pass raw tech strings.
 */

/** Map arbitrary data strings → an icon key in BRAND_ICONS. */
const ALIAS: Record<string, keyof typeof BRAND_ICONS | undefined> = {
  react: "react",
  "next.js": "next",
  nextjs: "next",
  next: "next",
  typescript: "typescript",
  ts: "typescript",
  javascript: "javascript",
  js: "javascript",
  "node.js": "node",
  nodejs: "node",
  node: "node",
  python: "python",
  tensorflow: "tensorflow",
  firebase: "firebase",
  "tailwind css": "tailwind",
  tailwind: "tailwind",
  php: "php",
  java: "java",
  "android": "android",
  "iot / esp32": "espressif",
  "iot/esp32": "espressif",
  esp32: "espressif",
  espressif: "espressif",
  iot: "espressif",
  arduino: "arduino",
  vercel: "vercel",
  netlify: "netlify",
  "google cloud vision": "googlecloud",
  "google cloud": "googlecloud",
  "gemini ai": "gemini",
  gemini: "gemini",
  sqlite: "sqlite",
  sqlite3: "sqlite",
  sql: "mysql",
  mysql: "mysql",
  html: "html5",
  html5: "html5",
  css: "css3",
  css3: "css3",
  "c++": "cpp",
  cpp: "cpp",
  // cert issuers
  nvidia: "nvidia",
  aws: "aws",
  "amazon web services (aws)": "aws",
  "amazon web services": "aws",
  freecodecamp: "freecodecamp",
};

export function iconKeyFor(name: string): keyof typeof BRAND_ICONS | undefined {
  const k = name.trim().toLowerCase();
  if (k in ALIAS) return ALIAS[k];
  if (k in BRAND_ICONS) return k as keyof typeof BRAND_ICONS;
  return undefined;
}

/** Official brand hex for a name, or undefined. */
export function brandHex(name: string): string | undefined {
  const key = iconKeyFor(name);
  return key ? BRAND_ICONS[key].hex : undefined;
}

export function hasBrandIcon(name: string): boolean {
  return iconKeyFor(name) !== undefined;
}

export function BrandIcon({
  name,
  size = 20,
  brand = false,
  className,
  title,
}: {
  name: string;
  size?: number;
  brand?: boolean;
  className?: string;
  title?: string;
}) {
  const key = iconKeyFor(name);
  if (!key) return null;
  const glyph: BrandGlyph = BRAND_ICONS[key];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={brand ? glyph.hex : "currentColor"}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
      className={className}
    >
      {title ? <title>{title}</title> : null}
      <path d={glyph.d} />
    </svg>
  );
}
