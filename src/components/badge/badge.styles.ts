import { cn } from '../../lib/cn'

export type BadgeIntent = 'primary' | 'success' | 'warning' | 'error'
export type BadgeVariant = 'filled' | 'outlined'
export type BadgeSize = 'sm' | 'md'
export type BadgeShape = 'pill' | 'rounded'

const base = cn(
  'inline-flex max-w-full items-center gap-0 border font-medium',
  'transition-[color,background-color,border-color] duration-150 ease-out',
  'motion-reduce:transition-none',
)

/**
 * `rounded` reuses `radius-control` (5px) — the same corner as Button, Input
 * and the Select trigger — so chips sitting inside a Select read as part of the
 * field rather than as loose pills.
 */
const shapeStyles: Record<BadgeShape, string> = {
  pill: 'rounded-full',
  rounded: 'rounded-control',
}

/**
 * Heights are 20/28px, which are off the spacing scale, so they are set as
 * arbitrary values. Everything else comes from tokens.
 */
const sizeStyles: Record<BadgeSize, string> = {
  sm: 'h-[1.5rem] px-1 text-xs',
  md: 'h-[2rem] px-2 text-sm',
}

export const badgeIconSizeStyles: Record<BadgeSize, string> = {
  sm: 'size-[0.75rem]',
  md: 'size-[1rem]',
}

/**
 * Filled uses the `*-fill` tokens with their matching `text-on-*` label. Both
 * sides are fixed across light and dark: the fill does not flip per mode, so a
 * label that flipped would lose its contrast in one of them.
 */
const filledStyles: Record<BadgeIntent, string> = {
  primary: 'border-transparent bg-primary-default text-text-on-primary',
  success: 'border-transparent bg-success-fill text-text-on-success',
  warning: 'border-transparent bg-warning-fill text-text-on-warning',
  error: 'border-transparent bg-error-fill text-text-on-error',
}

/**
 * Outlined paints the intent as a foreground on the page surface, so it follows
 * the `*-fg` ramp, which does flip per mode.
 */
const outlinedStyles: Record<BadgeIntent, string> = {
  primary: 'border-primary-fg bg-transparent text-primary-fg',
  success: 'border-success-fg bg-transparent text-success-fg',
  warning: 'border-warning-fg bg-transparent text-warning-fg',
  error: 'border-error-default bg-transparent text-error-default',
}

const disabledStyles: Record<BadgeVariant, string> = {
  filled: 'border-transparent bg-bg-disabled text-text-disabled',
  outlined: 'border-border-disabled bg-transparent text-text-disabled',
}

export interface BadgeStyleOptions {
  intent?: BadgeIntent
  variant?: BadgeVariant
  size?: BadgeSize
  shape?: BadgeShape
  disabled?: boolean
}

export function badgeStyles({
  intent = 'primary',
  variant = 'filled',
  size = 'md',
  shape = 'pill',
  disabled = false,
}: BadgeStyleOptions = {}) {
  return cn(
    base,
    variant === 'filled' ? filledStyles[intent] : outlinedStyles[intent],
    sizeStyles[size],
    shapeStyles[shape],
    disabled && disabledStyles[variant],
    // After the size classes: Tailwind's `text-*` utilities carry a
    // line-height, and tailwind-merge drops any `leading-*` placed before one.
    'leading-none',
  )
}

/** The label truncates rather than letting a long chip blow out its container. */
export const badgeLabelStyles = 'truncate'

export const badgeIconStyles = 'shrink-0 [&>svg]:size-full'

/**
 * The remove control inherits the badge's text colour so it works on every
 * intent without a per-intent map. Hover deepens it via the current colour
 * rather than a new token.
 */
export const badgeRemoveStyles = cn(
  'shrink-0 rounded-full text-current opacity-70',
  'cursor-pointer not-disabled:hover:opacity-100',
  'disabled:cursor-not-allowed disabled:opacity-70',
  'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring-default',
  'transition-opacity duration-150 ease-out motion-reduce:transition-none',
  '[&>svg]:size-full',
)
