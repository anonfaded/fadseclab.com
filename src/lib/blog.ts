import rawPosts from 'virtual:blog-posts';

// ── Types ──────────────────────────────────────────────────────────────────

export interface BlogPost {
  slug: string;
  title: string;
  badgeTitle?: string;
  date: string;
  description: string;
  author: string;
  featured: boolean;
  ogImage?: string;
  content: string;
  /** Raw markdown string (for static HTML generation at build time) */
  raw: string;
}

// ── Posts are loaded server-side via the vite-plugin-blog virtual module ───

const _postsCache: BlogPost[] = rawPosts as BlogPost[];

// ── Public API ─────────────────────────────────────────────────────────────

/** All posts, sorted newest-first. */
export function getAllPosts(): BlogPost[] {
  return _postsCache;
}

/** Get a single post by its slug. */
export function getPostBySlug(slug: string): BlogPost | undefined {
  return _postsCache.find((p) => p.slug === slug);
}

/**
 * Get the manually-featured post.
 * If multiple posts have `featured: true`, returns the most recent.
 * Returns `undefined` if no post is marked featured.
 */
export function getFeaturedPost(): BlogPost | undefined {
  const featured = _postsCache.filter((p) => p.featured);
  if (featured.length === 0) return undefined;
  // Already sorted newest-first, so first match is most recent
  return featured[0];
}

/**
 * Format a date string for display.
 * e.g. "June 28, 2026"
 */
export function formatBlogDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * Relative time string. e.g. "3 days ago", "just now", "last week"
 */
export function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const seconds = Math.floor((now - then) / 1000);

  const intervals: [number, string][] = [
    [31536000, 'year'],
    [2592000, 'month'],
    [604800, 'week'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
  ];

  for (const [secs, label] of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) {
      return count === 1 ? `${count} ${label} ago` : `${count} ${label}s ago`;
    }
  }

  return 'just now';
}
