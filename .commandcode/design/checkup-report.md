# Checkup Report — FadSec Lab

**Mode:** checkup
**Project:** fadseclab.com
**Date:** 2026-06-16
**Surface audited:** Marketing landing page (single-page React/Vite app, dark + light themes, GSAP + Framer Motion)

## Overall

**Score:** 47 / 60 — Watch (shippable after targeted fixes)
**Verdict:** Two vitals are critical; four are watch. Surface works, but composition and intentionality need repair.

| Vital | Status | Score |
|---|---|---|
| Intentionality | Watch | 5 / 10 |
| Readability | Watch | 8 / 10 |
| Usability | Healthy | 9 / 10 |
| Responsiveness | Watch | 6 / 10 |
| Speed | Healthy | 10 / 10 |
| Accessibility | Critical | 9 / 10 |

## TL;DR

The page is technically healthy. Speed is strong, the keyboard tab path is mostly clean, the primary action is obvious, and both light and dark themes are real. The two critical issues are accessibility (focus management around the external-nav confirmation dialog and the hero custom cursor) and the unintentional visual language drift that makes the surface read as "assembled" rather than "chosen." Composition is the most pressing visual repair.

## Vitals

### Intentionality — Watch (5 / 10)

**Evidence:** Manrope + JetBrains Mono are 2024–2026 defaults. The services section is a 3-up icon-card grid. The proof band opens with "150K+ users trust us" before any real product story. The footer wordmark uses a 2018-era hover-slide. The shield-under-attack hero and brand red are intentional; almost everything below it is not.

**Why it matters:** Intentionality is the difference between "this company built their site" and "this company picked a template." The hero carries the brand; the rest of the page does not.

**Prescription:** `/design deslop` to remove the slop patterns and replace them with project-specific decisions.

### Readability — Watch (8 / 10)

**Evidence:** Body measure sits at 65-75ch for paragraphs. Hero h1 scales fluidly with `clamp(2.4rem, 6vw, 4.5rem)`. Stat numbers and section headings are large enough. Contrast in dark mode is strong (white text on near-black surfaces). Light mode parity is real.

**Concerns:** The light-mode body text uses `--text-soft: #5a5a6e` on a `#f8f8fb` background — that pair measures at ~5.7:1, which passes AA for body but feels dim at small sizes. The `.eyebrow` mono labels at 11px / 800 weight with 0.08em letter-spacing are at the edge of legibility for low-vision users. The light-mode brand red `#d42b40` is darker than dark-mode — accessibility-correct, but the "Pressed-stamp" footer treatment (P2 in smell) would need contrast re-check.

**Prescription:** Light-mode body text soft color should be a step darker, e.g. `#42425a`. The mono labels are fine for the meta role; do not enlarge them, but add a `prefers-contrast: more` fallback that bumps to `--text`.

### Usability — Healthy (9 / 10)

**Evidence:** Primary CTAs are visible above the fold ("Explore services" and "Discuss a project"). External links open in a new tab with a confirmation dialog — a real recovery path. The contact dialog gives both mail and GitHub options. Theme toggle is in the header. The mobile menu closes after navigation.

**Concerns:** The hero custom crosshair cursor hides the system cursor on the hero section (`cursor: none` + a custom SVG). For users on touch input this is invisible; for keyboard users it never appears. The 320px viewport renders the metric band as a single column, but the world map container is 220px tall at that size — fine. The contact form is mailto, not a form, so there is no validation path; acceptable for a personal-site / open-source company.

**Prescription:** None required. Watch for future state additions.

### Responsiveness — Watch (6 / 10)

**Evidence:** Three breakpoints are defined: 1040px, 780px, 480px. The mobile menu replaces the nav. Grids collapse cleanly. The hero h1 reduces to text-5xl on mobile. The footer collapses to a column. The map remains interactive on mobile.

**Concerns:** The hero custom cursor stays active on tablet sizes (760px) — should be `pointer: coarse` only. The hero scene SVG uses 32px dot grid; on a 320px viewport this is 10 dots wide and reads as static. The Three.js adversary canvas is positioned with `inset: 16% 0 -4% -24%` at 520px — at that size it occupies ~50% of the width, which works, but at 320px it overlaps the shield. The `.hero-action` flex growth at mobile (`flex: 1 1 150px`) is fine, but the eyebrow badge text wraps awkwardly at 320px. The .stat-signal is 136px minimum height on 480px — good.

**Prescription:** The hero custom cursor should be gated to `pointer: fine`. The Three.js adversary scene should be `display: none` below 600px to prevent overlap with the shield at 320px. The eyebrow badge should be a single line or `white-space: nowrap` with a hidden label at very small sizes.

### Speed — Healthy (10 / 10)

