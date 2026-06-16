# Smell Report — FadSec Lab

**Mode:** smell
**Project:** fadseclab.com
**Date:** 2026-06-16
**Surface audited:** Marketing landing page (`src/App.tsx` + `App.css`, `index.css`, `HeroShield`, `Avatar`, `ui/*`)

## Overall

**Score:** 4 / 10 — STRONG
**Verdict:** IDENTITY DRIFT (faint but real) — direction is set, but several systems fall back to SaaS-template reflexes.

The site has a strong domain-specific color lane (brand red, not generic indigo) and a real visual idea (shield under attack). That said, the supporting systems — type, footer wordmark, "icon + heading + sentence" service grid, and the stat monument — read as assembled from the median generated landing page.

## TL;DR

FadSec Lab's strongest decision is refusing the blue-violet AI-startup reflex; the brand red + wireframe-shield combo is a real lane. The page then drifts on three systems: it falls back to a default geometric sans (Manrope, now the de-facto "Inter" of 2024–2026), the services section is an icon-topper feature-tile grid, and the footer/wordmark plays a hover-reveal trick that is now standard issue. Type voice and a few composition moves need to be replaced with project-specific decisions. Composition is mostly centered-stack — acceptable for the decide job, weak everywhere else.

## Heuristic Scores

| # | Heuristic | Score | Key Finding |
|---|---|---|---|
| 1 | Tech gradient (blue-violet / indigo-cyan / purple-teal) | 1 / 1 (absent) | Brand red `#e8334a` is the only saturated hue. No indigo, no teal, no purple-pink gradient anywhere. |
| 2 | Generic tech hue (blue-purple primary) | 1 / 1 (absent) | Primary is a saturated red, not blue. The "security-company-blue" reflex is actively avoided. |
| 3 | Feature tile grid (icon, heading, one sentence, repeated) | 0 / 1 (detected) | `.service-grid` is three identical cards: icon, h3, paragraph. The three service cards are interchangeable, none is prioritized. |
| 4 | Accent rail (colored stripe pretending to be structure) | 1 / 1 (absent) | No side rails. Decoration is gradient washes on cards, not stripes simulating structure. |
| 5 | Unearned blur (frosted glass without depth system) | 0 / 1 (detected) | `.site-header` uses `backdrop-filter: blur(22px)` on a floating pill; `.mobile-menu` uses blur over a flat bg. The blur is decorative, not earned by a real z-axis surface. |
| 6 | Stat monument (oversized number cluster) | 0 / 1 (detected) | The proof band is two 4xl stat numbers + chart sparklines; the page opens onto a "150K+ users" monument-style stat with no narrative before it. |
| 7 | Icon topper (rounded-square icon above every heading) | 0 / 1 (detected) | Service cards lead with a 28×28 icon, mini-map card leads with a Globe2 icon; product feature leads with a 52×52 icon. Every section introduces itself with an icon, never a domain artifact. |
| 8 | Bounce everywhere (elastic/overshoot easing) | 1 / 1 (absent) | Easing is `power3.out`, `cubic-bezier(0.23, 1, 0.32, 1)`, `easeOutExpo`. No spring/elastic. |
| 9 | Default type (a common family with no voice) | 0 / 1 (detected) | Manrope + JetBrains Mono. Manrope is now the default "design-y" sans; it is the 2024–2026 Inter replacement. JetBrains Mono is the default "developer-y" mono. Both are defaults, not choices. |
| 10 | Center stack (everything aligned to the safe middle) | 0 / 1 (detected) | Hero is centered. Proof band is centered on its 2-col grid. Footer wordmark is centered. The whole site reads as a centered column with side ornaments. |

**Total:** 4 / 10. Detected: feature tile grid, unearned blur, stat monument, icon topper, default type, center stack.

## What's Working

