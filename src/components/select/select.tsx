import { ChevronDown, X } from 'lucide-react'
import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'

import { cn } from '../../lib/cn'
import { Badge } from '../badge'
import { SelectOptionRow } from './select-option'
import {
  chevronOpenStyles,
  chevronStyles,
  chipRowStyles,
  controlStyles,
  DEFAULT_MAX_VISIBLE_OPTIONS,
  emptyStyles,
  fieldGroupStyles,
  iconButtonStyles,
  labelStyles,
  listboxStyles,
  messageStyles,
  OPTION_ROW_HEIGHT,
  placeholderStyles,
  requiredMarkerStyles,
  statusForegroundStyles,
  statusIcons,
  triggerStyles,
  valueStyles,
  type SelectStatus,
  type SelectValidationStatus,
} from './select.styles'
import { usePopover } from './use-popover'

export type { SelectStatus, SelectValidationStatus }

/** How many chips the trigger shows before collapsing the rest into `+N`. */
const MAX_VISIBLE_CHIPS = 3

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps {
  options: SelectOption[]
  /** A string in single mode, an array in `multiple` mode. */
  value?: string | string[]
  defaultValue?: string | string[]
  onValueChange?: (value: string | string[]) => void
  /** @default false */
  multiple?: boolean
  /** Adds a clear control once something is selected. @default false */
  clearable?: boolean
  placeholder?: string

  label?: string
  required?: boolean
  helperText?: string
  status?: SelectStatus
  statusText?: string

  disabled?: boolean
  id?: string
  /** Rows visible before the list scrolls. @default 4.5 */
  maxVisibleOptions?: number
  className?: string
}

const toArray = (value: string | string[] | undefined): string[] => {
  if (value === undefined) return []
  return Array.isArray(value) ? value : [value]
}

/**
 * A listbox-backed select, built from scratch.
 *
 * Focus never enters the list. It stays on the `role="combobox"` trigger, and
 * the active row is reported with `aria-activedescendant` — the pattern the
 * spec calls for, and the one that avoids the focus-restoration bugs that sink
 * most hand-rolled selects.
 *
 * The bordered box is a `div` rather than the trigger itself: chip remove
 * buttons and the clear button sit inside it, and nesting those inside a
 * `role="combobox"` would be a nested-interactive violation.
 */
