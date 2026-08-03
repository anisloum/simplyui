import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react'

import { cn } from './cn'

/**
 * Shared chrome for the form-field primitives (Input, Textarea, and whatever
 * follows). Both components render the same label, status ramp, border
 * behaviour and message line, so those live here rather than being copied —
 * the two are meant to stay indistinguishable apart from their control.
 */

export type FieldStatus = 'default' | 'success' | 'warning' | 'error'

/** The statuses that carry a colour, an icon and a message. */
export type FieldValidationStatus = Exclude<FieldStatus, 'default'>

export const statusIcons = {
  success: CheckCircle2,
  warning: AlertCircle,
  error: XCircle,
} as const satisfies Record<FieldValidationStatus, unknown>

/** Label → control → message, each gap `space-0` (4px). */
export const fieldGroupStyles = 'flex w-full flex-col gap-0'

export const labelStyles = 'text-sm font-medium text-text-default'

/** Decorative — the `required` attribute is the real signal. */
export const requiredMarkerStyles = 'text-error-fg'

/**
 * Feedback used as a foreground (status icon + message) rather than as a fill,
 * so it follows the `*-fg` tokens, which flip per mode. See semantic.css.
 */
export const statusForegroundStyles: Record<FieldValidationStatus, string> = {
  success: 'text-success-fg',
  warning: 'text-warning-fg',
  error: 'text-error-fg',
}

/**
 * Keyboard-only focus, in two halves because the surface sits in two different
 * places: `:focus-visible` for when it IS the focusable element (Textarea), and
 * `:has(:focus-visible)` for when it wraps one (Input, Select trigger). Only
 * one of the pair can ever match, so they never fight.
 *
 * Deliberately not `:focus-within`, which also fires for pointer clicks — that
 * put a ring on every field the moment you clicked into it.
 */
const focusRingStyles = cn(
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring-default',
  'has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring-default',
)

/** Border, background and focus ring for the bordered control. */
export const fieldSurfaceStyles = cn(
  'rounded-control border bg-bg-default',
  'transition-[color,background-color,border-color] duration-150 ease-out',
  focusRingStyles,
  'motion-reduce:transition-none',
)

/**
 * Only the neutral border switches to the focus colour. A status border holds
 * its colour through focus — a focused error field stays red and gains the ring
 * on top, rather than turning blue and dropping the error signal.
 */
export const statusBorderStyles: Record<FieldStatus, string> = {
  default:
    'border-border-default focus-visible:border-border-focused has-focus-visible:border-border-focused',
  success: 'border-border-success',
  warning: 'border-border-warning',
  error: 'border-border-error',
}

/**
 * Applied last and unconditionally: it has to beat the status border, and a
 * wrapper `div` has no `:disabled` of its own to hook a variant onto.
 */
export const disabledSurfaceStyles =
  'border-border-disabled bg-bg-disabled has-focus-visible:border-border-disabled'

/** Helper text is neutral; a status message takes the status colour. */
export function messageStyles(status: FieldStatus, isStatusMessage: boolean) {
  return cn(
    'text-xs',
    isStatusMessage && status !== 'default' ? statusForegroundStyles[status] : 'text-text-subtle',
  )
}

export interface FieldSurfaceOptions {
  status?: FieldStatus
  disabled?: boolean
}

/** Composes the surface for a bordered control. */
export function fieldSurface({ status = 'default', disabled = false }: FieldSurfaceOptions = {}) {
  return cn(fieldSurfaceStyles, statusBorderStyles[status], disabled && disabledSurfaceStyles)
}
