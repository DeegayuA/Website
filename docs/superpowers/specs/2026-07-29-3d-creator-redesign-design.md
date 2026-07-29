# 3D-Creator Redesign — Spec (2026-07-29)

Redesign the portfolio in the "3D creator" visual language (Kanit, giant gradient headings,
ink slabs, sticky-stacking cards) using **real site content** from `src/data/*`. Branch: `v3`.

Every implementing agent: read this file fully, then implement ONLY your assigned section.
Match existing code idioms (imports from `motion/react`, `@/` alias, function components,
`export function X()`). TypeScript strict. No new deps.

## Invariants (do not break)

- Hero `h1` visible in server HTML (no initial opacity-0 on it; use `initial={false}` or CSS-only). LCP-critical.
- Preloader stays session-gated + reduced-motion aware (`src/components/Preloader.tsx` logic untouched; colors may be retokened).
- No `filter: blur()` in reveal animations.
- All custom CSS classes live in `@layer components` in `globals.css`.
- `prefers-reduced-motion: reduce` kills decorative animation (keep existing block, adapt selectors).
- Keep `content-visibility` `.cv-section` pattern on below-fold sections.
- Keep `next-themes` dark/light via `.dark` class + `@custom-variant dark`.
- Keep Lenis `SmoothScroll`, `Providers`, `CustomCursor`, `ThemeToggle`, `Magnetic` components.

## S0 — Tokens + global CSS (`src/app/globals.css`)

Rewrite. Keep: `@import "tailwindcss"`, `@custom-variant dark`, base html/body rules,
focus-visible, selection, scrollbar, Lenis block, `.cv-section`, reduced-motion block,
`[data-quality="low"]` concept (adapted). Delete: aurora/mesh, glass/glass-strong/bevel/
glass-sheen/glint/orb/spotlight/eq/pulse-dot/wave/text-shine, `--hue` `@property`.

Tokens (`:root` = light, `.dark` = dark):

```css
:root {
  --background: #F2F3F5;      /* canvas */
  --foreground: #1A1D22;      /* body text */
  --muted: #5A626C;
  --grad-a: #9AA2AC;          /* heading gradient start */
  --grad-b: #16191E;          /* heading gradient end */
  --slab: #0C0C0C;            /* inverted slab bg */
  --slab-fg: #D7E2EA;         /* inverted slab text */
  --line: rgba(12, 12, 12, 0.15);       /* hairline on canvas */
  --slab-line: rgba(215, 226, 234, 0.18); /* hairline on slab */
}
.dark {
  --background: #0C0C0C;
  --foreground: #D7E2EA;
  --muted: #8B98A3;
  --grad-a: #646973;
  --grad-b: #BBCCD7;
  --slab: #FFFFFF;
  --slab-fg: #0C0C0C;
  --line: rgba(215, 226, 234, 0.18);
  --slab-line: rgba(12, 12, 12, 0.15);
}
```

`@theme inline`: map `--color-background/foreground/muted/slab/slab-fg/line/slab-line`
and `--font-sans: var(--font-kanit)`.

`@layer components`:

```css
.hero-heading {
  background: linear-gradient(180deg, var(--grad-a) 0%, var(--grad-b) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.cta-pill { /* ContactButton bg */
  background: linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%);
  box-shadow: 0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset;
  outline: 2px solid #fff; outline-offset: -3px;
}
```

Body font: `var(--font-kanit), sans-serif`. `overflow-x: clip` stays on body.

## S1 — Layout (`src/app/layout.tsx`)

- Fonts: replace Space_Grotesk/Inter/JetBrains_Mono with single `Kanit`
  (`weight: ["300","400","500","600","700","800","900"]`, `subsets: ["latin"]`,
  `variable: "--font-kanit"`, `display: "swap"`).
- Remove `<AuroraBackground />` and `<GlassFilter />` imports+usage.
- `viewport.themeColor`: light `#F2F3F5`, dark `#0C0C0C`.
- Skip-link: restyle without `glass-strong` (solid `bg-slab text-slab-fg` pill).
- Everything else (Providers, CustomCursor, Preloader, SmoothScroll, Navbar, Footer, metadata) stays.

## S2 — Shared components (new files in `src/components/`)

