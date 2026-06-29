import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldX, Terminal } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  const navigate = useNavigate();

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
              <BreadcrumbPage>404 — Not Found</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="relative mt-[60px] px-10 py-12 border border-[var(--frame-border)] bg-[var(--report-surface)] text-center overflow-visible">
          {/* Bracket corners */}
          <span className="absolute size-3 border-[var(--frame-bracket)] border-solid top-[-1px] left-[-1px] border-t-2 border-l-2" aria-hidden="true" />
          <span className="absolute size-3 border-[var(--frame-bracket)] border-solid top-[-1px] right-[-1px] border-t-2 border-r-2" aria-hidden="true" />
          <span className="absolute size-3 border-[var(--frame-bracket)] border-solid bottom-[-1px] left-[-1px] border-b-2 border-l-2" aria-hidden="true" />
          <span className="absolute size-3 border-[var(--frame-bracket)] border-solid bottom-[-1px] right-[-1px] border-b-2 border-r-2" aria-hidden="true" />

          <div className="flex flex-col items-center gap-4">
            <ShieldX size={32} className="text-[var(--accent-brand)] opacity-70" />

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md border border-[color-mix(in_srgb,var(--accent-brand)_20%,transparent)] bg-[color-mix(in_srgb,var(--accent-brand)_8%,transparent)]">
              <Terminal size={16} className="text-[var(--accent-brand)] opacity-80" />
              <span className="font-mono text-sm font-semibold text-[var(--accent-brand)] tracking-wider">404</span>
            </div>

            <h1 className="font-[var(--font-display)] text-[clamp(22px,3vw,28px)] font-bold text-[var(--text)] leading-tight">
              Page not found
            </h1>

            <p className="max-w-[380px] text-sm text-[var(--text-soft)] leading-relaxed m-0">
              Seems like you got lost in the lab.
            </p>

            <div className="flex items-center gap-2.5 mt-2">
              <Button
                type="button"
                variant="default"
                size="lg"
                onClick={() => navigate('/')}
              >
                <ArrowLeft size={16} />
                Back to home
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={() => navigate(-1)}
              >
                Go back
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
