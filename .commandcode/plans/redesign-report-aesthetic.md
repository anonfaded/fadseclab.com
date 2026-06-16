# FadSec Lab — Report-Aesthetic Redesign (SHIPPING)

**Mode:** redesign (full pass)
**Project:** fadseclab.com
**Date:** 2026-06-16
**Author:** Command Code
**Status:** Approved to build

## What the user asked for

- Tear out the boring gradient / card-grid look. Replace with the report-aesthetic: corner brackets, mono labels (`// SERVICES`), dense ruled tables, sharp borders, asymmetric per-section composition.
- Remove the CNN coverage reference (no press strip, no CNN button, no CNN URL in copy).
- Stop dumping project lists. Lead FadCam as the only product shown; remove the catalog list.
- Services: cover native iOS, native Android, cross-platform Flutter, **and** cross-platform desktop (macOS, Windows, Linux).
- Services should communicate **agentic AI-assisted workflows** with a **14-day MVP** promise.
- Keep the brand red, the hero shield scene, the GitHub outbound flow, the avatar mascot, the external-nav confirm dialog.
- Light-mode parity must continue to work.

## Direction (one line)

Treat the page like a security dossier: framed sections with corner brackets, mono `// LABEL` headers, dense ruled tables, asymmetric compositions per section, brand red as the only saturated hue, no soft cards.

## Section plan (locked)

1. **Header** — full-width bar, 1px hairline bottom, no radius, no shadow, no blur. Brand left, mono `//` nav center, account + theme + menu right.
2. **Hero** — three horizontal bands (badge+h1+lede / CTAs / framed shield with `// LIVE THREAT GRAPH`). Drop crosshair cursor. Drop radial wash.
3. **Capabilities** — 2-col dossier table: `01 / Native platforms` (with zero-telemetry chart) + `02 / Reach` (12-bar sparkline). **No world map. No CNN.**
4. **Product (FadCam)** — FadCam alone on the left + 6-row "release pulse" table on the right. **No catalog dump.**
5. **Services** — 4-row dossier: `01 Native Android` / `02 Native iOS` / `03 Cross-platform Flutter` / `04 Cross-platform desktop (macOS, Windows, Linux)`. Above: `// SHIP RATE — MVP in 14 days`.
6. **Open source** — single horizontal strip. "23+ public repositories" + one sentence + GitHub button.
7. **Footer** — sharp top edge, framed wordmark, `// SHIP LOG` mono row, 4-col link table with hairline rows.

## Files to change

- `src/App.tsx` — full section JSX rewrite.
- `src/App.css` — full section CSS rewrite. New `.report-frame`, `.report-label`, `.dossier-table`, `.release-pulse-table` helpers. Remove `.mini-map-*`, `.world-map-container`, `--map-*`, `.press-strip-*`, `.service-grid`, `.service-card`, `.catalog-list`, `.stat-signal*`, `.metric-band`, hero radial wash, crosshair cursor.

## Out of scope

- Audio toggle on avatar (taste file claims it; codebase doesn't implement it).
- Pre-existing TypeScript errors in `HeroShield.tsx`.
- Three.js offscreen pause.

## Verification

1. `pnpm run build` — must parse (pre-existing HeroShield errors expected, not in scope).
2. Visual check on dev server, in order: hero bands, capabilities dossier, product pulse, services dossier + 14-day block, open source strip, footer.
3. Tab through every section — focus rings visible.
4. Light mode — every frame readable.
5. Resize 480 / 780 / 1040px — sections collapse cleanly, tables remain readable.
6. Trigger Account / GitHub / FadCam outbound — confirm dialog still works.
7. `grep -ri 'cnn' src/` returns nothing.
