import type { ComponentPropsWithRef } from 'react'

import { cn } from '../../lib/cn'
import { bodyStyles } from './card.styles'

export type CardBodyProps = ComponentPropsWithRef<'div'>

/** The flexible content region — text, lists, or a chart. Layout only. */
export function CardBody({ className, children, ...rest }: CardBodyProps) {
  return (
    <div {...rest} className={cn(bodyStyles, className)}>
      {children}
    </div>
  )
}