**`FadeIn.tsx`** (client): props `{ children, delay?=0, duration?=0.7, x?=0, y?=30, className?, as?="div" }`.
`whileInView={{opacity:1,x:0,y:0}}`, `initial={{opacity:0,x,y}}`,
`viewport={{ once: true, margin: "50px", amount: 0 }}`, ease `[0.25,0.1,0.25,1]`.
Also export `FadeInStatic` variant (or prop `ssr`) that renders with `initial={false}` for LCP-critical children.

**`ContactButton.tsx`**: `<a href="#contact">` pill, class `cta-pill`, white text, `font-medium uppercase tracking-widest rounded-full`, sizes `px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base`. Label prop, default "Contact Me". Hover: slight scale via motion.

**`GhostButton.tsx`** (LiveProjectButton generalized): `<a>` rounded-full `border-2`, border/text follow surface context (`border-current text-current` works on both canvas and slab). Props `{href, children}`. `uppercase tracking-widest font-medium px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base`, hover bg 10% tint, external links `target="_blank" rel="noopener noreferrer"`.

**`AnimatedText.tsx`** (client): char-by-char scroll opacity 0.2→1.
`useScroll({ target: ref, offset: ["start 0.8", "end 0.2"] })`; each char =
invisible placeholder span + absolute animated span; `useTransform` per-char range.

`Magnetic.tsx` already exists — reuse as-is.

## S3 — Hero (`src/components/Hero.tsx`, rewrite)

Full-viewport `h-screen` flex column, `id="home"`, `overflow-x: clip`.
- Top spacing under fixed navbar.
- `h1`: `DEEGHAYU ADHIKARI` (two lines, each `whitespace-nowrap`), class `hero-heading font-black uppercase tracking-tight leading-none w-full text-center`, size `text-[13vw] sm:text-[14vw] md:text-[15vw]`. **Server-visible** — no opacity-0 initial.
- Under h1: rotating roles line from `site.roles` (client, cycles ~2.5s, motion crossfade, reduced-motion → static first role). Style: `text-muted uppercase tracking-[0.3em]` small.
- Bottom bar `justify-between items-end pb-8 md:pb-10 px-6 md:px-10`:
  - left: `site.tagline`, `font-light uppercase tracking-wide leading-snug`, `clamp(0.75rem, 1.4vw, 1.5rem)`, `max-w-[160px] sm:max-w-[240px] md:max-w-[320px]`.
  - right: `<ContactButton />` wrapped in `Magnetic`.
- FadeIn delays: heading none (SSR), roles 0.15, left text 0.35, button 0.5.

## S4 — Marquee (`src/components/WorkMarquee.tsx`, new)

Scroll-driven double marquee. `pt-24 sm:pt-32 md:pt-40 pb-10`, bg canvas.
21 GIFs (exact URLs, plain `<img>`, `loading="lazy"`, `decoding="async"`, alt "Motion web design preview"):

```
https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif
https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif
https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif
https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif
https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif
https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif
https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif
https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif
https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif
https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif
https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif
https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif
https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif
https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif
https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif
https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif
https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif
https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif
https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif
https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif
https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif
```

Row 1 = first 11 tripled, moves RIGHT: `translateX(offset - 200)`.
Row 2 = remaining 10 tripled, moves LEFT: `translateX(-(offset - 200))`.
`offset = (window.scrollY - sectionTop + window.innerHeight) * 0.3`, passive scroll
listener + rAF throttle, `willChange: transform`, transforms applied via refs (no re-render per scroll).
Tiles 420×270 (`w-[420px] h-[270px]` fixed, `max-w-none`), `rounded-2xl object-cover`, `gap-3` both axes.
Reduced motion: static rows, no transform updates. `cv-section`.

## S5 — About (`src/components/About.tsx`, rewrite)

