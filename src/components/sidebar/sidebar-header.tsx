import { PanelLeft, PanelLeftClose, X } from 'lucide-react'
import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '../../lib/cn'
import { useSidebarContext } from './sidebar-context'
import { headerButtonStyles, headerLogoStyles, headerStyles } from './sidebar.styles'

export interface SidebarHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Logo shown when expanded. Nothing renders if omitted. */
  logo?: ReactNode
  /** Smaller mark shown when collapsed; falls back to `logo`. */
  logoCollapsed?: ReactNode
  /** Show the built-in collapse toggle. @default true */
  showCollapseToggle?: boolean
}

/**
 * The logo slot plus the collapse control. The component never ships a brand
 * asset of its own — `logo` is a slot and renders nothing when unset.
 *
 * On mobile the collapse toggle becomes a close button: the drawer is already
 * an overlay, so icon-only is meaningless there, while a visible dismiss target
 * is the only way out for a touch user who cannot press Escape.
 */
export function SidebarHeader({
  logo,
  logoCollapsed,
  showCollapseToggle = true,
  className,
  children,
  ...rest
}: SidebarHeaderProps) {
  const { collapsed, setCollapsed, isMobile, closeMobile } = useSidebarContext('SidebarHeader')

  const mark = collapsed ? (logoCollapsed ?? logo) : logo

  return (
    <div {...rest} className={cn(headerStyles({ collapsed }), className)}>
      {mark ? <div className={headerLogoStyles}>{mark}</div> : null}

      {showCollapseToggle ? (
        isMobile ? (
          <button
            type="button"
            className={headerButtonStyles}
            aria-label="Close navigation"
            onClick={closeMobile}
          >
            <X aria-hidden="true" />
          </button>
        ) : (
          <button
            type="button"
            className={headerButtonStyles}
            aria-expanded={!collapsed}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <PanelLeft aria-hidden="true" /> : <PanelLeftClose aria-hidden="true" />}
          </button>
        )
      ) : null}

      {children}
    </div>
  )
}
