import { useEffect, type ComponentPropsWithRef } from 'react'

import { cn } from '../../lib/cn'
import { useCardContext } from './card-context'
import { titleStyles } from './card.styles'

export interface CardTitleProps extends ComponentPropsWithRef<'h3'> {
  /** Heading level, so the document outline stays sane. @default "h3" */
  as?: 'h2' | 'h3' | 'h4'
}

/**
 * A real heading, not styled text — `as` lets the consumer pick the level that
 * fits their page.
 *
 * Mounting also tells the parent `Card` a heading exists, which is what lets
 * the Card upgrade itself to a labelled `<section>`.
 */
export function CardTitle({
  as: Component = 'h3',
  id,
  className,
  children,
  ...rest
}: CardTitleProps) {
  const card = useCardContext()

  useEffect(() => {
    card?.registerTitle(true)
    return () => card?.registerTitle(false)
  }, [card])

  return (
    <Component {...rest} id={id ?? card?.titleId} className={cn(titleStyles, className)}>
      {children}
    </Component>
  )
}