`id="about"`, `min-h-screen` centered, `px-5 sm:px-8 md:px-10 py-20`, `cv-section`.
- Heading `ABOUT ME`, class `hero-heading font-black uppercase leading-none tracking-tight text-center`, `clamp(3rem, 12vw, 160px)`.
- 4 corner decorative tiles = real screenshots, `rounded-2xl object-cover` small tilted cards (`rotate-[-6deg]` etc.), absolute corners, hidden below `sm`:
  - top-left `/images/web_scada.png` (FadeIn x:-80 delay 0.1)
  - bottom-left `/images/greenwing.jpg` (x:-80 delay 0.25)
  - top-right `/images/web_lifesight.png` (x:80 delay 0.15)
  - bottom-right `/images/idh.jpg` (x:80 delay 0.3)
  Sizes ~`w-[160px] md:w-[210px]`, positions top-[4%]/bottom-[8%], sides 2–10%.
- `<AnimatedText>` paragraph = `site.bio`, centered `font-medium leading-relaxed max-w-[560px]`, `clamp(1rem, 2vw, 1.35rem)`.
- Stats row from `stats` (`src/data/site.ts`): value+suffix+label, uppercase small, hairline separators.
- `<ContactButton />` below. Gaps `gap-10 sm:gap-14 md:gap-16` / bottom `gap-16 sm:gap-20 md:gap-24`.

## S6 — Capabilities (`src/components/Capabilities.tsx`, new)

`id="capabilities"`. INVERTED SLAB: `bg-slab text-slab-fg`, `rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px]`, `px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32`, `cv-section`.
Heading `CAPABILITIES` `font-black uppercase text-center` `clamp(3rem, 12vw, 160px)` `mb-16 sm:mb-20 md:mb-28` (solid `text-slab-fg`, not gradient).
6 items, `max-w-5xl mx-auto`, rows split by `border-b` `var(--slab-line)`, `py-8 sm:py-10 md:py-12`,
layout: number left (`font-black`, `clamp(3rem, 10vw, 140px)`, ~0.35 opacity), name+desc right
(name `font-medium uppercase` `clamp(1rem, 2.2vw, 2.1rem)`; desc `font-light leading-relaxed max-w-2xl` `clamp(0.85rem, 1.6vw, 1.25rem)` opacity 0.6). Staggered FadeIn `i * 0.1`.

01 **Full-Stack Web** — Production platforms in Next.js, React and TypeScript — commercial SCADA dashboards, factory management systems and solar portals serving real operations daily.
02 **AI / ML Systems** — Machine-learning products from notebook to deployment: computer vision, NLP, forecasting and AI-assisted tooling built on TensorFlow and cloud AI services.
03 **IoT & Embedded** — ESP32 firmware, OPC UA integrations, inverter and weather-station telemetry — hardware wired end to end into live web interfaces.
04 **Industrial SCADA** — Multi-plant solar monitoring and mini-grid management: real-time telemetry, device control and load optimization for utility-scale energy systems.
05 **Data Engineering** — Realtime pipelines, microservices and analytics — from Firebase realtime sync to batch-processing platforms and factory-floor data models.
06 **Teaching & Lecturing** — Visiting lecturer in web development, mobile apps and AI — turning production experience into curriculum for the next cohort of engineers.

## S7 — Experience (`src/components/Experience.tsx`, rewrite)

`id="experience"`. Back on canvas (`bg-background`), dark slab pull-up:
`rounded-t-[40px]…` corners, `-mt-10 sm:-mt-12 md:-mt-14 z-10 relative`, `cv-section`.
Heading `EXPERIENCE` in `hero-heading` gradient, same clamp as others.
Data: `work` then `education` from `@/data/experience`. Two labeled groups
(`WORK`, `EDUCATION` — small uppercase tracking labels). Numbered rows `01…` continuing
across both groups, same row anatomy as Capabilities (number + title/org/period/detail),
hairlines `var(--line)`. Period in `text-muted`. Staggered FadeIn.

## S8 — Projects (`src/components/Projects.tsx`, rewrite; `ProjectCard.tsx` deleted if unused)

`id="projects"`, `cv-section`, on canvas bg.
Heading `PROJECTS` `hero-heading` gradient, same styling.
**Sticky-stack** of the 6 `featured: true` projects from `@/data/projects`:
each in `h-[85vh]` container, card `sticky top-24 md:top-32`, offset `top: index * 28px`,
scale on scroll-past: `targetScale = 1 - (5 - index) * 0.03` via `useScroll`+`useTransform`
(container-level progress). Card: `rounded-[40px] sm:rounded-[50px] md:rounded-[60px]
border-2 border-foreground/60`, `bg-background`, `p-4 sm:p-6 md:p-8`.
Card content:
- top row: number (`font-black clamp(3rem, 10vw, 140px)` `hero-heading`), category label
  (first of `categories`, uppercase small), title (`font-medium uppercase clamp(1.2rem, 2.4vw, 2.4rem)`),
  tech chips (small uppercase bordered pills), `GhostButton` per `links[0]` (label from data).
