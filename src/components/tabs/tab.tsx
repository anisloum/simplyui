import type { KeyboardEvent, ReactNode } from 'react'

import { cn } from '../../lib/cn'
import { panelId, tabId, useTabsContext } from './tabs-context'
import { tabStyles } from './tabs.styles'

export interface TabProps {
  value: string
  disabled?: boolean
  className?: string
  /** The tab's label. */
  children?: ReactNode
}

/**
 * A single tab. Only the active one is in the tab order (roving tabindex), so
 * Tab moves into and out of the whole set rather than through every tab.
 *
 * Arrow keys use automatic activation — selection follows focus — which is the
 * expected behaviour when panels are cheap to render.
 *
 * Siblings are read out of the DOM rather than from a registry, so navigation
 * follows visual order and needs no bookkeeping when tabs are added, removed or
 * reordered. Disabled tabs carry the real `disabled` attribute, which makes
 * `:not(:disabled)` the whole of the skipping logic.
 */
export function Tab({ value, disabled = false, className, children }: TabProps) {
  const { value: active, select, variant, baseId } = useTabsContext('Tab')
  const isActive = active === value

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const list = event.currentTarget.closest('[role="tablist"]')
    if (!list) return

    const tabs = Array.from(list.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)'))
    if (tabs.length === 0) return

    const index = tabs.indexOf(event.currentTarget)
    const moveTo = (tab: HTMLButtonElement | undefined) => {
      if (!tab) return
      tab.focus()
      const next = tab.dataset.value
      if (next) select(next)
    }

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault()
        moveTo(tabs[(index + 1 + tabs.length) % tabs.length])
        break
      case 'ArrowLeft':
        event.preventDefault()
        moveTo(tabs[(index - 1 + tabs.length) % tabs.length])
        break
      case 'Home':
        event.preventDefault()
        moveTo(tabs[0])
        break
      case 'End':
        event.preventDefault()
        moveTo(tabs[tabs.length - 1])
        break
      default:
        break
    }
  }

  return (
    <button
      type="button"
      role="tab"
      id={tabId(baseId, value)}
      // Read by the keyboard handler, which walks the DOM rather than a registry.
      data-value={value}
      aria-selected={isActive}
      aria-controls={panelId(baseId, value)}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      className={cn(isActive ? tabStyles[variant].active : tabStyles[variant].inactive, className)}
      onClick={() => select(value)}
      onKeyDown={handleKeyDown}
    >
      {children}
    </button>
  )
}
