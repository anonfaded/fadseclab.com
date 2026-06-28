import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'
import { createRequire } from 'module'
import { blogPlugin } from './src/vite-plugin-blog'

const require = createRequire(import.meta.url);

// ── Blog static HTML generation (build-time SSG for crawlers) ──────────────

interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  ogImage?: string;
}

function readBlogPosts(): BlogPostMeta[] {
  const blogDir = path.resolve(__dirname, 'src/content/blog');
  try {
    const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.md'));
    const matter = require('gray-matter');
    return files
      .map((f) => {
        const raw = fs.readFileSync(path.join(blogDir, f), 'utf-8');
        const { data } = matter(raw);
        return { slug: data.slug, title: data.title, description: data.description, date: data.date, ogImage: data.ogImage ?? undefined };
      })
      .filter((p: BlogPostMeta) => p.slug && p.title)
      .sort((a: BlogPostMeta, b: BlogPostMeta) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch {
    return [];
  }
}

function buildBlogPageHtml(baseHtml: string, title: string, description: string, url: string, type: string, ogImage?: string): string {
  const imageUrl = ogImage ? `https://fadseclab.com${ogImage}` : 'https://fadseclab.com/og-image.png';
  const metaBlock = `
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="${escapeHtml(url)}">
<meta property="og:type" content="${escapeHtml(type)}">
<meta property="og:site_name" content="FadSec Lab">
<meta property="og:image" content="${imageUrl}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(description)}">
<meta name="twitter:image" content="${imageUrl}">
<link rel="canonical" href="${escapeHtml(url)}">
`;

  // Replace existing <title> and meta tags with blog-specific ones, keeping the SPA shell
  let result = baseHtml;
  // Remove original <title>...</title>
  result = result.replace(/<title>[^<]*<\/title>/, '');
  // Remove original meta description
  result = result.replace(/<meta\s+name="description"[^>]*>/i, '');
  // Remove original og/twitter meta tags
  result = result.replace(/<meta\s+(property|name)="(og:|twitter:)[^"]*"[^>]*>/gi, '');
  // Remove original canonical
  result = result.replace(/<link\s+rel="canonical"[^>]*>/i, '');

  // Inject new meta block right before </head>
  result = result.replace('</head>', `${metaBlock}</head>`);

  return result;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    blogPlugin(),
    react(),
    tailwindcss(),
    {
      name: 'css-before-js',
      enforce: 'post',
      transformIndexHtml(html) {
        // Move CSS <link> before module <script> to prevent FOUC warning.
        return html.replace(
          /(<script type="module"[^<]*<\/script>)\s*(<link rel="stylesheet"[^>]*>)/,
          '$2\n    $1',
        );
      },
    },
    {
      name: 'generate-blog-html',
      apply: 'build',
      async writeBundle(options) {
        const posts = readBlogPosts();
        if (posts.length === 0) return;

        const outDir = options.dir || path.resolve(__dirname, 'dist');
        const indexPath = path.join(outDir, 'index.html');

        let baseHtml: string;
        try {
          baseHtml = fs.readFileSync(indexPath, 'utf-8');
        } catch {
          console.warn('[generate-blog-html] Could not read dist/index.html — skipping');
          return;
        }

        // ── Blog listing page ──
        const listingHtml = buildBlogPageHtml(
          baseHtml,
          'Blog — FadSec Lab',
          'Release notes and product updates from FadSec Lab.',
          'https://fadseclab.com/blog',
          'website',
        );
        fs.mkdirSync(path.join(outDir, 'blog'), { recursive: true });
        fs.writeFileSync(path.join(outDir, 'blog', 'index.html'), listingHtml);
        console.log('[generate-blog-html] ✓ /blog/index.html');

        // ── Individual post pages ──
        for (const post of posts) {
          const postHtml = buildBlogPageHtml(
            baseHtml,
            `${post.title} — FadSec Lab Blog`,
            post.description,
            `https://fadseclab.com/blog/${post.slug}`,
            'article',
            post.ogImage,
          );
          const postDir = path.join(outDir, 'blog', post.slug);
          fs.mkdirSync(postDir, { recursive: true });
          fs.writeFileSync(path.join(postDir, 'index.html'), postHtml);
          console.log(`[generate-blog-html] ✓ /blog/${post.slug}/index.html`);
        }

        console.log(`[generate-blog-html] Generated ${posts.length + 1} static blog pages`);

        // ── Sitemap ──
        const sitemapUrls = [
          { loc: 'https://fadseclab.com/', priority: '1.0', changefreq: 'weekly' },
          { loc: 'https://fadseclab.com/privacy', priority: '0.3', changefreq: 'monthly' },
          { loc: 'https://fadseclab.com/terms', priority: '0.3', changefreq: 'monthly' },
          { loc: 'https://fadseclab.com/blog', priority: '0.8', changefreq: 'weekly' },
          ...posts.map((p) => ({
            loc: `https://fadseclab.com/blog/${p.slug}`,
            priority: '0.7',
            changefreq: 'monthly' as const,
          })),
        ];

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
        fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap);
        console.log('[generate-blog-html] ✓ sitemap.xml');

        // ── RSS Feed ──
        const rssItems = posts.map((p) => {
          const pubDate = new Date(p.date).toUTCString();
          return `    <item>
      <title>${escapeHtml(p.title)}</title>
      <link>https://fadseclab.com/blog/${p.slug}</link>
      <guid>https://fadseclab.com/blog/${p.slug}</guid>
      <description>${escapeHtml(p.description)}</description>
      <pubDate>${pubDate}</pubDate>
      <author>FadSec Lab</author>
    </item>`;
        }).join('\n');

        const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>FadSec Lab Blog</title>
    <link>https://fadseclab.com/blog</link>
    <description>Release notes and product updates from FadSec Lab.</description>
    <language>en-us</language>
    <lastBuildDate>${posts.length > 0 ? new Date(posts[0].date).toUTCString() : new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://fadseclab.com/rss.xml" rel="self" type="application/rss+xml"/>
${rssItems}
  </channel>
</rss>`;
        fs.writeFileSync(path.join(outDir, 'rss.xml'), rss);
        console.log('[generate-blog-html] ✓ rss.xml');
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 700,
  },
})
