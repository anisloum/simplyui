import { useCallback, useId, useMemo, useState, type HTMLAttributes, type Ref } from 'react'

import { cn } from '../../lib/cn'
import { Slot } from '../../lib/slot'
import { CardContext } from './card-context'
import { cardStyles, type CardPadding, type CardVariant } from './card.styles'

export type { CardPadding, CardVariant }

/**
 * Keyed to the generic `HTMLElement` rather than `HTMLDivElement`, because the
 * rendered tag varies — `<div>`, `<section>` or `<button>` depending on the
 * props below. Element-specific handler types would not survive that.
 */
export interface CardProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<HTMLElement>
  /** Visual style. @default "elevated" */
  variant?: CardVariant
  /** Inner padding. Use `"none"` for edge-to-edge media or charts. @default "md" */
  padding?: CardPadding
  /** Makes the whole card one clickable target. @default false */
  interactive?: boolean
  /** Merge props into a single element child (e.g. an `<a>`) instead of rendering a container. @default false */
  asChild?: boolean
}

/**
 * Container for the card family. Compose it with `CardHeader`, `CardTitle`,
 * `CardDescription`, `CardBody` and `CardFooter` — there are no per-use-case
 * container variants, and charts simply live inside as children.
 *
 * The element it renders depends on what it is:
 * - `asChild` → whatever you passed, with the styling merged in;
 * - `interactive` → a real `<button>`, so Enter and Space work for free and the
 *   card is a single tab stop;
 * - containing a `CardTitle` → a `<section>` labelled by that heading;
 * - otherwise → a plain `<div>`.
 */
export function Card({
  variant = 'elevated',
  padding = 'md',
  interactive = false,
  asChild = false,
  className,
  children,
  ref,
  ...rest
}: CardProps) {
  const titleId = useId()
  // A card only becomes a labelled region once a heading actually exists —
  // pointing `aria-labelledby` at an absent id would be worse than no landmark.
  const [hasTitle, setHasTitle] = useState(false)
  const registerTitle = useCallback((present: boolean) => setHasTitle(present), [])
  // `asChild` cards are interactive too as far as sub-parts are concerned —
  // the child is usually an <a>, and a button inside an anchor is just as
  // invalid as one inside a button.
  const context = useMemo(
    () => ({ titleId, registerTitle, interactive: interactive || asChild }),
    [titleId, registerTitle, interactive, asChild],
  )

  const classes = cn(cardStyles({ variant, padding, interactive }), className)

  let content
  if (asChild) {
    content = (
      <Slot {...rest} ref={ref} className={classes}>
        {children}
      </Slot>
    )
  } else if (interactive) {
    content = (
      <button type="button" {...rest} ref={ref as Ref<HTMLButtonElement>} className={classes}>
        {children}
      </button>
    )
  } else if (hasTitle) {
    content = (
      <section {...rest} ref={ref} aria-labelledby={titleId} className={classes}>
        {children}
      </section>
    )
  } else {
    content = (
      <div {...rest} ref={ref as Ref<HTMLDivElement>} className={classes}>
        {children}
      </div>
    )
  }

  return <CardContext.Provider value={context}>{content}</CardContext.Provider>
}
