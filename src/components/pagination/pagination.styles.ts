import { cn } from '../../lib/cn'

export const listStyles = 'flex flex-wrap items-center gap-0'

/** Square 40px cell, matching the icon buttons beside it. */
const cellBase = cn(
  'inline-flex size-[2.5rem] shrink-0 items-center justify-center rounded-control',
  'text-sm font-medium',
  'transition-colors duration-150 ease-out motion-reduce:transition-none',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring-default',
)

export const pageStyles = cn(
  cellBase,
  'cursor-pointer bg-transparent text-text-default',
  'not-disabled:hover:bg-bg-subtle',
)

/**
 * `text-on-primary`, not `text-inverse`: the fill stays blue in dark mode, so a
 * label that flipped to near-black would drop to 3.73:1.
 */
export const pageActiveStyles = cn(
  cellBase,
  'cursor-default bg-primary-default text-text-on-primary',
)

export const navButtonStyles = cn(
  cellBase,
  'cursor-pointer bg-transparent text-text-default',
  'not-disabled:hover:bg-bg-subtle',
  'disabled:cursor-not-allowed disabled:text-text-disabled',
  '[&>svg]:size-icon-md',
)

/** Inert gap marker — the pages it stands for are still reachable via the chevrons. */
export const ellipsisStyles = cn(
  'inline-flex size-[2.5rem] shrink-0 items-center justify-center',
  'text-sm text-text-subtle',
)
