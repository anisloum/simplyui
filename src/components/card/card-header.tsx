import { Children, isValidElement, type ComponentPropsWithRef, type ReactNode } from 'react'

import { cn } from '../../lib/cn'
import { CardHint } from './card-hint'
import { CardTitle } from './card-title'
import { headerStyles, headerTitleGroupStyles, titleRowStyles } from './card.styles'

export interface CardHeaderProps extends ComponentPropsWithRef<'div'> {
  /** Shows an info affordance after the title carrying this text. */
  hint?: string
  /** Trailing content — a badge, a menu button, and so on. */
  action?: ReactNode
  /** Usually a `CardTitle` plus an optional `CardDescription`. */
  children?: ReactNode
}

/**
 * Title block on the left, `action` on the right.
 *
 * The hint has to sit on the same line as the heading rather than after the
 * whole title block, so the first child is pulled out and paired with it; any
 * remaining children (typically a `CardDescription`) stack underneath.
 */
export function CardHeader({ hint, action, className, children, ...rest }: CardHeaderProps) {
  const items = Children.toArray(children)
  const [first, ...remaining] = items
  const firstIsTitle = isValidElement(first) && first.type === CardTitle

  return (
    <div {...rest} className={cn(headerStyles, className)}>
      <div className={headerTitleGroupStyles}>
        {firstIsTitle ? (
          <>
            <div className={titleRowStyles}>
              {first}
              {hint ? <CardHint>{hint}</CardHint> : null}
            </div>
            {remaining}
          </>
        ) : (
          <>
            {children}
            {hint ? <CardHint>{hint}</CardHint> : null}
          </>
        )}
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
