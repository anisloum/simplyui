import { cn } from '../../lib/cn'

export type TabsVariant = 'pill' | 'underline'

/**
 * The rail scrolls horizontally when tabs overflow. The scrollbar is hidden —
 * the tab row is its own affordance — but scrolling stays available to wheel,
 * drag, touch and keyboard.
 */
const listBase = cn(
  'scrollbar-none flex items-center overflow-x-auto',
  'scroll-smooth motion-reduce:scroll-auto',
)

export const listStyles: Record<TabsVariant, string> = {
  pill: cn(listBase, 'gap-0'),
  // `items-stretch` so every tab's bottom edge lands exactly on the list's
  // content box — that is what lets the active indicator sit precisely on the
  // rule below rather than a pixel off it.
  underline: cn(listBase, 'z-0 items-stretch gap-0 border-b-[3px] border-border-subtle'),
}

const tabBase = cn(
  // `relative` anchors the underline variant's indicator.
  'relative inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap',
  'px-2 py-1 text-sm font-medium',
  'transition-colors duration-150 ease-out motion-reduce:transition-none',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring-default',
  'disabled:cursor-not-allowed disabled:text-text-disabled',
)

/**
 * Both variants use the `*-fg` ramp rather than the fill ramp for their text,
 * because that text sits on the page surface and has to lighten in dark mode.
 * The one exception is the pill's active label, which sits ON the fill and so
 * takes `text-on-primary` — fixed in both modes, like every other filled label.
 *
 * The hover label steps to `primary-fg-hover` along with the wash, exactly as
 * Button's ghost variant does: `primary-fg` on the hover wash is only 4.26:1.
 */
export const tabStyles: Record<TabsVariant, { active: string; inactive: string }> = {
  pill: {
    active: cn(tabBase, 'rounded-control bg-primary-default text-text-on-primary'),
    inactive: cn(
      tabBase,
      'rounded-control bg-transparent text-primary-fg',
      'not-disabled:hover:bg-primary-wash-hover not-disabled:hover:text-primary-fg-hover',
    ),
  },
  underline: {
    /**
     * The indicator is a pseudo-element pinned to the tab's bottom edge, not a
     * bottom border. A border sits *inside* the tab, so it lands above the
     * list's rule and the two stack into a thicker band; nudging it with a
     * negative margin only half-covers the rule and shifts with flex sizing.
     *
     * Pinned at `-bottom-[3px]` with a matching 3px height, it occupies exactly
     * the rule's own 3px band — same thickness, same line, just repainted blue.
     */
    active: cn(
      tabBase,
      'text-primary-fg',
      'after:absolute after:inset-x-0 after:-bottom-[3px] after:h-[3px]',
      "after:bg-primary-fg after:content-['']",
    ),
    inactive: cn(tabBase, 'text-text-subtle', 'not-disabled:hover:text-text-default'),
  },
}

export const panelStyles = cn(
  'py-2 text-sm text-text-default',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring-default',
)
