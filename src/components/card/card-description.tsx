import type { ComponentPropsWithRef } from 'react'

import { cn } from '../../lib/cn'
import { descriptionStyles } from './card.styles'

export type CardDescriptionProps = ComponentPropsWithRef<'p'>

export function CardDescription({ className, children, ...rest }: CardDescriptionProps) {
  return (
    <p {...rest} className={cn(descriptionStyles, className)}>
      {children}
    </p>
  )
}
