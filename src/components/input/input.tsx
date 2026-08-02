import { AlertCircle, CheckCircle2, Eye, EyeOff, XCircle } from 'lucide-react'
import { useId, useState, type ComponentPropsWithRef, type ReactNode } from 'react'

import { cn } from '../../lib/cn'
import {
  adornmentStyles,
  controlStyles,
  fieldGroupStyles,
  inputStyles,
  labelStyles,
  messageStyles,
  requiredMarkerStyles,
  statusForegroundStyles,
  toggleStyles,
  type InputStatus,
  type InputValidationStatus,
} from './input.styles'

export type { InputStatus, InputValidationStatus }

const statusIcons = {
  success: CheckCircle2,
  warning: AlertCircle,
  error: XCircle,
} as const satisfies Record<InputValidationStatus, unknown>

export interface InputProps extends Omit<ComponentPropsWithRef<'input'>, 'size' | 'prefix'> {
  /** Label rendered above the field and tied to it via `htmlFor`/`id`. */
  label?: string
  /** Neutral hint under the field. Suppressed while a status message shows. */
  helperText?: string
  /** Validation status. @default "default" */
  status?: InputStatus
  /** Message under the field, coloured by `status`. Replaces `helperText`. */
  statusText?: string
  /** Left adornment. Decorative, and always shown. */
  leftIcon?: ReactNode
  /** Right adornment. Yields to the password toggle and the status icon — see below. */
  rightIcon?: ReactNode
}

/**
 * Single-line text field with a built-in label, helper/validation message,
 * icon slots and a password reveal toggle.
 *
 * **The right slot holds exactly one thing.** In precedence order:
 *
 * 1. the password toggle, whenever `type="password"` — a status set alongside
 *    it still colours the border and message, but its icon is suppressed so the
 *    two never collide;
 * 2. the status icon, whenever `status` is not `"default"` — note this
 *    **replaces** any `rightIcon` you passed;
 * 3. `rightIcon`, only when neither of the above applies.
 *
 * `leftIcon` has no such conflict and always renders.
 */
export function Input({
  label,
  required = false,
  helperText,
  status = 'default',
  statusText,
  leftIcon,
  rightIcon,
  type = 'text',
  disabled = false,
  id,
  className,
  'aria-describedby': ariaDescribedBy,
  ...rest
}: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const messageId = `${inputId}-message`

  const [revealed, setRevealed] = useState(false)
  const isPassword = type === 'password'
  const resolvedType = isPassword && revealed ? 'text' : type

  const validationStatus: InputValidationStatus | null = status === 'default' ? null : status

  const isStatusMessage = validationStatus !== null && Boolean(statusText)
  const message = isStatusMessage ? statusText : helperText

  // Keep any consumer-supplied description; ours is additional, not a replacement.
  const describedBy =
    [message ? messageId : null, ariaDescribedBy].filter(Boolean).join(' ') || undefined

  const StatusIcon = validationStatus ? statusIcons[validationStatus] : null

  let rightSlot: ReactNode = null
  if (isPassword) {
    rightSlot = (
      <button
        type="button"
        className={toggleStyles}
        onClick={() => setRevealed((current) => !current)}
        disabled={disabled}
        aria-label={revealed ? 'Hide password' : 'Show password'}
        aria-pressed={revealed}
        aria-controls={inputId}
      >
        {revealed ? <Eye aria-hidden="true" /> : <EyeOff aria-hidden="true" />}
      </button>
    )
  } else if (StatusIcon && validationStatus) {
    rightSlot = (
      <span
        aria-hidden="true"
        className={cn(adornmentStyles, statusForegroundStyles[validationStatus])}
      >
        <StatusIcon />
      </span>
    )
  } else if (rightIcon) {
    rightSlot = (
      <span aria-hidden="true" className={cn(adornmentStyles, 'text-text-subtle')}>
        {rightIcon}
      </span>
    )
  }

  return (
    <div className={cn(fieldGroupStyles, className)}>
      {label ? (
        <label htmlFor={inputId} className={labelStyles}>
          {label}
          {required ? (
            // Decorative only — `required` on the input is what actually carries
            // this to assistive tech.
            <span aria-hidden="true" className={requiredMarkerStyles}>
              {' *'}
            </span>
          ) : null}
        </label>
      ) : null}

      <div className={controlStyles({ status, disabled })}>
        {leftIcon ? (
          <span aria-hidden="true" className={cn(adornmentStyles, 'text-text-subtle')}>
            {leftIcon}
          </span>
        ) : null}

        <input
          {...rest}
          id={inputId}
          type={resolvedType}
          disabled={disabled}
          required={required}
          aria-invalid={status === 'error' || undefined}
          aria-describedby={describedBy}
          className={inputStyles}
        />

        {rightSlot}
      </div>

      {message ? (
        <p id={messageId} className={messageStyles(status, isStatusMessage)}>
          {message}
        </p>
      ) : null}
    </div>
  )
}
