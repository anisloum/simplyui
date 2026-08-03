import { useId, type ComponentPropsWithRef, type ReactNode } from 'react'

import { cn } from '../../lib/cn'
import {
  inputStyles,
  labelStyles,
  rootStyles,
  thumbStyles,
  trackStyles,
  type SwitchLabelPosition,
} from './switch.styles'

export type { SwitchLabelPosition }

export interface SwitchProps extends Omit<ComponentPropsWithRef<'input'>, 'type' | 'size'> {
  /** Label beside the switch. */
  label?: ReactNode
  /** Which side the label sits on. @default "right" */
  labelPosition?: SwitchLabelPosition
}

/**
 * Binary on/off toggle: a real `<input type="checkbox">` carrying
 * `role="switch"`, styled as a track with a sliding thumb.
 *
 * A switch takes effect immediately, which is what separates it from a
 * `Checkbox` — use a checkbox when the change only lands on submit.
 */
export function Switch({
  label,
  labelPosition = 'right',
  disabled = false,
  id,
  className,
  ...rest
}: SwitchProps) {
  const generatedId = useId()
  const switchId = id ?? generatedId

  return (
    <span className={cn(rootStyles[labelPosition], className)}>
      <input
        {...rest}
        type="checkbox"
        role="switch"
        id={switchId}
        disabled={disabled}
        className={inputStyles}
      />

      <span aria-hidden="true" className={trackStyles}>
        <span data-slot="thumb" className={thumbStyles} />
      </span>

      {label != null && label !== false ? (
        <label htmlFor={switchId} className={labelStyles}>
          {label}
        </label>
      ) : null}
    </span>
  )
}
