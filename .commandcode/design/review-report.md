# Review Report — FadSec Lab

**Mode:** review
**Project:** fadseclab.com
**Date:** 2026-06-16
**Surface audited:** Marketing landing page

## Overall

**Score:** 26 / 50 — Focused intervention required
**Verdict:** The hero is excellent. The page below it does not live up to the hero. The brand is set; the surface is not.

| Lens | Score |
|---|---|
| First impression | 8 / 10 |
| Hierarchy | 5 / 10 |
| Color voice | 7 / 10 |
| Type voice | 3 / 10 |
| Interaction feel | 3 / 10 |
| **Total** | **26 / 50** |

## First Impression

The page arrives on a brand-red wireframe shield taking real arrow hits from a tower-and-launcher rig on the left, on a near-black canvas with a faint dot grid. The wordmark is small in the top-left, the nav is centered, the primary action is "Explore services" with a "Discuss a project" secondary. The hero shield breathes, recoils, sparks; the antenna blinks; the signal rings expand. This is a memorable point of view.

What it is for: a privacy-first open-source software company that engineers Android, desktop, and security tools. Yes — the shield + arrow scene + tag "Privacy-first FOSS software company" + h1 "Privacy today, tomorrow, forever." makes that obvious in the first viewport. The brand red does most of the work. The wireframe-on-dark shield does the rest.

The 30-second sniff test passes. A stranger would say "privacy / security company, red brand, technical." Good.

What weakens the first impression: the supporting cast below the fold is generic. Once the user scrolls past the shield, the page flattens. The stat band reads as SaaS, the services section reads as a template, the footer reads as a 2018 brand site. The hero is the strongest section by a wide margin, and the falloff is steep.

## Hierarchy

The hero is well-ordered: badge → h1 → lede → CTAs → shield artifact. The eye lands on the h1 first because of scale and weight, then on the CTAs because of color contrast (red on near-black), then on the shield because of motion.

Below the hero, the order breaks:

