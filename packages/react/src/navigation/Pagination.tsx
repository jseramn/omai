import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import type { ComponentPropsWithRef } from 'react';
import type { Size } from '../types';
import { cn, useControllableState } from '../utils';

export interface PaginationProps extends Omit<ComponentPropsWithRef<'nav'>, 'onChange'> {
  pageCount: number;
  page?: number;
  defaultPage?: number;
  onPageChange?(page: number): void;
  siblingCount?: number;
  boundaryCount?: number;
  showPrevNext?: boolean;
  showFirstLast?: boolean;
  size?: Size;
  disabled?: boolean;
}

type PaginationItem = number | 'start-ellipsis' | 'end-ellipsis';

function range(start: number, end: number): number[] {
  const length = end - start + 1;
  if (length <= 0) return [];
  return Array.from({ length }, (_, idx) => start + idx);
}

function buildPaginationItems(
  pageCount: number,
  currentPage: number,
  siblingCount: number,
  boundaryCount: number,
): PaginationItem[] {
  if (pageCount <= 0) return [];

  const startPages = range(1, Math.min(boundaryCount, pageCount));
  const endPages = range(Math.max(pageCount - boundaryCount + 1, boundaryCount + 1), pageCount);

  const siblingsStart = Math.max(
    Math.min(currentPage - siblingCount, pageCount - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2,
  );
  const siblingsEnd = Math.min(
    Math.max(currentPage + siblingCount, boundaryCount + siblingCount * 2 + 2),
    endPages.length > 0 ? endPages[0]! - 2 : pageCount - 1,
  );

  const items: PaginationItem[] = [...startPages];

  if (siblingsStart > boundaryCount + 2) {
    items.push('start-ellipsis');
  } else if (boundaryCount + 1 < pageCount - boundaryCount) {
    items.push(boundaryCount + 1);
  }

  items.push(...range(siblingsStart, siblingsEnd));

  if (siblingsEnd < pageCount - boundaryCount - 1) {
    items.push('end-ellipsis');
  } else if (pageCount - boundaryCount > boundaryCount) {
    items.push(pageCount - boundaryCount);
  }

  items.push(...endPages);

  const seen = new Set<PaginationItem>();
  return items.filter((item) => {
    if (typeof item === 'number' && (item < 1 || item > pageCount)) return false;
    if (seen.has(item)) return false;
    seen.add(item);
    return true;
  });
}

export function Pagination({
  pageCount,
  page,
  defaultPage = 1,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  showPrevNext = true,
  showFirstLast = false,
  size = 'md',
  disabled = false,
  className,
  'aria-label': ariaLabel = 'Pagination',
  ref,
  ...rest
}: PaginationProps) {
  const safeCount = Math.max(0, Math.floor(pageCount));
  const [rawPage, setRawPage] = useControllableState<number>({
    value: page,
    defaultValue: defaultPage,
    onChange: onPageChange,
  });

  const currentPage = safeCount > 0 ? Math.min(Math.max(1, rawPage), safeCount) : 1;
  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 18 : 16;

  const goTo = (next: number) => {
    if (disabled || safeCount <= 0) return;
    const clamped = Math.min(Math.max(1, next), safeCount);
    if (clamped !== currentPage) setRawPage(clamped);
  };

  const items = buildPaginationItems(safeCount, currentPage, siblingCount, boundaryCount);

  return (
    <nav
      ref={ref}
      aria-label={ariaLabel}
      className={cn('omai-pagination', className)}
      data-size={size}
      data-disabled={disabled ? '' : undefined}
      {...rest}
    >
      <ul className="omai-pagination__list">
        {showFirstLast ? (
          <li>
            <button
              type="button"
              className="omai-pagination__button"
              aria-label="First page"
              disabled={disabled || currentPage <= 1 || safeCount === 0}
              onClick={() => goTo(1)}
            >
              <ChevronsLeft size={iconSize} strokeWidth={1.75} aria-hidden />
            </button>
          </li>
        ) : null}

        {showPrevNext ? (
          <li>
            <button
              type="button"
              className="omai-pagination__button"
              aria-label="Previous page"
              disabled={disabled || currentPage <= 1 || safeCount === 0}
              onClick={() => goTo(currentPage - 1)}
            >
              <ChevronLeft size={iconSize} strokeWidth={1.75} aria-hidden />
            </button>
          </li>
        ) : null}

        {items.map((item) => {
          if (item === 'start-ellipsis' || item === 'end-ellipsis') {
            return (
              <li key={item}>
                <span className="omai-pagination__ellipsis" aria-hidden="true">
                  …
                </span>
              </li>
            );
          }

          const isCurrent = item === currentPage;
          return (
            <li key={item}>
              <button
                type="button"
                className="omai-pagination__button"
                aria-label={`Page ${item}`}
                aria-current={isCurrent ? 'page' : undefined}
                data-state={isCurrent ? 'active' : 'inactive'}
                disabled={disabled}
                onClick={() => goTo(item)}
              >
                {item}
              </button>
            </li>
          );
        })}

        {showPrevNext ? (
          <li>
            <button
              type="button"
              className="omai-pagination__button"
              aria-label="Next page"
              disabled={disabled || currentPage >= safeCount || safeCount === 0}
              onClick={() => goTo(currentPage + 1)}
            >
              <ChevronRight size={iconSize} strokeWidth={1.75} aria-hidden />
            </button>
          </li>
        ) : null}

        {showFirstLast ? (
          <li>
            <button
              type="button"
              className="omai-pagination__button"
              aria-label="Last page"
              disabled={disabled || currentPage >= safeCount || safeCount === 0}
              onClick={() => goTo(safeCount)}
            >
              <ChevronsRight size={iconSize} strokeWidth={1.75} aria-hidden />
            </button>
          </li>
        ) : null}
      </ul>
    </nav>
  );
}
