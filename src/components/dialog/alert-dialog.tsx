import { createContext, useContext, useRef, type ReactNode, type Ref, type RefObject } from 'react'

import { Slot } from '../../lib/slot'
import { Dialog } from './dialog'
import { DialogContent, type DialogContentProps } from './dialog-content'
import { useDialogContext } from './dialog-context'
import { DialogBody, DialogDescription, DialogFooter, DialogTitle } from './dialog-parts'

/**
 * Lets `AlertDialogCancel` hand its element up to the `AlertDialog` that owns
 * the `initialFocus` ref, so focusing the safe action is automatic rather than
 * something every consumer has to wire by hand.
 */
const AlertCancelRefContext = createContext<RefObject<HTMLElement | null> | null>(null)

export interface AlertDialogProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children?: ReactNode
}

/**
 * A Dialog constrained for confirmations.
 *
 * Four deliberate differences from `Dialog`, all pointing the same way — an
 * alert asks a question, so it should not be dismissable by accident, and the
 * easy path should be the safe one:
 *
 * - `role="alertdialog"`, which tells assistive tech this is an interruption
 *   expecting a response rather than a container of content;
 * - a backdrop press does nothing, so a stray click cannot dismiss it;
 * - focus lands on Cancel, so an eager Enter takes the safe path;
 * - Escape still cancels, because a keyboard user needs a way out — and it maps
 *   to the safe choice, never to the destructive one.
 */
export function AlertDialog({ children, ...rest }: AlertDialogProps) {
  const cancelRef = useRef<HTMLElement>(null)

  return (
    <AlertCancelRefContext.Provider value={cancelRef}>
      <Dialog {...rest} role="alertdialog" dismissOnBackdrop={false} initialFocus={cancelRef}>
        {children}
      </Dialog>
    </AlertCancelRefContext.Provider>
  )
}

export type AlertDialogContentProps = Omit<DialogContentProps, 'showClose'>

/**
 * No X button: the actions are the only way out, which is what forces an
 * explicit choice. Defaults to `sm`, since a confirmation is a sentence and a
 * pair of buttons.
 */
export function AlertDialogContent({ size = 'sm', children, ...rest }: AlertDialogContentProps) {
  return (
    <DialogContent {...rest} size={size} showClose={false}>
      {children}
    </DialogContent>
  )
}

export interface AlertDialogActionProps {
  /** Merge props into the child instead of rendering a bare `<button>`. */
  asChild?: boolean
  /** Close on activation. Pass `false` when the handler needs to await something. @default true */
  closeOnClick?: boolean
  onClick?: () => void
  children: ReactNode
}

/** The confirming action — usually a destructive Button. */
export function AlertDialogAction({
  asChild = false,
  closeOnClick = true,
  onClick,
  children,
}: AlertDialogActionProps) {
  const { setOpen } = useDialogContext('AlertDialogAction')

  const handleClick = () => {
    onClick?.()
    if (closeOnClick) setOpen(false)
  }

  if (asChild) {
    return <Slot onClick={handleClick}>{children}</Slot>
  }

  return (
    <button type="button" onClick={handleClick}>
      {children}
    </button>
  )
}

export interface AlertDialogCancelProps {
  /** Merge props into the child instead of rendering a bare `<button>`. */
  asChild?: boolean
  onClick?: () => void
  children: ReactNode
}

/**
 * The safe action, and the alert's initial focus target — it registers its own
 * element with the surrounding `AlertDialog`, so no wiring is needed.
 *
 * Not built on `DialogClose`, because it has to contribute a ref as well as a
 * click handler.
 */
export function AlertDialogCancel({ asChild = false, onClick, children }: AlertDialogCancelProps) {
  const { setOpen } = useDialogContext('AlertDialogCancel')
  const cancelRef = useContext(AlertCancelRefContext)

  const handleClick = () => {
    onClick?.()
    setOpen(false)
  }

  if (asChild) {
    return (
      <Slot onClick={handleClick} ref={cancelRef}>
        {children}
      </Slot>
    )
  }

  return (
    <button type="button" ref={cancelRef as Ref<HTMLButtonElement>} onClick={handleClick}>
      {children}
    </button>
  )
}

export {
  DialogBody as AlertDialogBody,
  DialogDescription as AlertDialogDescription,
  DialogFooter as AlertDialogFooter,
  DialogTitle as AlertDialogTitle,
}
