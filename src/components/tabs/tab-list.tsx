import { useEffect, useRef, type ReactNode } from 'react'

import { cn } from '../../lib/cn'
import { useTabsContext } from './tabs-context'
import { listStyles } from './tabs.styles'

export interface TabListProps {
  className?: string
  /** `Tab` items. */
  children?: ReactNode
  /** Accessible name for the tab set. */
  'aria-label'?: string
  'aria-labelledby'?: string
}

/**
 * The tab rail.
 *
 * Arrow-key handling deliberately lives on `Tab`, not here: with a roving tab
 * order the tablist itself is never focusable, so a keyboard handler on it
 * would only ever fire via bubbling — and an interactive role with no way to
 * focus it is exactly what the a11y lint flags.
 */
export function TabList({ className, children, ...rest }: TabListProps) {
  const { value, select, variant } = useTabsContext('TabList')
  const listRef = useRef<HTMLDivElement>(null)

  // With nothing selected, fall back to the first enabled tab so a panel is
  // always showing.
  useEffect(() => {
    if (value !== undefined) return
    const first = listRef.current?.querySelector<HTMLButtonElement>('[role="tab"]:not(:disabled)')
    const fallback = first?.dataset.value
    if (fallback) select(fallback)
  }, [value, select])

  // Keep the active tab visible when the rail has scrolled.
  useEffect(() => {
    if (value === undefined) return
    const active = listRef.current?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')
    active?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [value])

  return (
    <div
      {...rest}
      ref={listRef}
      role="tablist"
      aria-orientation="horizontal"
      className={cn(listStyles[variant], className)}
    >
      {children}
    </div>
  )
}
