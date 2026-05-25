import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function hrefFor(basePath: string, page: number): string {
  return page <= 1 ? basePath : `${basePath}?page=${page}`;
}

function pageWindow(page: number, totalPages: number): number[] {
  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const end = Math.min(totalPages, start + 4);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export function TablePagination({
  basePath,
  page,
  totalPages,
}: {
  basePath: string;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const canGoBack = page > 1;
  const canGoNext = page < totalPages;
  const pages = pageWindow(page, totalPages);

  return (
    <div className="flex items-center justify-end gap-2 border-t border-border/50 px-4 py-3 text-sm">
      {canGoBack ? (
        <Link
          href={hrefFor(basePath, page - 1)}
          className="inline-flex h-8 items-center gap-1 rounded-lg border border-primary/20 px-3 font-medium text-foreground transition-colors hover:bg-accent"
        >
          <ChevronLeft size={15} />
          Atrás
        </Link>
      ) : (
        <span className="inline-flex h-8 items-center gap-1 rounded-lg border border-border/60 px-3 font-medium text-muted-foreground opacity-60">
          <ChevronLeft size={15} />
          Atrás
        </span>
      )}

      <div className="flex items-center gap-1">
        {pages.map((item) => {
          const active = item === page;
          return active ? (
            <span key={item} className="inline-flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
              {item}
            </span>
          ) : (
            <Link
              key={item}
              href={hrefFor(basePath, item)}
              className="inline-flex size-8 items-center justify-center rounded-lg border border-primary/15 font-medium text-foreground transition-colors hover:bg-accent"
            >
              {item}
            </Link>
          );
        })}
      </div>

      {canGoNext ? (
        <Link
          href={hrefFor(basePath, page + 1)}
          className="inline-flex h-8 items-center gap-1 rounded-lg border border-primary/20 px-3 font-medium text-foreground transition-colors hover:bg-accent"
        >
          Siguiente
          <ChevronRight size={15} />
        </Link>
      ) : (
        <span className="inline-flex h-8 items-center gap-1 rounded-lg border border-border/60 px-3 font-medium text-muted-foreground opacity-60">
          Siguiente
          <ChevronRight size={15} />
        </span>
      )}
    </div>
  );
}
