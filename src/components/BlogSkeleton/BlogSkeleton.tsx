export function BlogSkeleton() {
  const pill = 'animate-pulse rounded-md bg-[var(--border)]';

  return (
    <div aria-label="Loading blog content" className="mx-auto max-w-6xl px-4 pt-8">
      {/* Breadcrumb skeleton */}
      <div className="mb-6 flex items-center gap-2">
        <div className={`${pill} h-3 w-16`} />
        <div className={`${pill} h-3 w-4`} />
        <div className={`${pill} h-3 w-20`} />
      </div>

      {/* Title + subtitle skeleton */}
      <div className="mb-10 space-y-3">
        <div className={`${pill} h-8 w-64`} />
        <div className={`${pill} h-4 w-96 max-w-full`} />
      </div>

      {/* Featured card skeleton */}
      <div className={`${pill} mb-12 space-y-3 p-6`}>
        <div className={`${pill} h-5 w-20`} />
        <div className={`${pill} h-6 w-3/4`} />
        <div className={`${pill} h-4 w-full`} />
        <div className={`${pill} h-4 w-1/2`} />
      </div>

      {/* Grid of cards skeleton */}
      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={`${pill} space-y-2 p-5`}>
            <div className={`${pill} h-5 w-3/4`} />
            <div className={`${pill} h-4 w-full`} />
            <div className={`${pill} h-4 w-2/3`} />
          </div>
        ))}
      </div>
    </div>
  );
}
