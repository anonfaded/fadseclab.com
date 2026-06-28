import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getFeaturedPost } from '@/lib/blog';

interface BlogBadgeProps {
  className?: string;
}

/**
 * Interactive hero badge that displays the manually-featured blog post.
 * Falls back to the static "Privacy-first FOSS software company" badge
 * if no post is marked featured.
 */
export default function BlogBadge({ className }: BlogBadgeProps) {
  const navigate = useNavigate();
  const featured = getFeaturedPost();

  if (!featured) {
    return (
      <Badge variant="outline" className={cn('section-badge', className)}>
        <ShieldCheck />
        Privacy-first FOSS software company
      </Badge>
    );
  }

  return (
    <button
      type="button"
      onClick={() => navigate(`/blog/${featured.slug}`)}
      className={cn(
        'blog-badge',
        'group/badge inline-flex shrink-0 items-center gap-2 rounded-4xl border text-xs font-medium transition-all cursor-pointer',
        'border-transparent bg-white/8 text-foreground',
        'hover:bg-white/12 hover:border-white/15',
        className,
      )}
    >
      <span className="blog-badge-blog-label">Blog</span>
      <span className="blog-badge-sep" aria-hidden="true" />
      <span className="blog-badge-title">{featured.badgeTitle || featured.title}</span>
      <ArrowRight className="blog-badge-arrow" />
      <span className="blog-badge-new">New</span>
    </button>
  );
}
