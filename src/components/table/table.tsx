import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from 'react'

import { cn } from '../../lib/cn'
import { TableContext, useTableContext } from './table-context'
import {
  bodyStyles,
  captionStyles,
  cellStyles,
  containerStyles,
  footerStyles,
  headCellStyles,
  headerStyles,
  rowStyles,
  tableStyles,
  type TableAlign,
  type TablePinned,
} from './table.styles'

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  /** Alternating row background. @default false */
  striped?: boolean
  /** Sticky header while the body scrolls. @default false */
  stickyHeader?: boolean
  /** Classes for the scroll container. Put `max-h-*` here for a sticky header. */
  containerClassName?: string
  /** Inline styles for the scroll container. */
  containerStyle?: CSSProperties
  /**
   * Name announced when the scroll container becomes a keyboard focus stop.
   * Only used when the table actually overflows. @default "Table, scrollable"
   */
  scrollAreaLabel?: string
}

/**
 * Real `<table>` markup with a scroll container around it — never
 * divs-as-table, so the browser's own table semantics stay intact for assistive
 * tech and so column widths behave.
 *
 * Name the table with `<TableCaption>` or an `aria-label`.
 */
export function Table({
  striped = false,
  stickyHeader = false,
  className,
  containerClassName,
  containerStyle,
  scrollAreaLabel = 'Table, scrollable',
  children,
  ...rest
}: TableProps) {
  const context = useMemo(() => ({ striped, stickyHeader }), [striped, stickyHeader])
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollable, setScrollable] = useState(false)

  /**
   * A scroll container that holds no focusable elements is unreachable by
   * keyboard — you can see the overflow but cannot scroll to it (WCAG 2.1.1,
   * and axe's `scrollable-region-focusable`). Making it a tab stop fixes that.
   *
   * Measured rather than always-on: a table that fits needs no tab stop, and
   * adding one to every table would put a stray stop in front of each. The
   * observer watches both box sizes, so the answer stays right as the viewport
   * or the data changes. setState here is an external-system subscription, not
   * a render-cascade.
   */
  useEffect(() => {
    const container = containerRef.current
    if (!container || typeof ResizeObserver === 'undefined') return

    const measure = () =>
      setScrollable(
        container.scrollWidth > container.clientWidth ||
          container.scrollHeight > container.clientHeight,
      )

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    const table = container.querySelector('table')
    if (table) observer.observe(table)
    return () => observer.disconnect()
  }, [])

  return (
    <TableContext.Provider value={context}>
      <div
        ref={containerRef}
        className={cn(containerStyles, containerClassName)}
        style={containerStyle}
        // `group` rather than `region`: this needs a name for the focus stop,
        // but one landmark per table would clutter landmark navigation.
        role={scrollable ? 'group' : undefined}
        aria-label={scrollable ? scrollAreaLabel : undefined}
        // Without this a scroll container holding no focusable children is
        // unreachable by keyboard — visible overflow you cannot scroll to.
        tabIndex={scrollable ? 0 : undefined}
      >
        <table {...rest} className={cn(tableStyles, className)}>
          {children}
        </table>
      </div>
    </TableContext.Provider>
  )
}

export type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>

export function TableHeader({ className, children, ...rest }: TableHeaderProps) {
  const { stickyHeader } = useTableContext()
  return (
    <thead {...rest} className={cn(headerStyles({ sticky: stickyHeader }), className)}>
      {children}
    </thead>
  )
}

export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>

export function TableBody({ className, children, ...rest }: TableBodyProps) {
  return (
    <tbody {...rest} className={cn(bodyStyles, className)}>
      {children}
    </tbody>
  )
}

export type TableFooterProps = HTMLAttributes<HTMLTableSectionElement>

export function TableFooter({ className, children, ...rest }: TableFooterProps) {
  return (
    <tfoot {...rest} className={cn(footerStyles, className)}>
      {children}
    </tfoot>
  )
}

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean
}

export function TableRow({ selected, className, children, ...rest }: TableRowProps) {
  const { striped } = useTableContext()
  return (
    <tr
      {...rest}
      // Only emitted when the row participates in a selectable table: on a
      // plain table every row would otherwise announce as "not selected".
      aria-selected={selected === undefined ? undefined : selected}
      className={cn(rowStyles({ selected: selected ?? false, striped }), className)}
    >
      {children}
    </tr>
  )
}

export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  align?: TableAlign
  /** Keep this column visible while the table scrolls sideways. */
  pinned?: TablePinned
  /** Cap the width; content wraps unless `truncate` is set. */
  maxWidth?: string
  /** Single-line with an ellipsis instead of wrapping. @default false */
  truncate?: boolean
}

export function TableHead({
  align = 'left',
  pinned,
  maxWidth,
  truncate = false,
  scope = 'col',
  className,
  style,
  children,
  ...rest
}: TableHeadProps) {
  return (
    <th
      {...rest}
      scope={scope}
      className={cn(headCellStyles({ align, pinned, truncate }), className)}
      style={{ maxWidth, ...style }}
    >
      {children}
    </th>
  )
}

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  align?: TableAlign
  /** Keep this column visible while the table scrolls sideways. */
  pinned?: TablePinned
  /** Cap the width; content wraps unless `truncate` is set. */
  maxWidth?: string
  /** Single-line with an ellipsis instead of wrapping. @default false */
  truncate?: boolean
}

export function TableCell({
  align = 'left',
  pinned,
  maxWidth,
  truncate = false,
  className,
  style,
  children,
  ...rest
}: TableCellProps) {
  return (
    <td
      {...rest}
      className={cn(cellStyles({ align, pinned, truncate }), className)}
      style={{ maxWidth, ...style }}
    >
      {children}
    </td>
  )
}

export interface TableCaptionProps extends HTMLAttributes<HTMLTableCaptionElement> {
  /** Name the table for screen readers without showing the text. @default false */
  visuallyHidden?: boolean
}

export function TableCaption({
  visuallyHidden = false,
  className,
  children,
  ...rest
}: TableCaptionProps) {
  return (
    <caption {...rest} className={cn(visuallyHidden ? 'sr-only' : captionStyles, className)}>
      {children}
    </caption>
  )
}
