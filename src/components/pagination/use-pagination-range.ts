import { useMemo } from 'react'

/** Marks a gap in the page run. */
export const PAGINATION_ELLIPSIS = 'ellipsis'
export type PaginationItem = number | typeof PAGINATION_ELLIPSIS

export interface PaginationRangeOptions {
  currentPage: number
  totalPages: number
  /** Pages either side of the current one before truncating. @default 1 */
  siblingCount?: number
}

const range = (start: number, end: number): number[] =>
  Array.from({ length: Math.max(end - start + 1, 0) }, (_, i) => start + i)

/**
 * Builds the page run: always the first and last page, the current page with
 * `siblingCount` neighbours either side, and an ellipsis wherever that leaves a
 * gap.
 *
 * Pure and separate from the component so the truncation edges can be reasoned
 * about (and tested) without rendering anything.
 *
 * An ellipsis is only inserted where it actually saves space — replacing a
 * single hidden page with `…` would take the same room and hide a target, so
 * those collapse to the page itself.
 */
export function getPaginationRange({
  currentPage,
  totalPages,
  siblingCount = 1,
}: PaginationRangeOptions): PaginationItem[] {
  if (!Number.isFinite(totalPages) || totalPages < 1) return []

  const page = Math.min(Math.max(currentPage, 1), totalPages)

  // first + last + current + 2 siblings + 2 ellipses
  const maxSlots = siblingCount * 2 + 5
  if (maxSlots >= totalPages) return range(1, totalPages)

  const leftSibling = Math.max(page - siblingCount, 1)
  const rightSibling = Math.min(page + siblingCount, totalPages)

  // Only worth an ellipsis when it hides more than one page.
  const showLeftEllipsis = leftSibling > 3
  const showRightEllipsis = rightSibling < totalPages - 2

  if (!showLeftEllipsis && showRightEllipsis) {
    return [...range(1, Math.max(maxSlots - 2, rightSibling)), PAGINATION_ELLIPSIS, totalPages]
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    return [
      1,
      PAGINATION_ELLIPSIS,
      ...range(Math.min(totalPages - maxSlots + 3, leftSibling), totalPages),
    ]
  }

  if (showLeftEllipsis && showRightEllipsis) {
    return [
      1,
      PAGINATION_ELLIPSIS,
      ...range(leftSibling, rightSibling),
      PAGINATION_ELLIPSIS,
      totalPages,
    ]
  }

  return range(1, totalPages)
}

export function usePaginationRange(options: PaginationRangeOptions): PaginationItem[] {
  const { currentPage, totalPages, siblingCount } = options
  return useMemo(
    () => getPaginationRange({ currentPage, totalPages, siblingCount }),
    [currentPage, totalPages, siblingCount],
  )
}