- **Refusal of the blue-violet reflex.** Brand red `#e8334a` is loaded as `--accent-brand` and used as the only saturated hue across the page. This single decision separates FadSec Lab from the median "developer / security" landing page.
- **Shield-under-attack hero artifact.** A SVG shield with a flag texture being hit by named arrows is a project-specific proof object. It is not a generic "office workspace" or "dashboard preview" mock.
- **Mono labels for "eyebrows" and stat axis.** Mono for `// SERVICES`, `// OPEN-SOURCE PORTFOLIO`, `2024 → 2026` is a domain-correct choice for a developer-tooling company.
- **Light-mode parity.** Light theme is fully realized with its own red (`#d42b40`), map land colors, and shadow stack. Not a dark-mode-only design with a `prefers-color-scheme` afterthought.
- **External-nav confirmation pattern.** Open external link in a new tab → confirm dialog → transition overlay. This is a real interaction decision, not a template reflex.
- **Zero-telemetry stat.** `stat-chart--zero` renders a flat dashed line labeled "no telemetry" — a chart that says "there is no chart here" is a memorable, on-brand choice.

## Priority Issues

### P0 — Default type with no voice

**Visible at:** `index.css` line 1, `index.css` `@theme inline` block.

```css
@import url('...Manrope:wght@300;400;500;600;700;800...JetBrains+Mono...');
--font-sans: 'Manrope', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', ...;
```

**Why it weakens this brief:** A privacy-first open-source company building security and Android tools needs a type voice that signals "we engineer for a living" — not the same face every Vercel-deployed landing page ships in 2026. Manrope reads as "design system" rather than "engineer." JetBrains Mono is the safe developer-mono default.

**Right mode to fix:** `/design typeset` — pick a type pair that earns its place. Candidates that fit the brief better than Manrope: a humanist workhorse (Inter Display is too default; consider Söhne, Inter Tight, GT America, Söhne Mono pairing); a sharper alternative (Geist, Geist Mono; or Switzer + JetBrains); or a serif-led brand for editorial weight (Fraunces or PP Editorial New for the hero, JetBrains retained for axis labels).

**Fix:** Replace the import. Keep weights tight. Use a single mono family for axis and metadata.

### P0 — Feature tile grid in the services section

**Visible at:** `App.tsx` `.service-grid` block. `App.css` `.service-grid { grid-template-columns: repeat(3, 1fr); }`.

**Why it weakens this brief:** Three identical cards, each with: icon top-left, h3, paragraph. This is the canonical "our services" tile layout from every agency site since 2014. The icons (`Smartphone`, `Layers3`, `Bot`) are Lucide defaults. The cards are equal, so nothing is prioritized. The reader has to scan three identical blocks and infer ordering.

**Right mode to fix:** `/design relayout` — break the equal-grid reflex. Try a stacked editorial layout: lead with one flagship service (Native Android) in detail, then two compact rows for the rest. Or replace the grid with a "what we do / how we do it" split where the icon moves into a process step rather than a category label.

**Fix:** Demote the grid. Make the Android service the lead; collapse the other two into a single column row.

### P1 — Stat monument before proof

**Visible at:** `App.tsx` `metric-band` block. `App.css` `.metric-band` renders two 4xl stat signals as the first thing after the hero.

**Why it weakens this brief:** "150K+ users trust us" landing immediately on the proof band is the SaaS stat-monoment reflex. The product is privacy-first FOSS — the number is the *least* interesting part of the story. The interesting parts are: zero trackers, public source, on-device recording, real-world press coverage. Right now the layout buries the proof (CNN press mention, public source code) below the stat.

**Right mode to fix:** `/design relayout` — lead proof, not stats. Put the press-credible artifact (CNN coverage, GitHub stars) and the zero-tracker stat up first; demote the 150K+ number to a footer line.

**Fix:** Swap stat order. Add a press-credible element (a "As featured in" press strip or a single quote attribution) above the metrics.

### P1 — Unearned blur on the floating header

**Visible at:** `App.css` `.site-header` rule. `backdrop-filter: blur(22px)` on a `color-mix(... 90%, transparent)` pill, with a 1px border and a `box-shadow`.

