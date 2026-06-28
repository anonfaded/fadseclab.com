import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Calendar, Clock, ExternalLink, FileText } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import GiscusComments from '@/components/GiscusComments/GiscusComments';
import { getAllPosts, getPostBySlug, formatBlogDate, timeAgo, type BlogPost } from '@/lib/blog';

// ── Types ──────────────────────────────────────────────────────────────────

// ── Dynamic SEO helper ─────────────────────────────────────────────────────

function useBlogSEO(post?: BlogPost) {
  useEffect(() => {
    if (post) {
      document.title = `${post.title} — FadSec Lab Blog`;
      setMeta('description', post.description);
      setMeta('og:title', post.title);
      setMeta('og:description', post.description);
      setMeta('og:url', `https://fadseclab.com/blog/${post.slug}`);
      setMeta('og:type', 'article');
      const ogImg = post.ogImage || '/og-image.png';
      setMeta('og:image', `https://fadseclab.com${ogImg}`);
      setMeta('twitter:image', `https://fadseclab.com${ogImg}`);
      setMeta('twitter:title', post.title);
      setMeta('twitter:description', post.description);
    } else {
      document.title = 'Blog — FadSec Lab';
      setMeta('description', 'Release notes and product updates from FadSec Lab.');
      setMeta('og:title', 'Blog — FadSec Lab');
      setMeta('og:description', 'Release notes and product updates from FadSec Lab.');
      setMeta('og:url', 'https://fadseclab.com/blog');
      setMeta('og:type', 'website');
      setMeta('og:image', 'https://fadseclab.com/og-image.png');
      setMeta('twitter:image', 'https://fadseclab.com/og-image.png');
      setMeta('twitter:title', 'Blog — FadSec Lab');
      setMeta('twitter:description', 'Release notes and product updates from FadSec Lab.');
    }
  }, [post]);
}

function setMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    if (name.startsWith('og:')) el.setAttribute('property', name);
    else el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

// ── Markdown components ────────────────────────────────────────────────────