export function Select({
  options,
  value,
  defaultValue,
  onValueChange,
  multiple = false,
  clearable = false,
  placeholder = 'Select…',
  label,
  required = false,
  helperText,
  status = 'default',
  statusText,
  disabled = false,
  id,
  maxVisibleOptions = DEFAULT_MAX_VISIBLE_OPTIONS,
  className,
}: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const labelId = `${selectId}-label`
  const messageId = `${selectId}-message`
  const listboxId = `${selectId}-listbox`
  const optionId = (index: number) => `${selectId}-option-${index}`

  const controlRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listboxRef = useRef<HTMLDivElement>(null)

  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const isControlled = value !== undefined
  const [uncontrolled, setUncontrolled] = useState<string[]>(() => toArray(defaultValue))
  const selected = isControlled ? toArray(value) : uncontrolled

  const validationStatus: SelectValidationStatus | null = status === 'default' ? null : status
  const isStatusMessage = validationStatus !== null && Boolean(statusText)
  const message = isStatusMessage ? statusText : helperText
  const StatusIcon = validationStatus ? statusIcons[validationStatus] : null

  const commit = useCallback(
    (next: string[]) => {
      if (!isControlled) setUncontrolled(next)
      onValueChange?.(multiple ? next : (next[0] ?? ''))
    },
    [isControlled, multiple, onValueChange],
  )

  const enabledIndexes = useMemo(
    () => options.map((option, index) => (option.disabled ? -1 : index)).filter((i) => i !== -1),
    [options],
  )

  const closeAndFocus = useCallback(() => {
    setOpen(false)
    setActiveIndex(-1)
    triggerRef.current?.focus()
  }, [])

  const openList = useCallback(() => {
    if (disabled) return
    setOpen(true)
    // Land on the first selection if there is one, else the first enabled row.
    const firstSelected = options.findIndex((o) => selected.includes(o.value) && !o.disabled)
    setActiveIndex(firstSelected !== -1 ? firstSelected : (enabledIndexes[0] ?? -1))
  }, [disabled, options, selected, enabledIndexes])

  const toggleValue = useCallback(
    (option: SelectOption) => {
      if (option.disabled) return
      if (multiple) {
        const next = selected.includes(option.value)
          ? selected.filter((entry) => entry !== option.value)
          : [...selected, option.value]
        commit(next)
        // Multi stays open so several picks can be made in one visit.
      } else {
        commit([option.value])
        closeAndFocus()
      }
    },
    [multiple, selected, commit, closeAndFocus],
  )

  const popover = usePopover({
    open,
    anchorRef: controlRef,
    popoverRef: listboxRef,
    offset: 4,
    preferredMaxHeight: maxVisibleOptions * OPTION_ROW_HEIGHT,
    onDismiss: useCallback(() => {
      setOpen(false)
      setActiveIndex(-1)
    }, []),
  })

  // Keep the active row in view as the arrows walk past the visible window.
  useEffect(() => {
    if (!open || activeIndex < 0) return
    const node = document.getElementById(optionId(activeIndex))
    node?.scrollIntoView({ block: 'nearest' })
    // optionId is derived from selectId, which is stable for the component's life.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activeIndex, selectId])

  const moveActive = (direction: 1 | -1) => {
    if (enabledIndexes.length === 0) return
    const position = enabledIndexes.indexOf(activeIndex)
    const nextPosition =
      position === -1
        ? direction === 1
          ? 0
          : enabledIndexes.length - 1
        : (position + direction + enabledIndexes.length) % enabledIndexes.length
    setActiveIndex(enabledIndexes[nextPosition] ?? -1)
  }

  // Typeahead: jump to the next option starting with the typed letters.
  const typeahead = useRef({ buffer: '', timer: 0 })
  const handleTypeahead = (char: string) => {
    window.clearTimeout(typeahead.current.timer)
    typeahead.current.buffer += char.toLowerCase()
    typeahead.current.timer = window.setTimeout(() => {
      typeahead.current.buffer = ''
    }, 600)

    const query = typeahead.current.buffer
    const match = enabledIndexes.find((index) =>
      options[index]?.label.toLowerCase().startsWith(query),
    )
    if (match !== undefined) setActiveIndex(match)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return

    if (!open) {
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
        event.preventDefault()
        openList()
      }
      return
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        moveActive(1)
        break
      case 'ArrowUp':
        event.preventDefault()
        moveActive(-1)
        break
      case 'Home':
        event.preventDefault()
        setActiveIndex(enabledIndexes[0] ?? -1)
        break
      case 'End':
        event.preventDefault()
        setActiveIndex(enabledIndexes[enabledIndexes.length - 1] ?? -1)
        break
      case 'Enter':
      case ' ': {
        event.preventDefault()
        const option = options[activeIndex]
        if (option) toggleValue(option)
        break
      }
      case 'Escape':
        event.preventDefault()
        closeAndFocus()
        break
      case 'Tab':
        // Let focus move on naturally; just dismiss the list.
        setOpen(false)
        setActiveIndex(-1)
        break
      default:
        if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
          handleTypeahead(event.key)
        }
    }
  }

  const selectedOptions = options.filter((option) => selected.includes(option.value))
  const visibleChips = selectedOptions.slice(0, MAX_VISIBLE_CHIPS)
  const overflowCount = selectedOptions.length - visibleChips.length
  const hasSelection = selected.length > 0
  const singleLabel = selectedOptions[0]?.label

  return (
    <div className={cn(fieldGroupStyles, className)}>
      {label ? (
        <label id={labelId} htmlFor={`${selectId}-trigger`} className={labelStyles}>
          {label}
          {required ? (
            <span aria-hidden="true" className={requiredMarkerStyles}>
              {' *'}
            </span>
          ) : null}
        </label>
      ) : null}

      <div ref={controlRef} className={controlStyles({ status, disabled })}>
        {multiple && visibleChips.length > 0 ? (
          <span className={chipRowStyles}>
            {visibleChips.map((option) => (
              <Badge
                key={option.value}
                size="sm"
                disabled={disabled}
                onRemove={() => commit(selected.filter((entry) => entry !== option.value))}
                removeLabel={`Remove ${option.label}`}
              >
                {option.label}
              </Badge>
            ))}
            {overflowCount > 0 ? (
              <Badge size="sm" variant="outlined" disabled={disabled}>
                {`+${overflowCount}`}
              </Badge>
            ) : null}
          </span>
        ) : null}

        <button
          ref={triggerRef}
          id={`${selectId}-trigger`}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          aria-activedescendant={open && activeIndex >= 0 ? optionId(activeIndex) : undefined}
          aria-labelledby={label ? labelId : undefined}
          aria-describedby={message ? messageId : undefined}
          aria-invalid={status === 'error' || undefined}
          aria-required={required || undefined}
          disabled={disabled}
          className={triggerStyles}
          onClick={() => (open ? closeAndFocus() : openList())}
          onKeyDown={handleKeyDown}
        >
          {multiple ? (
            hasSelection ? null : (
              <span className={placeholderStyles}>{placeholder}</span>
            )
          ) : singleLabel ? (
            <span className={valueStyles}>{singleLabel}</span>
          ) : (
            <span className={placeholderStyles}>{placeholder}</span>
          )}
        </button>

        {clearable && hasSelection && !disabled ? (
          <button
            type="button"
            className={iconButtonStyles}
            aria-label="Clear selection"
            onClick={() => {
              commit([])
              triggerRef.current?.focus()
            }}
          >
            <X aria-hidden="true" />
          </button>
        ) : null}

        <span aria-hidden="true" className={cn(chevronStyles, open && chevronOpenStyles)}>
          <ChevronDown />
        </span>
      </div>

      {message ? (
        <p id={messageId} className={messageStyles(status, isStatusMessage)}>
          {StatusIcon && validationStatus ? (
            <span
              aria-hidden="true"
              className={cn(
                'mr-0 inline-block size-icon-md align-text-bottom',
                statusForegroundStyles[validationStatus],
                '[&>svg]:size-full',
              )}
            >
              <StatusIcon />
            </span>
          ) : null}
          {message}
        </p>
      ) : null}

      {open && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={listboxRef}
              id={listboxId}
              role="listbox"
              aria-multiselectable={multiple || undefined}
              aria-labelledby={label ? labelId : undefined}
              className={listboxStyles}
              style={{
                position: 'fixed',
                top: popover?.top ?? -9999,
                left: popover?.left ?? -9999,
                width: popover?.width,
                maxHeight: Math.min(
                  maxVisibleOptions * OPTION_ROW_HEIGHT,
                  popover?.maxHeight ?? Number.POSITIVE_INFINITY,
                ),
                visibility: popover ? 'visible' : 'hidden',
              }}
            >
              {options.length === 0 ? (
                <p className={emptyStyles}>No options</p>
              ) : (
                options.map((option, index) => (
                  <SelectOptionRow
                    key={option.value}
                    id={optionId(index)}
                    label={option.label}
                    selected={selected.includes(option.value)}
                    active={index === activeIndex}
                    disabled={option.disabled ?? false}
                    multiple={multiple}
                    onSelect={() => toggleValue(option)}
                  />
                ))
              )}
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}
