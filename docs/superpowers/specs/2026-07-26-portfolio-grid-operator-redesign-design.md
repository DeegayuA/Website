# Portfolio redesign — "Grid Operator"

Date: 2026-07-26 · Branch: v2 · Status: approved (user gave full creative freedom: "surprise me")

## Concept

Deeghayu is an R&D engineer who builds the software that runs solar plants: SCADA
platforms, mini-grid controllers, BESS factory systems. The current site is generic
liquid-glass/aurora. The redesign borrows every structural device from the real
artifacts of his world instead:

- **Single-line diagrams** (the schematic language of power engineering) — the hero signature.
- **Telemetry strips** — live clock (Asia/Colombo), grid frequency, plant status.
- **Engineering drawing title blocks** — section headers carry SHEET NO / TITLE / REV.
- **Operations logs** — experience as timestamped log entries.
- **Calibration certificates** — the certifications grid.

Voice: precise, quiet, confident. The site reads like a beautifully built control-room
console, not a template.

## Tokens

### Color — two shifts (theme toggle relabeled "Day shift / Night shift")

Day (light):
- `--background` #F4F3EF — engineering paper
- `--panel` #FBFAF7 — instrument panel face
- `--foreground` #171C18 — green-tinted ink
- `--muted` #5C635C
- `--line` #D9D8D0 — hairline borders / graph grid
- `--amber` #E89B00 (graphics) · `--amber-ink` #8A6100 (text-grade, AA on paper)
- `--blue` #2C5BD9 — schematic ink
- `--ok` #177E4D · `--alert` #C23B2C

Night (dark):
- `--background` #0B0E12 · `--panel` #12161C
- `--foreground` #E8EAE5 · `--muted` #969C94 · `--line` #262B31
- `--amber` #FFB224 (instrument glow, also text-grade on dark)
- `--blue` #7C9CFF · `--ok` #43CD85 · `--alert` #FF6B5E

No gradients, no glassmorphism, no hue cycling. Amber is the single voice of energy;
blue is schematic ink; green/red only as status semantics.

### Type

- Display: **Archivo** (variable, wide + black weights) — industrial grotesk, uppercase,
  tight tracking. Name + section titles only.
- Body: **IBM Plex Sans** — engineering heritage, sentence case.
- Data: **IBM Plex Mono** — telemetry, labels, timestamps, tech tags, title blocks.
- Sinhala name keeps system fallback with `lang="si"`.

### Layout

- Fixed graph-paper background: faint 1px line grid (CSS gradients), replaces mesh blobs.
- Panels: flat `--panel`, 1px `--line` border, 2px radius, mono corner labels;
  featured panels get corner tick marks.
- Section header = title block strip: `SHEET 03 · SELECTED WORK · REV 2026.07`.
- Max width 72rem, generous vertical rhythm.

```
┌──────────────────────────────────────────────────────────┐
│ ● D.ADHIKARI   INDEX WORK LOG CERTS CONTACT   [NIGHT ⏻] │
├──────────────────────────────────────────────────────────┤
│ 06:42:11 +0530 │ 50.00 Hz │ 2.6 MW ONLINE │ KADAWATHA LK │
│                                                          │
│ R&D ENGINEER — SOLAR SCADA · AI · IOT                    │
│ DEEGHAYU                                                 │
│ ADHIKARI                                                 │
│ ☉──[PV]──[INV]──◉──────→ GRID   (animated SVG flow)     │
│ I build the software that runs solar plants.             │
│ [OPEN A CHANNEL]  [DOWNLOAD CV]   GH LI X IG FB          │
└──────────────────────────────────────────────────────────┘
```

### Signature (the one bold spend)

Animated SVG single-line diagram in the hero: sun → PV array → inverter → bus node
(labeled with his role) → grid, with energy-flow dashes animating along the conductors,
plus the live telemetry strip above the name. Everything else stays quiet.

## Motion

- Preloader → 1s "boot log" (3 mono lines type in, wipe up). Reduced motion: instant.
- Hero: one orchestrated load sequence (telemetry → name mask-reveal → diagram draw-in).
- Scroll: simple fade-up reveals (no blur filters). SLD dash flow continuous, CSS-only.
- Removed: Lenis smooth scroll, magnetic buttons, 3D tilts, sheen sweeps, custom cursor,
  hue cycling. Native scrolling, native cursor.

## Architecture / cleanup

- Delete: AuroraBackground, GlassFilter, CustomCursor, SmoothScroll, Magnetic,
  Preloader (replaced by BootScreen), SkillsMarquee (replaced by mono ticker in hero
  band or About capabilities table).
- New: GridPaper (bg), Telemetry (live strip), Sld (hero diagram), TitleBlock (section
  header device).
- Server components wherever possible; client only where state/motion demands.
- Drop `lenis` dependency; drop unused remotePatterns in next.config.
- Update opengraph-image.tsx, manifest/theme colors, JSON-LD copy to new positioning.

## Error handling / quality floor

- Contact form flow unchanged (Formspree), status via `role="status"`.
- Contrast AA: amber-ink on paper, amber on night bg verified.
- `prefers-reduced-motion` kills diagram flow, ticker, reveals.
- Responsive to 360px; keyboard focus visible everywhere.

## Testing

- `npm run build` green, ESLint clean.
- Multi-agent review sweep (React correctness, a11y, perf, craft, SEO) + fixes.
- Browser screenshot verification (light + dark, mobile + desktop).
