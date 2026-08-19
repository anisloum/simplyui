import { createContext, useContext } from 'react'

export interface SidebarContextValue {
  /**
   * Effective collapsed state. Always `false` inside the mobile off-canvas
   * panel — a drawer that is already an overlay has no reason to be icon-only,
   * so the parts can read this single flag and never ask about the viewport.
   */
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  /** Viewport is below the `md` breakpoint, so the sidebar is a drawer. */
  isMobile: boolean
  /** Dismisses the mobile drawer. No-op on desktop. */
  closeMobile: () => void
}

export const SidebarContext = createContext<SidebarContextValue | null>(null)

export function useSidebarContext(component: string): SidebarContextValue {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error(`<${component}> must be rendered inside <Sidebar>.`)
  }
  return context
}
