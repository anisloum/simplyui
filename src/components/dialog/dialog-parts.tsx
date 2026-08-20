import { useEffect, type HTMLAttributes } from 'react'

import { cn } from '../../lib/cn'
import { useDialogContext } from './dialog-context'
import {
  bodyStyles,
  descriptionStyles,
  footerStyles,
  headerStyles,
  headerTextStyles,
  titleStyles,
} from './dialog.styles'

export type DialogHeaderProps = HTMLAttributes<HTMLDivElement>

/**
 * Title block, pinned above the scrolling body.
 *
 * Reserves room on the right for the built-in close button, which is absolutely
 * positioned so it stays put regardless of how tall the title wraps.
 */
export function DialogHeader({ className, children, ...rest }: DialogHeaderProps) {
  return (
    <div {...rest} className={cn(headerStyles, className)}>
      <div className={headerTextStyles}>{children}</div>
      <span aria-hidden="true" className="size-control-sm shrink-0" />
    </div>
  )
}

export interface DialogTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Heading level. @default "h2" */
  as?: 'h1' | 'h2' | 'h3'
}

/**
 * A real heading, and the dialog's accessible name. Mounting registers it so
 * `DialogContent` only sets `aria-labelledby` when the id exists.
 */
export function DialogTitle({
  as: Component = 'h2',
  className,
  children,
  ...rest
}: DialogTitleProps) {
  const { titleId, registerTitle } = useDialogContext('DialogTitle')

  useEffect(() => {
    registerTitle(true)
    return () => registerTitle(false)
  }, [registerTitle])

  return (
    <Component {...rest} id={titleId || undefined} className={cn(titleStyles, className)}>
      {children}
    </Component>
  )
}

export type DialogDescriptionProps = HTMLAttributes<HTMLParagraphElement>

/** Optional supporting line; becomes the dialog's `aria-describedby`. */
export function DialogDescription({ className, children, ...rest }: DialogDescriptionProps) {
  const { descriptionId, registerDescription } = useDialogContext('DialogDescription')

  useEffect(() => {
    registerDescription(true)
    return () => registerDescription(false)
  }, [registerDescription])

  return (
    <p {...rest} id={descriptionId || undefined} className={cn(descriptionStyles, className)}>
      {children}
    </p>
  )
}

export type DialogBodyProps = HTMLAttributes<HTMLDivElement>

/**
 * The only region that scrolls. Header and footer stay pinned, which is what
 * keeps the actions reachable in a long dialog without scrolling to find them.
 */
export function DialogBody({ className, children, ...rest }: DialogBodyProps) {
  return (
    <div {...rest} className={cn(bodyStyles, className)}>
      {children}
    </div>
  )
}

export type DialogFooterProps = HTMLAttributes<HTMLDivElement>

/** Right-aligned action row. The consumer supplies the buttons. */
export function DialogFooter({ className, children, ...rest }: DialogFooterProps) {
  return (
    <div {...rest} className={cn(footerStyles, className)}>
      {children}
    </div>
  )
}
