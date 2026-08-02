import { cn } from '../../lib/cn'

export type ButtonVariant = 'solid' | 'outline' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

/**
 * Shared geometry and behaviour.
 *
 * Every variant renders a 1px border — transparent for solid/ghost — so all
 * three share one box size and text baseline. Without it, swapping variant
 * shifts the label by a pixel.
 *
 * Interactive states use `not-disabled:` rather than `enabled:`: `:enabled`
 * only matches form controls, so it would silently drop hover/press styling on
 * the `asChild` anchor case.
 */
const base = cn(
  'relative inline-flex cursor-pointer items-center justify-center',
  'rounded-control border font-medium whitespace-nowrap',
  'transition-[color,background-color,border-color] duration-150 ease-out',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring-default',
  'disabled:cursor-not-allowed',
  'motion-reduce:transition-none',
)

/**
 * Wash tokens are neutral grey by design — not a tinted primary. Do not
 * "correct" them to blue.
 */
const variantStyles: Record<ButtonVariant, string> = {
  solid: cn(
    // `text-on-primary`, not `text-inverse`: the fill stays blue in dark mode,
    // so the label has to stay light rather than flipping to the dark-mode
    // inverse (which is near-black).
    'border-transparent bg-primary-default text-text-on-primary',
    'not-disabled:hover:bg-primary-hover',
    'not-disabled:active:bg-primary-active',
    'disabled:bg-primary-disabled disabled:text-text-on-primary',
  ),
  // `primary-fg`, not `primary-default`: these two render primary as a label
  // and a border on a neutral surface, so they follow the foreground ramp
  // (which lightens in dark mode) rather than the fill ramp (which does not).
  // The label steps with the wash so it stays legible as the wash deepens.
  outline: cn(
    'border-primary-fg bg-transparent text-primary-fg',
    'not-disabled:hover:bg-primary-wash-hover not-disabled:hover:text-primary-fg-hover',
    'not-disabled:active:border-primary-fg-active not-disabled:active:bg-primary-wash-active not-disabled:active:text-primary-fg-active',
    'disabled:border-border-disabled disabled:bg-transparent disabled:text-text-disabled',
  ),
  ghost: cn(
    'border-transparent bg-transparent text-primary-fg',
    'not-disabled:hover:bg-primary-wash-hover not-disabled:hover:text-primary-fg-hover',
    'not-disabled:active:bg-primary-wash-active not-disabled:active:text-primary-fg-active',
    'disabled:border-transparent disabled:bg-transparent disabled:text-text-disabled',
  ),
}

/**
 * The disabled appearance without the `disabled:` variant prefix. A non-button
 * element — the `asChild` case — has no `:disabled` state for the variant to
 * hook into, so the look has to be applied unconditionally instead.
 */
export const disabledStyles: Record<ButtonVariant, string> = {
  solid: 'bg-primary-disabled text-text-on-primary',
  outline: 'border-border-disabled bg-transparent text-text-disabled',
  ghost: 'border-transparent bg-transparent text-text-disabled',
}

/**
 * Text-button geometry. Height comes from the semantic control token; the
 * spacing scale starts at 4px, so `py-0` is 4px and `px-2` is 12px.
 */
const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-control-sm gap-0 px-2 py-0 text-sm',
  md: 'h-control-md gap-0 px-4 py-1 text-base',
  lg: 'h-control-lg gap-1 px-5 py-1 text-lg',
}

/** Icon-only geometry: square, side == the control height for that size. */
const iconOnlySizeStyles: Record<ButtonSize, string> = {
  sm: 'h-control-sm w-control-sm',
  md: 'h-control-md w-control-md',
  lg: 'h-control-lg w-control-lg',
}

/** Icon box for a given button size, used for both `icon` and the spinner. */
export const iconSizeStyles: Record<ButtonSize, string> = {
  sm: 'size-icon-sm',
  md: 'size-icon-md',
  lg: 'size-icon-lg',
}

export interface ButtonStyleOptions {
  variant?: ButtonVariant
  size?: ButtonSize
  iconOnly?: boolean
  fullWidth?: boolean
}

export function buttonStyles({
  variant = 'solid',
  size = 'md',
  iconOnly = false,
  fullWidth = false,
}: ButtonStyleOptions = {}): string {
  return cn(
    base,
    variantStyles[variant],
    iconOnly ? iconOnlySizeStyles[size] : sizeStyles[size],
    fullWidth && 'w-full',
    // Has to land after the size classes. Tailwind's `text-*` utilities also
    // carry a line-height, so tailwind-merge drops any `leading-*` that comes
    // before one — put `leading-none` in `base` and the label silently renders
    // at ~1.43. It also stays its own `cn()` argument so the Prettier class
    // sorter cannot hoist it back above `text-*` inside a single string.
    'leading-none',
  )
}
