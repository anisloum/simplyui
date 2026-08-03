import { cn } from '../../lib/cn'
import { labelStyles, nodeInteractiveStyles, nodeStyles, type StepStatus } from './steps.styles'

const STATUS_TEXT: Record<StepStatus, string> = {
  completed: 'completed',
  current: 'current',
  upcoming: 'upcoming',
}

export interface StepNodeProps {
  index: number
  status: StepStatus
  label?: string
  onStepClick?: (index: number) => void
}

/**
 * The numbered node. Every step shows its number, including completed ones.
 *
 * That means completed and current are visually identical and only the
 * connector distinguishes them, so the whole status distinction rests on the
 * hidden text below plus `aria-current="step"` on the item — which is exactly
 * why both are kept.
 *
 * It renders as a `<button>` only when genuinely actionable; an inert node is a
 * `<span>`, not a disabled button, so it never lands in the tab order.
 */
export function StepNode({ index, status, label, onStepClick }: StepNodeProps) {
  const interactive = onStepClick !== undefined && status !== 'upcoming'

  const content = (
    <>
      <span aria-hidden="true">{index + 1}</span>
      <span className="sr-only">
        {`Step ${index + 1}${label ? `: ${label}` : ''}, ${STATUS_TEXT[status]}`}
      </span>
    </>
  )

  if (interactive) {
    return (
      <button
        type="button"
        onClick={() => onStepClick(index)}
        className={cn(nodeStyles[status], nodeInteractiveStyles)}
      >
        {content}
      </button>
    )
  }

  return <span className={nodeStyles[status]}>{content}</span>
}

export interface StepLabelProps {
  status: StepStatus
  children: string
}

export function StepLabel({ status, children }: StepLabelProps) {
  return (
    <span aria-hidden="true" className={labelStyles[status]}>
      {children}
    </span>
  )
}
