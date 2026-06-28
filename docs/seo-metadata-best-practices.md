# SEO & Social Metadata Best Practices

Quick reference for writing blog post frontmatter and maintaining metadata on fadseclab.com.

---

## Title (`title`)

- **Sweet spot:** ≤ 60 characters (Google truncates at ~60, X/LinkedIn at ~68).
- Include the primary keyword near the start.
- Format: `Short Product Name — Descriptive Hook`

**Example:**
```
title: "FadCam for iOS — 100 Promo Codes Giveaway"  # 47 chars ✅
```

**Avoid:**
```
title: "FadCam Launches on iOS — 100 Promo Codes Giveaway"  # 67 chars ❌
```

## Description (`description`)

- **Hard limit:** ≤ 125 characters (social previews truncate at ~125 on mobile).
- Write a complete sentence, not keyword soup.
- Tone: professional, informative. No clickbait phrasing.

**Example:**
```
description: "FadCam launches on iOS — open source dashcam, bodycam, and privacy-first video recorder. 100 promo codes available."  # 124 chars ✅
```

**Avoid:**
```
description: "FadCam is now available on iOS — an open source video recorder for dashcam, bodycam, and privacy-first recording. Celebrating with 100 promo codes."  # 147 chars ❌
```

## Open Graph Image (`ogImage`)

- **Exact dimensions:** `1200 × 630` px. This is not flexible — X, LinkedIn, Discord, Slack all expect exactly 1200×630.
- Aspect ratio: `1.91:1`
- Format: PNG or JPG (PNG preferred for text-heavy images)
- Place in `public/blog-images/{slug}/`
- Path in frontmatter is relative to public root: `/blog-images/{slug}/launch.png`

**Fixing an image that's off by a few pixels:**
```bash
# Resize with ImageMagick — adds black padding to hit exact 1200×630
convert input.png -gravity center -background black -extent 1200x630 output.png
```

The SSG plugin injects `og:image:width` and `og:image:height` meta tags automatically.

## Frontmatter Template

```yaml
---
title: "Under 60 characters"
badgeTitle: "Short badge text (optional)"
date: "YYYY-MM-DD"
description: "120–150 chars, professional tone"
slug: "post-url-slug"
featured: false
author: "FadSec Lab"
ogImage: "/blog-images/{slug}/image.png"
---
```

## Checklist Before Publishing

| Field         | Rule                            | Limit     |
| ------------- | ------------------------------- | --------- |
| `title`       | Include keyword, ≤ chars        | 60        |
| `description` | Complete sentence, professional | ≤ 125     |
| `ogImage`     | Exact dimensions                | 1200×630  |
| `slug`        | lowercase, hyphens only         | —         |
| `date`        | ISO format                      | YYYY-MM-DD|

## Where Metadata Lives

| Layer          | What it does                                       | File                                  |
| -------------- | -------------------------------------------------- | ------------------------------------- |
| Frontmatter    | Source of truth for each post                      | `src/content/blog/{slug}.md`          |
| SSG (build)    | Generates static HTML with `<meta>` tags per post  | `vite.config.ts` → `buildBlogPageHtml()` |
| Client (SPA)   | Updates `<meta>` at runtime during navigation      | `src/pages/BlogPage.tsx` → `useBlogSEO()` |
| Home page      | Default OG tags for `/`                            | `index.html`                          |
| Listing page   | Default OG tags for `/blog`                        | `vite.config.ts` SSG listing          |