**Why it weakens this brief:** The page does not establish a 3-plane depth system (background canvas → content → attention plane) where blur would be earned. The header is just a sticky pill with a frosted glass treatment because frosted glass is what modern navs look like. The mobile menu also uses `backdrop-filter: blur(24px)` over a flat background.

**Right mode to fix:** `/design interaction` — give blur a reason. Either commit to a real depth system (canvas / content / overlay planes, with the header belonging to the overlay plane and the rest of the page being content) or drop the blur and let the header be a solid pill that matches the rest of the surface language.

**Fix:** Pick one direction. Either solid pill or commit to full overlay-plane treatment across the site.

### P2 — Center stack across the whole page

**Visible at:** Hero (`place-items: center`), proof band (`grid-template-columns: 1fr` then `repeat(2, 1fr)`), footer wordmark (`text-align` and centered mascot).

**Why it weakens this brief:** The hero is a "Decide" surface — centered is correct there. But the proof band, the product section, and the services section all default to a centered column or a 2-col grid that visually centers. The result is a page that always looks the same. The work-pattern for proof is "compare" (show evidence against alternatives) and for products is "operate" (let users inspect the artifact). Both want asymmetric, not centered, layouts.

**Right mode to fix:** `/design relayout` — give each section a composition that matches its job. Hero stays centered. Proof becomes a left-rail evidence column + right-rail map. Products becomes a flagship-card + catalog-strip row. Services becomes a single lead paragraph + a one-line roster.

**Fix:** Apply asymmetric composition per section. Keep hero centered; change everything else.

### P2 — Footer wordmark hover-reveal

**Visible at:** `App.css` `.footer-wordmark`, `.wm-front`, `.wm-back` rules. CSS-only translateY hover swap.

**Why it weakens this brief:** A wordmark that slides up to reveal the second line on hover is a 2018-era brand-site trick. It is now seen on every agency portfolio and on Vercel/Linear-style landing pages. FadSec Lab has a real wordmark ("FadSec Lab" with a flag icon in the header); the footer should not repeat the trick in a louder way.

**Right mode to fix:** `/design voice` or `/design refine` — pick a footer treatment that belongs to the brand. A pressed-stamp wordmark, a one-line tagline, a monospace transcript of the company's repo count, or a flagged shield silhouette at footer scale. Anything that is not the hover-slide.

**Fix:** Replace the hover reveal with a single, intentional footer wordmark treatment.

## What I Refuse To Call Out

- The brand red is not a smell. It is the strongest decision on the page. Do not "diversify" the palette into a typical SaaS 5-hue system.
- The shield SVG hero is not a smell. It is a project-specific proof object. Do not replace it with a 3D scene or a product screenshot.
- The Manrope / JetBrains Mono combo is a smell *together* (both are 2026 defaults), but if you keep one, keep the mono. The mono is doing real work on axis labels and stat eyebrows.
- The "centered hero" itself is not a smell. The hero is a "Decide" surface and centered is the right answer there.

## Drift Check

- **Name:** "FadSec Lab" used correctly in title, header, footer, schema.org JSON-LD. No drift.
- **Category:** "Privacy-first FOSS software company" — visible in hero badge. Matches `index.html` description. No drift.
- **Domain artifact:** FadCam (real flagship), public source code, CNN coverage. All real. No drift.
- **Inherited copy:** Hero headline "Privacy today, tomorrow, forever." is a brand tagline (in title, JSON-LD slogan, and hero). It is not a generic SaaS headline. No drift.
- **Reflex adoption:** Tailwind CSS via shadcn-style component primitives, `class-variance-authority`, `lucide-react`, `framer-motion`, `gsap`, `react-simple-maps`, `three` — this is the 2024–2026 React landing-page stack. The library choices are defaults, not smells, but they should be acknowledged: anyone cloning this stack will reproduce the same look by accident.

## Next Modes

- `/design typeset` — fix the default type.
- `/design relayout` — break the center stack, break the feature tile grid, demote the stat monument.
- `/design voice` — replace the footer wordmark hover trick and tighten hero copy.
- `/design interaction` — decide if the frosted header blur is earned or should be dropped.
