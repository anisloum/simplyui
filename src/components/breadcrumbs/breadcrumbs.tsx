import { ChevronRight, MoreHorizontal } from 'lucide-react'
import { Fragment, type ComponentPropsWithRef } from 'react'

import {
  currentStyles,
  ellipsisStyles,
  itemStyles,
  linkStyles,
  listStyles,
  separatorStyles,
} from './breadcrumbs.styles'

export interface BreadcrumbItem {
  label: string
  /** Omit on the current (last) item. */
  href?: string
  /** For SPA routers, in place of `href`. */
  onClick?: () => void
}

export interface BreadcrumbsProps extends Omit<ComponentPropsWithRef<'nav'>, 'children'> {
  items: BreadcrumbItem[]
  /** Collapse the middle once the trail exceeds this many items. */
  maxItems?: number
}

/** Marks where the middle of the trail was folded away. */
const ELLIPSIS = Symbol('ellipsis')
type RenderedItem = BreadcrumbItem | typeof ELLIPSIS

/**
 * Keeps the first crumb and the last `maxItems - 1`, so you always see where
 * you started and where you are. Exported for testing the boundaries.
 */
export function collapseItems(items: BreadcrumbItem[], maxItems?: number): RenderedItem[] {
  if (maxItems === undefined || maxItems < 1 || items.length <= maxItems) return items
  // One slot goes to the first crumb, so the tail gets the rest.
  const tailCount = Math.max(maxItems - 1, 1)
  return [items[0] as BreadcrumbItem, ELLIPSIS, ...items.slice(items.length - tailCount)]
}

/**
 * Hierarchy trail. Every crumb but the last is a link; the last is plain text
 * carrying `aria-current="page"`.
 */
export function Breadcrumbs({ items, maxItems, className, ...rest }: BreadcrumbsProps) {
  const rendered = collapseItems(items, maxItems)

  return (
    <nav {...rest} aria-label={rest['aria-label'] ?? 'Breadcrumb'} className={className}>
      <ol className={listStyles}>
        {rendered.map((item, index) => {
          const isLast = index === rendered.length - 1
          const key = item === ELLIPSIS ? `ellipsis-${index}` : `${item.label}-${index}`

          return (
            <Fragment key={key}>
              <li className={itemStyles}>
                {item === ELLIPSIS ? (
                  <span className={ellipsisStyles}>
                    <MoreHorizontal aria-hidden="true" className="size-icon-sm" />
                    <span className="sr-only">Collapsed breadcrumbs</span>
                  </span>
                ) : isLast ? (
                  <span aria-current="page" className={currentStyles}>
                    {item.label}
                  </span>
                ) : item.onClick ? (
                  // A router-driven crumb navigates without a URL, so it is a
                  // button rather than an anchor with a placeholder href.
                  <button type="button" onClick={item.onClick} className={linkStyles}>
                    {item.label}
                  </button>
                ) : (
                  <a href={item.href} className={linkStyles}>
                    {item.label}
                  </a>
                )}
              </li>

              {!isLast ? (
                <li aria-hidden="true" className={separatorStyles}>
                  <ChevronRight />
                </li>
              ) : null}
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
