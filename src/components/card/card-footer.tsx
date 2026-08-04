import type { ComponentPropsWithRef } from 'react'

import { cn } from '../../lib/cn'
import { footerStyles } from './card.styles'

export type CardFooterProps = ComponentPropsWithRef<'div'>

/**
 * No top divider by default: the spec leaves separation to the consumer, and
 * `divider-default` only reaches 1.33:1 on the light surface. Add
 * `className="border-t border-divider-default pt-2"` where you want one.
 */
export function CardFooter({ className, children, ...rest }: CardFooterProps) {
  return (
    <div {...rest} className={cn(footerStyles, className)}>
      {children}
    </div>
  )
}
