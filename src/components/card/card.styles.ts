import { cn } from '../../lib/cn'

export type CardVariant = 'elevated' | 'outlined' | 'filled' | 'ghost'
export type CardPadding = 'none' | 'sm' | 'md' | 'lg'

const base = cn(
  'rounded-md border',
  'transition-[box-shadow,border-color,background-color] duration-150 ease-out',
  'motion-reduce:transition-none',
)

/**
 * Light leans on shadow for elevation, dark on a border — a shadow barely
 * registers against a near-black page, and in dark mode `surface-default` is
 * the same value as `bg-subtle`, so an elevated card would otherwise dissolve
 * into the page.
 *
 * Every variant carries a border (transparent where none shows), so switching
 * variant or mode never shifts the box by a pixel.
 */
const variantStyles: Record<CardVariant, string> = {
  elevated: 'border-transparent bg-bg-default shadow-sm dark:border-border-subtle',
  outlined: 'border-border-default bg-bg-default',
  // `bg-subtle`, never `bg-muted`: bg-muted is a mid grey (black-100), and
  // `text-default` on it is only 3.23:1 in dark mode.
  filled: 'border-transparent bg-bg-subtle',
  ghost: 'border-transparent bg-transparent',
}

/**
 * `p-[0]` rather than `p-0` — this theme replaces Tailwind's spacing scale and
 * `p-0` resolves to 4px, not zero. See the note in theme.css.
 */
const paddingStyles: Record<CardPadding, string> = {
  none: 'p-[0]',
  sm: 'p-2',
  md: 'p-3',
  lg: 'p-4',
}

/** One elevation step up on hover, plus the usual keyboard-only ring. */
const interactiveStyles: Record<CardVariant, string> = {
  elevated: 'hover:shadow-md',
  outlined: 'hover:shadow-sm dark:hover:border-border-default',
  filled: 'hover:shadow-sm',
  ghost: 'hover:bg-bg-subtle',
}

const interactiveBase = cn(
  'w-full cursor-pointer text-left',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring-default',
)

export interface CardStyleOptions {
  variant?: CardVariant
  padding?: CardPadding
  interactive?: boolean
}

export function cardStyles({
  variant = 'elevated',
  padding = 'md',
  interactive = false,
}: CardStyleOptions = {}) {
  return cn(
    base,
    variantStyles[variant],
    paddingStyles[padding],
    interactive && interactiveBase,
    interactive && interactiveStyles[variant],
  )
}

/* ---------------------------------------------------------------- parts -- */

export const headerStyles = 'mb-2 flex items-start justify-between gap-2'

export const headerTitleGroupStyles = 'flex min-w-0 flex-col gap-0'

export const titleRowStyles = 'flex items-center gap-0'

export const titleStyles = 'text-md font-bold text-text-less-prominent'

export const descriptionStyles = 'text-sm text-text-subtle'

/**
 * v1 hint affordance. Focusable and labelled so the text is reachable by
 * keyboard and announced, rather than being hover-only.
 * TODO: swap to <Tooltip> when that component exists.
 */
export const hintStyles = cn(
  'inline-flex size-icon-sm shrink-0 items-center justify-center text-text-subtle',
  'rounded-full',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring-default',
  '[&>svg]:size-full',
)

export const bodyStyles = 'min-w-0'

/**
 * No divider by default — the spec leaves separation to the consumer, and
 * `divider-default` is only 1.33:1 against the light surface anyway.
 */
export const footerStyles = 'mt-2 flex items-center gap-1'

/* ------------------------------------------------------------ StatCard -- */

export const statValueRowStyles = 'flex items-end justify-between gap-2'

export const statValueGroupStyles = 'flex min-w-0 items-baseline gap-0'

/**
 * `primary-fg`, not `primary-default`: as a foreground on a surface this has to
 * lighten in dark mode, where blue-300 reaches only 2.84:1.
 *
 * At `text-2xl` bold this is WCAG large text, so the 3:1 threshold applies —
 * which it clears on every surface (4.71 light, 4.40 dark, 4.26 on a filled
 * card). The `suffix` beside it is normal-size text and uses `text-subtle`,
 * which clears the full 4.5:1.
 */
export const statValueStyles = 'text-2xl font-bold text-primary-fg'

export const statSuffixStyles = 'text-sm text-text-subtle'

export const statBadgeGroupStyles = 'flex shrink-0 flex-col items-end gap-0'

export const statBadgeLabelStyles = 'text-xs text-text-subtle'
