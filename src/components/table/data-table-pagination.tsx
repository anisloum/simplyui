import { Pagination } from '../pagination'

export interface DataTablePaginationProps {
  /** 0-based, as TanStack keeps it. */
  pageIndex: number
  pageCount: number
  onPageIndexChange: (pageIndex: number) => void
  /** Rows after filtering — the "of M" figure. */
  filteredRowCount: number
  /** Rows before filtering. Used to word the summary when a filter is active. */
  totalRowCount: number
  /** Rows visible on the current page — the "N" figure. */
  pageRowCount: number
  /** Whether a search or column filter is currently narrowing the rows. */
  filtered: boolean
}

/**
 * Row-count summary plus our own `<Pagination>`.
 *
 * The summary is an `aria-live="polite"` region because filtering changes the
 * result count with no other announcement — a sighted user sees the rows
 * disappear, and this is the equivalent for everyone else. Polite, not
 * assertive, so it waits for a pause in typing rather than interrupting.
 */
export function DataTablePagination({
  pageIndex,
  pageCount,
  onPageIndexChange,
  filteredRowCount,
  totalRowCount,
  pageRowCount,
  filtered,
}: DataTablePaginationProps) {
  const summary = filtered
    ? `Showing ${pageRowCount} of ${filteredRowCount} matching ${filteredRowCount === 1 ? 'row' : 'rows'} (${totalRowCount} total)`
    : `Showing ${pageRowCount} of ${filteredRowCount} ${filteredRowCount === 1 ? 'row' : 'rows'}`

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p aria-live="polite" className="text-xs text-text-subtle">
        {summary}
      </p>
      {pageCount > 1 ? (
        <Pagination
          currentPage={pageIndex + 1}
          totalPages={pageCount}
          onPageChange={(page) => onPageIndexChange(page - 1)}
        />
      ) : null}
    </div>
  )
}
