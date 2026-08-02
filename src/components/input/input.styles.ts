import { cn } from '../../lib/cn'
import { fieldSurface, type FieldStatus, type FieldValidationStatus } from '../../lib/field-styles'

/**
 * Input reuses the shared field chrome wholesale — label, status ramp, border
 * behaviour, message line — and only adds the geometry of a single-line
 * control. Anything that Textarea also needs belongs in `lib/field-styles`, not
 * here, so the two cannot drift.
 */
export {
  fieldGroupStyles,
  labelStyles,
  messageStyles,
  requiredMarkerStyles,
  statusForegroundStyles,
  statusIcons,
} from '../../lib/field-styles'

export type InputStatus = FieldStatus
export type InputValidationStatus = FieldValidationStatus

export interface ControlStyleOptions {
  status?: InputStatus
  disabled?: boolean
}

/**
 * The bordered box. Height matches the `md` Button so the two line up in a row.
 * `px-2` is the 12px side padding; adornments sit inside it with a 4px gap to
 * the text.
 */
export function controlStyles(options: ControlStyleOptions = {}) {
  return cn('flex h-control-md w-full items-center gap-0 px-2', fieldSurface(options))
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
