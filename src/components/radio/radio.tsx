import { useId, type ComponentPropsWithRef, type ReactNode } from 'react'

import { cn } from '../../lib/cn'
import { useRadioGroup } from './radio-group'
import { circleStyles, dotStyles, inputStyles, labelStyles, rootStyles } from './radio.styles'

export interface RadioProps extends Omit<ComponentPropsWithRef<'input'>, 'type' | 'size'> {
  /** This item's value. */
  value: string
  /** Label beside the circle. */
  label?: ReactNode
}

/**
 * A single option. Normally rendered inside a `RadioGroup`, which supplies the
 * shared `name` and owns the selected value; it also works standalone if you
 * pass `name`, `checked` and `onChange` yourself.
 */
export function Radio({
  value,
  label,
  disabled = false,
  id,
  className,
  name,
  checked,
  onChange,
  ...rest
}: RadioProps) {
  const generatedId = useId()
  const radioId = id ?? generatedId
  const group = useRadioGroup()

  const isDisabled = disabled || (group?.disabled ?? false)
  const resolvedName = name ?? group?.name
  const resolvedChecked = checked ?? (group ? group.value === value : undefined)

  return (
    // Wrapping the input makes the circle part of the label, so the whole row
    // is clickable rather than just the text.
    <label htmlFor={radioId} className={cn(rootStyles, className)}>
      <input
        {...rest}
        type="radio"
        id={radioId}
        name={resolvedName}
        value={value}
        checked={resolvedChecked}
        disabled={isDisabled}
        onChange={(event) => {
          group?.onSelect(value)
          onChange?.(event)
        }}
        className={inputStyles}
      />

      <span aria-hidden="true" className={circleStyles}>
        <span data-slot="dot" className={dotStyles} />
      </span>

      {label != null && label !== false ? <span className={labelStyles}>{label}</span> : null}
    </label>
  )
}
