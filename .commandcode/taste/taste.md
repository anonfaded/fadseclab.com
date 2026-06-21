# Workflow
- Do not run build, dev, or other npm/pnpm scripts — only edit files and make code changes. Confidence: 0.75

# Package Manager
- Use `pnpm` for this project, never `npm`. Confidence: 0.90
- When a dependency install fails, fix the underlying tool/postinstall issue instead of skipping the package. Confidence: 0.85

# Workflow Safety
- Never run destructive git commands (`git commit`, `git push`, `git reset`, `git checkout --`, `git stash` without prior approval, etc.) without explicitly asking the user first. Always confirm before mutating repository state. Confidence: 0.95

# UI/UX Direction
- Keep the landing page minimal and clean. Reject cluttered backgrounds, "junk" decorative layers, grid patterns in the hero, and full-bleed red glow washes. Confidence: 0.85
- For beta/WIP badges on buttons, position them as a small top-right overlay badge (not inline inside the button text). Use green for beta status indicators. Confidence: 0.70
- Hero must be full-width (no nested rounded card on top of the page background). Section backgrounds are owned by each section, not the body. Confidence: 0.85
- Use the brand red as the primary accent color across the site (hero, CTAs, stats, badges, etc.). Avoid blue/violet accents. Confidence: 0.80
- Prefer lighter, performance-friendly implementations over heavy 3D/WebGL on the hero. Three.js-style scenes are not desired for this project. Confidence: 0.75

# Component Library
- Build UI from shadcn-style components (`Card`, `ChartContainer`, `Button`, `Badge`, `Dialog`, etc.). Avoid custom one-off components that duplicate shadcn patterns. Confidence: 0.80
- Use Context7 to discover the best matching component from a UI library for a given need (e.g. stats → chart components) before building custom. Confidence: 0.75
- Extract `*Variants` cva helpers into separate files (e.g. `button-variants.ts`, `badge-variants.ts`) so component files only export components. This keeps `react-refresh/only-export-components` lint clean. Confidence: 0.80
- Use `lucide-react` icons for buttons, nav, stats, and section affordances. Plain text labels alone feel generic. Confidence: 0.70

# Hero Visual
- Hero centerpiece: a shield (with the FadSec Lab flag texture inside it) is hit by named threat arrows (e.g. trackers, spyware, data brokers) fired from a launch rack/table on the left. Arrows follow arced motion paths and impact the shield in sync. Confidence: 0.75
- Arrow hit timing and shield recoil must align to the same keyframe; desynced hits are a regression. Confidence: 0.70
- Hero shield is rendered as SVG with CSS/SMIL motion (wireframe pattern, flag texture, impact surges) rather than a heavy 3D/WebGL scene. Performance stays light while still feeling "physics-based". Confidence: 0.70

# Avatar Mascot
- The mascot avatar is pinned to the bottom-right of the viewport, anchored to the bottom edge (body touches the bottom, not floating mid-screen). Its eyes track the mouse cursor. Confidence: 0.70
- The avatar doubles as the audio on/off control (gamified mute toggle on hover/click). Do not expose a separate audio button. Confidence: 0.65

# Motion and Sound
- Stat numbers must animate (count up) rather than render statically. Confidence: 0.70
- Add subtle sound effects for menu open/close and nav link hovers (muted by default, toggled via the avatar). Confidence: 0.65

# Copy and Tone
- Use professional, SEO-optimized, sales-oriented copy on the landing page. Phrasing should sound like a real company, not generic "Hire us" or odd bullet lists. Confidence: 0.75
- Avoid labels like "Real-world proof" — they read as robotic. Section headings should sound like a real company speaking. Confidence: 0.65
- Prefer concise, plain language. Drop filler words. (User asked for "caveman mode ultra" once for terse responses.) Confidence: 0.55

# Design Audit Workflow
- Run design audit commands (`/design smell`, `/design checkup`, `/design review`) as discrete report-only passes. They produce `.commandcode/design/*.md` and `.html` artifacts only — no fixes in the same turn. Confidence: 0.85

# Product Taxonomy
- "FadSec ID" / auth / accounts is the sign-in/sign-up entry, not a service or product. Do not list it under Services or Products on the landing page. Confidence: 0.70

# Visual Quality Bar
- The site should feel like an Awwwards-grade, industry-standard SaaS landing page: distinct visual variety per section, modern minimal typography, responsive across all screen sizes. Confidence: 0.80
- Mobile and light-mode parity with dark mode is required. Do not ship a layout that works in one theme/viewport but breaks in another. Confidence: 0.80
- Reject boring 3-up feature-tile grids, generic gradient cards, and "dumping" content (project lists, stat tiles). Sections should have distinct composition matched to their work pattern (operate, compare, decide, monitor, etc.). Confidence: 0.85
- Lean into the corner-bracketed wireframe / report-style aesthetic for section containers, table rows, and stat blocks rather than soft rounded cards. Sharp, framed, intentional. Confidence: 0.75

