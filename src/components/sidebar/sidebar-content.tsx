import type { HTMLAttributes } from 'react'

import { cn } from '../../lib/cn'
import { contentStyles } from './sidebar.styles'

/**
 * Typed against `HTMLElement` rather than `HTMLDivElement` because this renders
 * a `<nav>`: the root is an `<aside>` (a complementary landmark), so the actual
 * navigation landmark has to live here for screen-reader landmark navigation to
 * find the links.
 */
export type SidebarContentProps = HTMLAttributes<HTMLElement>

/** The scrollable middle region. Holds the groups. */
export function SidebarContent({ className, children, ...rest }: SidebarContentProps) {
  return (
    <nav {...rest} className={cn(contentStyles, className)}>
      {children}
    </nav>
  )
}
