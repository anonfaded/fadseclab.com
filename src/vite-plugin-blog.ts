import type { Plugin } from 'vite';
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';

const require = createRequire(import.meta.url);

const VIRTUAL_MODULE_ID = 'virtual:blog-posts';
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID;

interface BlogPostMeta {
  slug: string;
  title: string;
  badgeTitle?: string;
  description: string;
  date: string;
  author: string;
  featured: boolean;
  ogImage?: string;
  content: string;
  raw: string;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function generateSitemap(posts: BlogPostMeta[]): string {
  const urls = [
    { loc: 'https://fadseclab.com/', priority: '1.0', changefreq: 'weekly' },
    { loc: 'https://fadseclab.com/privacy', priority: '0.3', changefreq: 'monthly' },
    { loc: 'https://fadseclab.com/terms', priority: '0.3', changefreq: 'monthly' },
    { loc: 'https://fadseclab.com/blog', priority: '0.8', changefreq: 'weekly' },
    ...posts.map((p) => ({
      loc: `https://fadseclab.com/blog/${p.slug}`,
      priority: '0.7' as const,
      changefreq: 'monthly' as const,
    })),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`).join('\n')}\n</urlset>`;
}

function generateRss(posts: BlogPostMeta[]): string {
  const items = posts.map((p) => {
    const pubDate = new Date(p.date).toUTCString();
    return `    <item>\n      <title>${escapeXml(p.title)}</title>\n      <link>https://fadseclab.com/blog/${p.slug}</link>\n      <guid>https://fadseclab.com/blog/${p.slug}</guid>\n      <description>${escapeXml(p.description)}</description>\n      <pubDate>${pubDate}</pubDate>\n      <author>${escapeXml(p.author || 'FadSec Lab')}</author>\n    </item>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n  <channel>\n    <title>FadSec Lab Blog</title>\n    <link>https://fadseclab.com/blog</link>\n    <description>Release notes and product updates from FadSec Lab.</description>\n    <language>en-us</language>\n    <lastBuildDate>${posts.length > 0 ? new Date(posts[0].date).toUTCString() : new Date().toUTCString()}</lastBuildDate>\n    <atom:link href="https://fadseclab.com/rss.xml" rel="self" type="application/rss+xml"/>\n${items}\n  </channel>\n</rss>`;
}

export function blogPlugin(): Plugin {
  const blogDir = path.resolve(process.cwd(), 'src/content/blog');

  function loadPosts(): BlogPostMeta[] {
    try {
      const matter = require('gray-matter');
      const files = fs.readdirSync(blogDir).filter((f: string) => f.endsWith('.md'));
      const posts = files.map((f: string) => {
        const raw = fs.readFileSync(path.join(blogDir, f), 'utf-8');
        const { data, content } = matter(raw);
        return {
          slug: data.slug ?? '',
          title: data.title ?? '',
          badgeTitle: data.badgeTitle ?? undefined,
          date: data.date ?? '',
          description: data.description ?? '',
          author: data.author ?? 'FadSec Lab',
          featured: data.featured ?? false,
          ogImage: data.ogImage ?? undefined,
          content,
          raw,
        };
      });
      // Sort newest-first
      posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      return posts;
    } catch (e) {
      console.warn('[vite-plugin-blog] Failed to load posts:', e);
      return [];
    }
  }

  return {
    name: 'vite-plugin-blog',
    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) return RESOLVED_VIRTUAL_MODULE_ID;
    },
    load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        const posts = loadPosts();
        return `export default ${JSON.stringify(posts)};`;
      }
    },
    // Hot reload when markdown files change
    configureServer(server) {
      server.watcher.add(path.join(blogDir, '*.md'));
      server.watcher.on('change', (file) => {
        if (file.endsWith('.md') && file.includes('content/blog')) {
          const mod = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_MODULE_ID);
          if (mod) {
            server.moduleGraph.invalidateModule(mod);
            server.ws.send({ type: 'full-reload' });
          }
        }
      });

      // Serve RSS and sitemap in dev mode (static files only exist after build)
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0] ?? '';
        if (url === '/rss.xml') {
          const posts = loadPosts();
          res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
          res.end(generateRss(posts));
          return;
        }
        if (url === '/sitemap.xml') {
          const posts = loadPosts();
          res.setHeader('Content-Type', 'application/xml; charset=utf-8');
          res.end(generateSitemap(posts));
          return;
        }
        next();
      });
    },
  };
}
