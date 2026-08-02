import { useId, useState, type ChangeEvent, type ComponentPropsWithRef } from 'react'

import { cn } from '../../lib/cn'
import {
  counterStyles,
  fieldGroupStyles,
  footerStyles,
  headerStyles,
  labelStyles,
  messageStyles,
  requiredMarkerStyles,
  statusForegroundStyles,
  statusIconStyles,
  statusIcons,
  textareaMinHeight,
  textareaStyles,
  type TextareaResize,
  type TextareaStatus,
  type TextareaValidationStatus,
} from './textarea.styles'

export type { TextareaResize, TextareaStatus, TextareaValidationStatus }

export interface TextareaProps extends Omit<ComponentPropsWithRef<'textarea'>, 'rows'> {
  /** Label rendered above the field and tied to it via `htmlFor`/`id`. */
  label?: string
  /** Neutral hint under the field. Suppressed while a status message shows. */
  helperText?: string
  /** Validation status. @default "default" */
  status?: TextareaStatus
  /** Message under the field, coloured by `status`. Replaces `helperText`. */
  statusText?: string
  /** Manual resize behaviour. @default "vertical" */
  resize?: TextareaResize
  /** Visible rows, which set the control's min-height. @default 3 */
  rows?: number
  /** Character counter at the bottom-right. @default false */
  showCount?: boolean
}

/**
 * Multi-line text field. Label, status model, focus rule and a11y wiring are
 * shared with `Input` via `lib/field-styles`, so the two stay consistent.
 *
 * Two things differ from `Input`, both because of the native resize grip:
 * the status icon sits on the **label row** rather than inside the field, and
 * the character counter sits below it, sharing a line with the message.
 */
export function Textarea({
  label,
  required = false,
  helperText,
  status = 'default',
  statusText,
  resize = 'vertical',
  rows = 3,
  showCount = false,
  maxLength,
  disabled = false,
  id,
  className,
  style,
  value,
  defaultValue,
  onChange,
  'aria-describedby': ariaDescribedBy,
  ...rest
}: TextareaProps) {
  const generatedId = useId()
  const textareaId = id ?? generatedId
  const messageId = `${textareaId}-message`

  const validationStatus: TextareaValidationStatus | null = status === 'default' ? null : status
  const isStatusMessage = validationStatus !== null && Boolean(statusText)
  const message = isStatusMessage ? statusText : helperText

  // Keep any consumer-supplied description; ours is additional, not a replacement.
  const describedBy =
    [message ? messageId : null, ariaDescribedBy].filter(Boolean).join(' ') || undefined

  // The counter needs the current length in both modes: read it straight off
  // `value` when controlled, otherwise track it ourselves.
  const isControlled = value !== undefined
  const [uncontrolledLength, setUncontrolledLength] = useState(
    () => String(defaultValue ?? '').length,
  )
  const currentLength = isControlled ? String(value).length : uncontrolledLength

  const handleUncontrolledChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setUncontrolledLength(event.target.value.length)
    onChange?.(event)
  }

  const atLimit = maxLength !== undefined && currentLength >= maxLength
  const StatusIcon = validationStatus ? statusIcons[validationStatus] : null

  return (
    <div className={cn(fieldGroupStyles, className)}>
      {label || StatusIcon ? (
        <div className={headerStyles}>
          {label ? (
            <label htmlFor={textareaId} className={labelStyles}>
              {label}
              {required ? (
                // Decorative only — `required` on the control is what actually
                // carries this to assistive tech.
                <span aria-hidden="true" className={requiredMarkerStyles}>
                  {' *'}
                </span>
              ) : null}
            </label>
          ) : null}

          {StatusIcon && validationStatus ? (
            <span
              aria-hidden="true"
              className={cn(statusIconStyles, statusForegroundStyles[validationStatus])}
            >
              <StatusIcon />
            </span>
          ) : null}
        </div>
      ) : null}

      <textarea
        {...rest}
        id={textareaId}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        required={required}
        value={value}
        defaultValue={defaultValue}
        // Only intercept when uncontrolled. Forwarding the consumer's handler
        // untouched in the controlled case keeps React's "you passed `value`
        // without `onChange`" warning working.
        onChange={isControlled ? onChange : handleUncontrolledChange}
        aria-invalid={status === 'error' || undefined}
        aria-describedby={describedBy}
        className={textareaStyles({ status, disabled, resize })}
        style={{ minHeight: textareaMinHeight(rows), ...style }}
      />

      {message || showCount ? (
        <div className={footerStyles}>
          {message ? (
            <p id={messageId} className={messageStyles(status, isStatusMessage)}>
              {message}
            </p>
          ) : null}

          {showCount ? (
            // Hidden from assistive tech on purpose: the browser enforces
            // `maxLength` natively, so announcing every keystroke would be
            // noise rather than information.
            <span aria-hidden="true" className={counterStyles(atLimit)}>
              {maxLength === undefined ? currentLength : `${currentLength} / ${maxLength}`}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
