import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Fragment, type ComponentPropsWithRef } from 'react'

import {
  ellipsisStyles,
  listStyles,
  navButtonStyles,
  pageActiveStyles,
  pageStyles,
} from './pagination.styles'
import { PAGINATION_ELLIPSIS, usePaginationRange } from './use-pagination-range'

export interface PaginationProps extends Omit<ComponentPropsWithRef<'nav'>, 'onChange'> {
  /** 1-based. */
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  /** Pages either side of the current one before truncating. @default 1 */
  siblingCount?: number
  /** Show the first/last jump buttons. @default true */
  showFirstLast?: boolean
}

/**
 * Page navigation. Controlled only — it renders from `currentPage` and reports
 * intent through `onPageChange`.
 *
 * The truncation itself lives in `use-pagination-range`, kept pure so the edge
 * cases are testable without rendering.
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  className,
  ...rest
}: PaginationProps) {
  const items = usePaginationRange({ currentPage, totalPages, siblingCount })

  const atStart = currentPage <= 1
  const atEnd = currentPage >= totalPages

  const goTo = (page: number) => {
    const clamped = Math.min(Math.max(page, 1), totalPages)
    if (clamped !== currentPage) onPageChange(clamped)
  }

  if (totalPages < 1) return null

  return (
    <nav {...rest} aria-label={rest['aria-label'] ?? 'Pagination'} className={className}>
      <ul className={listStyles}>
        {showFirstLast ? (
          <li>
            <button
              type="button"
              className={navButtonStyles}
              onClick={() => goTo(1)}
              disabled={atStart}
              aria-label="First page"
            >
              <ChevronsLeft aria-hidden="true" />
            </button>
          </li>
        ) : null}

        <li>
          <button
            type="button"
            className={navButtonStyles}
            onClick={() => goTo(currentPage - 1)}
            disabled={atStart}
            aria-label="Previous page"
          >
            <ChevronLeft aria-hidden="true" />
          </button>
        </li>

        {items.map((item, index) => (
          <Fragment key={item === PAGINATION_ELLIPSIS ? `gap-${index}` : item}>
            {item === PAGINATION_ELLIPSIS ? (
              <li aria-hidden="true" className={ellipsisStyles}>
                &hellip;
              </li>
            ) : (
              <li>
                <button
                  type="button"
                  className={item === currentPage ? pageActiveStyles : pageStyles}
                  onClick={() => goTo(item)}
                  aria-current={item === currentPage ? 'page' : undefined}
                  aria-label={`Page ${item}`}
                >
                  {item}
                </button>
              </li>
            )}
          </Fragment>
        ))}

        <li>
          <button
            type="button"
            className={navButtonStyles}
            onClick={() => goTo(currentPage + 1)}
            disabled={atEnd}
            aria-label="Next page"
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </li>

        {showFirstLast ? (
          <li>
            <button
              type="button"
              className={navButtonStyles}
              onClick={() => goTo(totalPages)}
              disabled={atEnd}
              aria-label="Last page"
            >
              <ChevronsRight aria-hidden="true" />
            </button>
          </li>
        ) : null}
      </ul>
    </nav>
  )
}
