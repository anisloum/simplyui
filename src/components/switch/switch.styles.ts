import { cn } from '../../lib/cn'

export type SwitchLabelPosition = 'left' | 'right'

/**
 * `labelPosition="left"` only reverses the visual row. DOM order stays
 * input → track → label, which matters: Tailwind's `peer-*` compiles to a
 * following-sibling combinator, so the input has to come first either way.
 */
const rootBase = cn(
  'inline-flex w-fit cursor-pointer items-center gap-1',
  'has-disabled:cursor-not-allowed',
)

/**
 * The root is the `<label>`, so the track itself is part of the click target —
 * as a bare sibling of the `sr-only` input it would swallow clicks.
 */
export const rootStyles: Record<SwitchLabelPosition, string> = {
  right: rootBase,
  left: cn(rootBase, 'flex-row-reverse'),
}

/** Same peer approach as Checkbox: a real checkbox input, visually replaced. */
export const inputStyles = 'peer sr-only'

/**
 * 40×24 track with a 2px inset around the 20px thumb.
 *
 * The thumb is nested inside the track, so it cannot be a `peer-*` target
 * itself — the sliding rule reaches it as a descendant of the track instead.
 */
export const trackStyles = cn(
  'inline-flex h-[1.5rem] w-[2.5rem] shrink-0 items-center rounded-full p-[2px]',
  'bg-bg-muted',
  'transition-colors duration-150 ease-out motion-reduce:transition-none',

  'peer-checked:bg-primary-default',
  'peer-not-disabled:peer-hover:bg-bg-muted-hover',
  'peer-checked:peer-not-disabled:peer-hover:bg-primary-hover',

  'peer-disabled:bg-bg-disabled',
  'peer-checked:peer-disabled:bg-primary-disabled',

  // Travel = track − thumb − 2×inset = 40 − 20 − 4 = 16px.
  'peer-checked:[&_[data-slot=thumb]]:translate-x-[1rem]',
  'peer-disabled:[&_[data-slot=thumb]]:opacity-70',

  'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring-default',
)

export const thumbStyles = cn(
  'size-[1.25rem] rounded-full bg-bg-default',
  'transition-transform duration-150 ease-out motion-reduce:transition-none',
)

export const labelStyles = cn(
  'text-sm font-regular text-text-default select-none',
  'peer-disabled:text-text-disabled',
)
