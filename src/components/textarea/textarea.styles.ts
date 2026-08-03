import { cn } from '../../lib/cn'
import {
  fieldSurface,
  type FieldStatus,
  type FieldSurfaceOptions,
  type FieldValidationStatus,
} from '../../lib/field-styles'

/**
 * Textarea shares the field chrome with Input — same label, status ramp, border
 * behaviour and message line, all from `lib/field-styles`. Only the geometry of
 * a multi-line control lives here.
 */
export {
  fieldGroupStyles,
  labelStyles,
  messageStyles,
  requiredMarkerStyles,
  statusForegroundStyles,
  statusIcons,
} from '../../lib/field-styles'

export type TextareaStatus = FieldStatus
export type TextareaValidationStatus = FieldValidationStatus
export type TextareaResize = 'vertical' | 'none' | 'both'

const resizeStyles: Record<TextareaResize, string> = {
  vertical: 'resize-y',
  none: 'resize-none',
  both: 'resize',
}

export interface TextareaStyleOptions extends FieldSurfaceOptions {
  resize?: TextareaResize
}

/**
 * Unlike Input there is no wrapper: the `<textarea>` is itself the bordered
 * box, so it carries the surface directly and takes the ring from its own
 * `:focus-visible` rather than the wrapper's `:has()`. The old note here said
 * `:focus-within`, which also fired on pointer clicks.
 * because an element matches it when it has focus itself.
 */
export function textareaStyles({ resize = 'vertical', ...surface }: TextareaStyleOptions = {}) {
  return cn(
    'block w-full p-2',
    'text-base font-regular text-text-default placeholder:text-text-placeholder',
    'disabled:cursor-not-allowed disabled:text-text-disabled',
    fieldSurface(surface),
    resizeStyles[resize],
    // Must land after `text-base`: Tailwind's font-size utilities carry their
    // own line-height, so tailwind-merge drops any `leading-*` that comes
    // first. Its own cn() argument, so the Prettier class sorter cannot hoist
    // it back into the string above.
    'leading-normal',
  )
}

/**
 * The min-height the control cannot be dragged below, derived from `rows` the
 * way the spec defines it: rows × line-height + vertical padding + border.
 * Built from the theme variables so it tracks the tokens rather than baking in
 * pixel values.
 */
export function textareaMinHeight(rows: number) {
  return `calc(${rows} * var(--leading-normal) * var(--text-base) + 2 * var(--spacing-2) + 2px)`
}

/**
 * The status icon sits on the label row, not inside the field: the field's own
 * bottom-right corner belongs to the native resize grip and the two would
 * collide.
 */
export const statusIconStyles = 'ml-auto size-icon-md shrink-0 [&>svg]:size-full'

export const headerStyles = 'flex items-center justify-between gap-2'

/** Message on the left, counter on the right. */
export const footerStyles = 'flex items-start justify-between gap-2'

export function counterStyles(atLimit: boolean) {
  return cn(
    'ml-auto shrink-0 text-xs tabular-nums',
    // `error-fg`, not `error-default`: this is a foreground on the page
    // surface, and only the -fg token lightens for dark mode.
    atLimit ? 'text-error-fg' : 'text-text-subtle',
  )
}
