# Deeghayu Adhikari — Portfolio

Personal portfolio at [deeghayu.netlify.app](https://deeghayu.netlify.app), rebuilt with a liquid-glass design system.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Motion (Framer Motion) · next-themes · Netlify

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

## Updating content — no code required

All content lives in three files:

| What | Where |
| --- | --- |
| Name, roles, bio, contact, socials, skills, stats | [`src/data/site.ts`](src/data/site.ts) |
| Projects (title, description, tags, links, image) | [`src/data/projects.ts`](src/data/projects.ts) |
| Work experience & education | [`src/data/experience.ts`](src/data/experience.ts) |

- **Add a project:** drop a screenshot in `public/images/`, then copy any block in `projects.ts` and edit it. `featured: true` makes the card span two columns.
- **Update the CV:** replace `public/cv/Deeghayu_Adhikari_CV.pdf` (keep the filename, or update `cv` in `site.ts`).
- **Contact form:** posts to Formspree (endpoint in `src/components/Contact.tsx`).

## Design system

Theme tokens (colors, glass surfaces, aurora palette) are CSS variables at the top of [`src/app/globals.css`](src/app/globals.css) with light/dark variants. Reusable classes: `.glass`, `.glass-strong`, `.glass-sheen` (hover sweep), `.glass-button`, `.glass-lens`, `.text-shine`.

True liquid-glass refraction: `GlassFilter` renders an SVG displacement filter and tags `<html class="lens">` on Chromium browsers, where `.glass-lens` elements bend the backdrop through them (`backdrop-filter: url(#glass-lens) …`). Safari/Firefox automatically fall back to the frosted blur.

## Built-in behavior

- Awwwards-style preloader: per-letter name reveal, live percentage counter, curved-curtain exit synced to the hero entrance
- Custom cursor: accent dot + lagging glass ring that swells over links and squeezes on press (mouse-only; native cursor kept in form fields)
- Layered animated background: rotating conic sheen, drifting aurora blobs, masked dot grid, pointer spotlight, film grain
- Hero parallax: floating glass orbs and tech chips drift opposite the pointer at three depths
- Lenis inertial smooth scrolling with eased anchor navigation
- Navbar hides while scrolling down, returns on scroll up; reading progress bar
- Infinite skills marquee (pauses on hover)
- Light / dark / system theme (toggle in nav, persisted locally)
- Full `prefers-reduced-motion` support — every animation, including the preloader, marquee and smooth scroll, is disabled when requested
- SEO: Open Graph image, JSON-LD, sitemap, robots, manifest (all generated at build)
- Accessibility: skip link, semantic landmarks, keyboard focus rings, labelled controls

## Deploy

Pushing to `main` deploys via Netlify using [`netlify.toml`](netlify.toml) (official Next.js runtime, image optimization included). No extra configuration needed.
