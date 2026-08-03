import type { ReactNode } from 'react'

import { cn } from '../../lib/cn'
import { panelId, tabId, useTabsContext } from './tabs-context'
import { panelStyles } from './tabs.styles'

export interface TabPanelProps {
  /** Matches its `Tab`'s value. */
  value: string
  className?: string
  children?: ReactNode
}

/**
 * The content for one tab. Inactive panels stay mounted and are hidden with the
 * `hidden` attribute, so scroll position and any local state survive switching.
 */
export function TabPanel({ value, className, children }: TabPanelProps) {
  const { value: active, baseId } = useTabsContext('TabPanel')
  const isActive = active === value

  return (
    <div
      role="tabpanel"
      id={panelId(baseId, value)}
      aria-labelledby={tabId(baseId, value)}
      hidden={!isActive}
      // Focusable so keyboard users can reach panel content that holds no
      // controls of its own.
      tabIndex={isActive ? 0 : undefined}
      className={cn(panelStyles, className)}
    >
      {children}
    </div>
  )
}
