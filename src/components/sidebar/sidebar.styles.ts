import { cn } from '../../lib/cn'

/**
 * NOTE ON SPACING: the token scale has no true zero — `gap-0` is 4px and `p-0`
 * is 4px (see the spacing block in theme.css). Where a hard zero is meant, this
 * file uses the literal `[0]` form. Where 4px is meant, `-0` is deliberate.
 */

/**
 * The shell in both modes. `min-h-0` lets the scrollable middle actually shrink
 * inside the flex column; without it the content region refuses to scroll and
 * pushes the footer off the bottom instead.
 *
 * The right edge is drawn in both themes — a sidebar needs a visible boundary
 * even on a light page where the surface and the canvas are close in value.
 */
export const rootStyles = cn(
  'm-[20px] flex h-[calc(100%-40px)] min-h-0 flex-col overflow-hidden p-[10px]',
  'rounded-sm border border-border-subtle bg-bg-default',
  'transition-[width] duration-200 ease-out motion-reduce:transition-none',
)

/** Fixed layer holding the mobile backdrop + panel. */
export const mobileLayerStyles = 'fixed inset-[0] z-modal'

export const backdropStyles = cn('absolute inset-[0] bg-overlay-default', 'animate-overlay')

/**
 * The off-canvas panel. `max-w-[85vw]` keeps a strip of the page behind visible
 * on narrow phones, which is what makes the backdrop readable as "tap here to
 * dismiss" rather than as a dead margin.
 */
export const mobilePanelStyles = cn(
  rootStyles,
  'absolute inset-y-[0] left-[0] max-w-[85vw] shadow-lg outline-none',
  'animate-panel-left',
)

/* -------------------------------------------------------------------------- */
/* Header                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Expanded: logo left, toggle right. Collapsed: the pair stacks and centres,
 * because 72px cannot hold both side by side.
 */
export function headerStyles({ collapsed = false } = {}) {
  return cn(
    'flex shrink-0 items-center gap-1 py-2',
    collapsed ? 'flex-col justify-center px-1' : 'justify-between px-2',
  )
}

export const headerLogoStyles = 'flex min-w-0 items-center overflow-hidden'

/**
 * Toggle and mobile-close button. Sized off the control scale so it stays a
 * comfortable target, and given the same neutral wash as an inactive item so
 * the header reads as part of the same surface.
 */
export const headerButtonStyles = cn(
  'inline-flex size-control-sm shrink-0 cursor-pointer items-center justify-center',
  'rounded-control text-text-subtle',
  'transition-colors duration-150 ease-out motion-reduce:transition-none',
  'hover:bg-primary-wash-hover hover:text-text-default',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring-default',
  '[&>svg]:size-icon-lg',
)

/* -------------------------------------------------------------------------- */
/* Content / groups                                                            */
/* -------------------------------------------------------------------------- */

/**
 * The scrolling middle. Scrollbar hidden like the Tabs rail — the nav is short
 * enough that a visible bar reads as chrome, and `overflow-x-hidden` stops the
 * width transition from momentarily producing a horizontal scrollbar.
 */
export const contentStyles = cn(
  'scrollbar-none min-h-0 flex-1 overflow-x-hidden overflow-y-auto',
  'px-1 py-2',
)

/** `mt-2` (12px) separates groups; the first one sits flush under the header. */
export const groupStyles = 'mt-4 flex flex-col first:mt-[0]'

export const groupLabelStyles = 'px-1 pb-0 text-base font-bold text-text-default mb-2'

/** `gap-0` here is the 4px token, not zero — a hairline between item rows. */
export const groupListStyles = 'flex list-none flex-col gap-[5px] p-[0]'

/* -------------------------------------------------------------------------- */
/* Item                                                                        */
/* -------------------------------------------------------------------------- */

export interface ItemStyleOptions {
  active?: boolean
  collapsed?: boolean
  disabled?: boolean
}

/**
 * Active is a solid primary fill with `text-on-primary` on top — the fixed
 * light label every filled surface in the system uses. `text-inverse` would be
 * wrong here: it flips to near-black in dark mode, which on the blue fill lands
 * at ~3:1 and fails AA.
 *
 * Inactive hover is the neutral wash, matching Button's ghost variant, so the
 * nav never competes with the active item for attention.
 */
export function itemStyles({
  active = false,
  collapsed = false,
  disabled = false,
}: ItemStyleOptions = {}) {
  return cn(
    'flex w-full items-center rounded-control py-1 no-underline',
    'text-sm font-medium',
    'transition-colors duration-150 ease-out motion-reduce:transition-none',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring-default',
    collapsed ? 'justify-center px-1' : 'gap-1 px-2',
    disabled && 'pointer-events-none text-text-disabled',
    !disabled && active && 'bg-primary-default text-text-on-primary hover:bg-primary-hover',
    !disabled && !active && 'cursor-pointer text-text-default hover:bg-primary-wash-hover',
  )
}

export const itemIconStyles = cn(
  'flex size-icon-md shrink-0 items-center justify-center',
  '[&>svg]:size-full',
)

export const itemLabelStyles = 'min-w-0 flex-1 truncate text-left'

/* -------------------------------------------------------------------------- */
/* Footer                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * `mt-auto` pins the footer to the bottom even when no `SidebarContent` is
 * present to absorb the free space.
 */
export const footerStyles = 'mt-auto shrink-0 px-1 pt-2 pb-2'
