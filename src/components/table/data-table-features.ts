import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  globalFilteringFeature,
  metaHelper,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  type ColumnDef,
  type RowData,
} from '@tanstack/react-table'

import type { TableAlign, TablePinned } from './table.styles'

/**
 * Presentation hints TanStack carries for us but never interprets. Sorting,
 * filtering and pagination are TanStack's; how a column *looks* is ours.
 */
export interface DataTableColumnMeta {
  /** Text alignment for the column's header and cells. @default "left" */
  align?: TableAlign
  /**
   * Fixed column width, emitted as a `<col>` in the table's `<colgroup>`.
   * Declaring widths is what makes the loading skeleton occupy exactly the
   * same geometry as the loaded rows — without them the browser sizes
   * columns from content, which differs between placeholder bars and data.
   */
  width?: string
  /** Cap the column's width; content wraps unless `truncate` is set. */
  maxWidth?: string
  /** Single-line with an ellipsis instead of wrapping. @default false */
  truncate?: boolean
  /** Keep the column visible while the table scrolls sideways. */
  pinned?: TablePinned
  /** Show a text filter for this column when `columnFilters` is on. @default true */
  filterable?: boolean
  /** Accessible name for the sort button. Defaults to the column id. */
  sortLabel?: string
}

/**
 * Registered once at module scope, not per render — TanStack treats the feature
 * set as a static input, and rebuilding it each render would rebuild the table
 * instance with it.
 *
 * Every feature is registered up front rather than assembled per prop, because
 * the feature set is part of the table's *type*: making it conditional would
 * mean `DataTableProps` had a different `columns` type depending on which
 * booleans a consumer passed. The `sorting` / `selectable` / `pagination` props
 * gate the UI and the enable flags instead.
 */
export const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
    text: sortFn_text,
  },

  rowSelectionFeature,

  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),

  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: { includesString: filterFn_includesString },

  columnMeta: metaHelper<DataTableColumnMeta>(),
})

export type DataTableFeatures = typeof dataTableFeatures

/**
 * The column type consumers write. Aliased so the feature set — which is ours,
 * not theirs — never has to appear in application code.
 */
export type DataTableColumn<TData extends RowData, TValue = unknown> = ColumnDef<
  DataTableFeatures,
  TData,
  TValue
>

/**
 * Typed column builder. Using it (rather than a bare array literal) is what
 * makes `meta` autocomplete and typo-check against `DataTableColumnMeta`.
 *
 * @example
 * const column = createDataTableColumns<Product>()
 * const columns = column.columns([
 *   column.accessor('price', { header: 'Price', meta: { align: 'right' } }),
 * ])
 */
export function createDataTableColumns<TData extends RowData>() {
  return createColumnHelper<DataTableFeatures, TData>()
}
