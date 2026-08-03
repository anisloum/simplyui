import { createContext, useContext, useId, useState, type ReactNode } from 'react'

import { cn } from '../../lib/cn'
import { groupStyles, type RadioOrientation } from './radio.styles'

export type { RadioOrientation }

interface RadioGroupContextValue {
  name: string
  value: string | undefined
  disabled: boolean
  onSelect: (value: string) => void
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null)

export function useRadioGroup() {
  return useContext(RadioGroupContext)
}

export interface RadioGroupProps {
  /** Controlled selected value. */
  value?: string
  /** Uncontrolled initial value. */
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Shared `name` for the inputs. Auto-generated when omitted. */
  name?: string
  /** Disables every item in the group. */
  disabled?: boolean
  /** @default "vertical" */
  orientation?: RadioOrientation
  /** Accessible name — required when the group has no visible heading. */
  'aria-label'?: string
  'aria-labelledby'?: string
  className?: string
  children?: ReactNode
}

/**
 * Groups `Radio` items and owns the selected value.
 *
 * The items are real `<input type="radio">` sharing one `name`, so the browser
 * supplies mutual exclusion, roving tab order and arrow-key navigation. None of
 * that is reimplemented here.
 */
export function RadioGroup({
  value,
  defaultValue,
  onValueChange,
  name,
  disabled = false,
  orientation = 'vertical',
  className,
  children,
  ...rest
}: RadioGroupProps) {
  const generatedName = useId()
  const isControlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const selectedValue = isControlled ? value : uncontrolledValue

  const handleSelect = (next: string) => {
    if (!isControlled) setUncontrolledValue(next)
    onValueChange?.(next)
  }

  return (
    <RadioGroupContext.Provider
      value={{
        name: name ?? generatedName,
        value: selectedValue,
        disabled,
        onSelect: handleSelect,
      }}
    >
      <div
        {...rest}
        role="radiogroup"
        aria-orientation={orientation}
        aria-disabled={disabled || undefined}
        className={cn(groupStyles[orientation], className)}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
}
