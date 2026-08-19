import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'

import { cn } from '../../lib/cn'
import { useDismissableLayer } from '../../lib/use-dismissable-layer'
import { useMediaQuery } from '../../lib/use-media-query'
import { SidebarContext } from './sidebar-context'
import { backdropStyles, mobileLayerStyles, mobilePanelStyles, rootStyles } from './sidebar.styles'

/** Tailwind's `md`. Above it the sidebar is inline; below it, a drawer. */
const DESKTOP_QUERY = '(min-width: 48rem)'

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  /** Controlled collapsed (icon-only) state. */
  collapsed?: boolean
  defaultCollapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  /** Width when expanded. @default "380px" */
  expandedWidth?: string
  /** Width when collapsed (icon-only). @default "72px" */
  collapsedWidth?: string
  /** Controlled open state for the MOBILE off-canvas drawer. */
  mobileOpen?: boolean
  defaultMobileOpen?: boolean
  onMobileOpenChange?: (open: boolean) => void
  /** `SidebarHeader` / `SidebarContent` / `SidebarFooter`. */
  children?: ReactNode
}

/**
 * Owns collapse state and responsive mode; the content structure is entirely
 * the consumer's, assembled from the exported parts.
 *
 * Two renders, not one styled two ways: on desktop this is an inline `<aside>`,
 * and below `md` it is a portalled `role="dialog"` panel over a backdrop. The
 * dialog semantics, focus trap and scroll lock cannot be expressed as a media
 * query, so the mode is resolved in JS and the tree differs accordingly.
 *
 * Collapse state is never persisted here — see the README for how to store it.
 */
export function Sidebar({
  collapsed: controlledCollapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  expandedWidth = '380px',
  collapsedWidth = '72px',
  mobileOpen: controlledMobileOpen,
  defaultMobileOpen = false,
  onMobileOpenChange,
  className,
  children,
  style,
  ...rest
}: SidebarProps) {
  const isDesktop = useMediaQuery(DESKTOP_QUERY, true)
  const isMobile = !isDesktop

  const isCollapsedControlled = controlledCollapsed !== undefined
  const [uncontrolledCollapsed, setUncontrolledCollapsed] = useState(defaultCollapsed)
  const collapsedState = isCollapsedControlled ? controlledCollapsed : uncontrolledCollapsed

  const setCollapsed = useCallback(
    (next: boolean) => {
      if (!isCollapsedControlled) setUncontrolledCollapsed(next)
      onCollapsedChange?.(next)
    },
    [isCollapsedControlled, onCollapsedChange],
  )

  const isMobileControlled = controlledMobileOpen !== undefined
  const [uncontrolledMobileOpen, setUncontrolledMobileOpen] = useState(defaultMobileOpen)
  const mobileOpen = isMobileControlled ? controlledMobileOpen : uncontrolledMobileOpen

  const setMobileOpen = useCallback(
    (next: boolean) => {
      if (!isMobileControlled) setUncontrolledMobileOpen(next)
      onMobileOpenChange?.(next)
    },
    [isMobileControlled, onMobileOpenChange],
  )

  const closeMobile = useCallback(() => setMobileOpen(false), [setMobileOpen])

  // Growing past `md` needs no state reset: the desktop branch simply does not
  // render the drawer, and `useDismissableLayer` is handed `isMobile &&
  // mobileOpen`, so its scroll lock and focus trap tear themselves down. The
  // consumer's `mobileOpen` is left alone on purpose — resetting it from an
  // effect would be a cascading render, and preserving it means shrinking back
  // below `md` restores exactly what the user had open.

  // The drawer always shows full labels, so parts read `collapsed` as false there.
  const effectiveCollapsed = isMobile ? false : collapsedState

  const context = useMemo(
    () => ({ collapsed: effectiveCollapsed, setCollapsed, isMobile, closeMobile }),
    [effectiveCollapsed, setCollapsed, isMobile, closeMobile],
  )

  const panelRef = useRef<HTMLElement>(null)

  useDismissableLayer({
    open: isMobile && mobileOpen,
    layerRef: panelRef,
    onDismiss: closeMobile,
  })

  // A portal escapes any `.dark` ancestor, so the theme has to be carried over
  // explicitly — same approach MenuContent takes.
  const [darkContext, setDarkContext] = useState(false)
  const probeRef = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (isMobile && mobileOpen) {
      setDarkContext(probeRef.current?.closest('.dark') != null)
    }
  }, [isMobile, mobileOpen])

  const label = rest['aria-label'] ?? (rest['aria-labelledby'] ? undefined : 'Main navigation')

  if (isMobile) {
    return (
      <SidebarContext.Provider value={context}>
        {/* Anchors the theme probe in the consumer's tree, where `.dark` lives. */}
        <span ref={probeRef} hidden />
        {mobileOpen && typeof document !== 'undefined'
          ? createPortal(
              <div className={cn(darkContext && 'dark', mobileLayerStyles)}>
                <div className={backdropStyles} aria-hidden="true" />
                <aside
                  {...rest}
                  ref={panelRef}
                  role="dialog"
                  aria-modal="true"
                  aria-label={label}
                  tabIndex={-1}
                  className={cn(mobilePanelStyles, className)}
                  style={{ width: expandedWidth, ...style }}
                >
                  {children}
                </aside>
              </div>,
              document.body,
            )
          : null}
      </SidebarContext.Provider>
    )
  }

  return (
    <SidebarContext.Provider value={context}>
      <aside
        {...rest}
        aria-label={label}
        className={cn(rootStyles, className)}
        style={{ width: collapsedState ? collapsedWidth : expandedWidth, ...style }}
      >
        {children}
      </aside>
    </SidebarContext.Provider>
  )
}
