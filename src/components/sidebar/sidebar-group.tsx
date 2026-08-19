import { useId, type HTMLAttributes } from 'react'

import { cn } from '../../lib/cn'
import { useSidebarContext } from './sidebar-context'
import { groupLabelStyles, groupListStyles, groupStyles } from './sidebar.styles'

export interface SidebarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Section heading — "General", "Admin Panel", "Account". */
  label?: string
}

/**
 * A labelled section of nav items. Children must be `SidebarItem`s: this
 * renders the `<ul>` they expect to be `<li>`s inside.
 *
 * When collapsed the heading goes `sr-only` rather than `display: none`. It
 * disappears visually either way and takes up no space, but staying in the
 * accessibility tree keeps the list's `aria-labelledby` pointing at real text —
 * a hidden target would silently leave the group unnamed for screen readers.
 */
export function SidebarGroup({ label, className, children, ...rest }: SidebarGroupProps) {
  const { collapsed } = useSidebarContext('SidebarGroup')
  const labelId = useId()

  return (
    <div {...rest} className={cn(groupStyles, className)}>
      {label ? (
        <div id={labelId} className={collapsed ? 'sr-only' : groupLabelStyles}>
          {label}
        </div>
      ) : null}
      <ul className={groupListStyles} aria-labelledby={label ? labelId : undefined}>
        {children}
      </ul>
    </div>
  )
}
