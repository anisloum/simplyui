import { Check } from 'lucide-react'

import { cn } from '../../lib/cn'
import { Checkbox } from '../checkbox'
import {
  optionActiveStyles,
  optionCheckStyles,
  optionDisabledStyles,
  optionStyles,
} from './select.styles'

export interface SelectOptionRowProps {
  id: string
  label: string
  selected: boolean
  /** Keyboard-active (`aria-activedescendant`), not DOM focus. */
  active: boolean
  disabled: boolean
  multiple: boolean
  onSelect: () => void
}

/**
 * A single `role="option"` row.
 *
 * It is a `div`, not a button: real focus never leaves the trigger, so nothing
 * here should be tabbable. Selection is driven from the parent's keyboard
 * handler or from a pointer click.
 *
 * The multi-select checkbox is `tabIndex={-1}` and `aria-hidden` for the same
 * reason — the row's own `aria-selected` already reports the state, so exposing
 * the checkbox too would double-announce it.
 */
export function SelectOptionRow({
  id,
  label,
  selected,
  active,
  disabled,
  multiple,
  onSelect,
}: SelectOptionRowProps) {
  return (
    <div
      id={id}
      role="option"
      aria-selected={selected}
      aria-disabled={disabled || undefined}
      className={cn(optionStyles, active && optionActiveStyles, disabled && optionDisabledStyles)}
      // pointerdown, not click: it fires before the blur/dismiss handling and
      // keeps focus on the trigger.
      onPointerDown={(event) => {
        event.preventDefault()
        if (!disabled) onSelect()
      }}
    >
      {multiple ? (
        <Checkbox
          checked={selected}
          disabled={disabled}
          readOnly
          tabIndex={-1}
          aria-hidden="true"
          className="pointer-events-none"
        />
      ) : null}

      <span className="truncate">{label}</span>

      {!multiple && selected ? (
        <span aria-hidden="true" className={optionCheckStyles}>
          <Check />
        </span>
      ) : null}
    </div>
  )
}
