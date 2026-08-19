import type { HTMLAttributes } from 'react'

import { cn } from '../../lib/cn'
import { footerStyles } from './sidebar.styles'

export type SidebarFooterProps = HTMLAttributes<HTMLDivElement>

/** Pinned to the bottom via `mt-auto`. Holds the account group in the mockup. */
export function SidebarFooter({ className, children, ...rest }: SidebarFooterProps) {
  return (
    <div {...rest} className={cn(footerStyles, className)}>
      {children}
    </div>
  )
}