- bottom: one large screenshot `next/image` (`project.image`), `rounded-[32px] sm:rounded-[40px]
  md:rounded-[48px] object-cover object-top`, height `clamp(260px, 44vw, 520px)`.
Reduced motion: no scale transform.
**Index list** below stack: remaining 12 projects as numbered rows `07…18` —
number, title, tagline, category, arrow link (first link if any). Hairline rows, hover shifts
title. Compact.

## S9 — Certifications (`src/components/Certifications.tsx`, rewrite)

`id="certifications"`. INVERTED SLAB like S6 (rounded top, `bg-slab text-slab-fg`), `cv-section`.
Heading `CERTIFICATIONS` solid `text-slab-fg`, `clamp(2.4rem, 9vw, 120px)`.
8 rows from `@/data/certifications`: number, title (`font-medium uppercase`), issuer + issued
(`opacity-60 font-light`), keep `BrandIcon` issuer icons if standalone (check imports; if tied
to deleted code, plain text). Hairlines `var(--slab-line)`. Staggered FadeIn.

## S10 — Contact (`src/components/Contact.tsx`, rewrite)

`id="contact"`. Dark slab pull-up over the light slab (like S7): rounded top, `-mt-10…`, `z-10`, `cv-section`.
- Giant `LET'S TALK` `hero-heading` gradient, same clamp as section headings.
- Two-column below (stack on mobile):
  - left: contact rows — email (`site.email`, mailto), phone (`site.phone`, `site.phoneHref`),
    WhatsApp (`site.whatsapp`), Telegram (`site.telegram`), location (`site.location` →
    `site.locationUrl`), CV download (`site.cv`). Uppercase labels, hairline rows.
  - right: **preserve the existing Formspree form exactly** — read current `Contact.tsx`
    first, keep endpoint/field names/validation/success state; restyle inputs flat:
    transparent bg, `border-b` hairline, uppercase labels, focus border-foreground.
    Submit button = `cta-pill` style.
- Socials row: 5 links from `socials` via existing `SocialIcon`/`brand-icons` if standalone.

## S11 — Navbar (`src/components/Navbar.tsx`, rewrite) + Footer (`src/components/Footer.tsx`, restyle)

Navbar: fixed top, transparent over canvas with subtle bottom hairline on scroll
(no glass/backdrop-blur). Links uppercase `font-medium tracking-wider text-sm md:text-base`,
hover opacity 70% 200ms. Items: About `#about`, Projects `#projects`, Experience `#experience`,
Contact `#contact` (update `nav` in `src/data/site.ts` accordingly). Left: `DA` wordmark
(`font-black uppercase`). Right: `ThemeToggle` (keep component). Mobile: same row, smaller —
4 links fit; no hamburger.
Footer: flat — hairline top, `© {year} Deeghayu Adhikari`, socials, back-to-top. No glass classes.

## S12 — Wire-up + cleanup (`src/app/page.tsx` + deletions)

Order: `Hero, WorkMarquee, About, Capabilities, Experience, Projects, Certifications, Contact`.
Delete files (after confirming nothing imports them): `AuroraBackground.tsx`, `GlassFilter.tsx`,
`SkillsMarquee.tsx`, `Section.tsx`, `Reveal.tsx`, `ProjectCard.tsx` (if unused).
`CustomCursor.tsx` + `Preloader.tsx`: replace any glass-class usage / old palette hexes with
tokens; logic untouched. `not-found.tsx`, `opengraph-image.tsx`: fix only if they reference
deleted classes/fonts (compile must pass). JsonLd in `page.tsx` stays.

## Verification

`npm run typecheck` → `npm run lint` → `npm run build` all green. Then opus diff review
against Invariants above; fixes applied; re-verify.
