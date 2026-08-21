import { ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide-react'
import { useCallback, useEffect, useId, useMemo, useState, type ReactNode } from 'react'
import {
  useTable,
  type ColumnFiltersState,
  type RowData,
  type RowSelectionState,
  type SortingState,
} from '@tanstack/react-table'

import { cn } from '../../lib/cn'
import { Checkbox } from '../checkbox'
import { DataTablePagination } from './data-table-pagination'
import { DataTableToolbar } from './data-table-toolbar'
import {
  dataTableFeatures,
  type DataTableColumn,
  type DataTableColumnMeta,
} from './data-table-features'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table'
import {
  checkboxCellStyles,
  emptyCellStyles,
  filterCellStyles,
  filterInputStyles,
  skeletonBarStyles,
  skeletonBarWidth,
  sortButtonStyles,
  sortIconStyles,
} from './table.styles'

/** The id of the injected selection column. Reserved — do not use it yourself. */
const SELECT_COLUMN_ID = '__select__'

export interface DataTableProps<TData extends RowData> {
  columns: DataTableColumn<TData>[]
  data: TData[]

  /** Click-to-sort on sortable columns. @default true */
  sorting?: boolean
  /** Row selection checkboxes plus a select-all header box. @default false */
  selectable?: boolean
  onRowSelectionChange?: (rows: TData[]) => void
  /** Stable row identity for selection. Defaults to the row's index. */
  getRowId?: (row: TData, index: number) => string

  /** Client-side pagination via our `<Pagination>`. @default true */
  pagination?: boolean
  /** @default 10 */
  pageSize?: number

  /** Global search box above the table. @default false */
  globalFilter?: boolean
  /** Per-column text filters in a second header row. @default false */
  columnFilters?: boolean

  /** Swap the rows for skeleton placeholders. */
  loading?: boolean
  /** Replaces the default "No results." message. */
  emptyState?: ReactNode

  striped?: boolean
  stickyHeader?: boolean
  className?: string
  /** Classes for the table's scroll container. `max-h-*` goes here. */
  containerClassName?: string
  /** Names the table for assistive tech. Rendered visually hidden. */
  caption?: string
}

/**
 * TanStack drives the row model — sorting, filtering, pagination, selection —
 * and nothing else. Every element below is our own `Table` primitive; no
 * third-party markup or styling is involved.
 *
 * Column presentation (`align`, `maxWidth`, `pinned`, `truncate`) travels on
 * `ColumnDef.meta`, which TanStack carries verbatim without interpreting.
 *
 * The Actions column is a consumer slot: pass a `cell` renderer and pin it with
 * `meta.pinned: 'right'`. This component deliberately owns no menu — an actions
 * menu needs `menu`/`menuitem` semantics, which is `Menu`'s job, not the
 * table's.
 */
export function DataTable<TData extends RowData>({
  columns,
  data,
  sorting: sortingEnabled = true,
  selectable = false,
  onRowSelectionChange,
  getRowId,
  pagination: paginationEnabled = true,
  pageSize = 10,
  globalFilter: globalFilterEnabled = false,
  columnFilters: columnFiltersEnabled = false,
  loading = false,
  emptyState,
  striped = false,
  stickyHeader = false,
  className,
  containerClassName,
  caption,
}: DataTableProps<TData>) {
  const baseId = useId()

  const [sortingState, setSortingState] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [globalFilterValue, setGlobalFilterValue] = useState('')
  const [columnFilterState, setColumnFilterState] = useState<ColumnFiltersState>([])
  const [pageIndex, setPageIndex] = useState(0)

  /**
   * The checkbox column is injected rather than asked for, so `selectable` is
   * one boolean instead of a column every consumer has to hand-write. It is a
   * display column: no accessor, so it never sorts or filters.
   */
  const resolvedColumns = useMemo<DataTableColumn<TData>[]>(() => {
    if (!selectable) return columns

    const selectColumn = {
      id: SELECT_COLUMN_ID,
      enableSorting: false,
      enableGlobalFilter: false,
      enableColumnFilter: false,
      meta: { align: 'center', filterable: false, width: '3rem' } satisfies DataTableColumnMeta,
      header: ({ table }) => (
        // Checkbox renders a flex `<label>`, which the cell's `text-align`
        // cannot move; it needs a flex parent to actually centre.
        <span className={checkboxCellStyles}>
          <Checkbox
            aria-label="Select all rows"
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
            onChange={(event) => table.toggleAllRowsSelected(event.target.checked)}
          />
        </span>
      ),
      cell: ({ row }) => (
        <span className={checkboxCellStyles}>
          <Checkbox
            aria-label={`Select row ${row.index + 1}`}
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            // Click, not change: the handler reads Shift from the original
            // event to extend a range, and React's change event exposes it via
            // nativeEvent — but only the click path carries the modifier.
            onClick={row.getToggleSelectedHandler()}
            onChange={() => undefined}
          />
        </span>
      ),
    } satisfies DataTableColumn<TData>

    return [selectColumn, ...columns]
  }, [columns, selectable])

  const table = useTable({
    features: dataTableFeatures,
    columns: resolvedColumns,
    data,
    getRowId,

    enableSorting: sortingEnabled,
    // TanStack starts numeric columns descending; the spec's cycle is
    // ascending → descending → none for every column, so the direction cannot
    // depend on the value type.
    sortDescFirst: false,
    enableRowSelection: selectable,
    globalFilterFn: 'includesString',
    // The checkbox column holds no text; searching it would match everything.
    getColumnCanGlobalFilter: (column) => column.id !== SELECT_COLUMN_ID,

    state: {
      sorting: sortingState,
      rowSelection,
      globalFilter: globalFilterValue,
      columnFilters: columnFilterState,
      pagination: { pageIndex, pageSize: paginationEnabled ? pageSize : data.length || 1 },
    },
    onSortingChange: setSortingState,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilterValue,
    onColumnFiltersChange: setColumnFilterState,
  })

  const headerGroups = table.getHeaderGroups()
  const rows = table.getRowModel().rows
  const filteredRowCount = table.getFilteredRowModel().rows.length
  const columnCount = resolvedColumns.length
  const isFiltered = globalFilterValue.trim() !== '' || columnFilterState.length > 0

  const pageCount = paginationEnabled ? table.getPageCount() : 1

  // Only emit a colgroup when something actually declares a width; an empty
  // one would pin every column to the same size. Declared widths also switch the
  // table to `fixed` layout, which is what makes them authoritative — under
  // `auto` the browser still sizes from content, so the skeleton and the loaded
  // rows would land on different widths and the table would visibly re-flow.
  const hasDeclaredWidths = resolvedColumns.some((column) => (column.meta ?? {}).width)

  // A shrinking row set can strand the viewer on a page that no longer exists.
  // Filter changes already reset to page 0; this covers the remaining case,
  // `data` itself getting shorter. Adjusted during render, not in an effect, so
  // the out-of-range page is never painted.
  const [lastPageCount, setLastPageCount] = useState(pageCount)
  if (pageCount !== lastPageCount) {
    setLastPageCount(pageCount)
    if (pageIndex > pageCount - 1) setPageIndex(Math.max(0, pageCount - 1))
  }

  const selectedRows = table.getSelectedRowModel().rows
  useEffect(() => {
    if (!selectable) return
    onRowSelectionChange?.(selectedRows.map((row) => row.original))
    // `selectedRows` is a fresh array each render; the selection state is the
    // real trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection, selectable, onRowSelectionChange])

  const handleGlobalFilter = useCallback((value: string) => {
    setGlobalFilterValue(value)
    setPageIndex(0)
  }, [])

  return (
    <div className={cn('flex w-full flex-col gap-2', className)}>
      {globalFilterEnabled ? (
        <DataTableToolbar value={globalFilterValue} onValueChange={handleGlobalFilter} />
      ) : null}

      <Table
        striped={striped}
        stickyHeader={stickyHeader}
        className={hasDeclaredWidths ? 'table-fixed' : undefined}
        containerClassName={containerClassName}
        aria-busy={loading || undefined}
        aria-label={caption ? undefined : 'Data table'}
      >
        {caption ? <TableCaption visuallyHidden>{caption}</TableCaption> : null}

        {hasDeclaredWidths ? (
          <colgroup>
            {resolvedColumns.map((column, index) => (
              <col key={column.id ?? `col-${index}`} style={{ width: (column.meta ?? {}).width }} />
            ))}
          </colgroup>
        ) : null}

        <TableHeader>
          {headerGroups.map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => {
                const meta = header.column.columnDef.meta ?? {}
                const canSort = sortingEnabled && header.column.getCanSort()
                const direction = header.column.getIsSorted()

                return (
                  <TableHead
                    key={header.id}
                    align={meta.align}
                    pinned={meta.pinned}
                    maxWidth={meta.maxWidth}
                    truncate={meta.truncate}
                    aria-sort={
                      canSort
                        ? direction === 'asc'
                          ? 'ascending'
                          : direction === 'desc'
                            ? 'descending'
                            : 'none'
                        : undefined
                    }
                  >
                    {header.isPlaceholder ? null : canSort ? (
                      <button
                        type="button"
                        className={sortButtonStyles}
                        onClick={header.column.getToggleSortingHandler()}
                        aria-label={`Sort by ${meta.sortLabel ?? header.column.id}`}
                      >
                        <table.FlexRender header={header} />
                        {direction === 'asc' ? (
                          <ChevronUp
                            aria-hidden="true"
                            className={sortIconStyles({ active: true })}
                          />
                        ) : direction === 'desc' ? (
                          <ChevronDown
                            aria-hidden="true"
                            className={sortIconStyles({ active: true })}
                          />
                        ) : (
                          <ChevronsUpDown aria-hidden="true" className={sortIconStyles()} />
                        )}
                      </button>
                    ) : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}

          {columnFiltersEnabled
            ? headerGroups.map((group) => (
                <TableRow key={`${group.id}-filters`}>
                  {group.headers.map((header) => {
                    const meta = header.column.columnDef.meta ?? {}
                    const canFilter = header.column.getCanFilter() && meta.filterable !== false
                    return (
                      <TableHead key={header.id} pinned={meta.pinned} className={filterCellStyles}>
                        {canFilter ? (
                          <input
                            type="text"
                            id={`${baseId}-filter-${header.column.id}`}
                            aria-label={`Filter by ${meta.sortLabel ?? header.column.id}`}
                            placeholder="Filter…"
                            className={filterInputStyles}
                            value={(header.column.getFilterValue() as string | undefined) ?? ''}
                            onChange={(event) => {
                              header.column.setFilterValue(event.target.value)
                              setPageIndex(0)
                            }}
                          />
                        ) : null}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))
            : null}
        </TableHeader>

        <TableBody>
          {loading ? (
            // Same row count and the same columns as a loaded page, so nothing
            // shifts when the real data arrives.
            Array.from({ length: paginationEnabled ? pageSize : 5 }, (_, rowIndex) => (
              <TableRow key={`skeleton-${rowIndex}`}>
                {resolvedColumns.map((column, columnIndex) => {
                  const meta = column.meta ?? {}
                  return (
                    <TableCell
                      key={column.id ?? `skeleton-cell-${columnIndex}`}
                      align={meta.align}
                      pinned={meta.pinned}
                    >
                      {/* TODO: <Skeleton> — swap this bar for the real component. */}
                      <span
                        className={skeletonBarStyles}
                        style={{
                          // The checkbox column gets a box the size of a
                          // checkbox; a 55%-wide bar in a 3rem column reads as a
                          // broken cell rather than a placeholder.
                          width:
                            column.id === SELECT_COLUMN_ID
                              ? '1.125rem'
                              : skeletonBarWidth(columnIndex),
                        }}
                      />
                    </TableCell>
                  )
                })}
              </TableRow>
            ))
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columnCount} className={emptyCellStyles} align="center">
                {emptyState ?? (isFiltered ? 'No rows match the current filters.' : 'No results.')}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row.id} selected={selectable ? row.getIsSelected() : undefined}>
                {row.getAllCells().map((cell) => {
                  const meta = cell.column.columnDef.meta ?? {}
                  return (
                    <TableCell
                      key={cell.id}
                      align={meta.align}
                      pinned={meta.pinned}
                      maxWidth={meta.maxWidth}
                      truncate={meta.truncate}
                    >
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  )
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {paginationEnabled && !loading ? (
        <DataTablePagination
          pageIndex={pageIndex}
          pageCount={pageCount}
          onPageIndexChange={setPageIndex}
          filteredRowCount={filteredRowCount}
          totalRowCount={data.length}
          pageRowCount={rows.length}
          filtered={isFiltered}
        />
      ) : null}
    </div>
  )
}
