import { chromium } from 'playwright';
import { preview } from 'vite';
import { readFileSync, readdirSync, mkdirSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

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

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, html, 'utf-8');

  const displayPath = outputPath.replace(distDir, 'dist');
  console.log(`  ✓  ${route.padEnd(30)} ${displayPath}`);
}

await browser.close();
await server.close();

console.log(`\n  ✓ Prerendered ${routes.length} pages to dist/\n`);
