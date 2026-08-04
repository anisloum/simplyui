import { Info } from 'lucide-react'

import { cn } from '../../lib/cn'
import { useCardContext } from './card-context'
import { hintStyles } from './card.styles'

export interface CardHintProps {
  /** The hint text. */
  children: string
  className?: string
}

/**
 * The small info affordance beside a card title.
 *
 * v1 fallback per the spec: the text goes in both `title` (so a pointer reveals
 * it natively) and `aria-label` (so assistive tech announces it). It is a real
 * `<button>` rather than a `tabIndex={0}` span — the hint has to be
 * keyboard-reachable, since a hover-only hint is invisible without a mouse, and
 * this is the shape a tooltip trigger needs anyway.
 *
 * Inside an *interactive* Card it drops to a decorative icon plus visually
 * hidden text instead. The card is itself a button (or an anchor via
 * `asChild`), so a nested button there would be invalid HTML, a second tab stop
 * and an axe `nested-interactive` failure. Folding the text into the card's own
 * accessible name keeps the information without any of that.
 *
 * TODO: swap to <Tooltip> when that component exists; the props already match.
 */
export function CardHint({ children, className }: CardHintProps) {
  const card = useCardContext()

  if (card?.interactive) {
    return (
      <span className={cn(hintStyles, className)}>
        <Info aria-hidden="true" />
        <span className="sr-only">{children}</span>
      </span>
    )
  }

  return (
    <button
      type="button"
      title={children}
      aria-label={children}
      className={cn(hintStyles, className)}
    >
      <Info aria-hidden="true" />
    </button>
  )
}