# Service and Product Catalog
- Services must explicitly cover: native Android, native iOS, cross-platform Flutter, and desktop apps (macOS, Windows, Linux). Do not collapse mobile to Android-only or omit desktop. Confidence: 0.80
- Do not list projects / product names in a flat "dump" list. Each item needs context, status, or framing — not a raw enumeration. Confidence: 0.75
- In the services section, explain the offering in copy rather than dumping "Stack / What you get" as terse table cells. Engage users with a narrative, not a spec sheet. Confidence: 0.75
- In the product section, feature the flagship product with a real photo/asset (e.g. the pilot pic) and describe use cases (documentation, safety, etc.), not release-version tables. Link out to GitHub for the rest. Confidence: 0.70

# Loading Screen
- Loading screens must be "very minimal fast and modern" — no bloated multi-phase animations, progress bars, sigils, dossier themes, or extended sequences. A simple, lightweight, fast-dismissing indicator is preferred. The loading screen must actually preload/wait for real resources to load (not just run a cosmetic timer) so the website appears instantly when dismissed. Use the complete brand name (e.g. "FADSEC LAB", not abbreviated "FADSEC"). Confidence: 0.75

# Design Iteration
- When the user says "i liked the old X" or "old Y was better", preserve the prior version of that element instead of redesigning it. Do not redesign components the user is happy with. Confidence: 0.85
- Avoid replacing existing, working assets (photos, maps, icons) with abstract data tables or placeholder visuals during a redesign. If the old asset is in use, keep using it. Confidence: 0.80
- Don't double up headings inside headings. A `// SHIP RATE` label stacked directly above an "MVP in 14 days." headline reads as redundant. Pick one labeling pattern per region. Confidence: 0.70
- When restoring a prior design, "enhance" rather than "revert literally". Build on top of the restored element (add the wireframe/blueprint treatment, sharper fonts, etc.) instead of dropping it back in unmodified. Pure revert reads as throwing out the new work. Confidence: 0.70
- When restoring a footer/header to its prior design, keep it visually consistent with the rest of the site's aesthetic (corner brackets, mono sigils, blueprint treatment). A reverted element that visually clashes with the surrounding design is incomplete. Confidence: 0.70

# Content Tone
- Avoid being too direct/blunt across the page. Use narrative, engaging copy that explains context and "why", not just labels and data. The user described the prior redesign tone as "too direct everywhere". Confidence: 0.75
- In the "users trust us" / trust section, include a short explanatory line alongside the proof visuals. Pure data without context feels hollow. Confidence: 0.65
- For an open-source / "we work in public" stance section, lead with the stance and philosophy, not the repository count. The count supports the stance, not the other way around. Confidence: 0.70

# Motion
See [motion/taste.md](motion/taste.md)
# Typography
- Treat font choice as a first-class decision for this security/SaaS-feeling project. Pair a strong display sans for headings with a mono for labels and a clean sans for body. The current token set is not the final answer — iterate the font combination rather than defaulting to the existing stack. Confidence: 0.70

# Avatar Mascot
- The avatar mascot is no longer an audio on/off toggle. It is purely decorative. Remove audio-toggle framing/claims from the design and copy. Confidence: 0.75

# Footer
- Footer must include a copyright line with the year range (e.g. © 2024–2026 FadSec Lab). Confidence: 0.75
- The user prefers the previous footer design over the redesigned dossier/table-style footer. Revert to the prior footer treatment rather than keeping the new one. Confidence: 0.75

# Header and Nav
See [header-and-nav/taste.md](header-and-nav/taste.md)
# Typography
- Treat font choice as a first-class decision for this security/SaaS-feeling project. Research and propose proper font combinations (cyber-security / SaaS / Swiss style) instead of iterating on the existing stack. Pair a strong display sans for headings with a mono for labels and a clean sans for body. Confidence: 0.80
- The brand wordmark name should be set in a unique, distinctive display font — not the same body/heading face. The wordmark is a brand asset, not just text. Use the same distinctive font family as the account button (e.g. FADSEC ID label), not the body/UI sans. The wordmark should NOT be set in plain body sans — it reads as weak/odd. The "Lab" suffix in brand red works well; keep that treatment. Confidence: 0.85

# Hero
- Remove the `// LIVE THREAT GRAPH` label above the hero shield. It reads as forced/awkward. If no fitting label exists, leave the shield unlabeled. Confidence: 0.70

# CSS Selector Specificity
- Avoid broad descendant selectors (e.g. `.hero-section h1 span`) that override component-level class styling like `wordClassName`. Use targeted class selectors scoped to the specific element, not blanket tag selectors that leak across all children. Confidence: 0.70

# Capabilities / Trust Section
- The "capabilities" framing as 01/02 Native platforms + Reach was wrong. This section is the "users trust us" / social-proof section. Lead with a world map or per-country markers showing where users are, and a short copy line about why they trust the product. Confidence: 0.80
- The world map showing user countries is important proof. Do not remove it in a redesign — it shows real global reach. Confidence: 0.80
