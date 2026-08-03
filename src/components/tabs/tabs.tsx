import { useCallback, useId, useMemo, useState, type ReactNode } from 'react'

import { TabsContext } from './tabs-context'
import type { TabsVariant } from './tabs.styles'

export type { TabsVariant }

export interface TabsProps {
  /** Controlled active value. */
  value?: string
  /** Uncontrolled initial value. Falls back to the first enabled tab. */
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** @default "underline" */
  variant?: TabsVariant
  className?: string
  /** A `TabList` plus its `TabPanel`s. */
  children?: ReactNode
}

/**
 * Owns the active tab and hands it to `TabList`, `Tab` and `TabPanel` through
 * context, so the parts can be composed in any arrangement.
 */
export function Tabs({
  value,
  defaultValue,
  onValueChange,
  variant = 'underline',
  className,
  children,
}: TabsProps) {
  const baseId = useId()
  const isControlled = value !== undefined
  const [uncontrolled, setUncontrolled] = useState(defaultValue)
  const active = isControlled ? value : uncontrolled

  const select = useCallback(
    (next: string) => {
      if (!isControlled) setUncontrolled(next)
      onValueChange?.(next)
    },
    [isControlled, onValueChange],
  )

  const context = useMemo(
    () => ({ value: active, select, variant, baseId }),
    [active, select, variant, baseId],
  )

  return (
    <TabsContext.Provider value={context}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}
