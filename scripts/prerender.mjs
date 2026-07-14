import { chromium } from 'playwright';
import { preview } from 'vite';
import { readFileSync, readdirSync, mkdirSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

// ── Route metadata (title, description, canonical, og tags) ─────────────────

const SITE_URL = 'https://fadseclab.com';

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildHeadTags(title, description, url, type = 'website', ogImage = '/og-image.png') {
  const fullUrl = `${SITE_URL}${url}`;
  const imageUrl = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`;
  return `
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${escapeHtml(fullUrl)}">
<meta property="og:site_name" content="FadSec Lab">
<meta property="og:type" content="${escapeHtml(type)}">
<meta property="og:url" content="${escapeHtml(fullUrl)}">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:image" content="${escapeHtml(imageUrl)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(description)}">
<meta name="twitter:image" content="${escapeHtml(imageUrl)}">`;
}

function routeMeta(route) {
  if (route === '/') return buildHeadTags(
    'FadSec Lab - Privacy today, tomorrow, forever.',
    'Anti-adversary, open-source software for Android, iOS, desktop. No tracking, no telemetry, production-grade engineering.',
    '/',
  );
  if (route === '/privacy') return buildHeadTags(
    'Privacy Policy — FadSec Lab',
    'Privacy policy for FadSec Lab products and services. No tracking, no telemetry, your data stays yours.',
    '/privacy',
  );
  if (route === '/terms') return buildHeadTags(
    'Terms and Conditions — FadSec Lab',
    'Terms and conditions governing the use of FadSec Lab software, services, and website.',
    '/terms',
  );
  if (route === '/blog') return buildHeadTags(
    'Blog — FadSec Lab',
    'Release notes and product updates from FadSec Lab.',
    '/blog',
  );
  if (route === '/404') return buildHeadTags(
    '404 — Page Not Found | FadSec Lab',
    'The page you are looking for does not exist.',
    '/404',
  );
  if (route.startsWith('/blog/')) {
    const slug = route.replace('/blog/', '');
    const blogDir = resolve(rootDir, 'src/content/blog');
    if (existsSync(blogDir)) {
      const files = readdirSync(blogDir).filter(f => f.endsWith('.md'));
      for (const file of files) {
        const raw = readFileSync(resolve(blogDir, file), 'utf-8');
        const { data } = matter(raw);
        if (data.slug === slug) {
          return buildHeadTags(
            `${data.title} — FadSec Lab Blog`,
            data.description || '',
            route,
            'article',
            data.ogImage || undefined,
          );
        }
      }
    }
  }
  return buildHeadTags('FadSec Lab', '', route);
}

function injectHeadTags(html, route) {
  const tags = routeMeta(route);
  // Remove existing title, canonical, meta description, og/twitter tags
  let result = html;
  result = result.replace(/<title>[^<]*<\/title>/, '');
  result = result.replace(/<meta\s+name="description"[^>]*>/i, '');
  result = result.replace(/<link\s+rel="canonical"[^>]*>/i, '');
  result = result.replace(/<meta\s+(property|name)="(og:|twitter:)[^"]*"[^>]*>/gi, '');
  // Inject new tags before </head>
  result = result.replace('</head>', `${tags}</head>`);
  return result;
}

// ── Discover all routes ─────────────────────────────────────────────────────

const staticRoutes = ['/', '/privacy', '/terms', '/blog', '/404'];

const blogDir = resolve(rootDir, 'src/content/blog');
const blogSlugs = [];
if (existsSync(blogDir)) {
  const files = readdirSync(blogDir).filter(f => f.endsWith('.md'));
  for (const file of files) {
    const raw = readFileSync(resolve(blogDir, file), 'utf-8');
    const { data } = matter(raw);
    if (data.slug) blogSlugs.push(data.slug);
  }
}

const routes = [
  ...staticRoutes,
  ...blogSlugs.map(slug => `/blog/${slug}`),
];

// ── Prerender ───────────────────────────────────────────────────────────────

const distDir = resolve(rootDir, 'dist');

console.log(`\n  Starting preview server...`);
const server = await preview({
  root: rootDir,
  preview: { port: 4173, host: '127.0.0.1' },
});

console.log(`  Launching browser...`);
let browser;
try {
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  console.log(`  → using system Google Chrome`);
} catch {
  browser = await chromium.launch({ headless: true });
  console.log(`  → using Playwright bundled Chromium`);
}

const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

console.log(`\n  Prerendering ${routes.length} routes:\n`);

for (const route of routes) {
  const url = `http://127.0.0.1:4173${route}`;

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });

  // Wait for MilitaryLoader to finish and real content to appear
  try {
    await page.waitForSelector('.site-header', { state: 'attached', timeout: 15000 });
  } catch {
    console.warn(`  ⚠  timeout waiting for .site-header on ${route}`);
  }

  // Let GSAP/Framer animations settle + async content render
  await page.waitForTimeout(3000);

  const html = await page.content();

  const outputPath = route === '/'
    ? resolve(distDir, 'index.html')
    : route === '/404'
    ? resolve(distDir, '404.html')
    : resolve(distDir, route.slice(1), 'index.html');

  const finalHtml = injectHeadTags(html, route);

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, finalHtml, 'utf-8');

  const displayPath = outputPath.replace(distDir, 'dist');
  console.log(`  ✓  ${route.padEnd(30)} ${displayPath}`);
}

await browser.close();
await server.close();

console.log(`\n  ✓ Prerendered ${routes.length} pages to dist/\n`);