function createMarkdownComponents(onImageClick?: (src: string) => void) {
  return {
    h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2 className="blog-post-h2" {...props}>{children}</h2>
    ),
    h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3 className="blog-post-h3" {...props}>{children}</h3>
    ),
    p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p className="blog-post-p" {...props}>{children}</p>
    ),
    ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
      <ul className="blog-post-ul" {...props}>{children}</ul>
    ),
    li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
      <li className="blog-post-li" {...props}>{children}</li>
    ),
    a: ({ href, children, node, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { node?: unknown }) => {
      const isExternal = href && (href.startsWith('http://') || href.startsWith('https://'));
      // Check HAST node (react-markdown passes this) for image descendants.
      // react-markdown children are HAST objects, not React elements,
      // so React.isValidElement checks fail on them.
      function hastHasImage(n: unknown): boolean {
        if (!n || typeof n !== 'object') return false;
        const obj = n as Record<string, unknown>;
        if (obj.type === 'image' || obj.tagName === 'img') return true;
        const kids = obj.children;
        if (Array.isArray(kids)) return kids.some(hastHasImage);
        return false;
      }
      const hasImageChild = Array.isArray(children)
        ? children.some(hastHasImage)
        : hastHasImage(node);
      return (
        <a
          href={href}
          {...isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {}}
          className={cn('blog-post-a', hasImageChild && 'blog-post-a--img')}
          {...props}
        >
          {children}
          {isExternal && !hasImageChild && <ExternalLink size={13} className="blog-post-ext-icon" />}
        </a>
      );
    },
    strong: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <strong className="blog-post-strong" {...props}>{children}</strong>
    ),
    code: ({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) => {
      const isInline = !className;
      if (isInline) {
        return <code className="blog-post-code-inline" {...props}>{children}</code>;
      }
      return (
        <pre className="blog-post-pre">
          <code className={cn('blog-post-code-block', className)} {...props}>{children}</code>
        </pre>
      );
    },
    img: ({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => {
      // SVG icons/buttons don't need lightbox — render directly
      if (src?.endsWith('.svg')) {
        return (
          <img
            src={src}
            alt={alt || 'Blog post image'}
            loading="lazy"
            className="blog-post-img blog-post-img--svg"
            width="180"
            height="54"
            {...props}
          />
        );
      }
      return (
        <button
          type="button"
          className="blog-post-img-btn"
          onClick={() => src && onImageClick?.(src)}
          aria-label={alt || 'View image full size'}
        >
          <img
            src={src}
            alt={alt || 'Blog post image'}
            loading="lazy"
            className="blog-post-img"
            width="1200"
            height="675"
            {...props}
          />
        </button>
      );
    },
  };
}

// ── Sub-components ─────────────────────────────────────────────────────────

function BlogPostCard({ post, onClick }: { post: BlogPost; onClick: () => void }) {
  return (
    <article className="blog-card group cursor-pointer" onClick={onClick}>
      {post.ogImage && (
        <div className="blog-card-thumb-wrap">
          <img
            src={post.ogImage}
            alt=""
            className="blog-card-thumb"
            loading="lazy"
            width="600"
            height="338"
          />
        </div>
      )}
      {post.featured && (
        <Badge variant="outline" className="blog-card-featured">Featured</Badge>
      )}
      <h2 className="blog-card-title">{post.title}</h2>
      <p className="blog-card-desc">{post.description}</p>
      <div className="blog-card-footer">
        <div className="blog-card-footer-left">
          <span className="blog-card-author">{timeAgo(post.date)}</span>
          <span className="blog-card-date">{formatBlogDate(post.date)}</span>
        </div>
        <span className="blog-card-read">
          Read post
          <span className="blog-card-arrow">→</span>
        </span>
      </div>
    </article>
  );
}

function BlogListView({ posts, onNavigate }: { posts: BlogPost[]; onNavigate: (slug: string) => void }) {
  useBlogSEO();

  return (
    <div className="page-shell">
      <div className="page-content">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Blog</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="page-header">
          <h1 className="page-title">Blog</h1>
          <p className="page-subtitle">Release notes and product updates from FadSec Lab.</p>
        </div>

        {posts.length === 0 ? (
          <div className="page-body">
            <div className="blog-empty">
              <FileText size={32} />
              <p>No posts yet. Check back soon.</p>
            </div>
          </div>
        ) : (
          <div className="blog-grid">
            {posts.map((post) => (
              <BlogPostCard
                key={post.slug}
                post={post}
                onClick={() => onNavigate(post.slug)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BlogPostView({ post, onBack }: { post: BlogPost; onBack: () => void }) {
  useBlogSEO(post);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const readingTime = useMemo(() => {
    const words = post.content.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  }, [post.content]);

  const components = useMemo(() => createMarkdownComponents(setLightboxSrc), []);

  return (
    <div className="page-shell">
      <article className="page-content">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{post.slug}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <header className="blog-post-header">
          <div className="blog-post-meta">
            <Badge variant="outline" className="blog-post-meta-badge">
              <Calendar size={11} />
              {formatBlogDate(post.date)}
            </Badge>
            <Badge variant="outline" className="blog-post-meta-badge">
              <Clock size={11} />
              {readingTime} min read
            </Badge>
            {post.featured && (
              <Badge variant="outline" className="blog-post-featured-badge">
                Featured
              </Badge>
            )}
          </div>
          <h1 className="blog-post-title">{post.title}</h1>
          <p className="blog-post-subtitle">{post.description}</p>
          <p className="blog-post-author">By {post.author}</p>
        </header>

        <div className="blog-post-body">
          <Markdown
            remarkPlugins={[remarkGfm]}
            components={components}
          >
            {post.content}
          </Markdown>
        </div>

        <footer className="blog-post-footer">
          <div className="blog-post-footer-divider" />
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onBack}
          >
            <ArrowLeft size={16} />
            Back to blog
          </Button>
        </footer>

        <GiscusComments />
      </article>

      {lightboxSrc && (
        <div className="lightbox-overlay" onClick={() => setLightboxSrc(null)}>
          <button type="button" className="lightbox-close" aria-label="Close">✕</button>
          <img src={lightboxSrc} alt="" className="lightbox-img" width="1200" height="900" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

function BlogNotFound({ onBack }: { onBack: () => void }) {
  useBlogSEO();
  return (
    <div className="page-shell">
      <div className="page-content">
        <button type="button" className="page-back" onClick={onBack}>
          <ArrowLeft size={16} />
          Back to blog
        </button>
        <div className="page-header">
          <h1 className="page-title">Post not found</h1>
        </div>
        <div className="page-body">
          <div className="blog-empty">
            <FileText size={32} />
            <p>The post you're looking for doesn't exist or has been moved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function BlogPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Post view
  if (slug) {
    const post = getPostBySlug(slug);
    if (!post) {
      return <BlogNotFound onBack={() => navigate('/blog')} />;
    }
    return <BlogPostView post={post} onBack={() => navigate('/blog')} />;
  }

  // List view
  const posts = getAllPosts();
  return <BlogListView posts={posts} onNavigate={(s) => navigate(`/blog/${s}`)} />;
}