**Evidence:** Vite-based build, tree-shaken dependencies. GSAP and Framer Motion are co-imported; GSAP is the heavier one. The world map loads a CDN-hosted `world-atlas@2/countries-110m.json` (small, ~120KB gzipped). The Three.js scene is bound to the hero. The world map is a single SVG with a single fill — cheap. CSS animations are GPU-friendly (transform + opacity only). `prefers-reduced-motion` is honored. `IntersectionObserver` is used for chart reveal and map bars.

**Concerns:** Co-importing GSAP and Framer Motion is duplicate animation infrastructure. The Three.js scene renders continuously (no RAF pause when offscreen) — should pause via `requestAnimationFrame` cancel on visibility change. The `world-atlas` JSON is fetched from jsDelivr; an outage would break the map. None of these are blockers.

**Prescription:** Pause Three.js when the hero leaves the viewport. Consider vendoring `world-atlas@2/countries-110m.json` to the public/ folder to remove the CDN dependency. Acceptable to defer.

### Accessibility — Critical (9 / 10)

**Evidence:**
- Focus rings are present (`outline: 2px solid var(--accent-brand); outline-offset: 3px;`).
- All interactive elements are keyboard-reachable.
- The map markers are `tabIndex={0}` and respond to `onFocus` for the tooltip.
- The contact dialog has `aria-label`-style headers and a footer with Cancel/Continue.
- `prefers-reduced-motion` is respected across hero, stats, and map animations.
- Selection highlight uses the brand red.
- Tap highlight is suppressed with `-webkit-tap-highlight-color: transparent` — paired with the strong focus ring this is fine.

**Concerns:**
- The custom crosshair cursor in the hero (`cursor: none` + SVG overlay) is a "remove system cursor" pattern. The SVG overlay is pointer-events: none and updates on `mousemove`, but the implementation does not appear to fire the `fadsec:hero-hit` event reliably — the avatar hit-rig listens for it, but no source code in `App.tsx` or `HeroShield.tsx` is currently dispatching the event based on what I read. This is a "claimed behavior without observable cause" — either verify it fires, or remove the claim from copy.
- The hero cursor is fixed-position and z-index 80 — at 80 it sits above the sticky header (z-index 80 same). Confirm the header remains clickable.
- The hero custom cursor is invisible to keyboard users and irrelevant on touch input. It should be gated to `pointer: fine` AND `prefers-reduced-motion: no-preference` AND viewport ≥ 780px.
- The dialog has no `aria-describedby` wiring; `DialogDescription` is rendered but I cannot confirm the `id` link from `App.tsx`.
- The map markers use a `tabIndex={0}` and a `circle` element. The `foreignObject` tooltip has `pointer-events: none` and `visibility: visible` only on focus — screen readers will not announce the country name because the `foreignObject` content is rendered but the `circle` lacks `aria-label`. The `name` value lives only in React state.
- The world map is decorative, but if the data is meaningful, it should have an accessible list fallback. The "51+ countries" line is the only text version of the data.
- The mobile menu has `aria-hidden={!isMenuOpen}` and toggles visibility — this is correct, but the close button uses `aria-label="Open menu"` / `"Close menu"` which is right.
- The header account button's dialog has a 520ms transition overlay, during which the page is briefly covered. Make sure focus is restored to the trigger after the dialog closes.

**Prescription:**
1. Verify the `fadsec:hero-hit` event actually fires from the Three.js scene. If not, remove the event listener in `Avatar.tsx`.
2. Add `aria-label={name}` to each `circle` map marker.
3. Gate the hero custom cursor to `pointer: fine`, `prefers-reduced-motion: no-preference`, `min-width: 780px`.
4. Restore focus to the trigger after the external-nav dialog closes.
5. Confirm `DialogDescription` is wired to the dialog via `aria-describedby` (Base UI provides this by default — verify the rendered DOM).

## Prescriptions Summary

| Priority | Vital | Action |
|---|---|---|
| P0 | Accessibility | Verify or remove `fadsec:hero-hit` event chain |
| P0 | Accessibility | `aria-label` on map markers |
| P0 | Accessibility | Gate hero custom cursor to fine pointer + no reduced motion + ≥ 780px |
| P1 | Responsiveness | Hide Three.js adversary scene below 600px |
| P1 | Accessibility | Restore focus to trigger after dialog close |
| P1 | Intentionality | `/design deslop` — remove the slop |
| P2 | Responsiveness | `white-space: nowrap` on eyebrow badge below 480px |
| P2 | Speed | Pause Three.js when offscreen; vendor world-atlas JSON |
| P2 | Readability | Darken light-mode `--text-soft` from `#5a5a6e` to `#42425a` |

## Next Modes

- `/design deslop` — run now; the slop is structural and affects intentionality, composition, and the read of the whole page.
- `/design interaction` — focus the post-dialog focus restoration, cursor gating, and map marker a11y.
- `/design responsive` — refine the 320px and 520px breakpoints after the composition pass.
