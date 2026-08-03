import { Check, Minus } from 'lucide-react'
import { useCallback, useId, type ComponentPropsWithRef, type ReactNode } from 'react'

import { cn } from '../../lib/cn'
import { boxStyles, glyphStyles, inputStyles, labelStyles, rootStyles } from './checkbox.styles'

export interface CheckboxProps extends Omit<ComponentPropsWithRef<'input'>, 'type' | 'size'> {
  /** Label beside the box. Omit it to use the box on its own. */
  label?: ReactNode
  /**
   * Renders the dash instead of the tick and sets the DOM `indeterminate`
   * property. Visual only — an indeterminate checkbox still reports whatever
   * `checked` says. @default false
   */
  indeterminate?: boolean
}

/**
 * Binary selection control, with an optional third indeterminate look.
 *
 * `indeterminate` is not an HTML attribute — it is a DOM property — so it is
 * applied through a ref rather than rendered. `aria-checked="mixed"` is set
 * alongside it to match.
 */
export function Checkbox({
  label,
  indeterminate = false,
  disabled = false,
  id,
  className,
  ref,
  ...rest
}: CheckboxProps) {
  const generatedId = useId()
  const checkboxId = id ?? generatedId

  // A callback ref rather than an effect: it runs on mount and again whenever
  // `indeterminate` changes, because the callback identity changes with it.
  const setInputRef = useCallback(
    (node: HTMLInputElement | null) => {
      if (node) node.indeterminate = indeterminate
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    },
    [ref, indeterminate],
  )

  return (
    // Wrapping the input means the box counts as part of the label, so clicking
    // anywhere on the row toggles — not just the text.
    <label htmlFor={checkboxId} className={cn(rootStyles, className)}>
      <input
        {...rest}
        ref={setInputRef}
        type="checkbox"
        id={checkboxId}
        disabled={disabled}
        aria-checked={indeterminate ? 'mixed' : undefined}
        className={inputStyles}
      />

      <span aria-hidden="true" className={boxStyles}>
        {indeterminate ? (
          <Minus data-slot="glyph" className={glyphStyles} />
        ) : (
          <Check data-slot="glyph" className={glyphStyles} />
        )}
      </span>

      {label != null && label !== false ? <span className={labelStyles}>{label}</span> : null}
    </label>
  )
}
