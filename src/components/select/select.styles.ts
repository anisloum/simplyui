import { cn } from '../../lib/cn'
import { fieldSurface, type FieldStatus, type FieldValidationStatus } from '../../lib/field-styles'

/** The trigger reuses Input's border/focus/status chrome verbatim. */
export {
  fieldGroupStyles,
  labelStyles,
  messageStyles,
  requiredMarkerStyles,
  statusForegroundStyles,
  statusIcons,
} from '../../lib/field-styles'

export type SelectStatus = FieldStatus
export type SelectValidationStatus = FieldValidationStatus

/** Option rows are 40px; the default cap shows 4.5 of them so it reads as scrollable. */
export const OPTION_ROW_HEIGHT = 40
export const DEFAULT_MAX_VISIBLE_OPTIONS = 4.5

export interface ControlStyleOptions {
  status?: SelectStatus
  disabled?: boolean
}

/**
 * The bordered box. It is a plain `div`, not the focusable element: the chips'
 * remove buttons and the clear button live inside it, and nesting those in a
 * `role="combobox"` (or a `<button>`) would be a nested-interactive violation.
 * The box therefore takes the ring on `:focus-within` from whichever child has
 * focus.
 */
export function controlStyles(options: ControlStyleOptions = {}) {
  return cn('flex h-control-md w-full items-center gap-0 px-2', fieldSurface(options))
}

/** The actual `role="combobox"` element, filling the space the chips leave. */
export const triggerStyles = cn(
  'flex min-w-0 flex-1 cursor-pointer items-center gap-0 self-stretch',
  'bg-transparent text-left text-base font-regular text-text-default',
  // The ring is drawn by the control wrapper via :focus-within.
  'outline-none disabled:cursor-not-allowed disabled:text-text-disabled',
)

export const placeholderStyles = 'truncate text-text-placeholder'
export const valueStyles = 'truncate'

export const chipRowStyles = 'flex min-w-0 shrink items-center gap-0 overflow-hidden'

export const iconButtonStyles = cn(
  'flex size-icon-md shrink-0 cursor-pointer items-center justify-center rounded-control',
  'text-text-subtle not-disabled:hover:text-text-default',
  'disabled:cursor-not-allowed disabled:text-text-disabled',
  'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring-default',
  '[&>svg]:size-full',
)

export const chevronStyles = cn(
  'pointer-events-none flex size-icon-md shrink-0 items-center justify-center text-text-subtle',
  'transition-transform duration-150 ease-out motion-reduce:transition-none',
  '[&>svg]:size-full',
)

export const chevronOpenStyles = 'rotate-180'

/** Popover surface. `z-dropdown` comes from the token scale. */
export const listboxStyles = cn(
  'z-dropdown overflow-y-auto rounded-md border border-border-subtle bg-surface-default py-0 shadow-md',
  'outline-none',
)

export const optionStyles = cn(
  'flex h-[2.5rem] w-full cursor-pointer items-center gap-1 px-2',
  'text-sm font-regular text-text-default',
  'transition-colors duration-150 ease-out motion-reduce:transition-none',
)

/** Hover and keyboard-active share one highlight, so the two never disagree. */
export const optionActiveStyles = 'bg-bg-subtle'

export const optionDisabledStyles = 'cursor-not-allowed text-text-disabled'

export const optionCheckStyles = 'ml-auto size-icon-md shrink-0 text-primary-fg [&>svg]:size-full'

export const emptyStyles = 'px-2 py-2 text-sm text-text-subtle'