- **Proof band** opens with two 4xl stat numbers — "150K+" and "0". The 150K+ is the largest text in the band, which means the user reads "150K+ Users trust us / Hidden trackers / 92% / Community adoption / Privacy baseline" before they read "Open-source tools that reach users without growth hacks…" (the only line in the band that explains what FadSec Lab is).
- **Product section** is 2-column with FadCam on the left, catalog stats on the right. The FadCam side wins by domain specificity (it's a real product), but the catalog side reads as "7 / 12 / 4" with no link to the actual catalog. The "Browse all products" CTA goes to GitHub. Fine, but the relationship between "7 Android apps" and the 7 specific apps is not shown.
- **Open source** section is a 3-col row (eyebrow + h2 / paragraph / GitHub button) — fine.
- **Services** section is the most troubled: a 3-up icon-card grid with no priority, no specificity, no proof. Three identical "we do X" cards. The user cannot tell which service is flagship, which is occasional, or what the engagement looks like.

The hierarchy tells the eye: shield > 150K+ > FadCam > eyebrow > nothing > service cards > footer. The proof band is louder than the product. The service cards are the noisiest. The footer is the quietest.

**Fix:** Lead proof, not stats. Lead the Android service in detail, then collapse the other two into a single line.

## Color Voice

The brand red `#e8334a` (dark) and `#d42b40` (light) is used as the only saturated hue. CTAs, accents, stat sparklines, map dots, and shield rims all read as the same red. The 60-30-10 rule holds: ~60% near-black surfaces, ~30% text/muted greys, ~10% red. Red does not get noisy; it stays rare enough to mean something.

The `var(--cyan)` token is defined as `#7dd3fc` but I see no place in the rendered surface where cyan is used. Dead token. Light-mode `--cyan: #0369a1` is also defined but unused. Both should be removed or used with intention.

**What weakens color voice:** the gradient washes on the product catalog card and the open-source section card (`linear-gradient(135deg, color-mix(...accent-brand 8-10%...), transparent 50%)`) are decorative and add a subtle "polish" feel. They do not hurt, but they do not help. The services copy card has a yellow gradient wash (`radial-gradient(ellipse at 0% 0%, rgba(250, 204, 21, 0.08), transparent 54%)`) — yellow is the only color that breaks the red-mono palette, and it is decorative only. **Remove it.** The yellow ref is a single line, easy to delete.

**Fix:** Remove the yellow gradient wash on the services copy. Remove unused `--cyan` and `--success` tokens (or use them deliberately). The red-mono palette is the strongest visual decision; protect it.

## Type Voice

Manrope (sans) + JetBrains Mono (mono). Manrope is the 2024–2026 default sans — every Vercel/Next.js landing ships it. JetBrains Mono is the 2024–2026 default developer mono. Both are defaults, not choices. There is no type voice.

A privacy-first open-source company building Android, desktop, and security tools needs a type voice that signals "we engineer for a living." The current type signals "we hired a designer who uses a system that picked Manrope for us."

The mono is doing real work on `// SERVICES`, `2024 → 2026`, and the stat eyebrows. Keep the mono. Replace the sans with a family that has a project-specific reason. Candidates:

- **Söhne / Söhne Mono** — Klim's commercial family, used by Linear and a handful of design-led engineering companies. Sets a serious technical tone. (Klim, paid.)
- **GT America** — Grilli Type, used by Vercel-adjacent projects. Sharp, slightly geometric. (Paid.)
- **Switzer** — Indian Type Foundry, free for commercial use, sharp humanist sans with a "designed, not assembled" feel.
- **Geist** + **Geist Mono** — Vercel's own. The replacement of Manrope for the 2026 cohort. Free.
- **Inter** + **JetBrains Mono** — staying with the default but tuning scale, weight, tracking, and reducing weight contrast properly. Acceptable, not strong.
- **PP Editorial New** (serif) on the hero + **Inter** body — editorial-led brand voice. Would land well for a privacy company that wants to feel "we think about this" rather than "we ship this." (Pangram Pangram, paid.)

**Recommended:** Geist + Geist Mono. Free, shipped by Vercel, technically serious, and clearly different from the 2024–2025 Manrope cohort. If the user wants a stronger shift, PP Editorial New on the hero with Geist on body. Either keeps the mono for axis labels.

**Score:** 3 / 10. The current type does not carry a voice.

## Interaction Feel

The interaction surface is rich and has real decisions:

- **External-nav confirmation dialog** — every outbound link goes through a confirm-then-transition flow. This is a real, opinionated interaction. The 520ms transition overlay is a nice touch. The Cancel/Continue buttons are the right pattern.
- **Theme toggle** — sun/moon icon, switches dataset and class. Light mode is fully realized.
- **Sticky pill header** — wide nav, account button, theme toggle, mobile menu trigger. Works.
- **Stat count-up** — IntersectionObserver triggers an easeOutExpo from 0 to value. Real number animation, not a CSS trick.
- **Map markers** — hover/focus triggers a tooltip with the country name. Pin pulse animation runs continuously.
- **Hero shield recoil + impact + bolt** — full CSS/SMIL animation chain synced to the arrow visibility window. The shield "feels" hit, then returns.
- **Avatar mascot** — eyes track the mouse, body bounces on a GSAP timeline, blink timer is randomized, hit-rig reacts to a `fadsec:hero-hit` event. Real character.
- **Mobile menu** — full-screen overlay with large type. Fades in via opacity + visibility. No layout shift.

**What weakens interaction feel:**

1. **The hero custom crosshair cursor** — `cursor: none` + a fixed-position SVG that updates on mousemove. The SVG is pointer-events: none and lives at z-index 80, same as the sticky header. On touch input, the cursor is irrelevant; on keyboard, it never appears. The cursor is also the only part of the hero that requires the user's mouse to be in the hero region. If the user has scrolled, it disappears. The pattern is decorative. The "fadsec:hero-hit" event that should fire when the shield is hit is not wired to any visible source in `App.tsx` or `HeroShield.tsx` from what I read — the Avatar listens for it but nothing dispatches it. **Either wire it or remove the listener.**

2. **Avatar mascot as the audio on/off control** — the taste file mentions this. I see a `<Avatar />` component in the footer with eye-tracking and idle motion. I see no audio on/off implementation in the component. The mascot doubles as the audio toggle in the project's stated design intent, but the code does not reflect that. **Either implement the audio toggle on the avatar, or remove the claim.**

3. **Stat number is animated, but the chart is animated only on first view** — re-scrolling back up does not re-trigger the count-up. Acceptable for now, but worth noting.

4. **The contact dialog** opens with "Mail" and "GitHub" buttons that are themselves buttons (Mail goes to mailto, GitHub goes to the confirm-then-open flow). The "Mail" entry should be an `<a href="mailto:...">`, not a `<button>`, to give users the right-click "copy email" affordance. Looking again — it is `<a href="mailto:contact@fadseclab.com" className="contact-entry">`, good. The GitHub one is a button that calls `queueExternalNav`, which is correct.

5. **The map tooltip** is rendered via `<foreignObject>` and only appears on hover/focus, not on click. The "open in a new tab" pattern does not apply here. Fine.

6. **The footer wordmark hover-slide** is a 2018-era trick. See smell P2.

7. **No skip-to-content link.** The first tab from the top of the page lands on the brand lockup. There is no skip-to-main link. Should add one for keyboard users.

**Score:** 3 / 10. The interaction surface is rich but has dead/decorative elements and the audio claim is unverified.

## What I Recommend

Ordered by impact:

1. **Type:** Replace Manrope with a deliberate sans (Geist, Switzer, or Söhne). Keep JetBrains Mono for axis and meta. This is the single biggest visual lift. → `/design deslop` then `/design typeset`.

2. **Composition:** Break the services feature-tile grid. Lead the Android service. Demote the rest. Replace the stat-monument opening of the proof band with a press-credible proof artifact. → `/design relayout`.

3. **Footer wordmark:** Replace the hover-slide trick with an intentional treatment — a pressed-stamp, a flagged shield silhouette, or a one-line mono transcript. → `/design voice`.

4. **Interaction cleanup:** Remove the hero custom cursor pattern (or gate it heavily to fine pointer + no reduced motion + 780px+). Either wire the `fadsec:hero-hit` event or remove the listener. Add a skip-to-content link. Add `aria-label` to map markers. → `/design interaction`.

5. **Color hygiene:** Remove the yellow gradient wash on services copy. Remove unused `--cyan` and `--success` tokens (or use them). → `/design recolor` as a small pass within deslop.

6. **Stat hierarchy:** Add a "As featured in" press strip (CNN) above the metric band. Lead proof, not the user count.

## Prompt Drift

- **Name:** "FadSec Lab" exact, in title, h1, header, footer, schema.org JSON-LD, og:title, twitter:title. ✓
- **Category:** "Privacy-first FOSS software company" — visible in hero badge, h1 tagline, schema.org description. ✓
- **Domain artifact:** FadCam (real flagship product, real URL), CNN coverage (real, real URL), GitHub org (real). ✓
- **Evidence:** The stat band claims "150K+ Users trust us" — verifiable on GitHub stars + downloads but not shown in-source. The "51+ Countries" claim is supported by the world map. The CNN mention is on the product page (FadCam), not on the homepage — the homepage should surface this more prominently.
- **Drift:** None on the *what*. The drift is on the *how*: default type, default grid, default wordmark trick, default stat monument. The product is not generic; the surface is.

## Next Modes

- `/design deslop` — run now; the slop is structural.
- `/design interaction` — after deslop, refine the cursor, the audio claim, focus restoration.
- `/design voice` — footer wordmark + hero copy tightening.
