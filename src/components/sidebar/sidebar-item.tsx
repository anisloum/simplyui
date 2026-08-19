import {
  cloneElement,
  isValidElement,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react'

import { cn } from '../../lib/cn'
import { Slot } from '../../lib/slot'
import { useSidebarContext } from './sidebar-context'
import { itemIconStyles, itemLabelStyles, itemStyles } from './sidebar.styles'

export interface SidebarItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Required — the only thing rendered in collapsed mode. */
  icon: ReactNode
  /** Required — the visible text, and the accessible name when collapsed. */
  label: string
  /** Consumer sets this from the current route. */
  active?: boolean
  disabled?: boolean
  /** Merge props into a router `<Link>` instead of rendering an `<a>`. */
  asChild?: boolean
}

/**
 * One nav row: icon plus label, rendered as an `<li><a>` so it must sit inside
 * a `SidebarGroup`.
 *
 * Collapsed, the label stays in the DOM as `sr-only` text rather than becoming
 * an `aria-label`. Both give the link an accessible name, but real text is what
 * translation tooling and "find on page" can reach, and it means the name can
 * never drift from what sighted users read once expanded.
 */
export function SidebarItem({
  icon,
  label,
  active = false,
  disabled = false,
  asChild = false,
  className,
  children,
  href,
  title,
  onClick,
  ...rest
}: SidebarItemProps) {
  const { collapsed, isMobile, closeMobile } = useSidebarContext('SidebarItem')

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      event.preventDefault()
      return
    }
    onClick?.(event)
    // Navigating from the drawer should not leave it covering the page it just
    // took you to.
    if (isMobile) closeMobile()
  }

  const content = (
    <>
      <span className={itemIconStyles} aria-hidden="true">
        {icon}
      </span>
      {collapsed ? (
        <span className="sr-only">{label}</span>
      ) : (
        <span className={itemLabelStyles}>{label}</span>
      )}
    </>
  )

  const shared = {
    ...rest,
    className: cn(itemStyles({ active, collapsed, disabled }), className),
    'aria-current': active ? ('page' as const) : undefined,
    'aria-disabled': disabled || undefined,
    // TODO: <Tooltip> — replace this native title with a right-placed tooltip
    // once Tooltip ships. `title` is the stopgap affordance for collapsed mode.
    title: collapsed ? label : title,
    onClick: handleClick,
  }

  if (asChild) {
    return (
      <li>
        <Slot {...shared}>
          {isValidElement(children)
            ? cloneElement(children as ReactElement<{ children?: ReactNode }>, undefined, content)
            : children}
        </Slot>
      </li>
    )
  }

  return (
    <li>
      {/* A disabled link drops its href: an anchor with no href is not
          focusable or activatable, which is what "not clickable" has to mean
          for an element that cannot carry the `disabled` attribute. */}
      <a {...shared} href={disabled ? undefined : href}>
        {content}
      </a>
    </li>
  )
}
