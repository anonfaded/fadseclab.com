import Giscus from '@giscus/react';

/**
 * Giscus comment widget — privacy-friendly, GitHub Discussions-backed.
 *
 * Comments are stored as GitHub Discussions in anonfaded/fadseclab.com
 * under the "Blog Comments" category. One discussion per blog post URL.
 *
 * No tracking. No ads. Open source.
 */
export default function GiscusComments() {
  const isDev = typeof window !== 'undefined' && window.location.hostname === '127.0.0.1';

  if (isDev) {
    return (
      <div className="blog-comments">
        <div className="blog-post-footer-divider" />
        <h3 className="blog-post-h2">Comments</h3>
        <p className="blog-post-p" style={{ color: 'var(--text-faint)' }}>
          Giscus comments are disabled in local development. They will appear on the live site at fadseclab.com.
        </p>
      </div>
    );
  }

  return (
    <div className="blog-comments">
      <div className="blog-post-footer-divider" />
      <h3 className="blog-post-h2">Comments</h3>
      <Giscus
        repo="anonfaded/fadseclab.com"
        repoId="R_kgDOQvOYLQ"
        category="Blog Comments"
        categoryId="DIC_kwDOQvOYLc4DAGKR"
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="dark"
        lang="en"
        loading="lazy"
      />
    </div>
  );
}
