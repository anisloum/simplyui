import { cn } from '../../lib/cn'

export type RadioOrientation = 'vertical' | 'horizontal'

/** Vertical items sit 8px apart, horizontal ones 16px. */
export const groupStyles: Record<RadioOrientation, string> = {
  vertical: 'flex flex-col gap-1',
  horizontal: 'flex flex-row flex-wrap gap-3',
}

/** Same peer trick as Checkbox: a real radio input, only visually replaced. */
export const rootStyles = 'inline-flex items-center gap-1'

export const inputStyles = 'peer sr-only'

export const circleStyles = cn(
  'inline-flex size-[1.25rem] shrink-0 items-center justify-center rounded-full border',
  'border-border-default bg-bg-default',
  'transition-[background-color,border-color] duration-150 ease-out',
  'motion-reduce:transition-none',

  'peer-checked:border-primary-fg',

  // The dot is nested inside the circle, so it is not a sibling of the input
  // and has to be reached as a descendant.
  'peer-checked:[&_[data-slot=dot]]:block',
  'peer-checked:peer-disabled:[&_[data-slot=dot]]:bg-text-disabled',

  'peer-not-disabled:peer-hover:border-primary-fg',
  'peer-disabled:border-border-disabled peer-disabled:bg-bg-disabled',

  'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring-default',
)

/** 10px dot, hidden until the circle CSS reveals it. */
export const dotStyles = 'hidden size-[0.625rem] rounded-full bg-primary-fg'

export const labelStyles = cn(
  'cursor-pointer text-sm font-regular text-text-default',
  'peer-disabled:cursor-not-allowed peer-disabled:text-text-disabled',
)
