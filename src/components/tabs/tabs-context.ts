import { createContext, useContext } from 'react'

import type { TabsVariant } from './tabs.styles'

export interface TabsContextValue {
  value: string | undefined
  select: (value: string) => void
  variant: TabsVariant
  baseId: string
}

export const TabsContext = createContext<TabsContextValue | null>(null)

export function useTabsContext(component: string): TabsContextValue {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error(`<${component}> must be rendered inside <Tabs>.`)
  }
  return context
}

export const tabId = (baseId: string, value: string) => `${baseId}-tab-${value}`
export const panelId = (baseId: string, value: string) => `${baseId}-panel-${value}`
