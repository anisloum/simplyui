import { cn } from '../../lib/cn'

export type InputStatus = 'default' | 'success' | 'warning' | 'error'

/** Non-default statuses — the ones that carry a colour, an icon and a message. */
export type InputValidationStatus = Exclude<InputStatus, 'default'>

/** Label → control → message, each gap `space-0` (4px). */
export const fieldGroupStyles = 'flex w-full flex-col gap-0'

export const labelStyles = 'text-sm font-medium text-text-default'

/** The required marker is decorative — the `required` attribute is the real signal. */
export const requiredMarkerStyles = 'text-error-fg'

/**
 * The bordered box. Height matches the `md` Button so the two line up in a row.
 *
 * The ring is on `:focus-within` rather than `:focus-visible`: this is a text
 * field, so a pointer click should show focus too, and focus landing on the
 * password toggle should still light up the field it belongs to.
 */
const controlBase = cn(
  'flex h-control-md w-full items-center gap-0 px-2',
  'rounded-control border bg-bg-default',
  'transition-[color,background-color,border-color] duration-150 ease-out',
  'focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring-default',
  'motion-reduce:transition-none',
)

/**
 * Only the neutral border switches to the focus colour. A status border holds
 * its colour through focus — a focused error field stays red and gains the ring
 * on top, rather than turning blue and dropping the error signal.
 */
const statusBorderStyles: Record<InputStatus, string> = {
  default: 'border-border-default focus-within:border-border-focused',
  success: 'border-border-success',
  warning: 'border-border-warning',
  error: 'border-border-error',
}

/**
 * Feedback used as a foreground (status icon + message) rather than as a fill,
 * so it follows the `*-fg` tokens, which flip per mode. See semantic.css.
 */
export const statusForegroundStyles: Record<InputValidationStatus, string> = {
  success: 'text-success-fg',
  warning: 'text-warning-fg',
  error: 'text-error-fg',
}

export interface ControlStyleOptions {
  status?: InputStatus
  disabled?: boolean
}

export function controlStyles({ status = 'default', disabled = false }: ControlStyleOptions = {}) {
  return cn(
    controlBase,
    statusBorderStyles[status],
    // A wrapper `div` has no `:disabled` of its own, and the disabled look has
    // to beat the status border, so it is applied last and unconditionally.
    disabled && 'border-border-disabled bg-bg-disabled focus-within:border-border-disabled',
  )
}

/**
 * The `<input>` itself is chrome-free — the wrapper draws the border, background
 * and focus ring, so the native control must not paint a second outline inside
 * it.
 */
export const inputStyles = cn(
  'h-full min-w-0 flex-1 border-0 bg-transparent p-0 outline-none',
  'text-base font-regular text-text-default placeholder:text-text-placeholder',
  'disabled:cursor-not-allowed disabled:text-text-disabled',
)

/** Left/right adornment box. */
export const adornmentStyles =
  'flex shrink-0 items-center justify-center size-icon-md [&>svg]:size-full'

/** The password reveal control — a real button, so it gets its own focus ring. */
export const toggleStyles = cn(
  adornmentStyles,
  'rounded-control text-text-subtle',
  'cursor-pointer disabled:cursor-not-allowed disabled:text-text-disabled',
  'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring-default',
)

/** Helper text is neutral; a status message takes the status colour. */
export function messageStyles(status: InputStatus, isStatusMessage: boolean) {
  return cn(
    'text-xs',
    isStatusMessage && status !== 'default' ? statusForegroundStyles[status] : 'text-text-subtle',
  )
}
