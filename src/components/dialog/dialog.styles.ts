import { cn } from '../../lib/cn'

export type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

/** Fixed layer holding the backdrop and the centred panel. */
export const layerStyles = 'fixed inset-[0] z-modal flex items-center justify-center p-4'

export const backdropStyles = cn('absolute inset-[0] bg-overlay-default', 'animate-overlay')

/**
 * Max-widths per the spec. `full` leaves the layer's own `p-4` as the side
 * margin, which is also what keeps every other size off the viewport edge on a
 * narrow screen — the panel is `w-full` and simply caps at its max-width.
 */
const sizeStyles: Record<DialogSize, string> = {
  sm: 'max-w-[25rem]',
  md: 'max-w-[32rem]',
  lg: 'max-w-[40rem]',
  xl: 'max-w-[50rem]',
  full: 'max-w-full',
}

/**
 * The panel. `max-h-[85vh]` plus a flex column is what lets the header and
 * footer stay pinned while only `DialogBody` scrolls — without the column and
 * the `min-h-0` on the body, a tall body pushes the footer off the bottom
 * instead of scrolling.
 *
 * `bg-surface-default` with a border in both modes: a shadow alone does not
 * separate the panel from a near-black backdrop.
 */
export function contentStyles({ size = 'md' }: { size?: DialogSize } = {}) {
  return cn(
    'relative flex max-h-[85vh] w-full flex-col overflow-hidden',
    'rounded-md border border-border-subtle bg-bg-default shadow-lg',
    'outline-none',
    sizeStyles[size],
    'animate-dialog',
  )
}

/* -------------------------------------------------------------------------- */
/* Parts                                                                       */
/* -------------------------------------------------------------------------- */

/** Header and footer are `shrink-0` so the body is the only thing that gives. */
export const headerStyles = 'flex shrink-0 items-start justify-between gap-2 p-4 pb-2'

export const headerTextStyles = 'flex min-w-0 flex-col gap-0'

/**
 * `primary-fg`, not `primary-default`: the title is a foreground on a surface,
 * so it has to lighten in dark mode where blue-300 manages only 2.84:1. At
 * `text-lg` bold it is WCAG large text either way.
 *
 * Colour lives here rather than being forced inline, so passing `className`
 * with a neutral colour overrides it.
 */
export const titleStyles = 'text-lg font-bold text-primary-fg'

export const descriptionStyles = 'text-sm text-text-subtle'

export const closeStyles = cn(
  'inline-flex size-control-sm shrink-0 cursor-pointer items-center justify-center',
  'rounded-control text-text-subtle',
  'transition-colors duration-150 ease-out motion-reduce:transition-none',
  'hover:bg-primary-wash-hover hover:text-text-default',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring-default',
  '[&>svg]:size-icon-md',
)

/**
 * The only scrolling region. Scrollbar styled rather than hidden — unlike the
 * Tabs rail, a dialog body can be arbitrarily long and the bar is the only cue
 * that there is more below.
 */
export const bodyStyles = 'scrollbar-subtle min-h-0 flex-1 overflow-y-auto px-4 py-2'

export const footerStyles = 'flex shrink-0 flex-wrap items-center justify-end gap-1 p-4 pt-2'
