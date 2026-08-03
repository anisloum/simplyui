import { cn } from '../../lib/cn'

export type StepsOrientation = 'horizontal' | 'vertical'
export type StepStatus = 'completed' | 'current' | 'upcoming'

export const listStyles: Record<StepsOrientation, string> = {
  horizontal: 'flex w-full items-start',
  vertical: 'flex flex-col',
}

export const itemStyles: Record<StepsOrientation, string> = {
  horizontal: 'flex min-w-0 flex-1 flex-col items-center gap-0',
  vertical: 'flex gap-1',
}

const nodeBase = cn(
  'inline-flex size-[2rem] shrink-0 items-center justify-center rounded-control',
  'text-sm font-medium',
  'transition-colors duration-150 ease-out motion-reduce:transition-none',
)

/**
 * Every node is a solid rounded square showing its number — no checkmark, and
 * no separate shade for the current step. Reached steps are blue, unreached
 * ones grey, and the connector is what shows how far along the trail you are.
 *
 * Both labels are `text-on-*` rather than `text-inverse`: neither fill flips
 * per mode, so their labels must not either.
 */
export const nodeStyles: Record<StepStatus, string> = {
  completed: cn(nodeBase, 'bg-primary-default text-text-on-primary'),
  current: cn(nodeBase, 'bg-primary-default text-text-on-primary'),
  upcoming: cn(nodeBase, 'bg-neutral-fill text-text-on-neutral'),
}

/** Only completed and current steps are reachable; upcoming ones are inert. */
export const nodeInteractiveStyles = cn(
  'cursor-pointer',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring-default',
)

export const labelStyles: Record<StepStatus, string> = {
  completed: 'text-sm text-text-default',
  current: 'text-sm font-medium text-text-default',
  upcoming: 'text-sm text-text-subtle',
}

export const labelWrapStyles: Record<StepsOrientation, string> = {
  horizontal: 'max-w-full truncate text-center',
  vertical: 'pt-1',
}

/**
 * The connector carries progress: the segment before the current step is
 * filled, the rest stays muted.
 */
const connectorBase =
  'shrink-0 rounded-full transition-colors duration-150 ease-out motion-reduce:transition-none'

export const connectorStyles: Record<StepsOrientation, string> = {
  // Sits on the node's vertical centre (32px node → 16px, minus half the 2px line).
  horizontal: cn(connectorBase, 'mt-[0.9375rem] h-[2px] min-w-0 flex-1'),
  vertical: cn(connectorBase, 'my-0 ml-[0.9375rem] w-[2px] flex-1 self-stretch'),
}

export const connectorFillStyles: Record<'filled' | 'empty', string> = {
  filled: 'bg-primary-default',
  // Matches the upcoming node it runs into, so the unreached part of the trail
  // reads as one grey run.
  empty: 'bg-neutral-fill',
}

/** Horizontal rows put the node and its trailing connector on one line. */
export const horizontalRowStyles = 'flex w-full items-start'

export const verticalConnectorWrapStyles = 'flex min-h-[1rem] justify-start'
