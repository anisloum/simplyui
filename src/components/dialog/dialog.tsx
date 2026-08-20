import { useCallback, useId, useMemo, useState, type ReactNode, type RefObject } from 'react'

import { Slot } from '../../lib/slot'
import { DialogContext, useDialogContext } from './dialog-context'

export interface DialogProps {
  /** Controlled open state. */
  open?: boolean
  /** Uncontrolled initial state, for use with `DialogTrigger`. */
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Close when the backdrop is pressed. @default true */
  dismissOnBackdrop?: boolean
  /** Close on Escape. @default true */
  dismissOnEscape?: boolean
  /** Where to send focus on open. Falls back to the first focusable element. */
  initialFocus?: RefObject<HTMLElement | null>
  /** @default "dialog" — `AlertDialog` passes `"alertdialog"`. */
  role?: 'dialog' | 'alertdialog'
  children?: ReactNode
}

/**
 * Owns open state and the wiring every part needs; renders no markup itself.
 *
 * Nothing is portalled or trapped until `DialogContent` mounts, so a closed
 * dialog costs one context provider and nothing else.
 */
export function Dialog({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  dismissOnBackdrop = true,
  dismissOnEscape = true,
  initialFocus,
  role = 'dialog',
  children,
}: DialogProps) {
  const baseId = useId()
  const isControlled = controlledOpen !== undefined
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next)
      onOpenChange?.(next)
    },
    [isControlled, onOpenChange],
  )

  // The content only points `aria-labelledby`/`aria-describedby` at ids that
  // actually exist — a dangling reference leaves the dialog unnamed, which is
  // worse than having no attribute at all.
  const [hasTitle, setHasTitle] = useState(false)
  const [hasDescription, setHasDescription] = useState(false)

  const context = useMemo(
    () => ({
      open,
      setOpen,
      titleId: hasTitle ? `${baseId}-title` : '',
      descriptionId: hasDescription ? `${baseId}-description` : '',
      registerTitle: setHasTitle,
      registerDescription: setHasDescription,
      dismissOnBackdrop,
      dismissOnEscape,
      initialFocus,
      role,
    }),
    [
      open,
      setOpen,
      baseId,
      hasTitle,
      hasDescription,
      dismissOnBackdrop,
      dismissOnEscape,
      initialFocus,
      role,
    ],
  )

  return <DialogContext.Provider value={context}>{children}</DialogContext.Provider>
}

export interface DialogTriggerProps {
  /** Merge props into the child element instead of rendering a `<button>`. */
  asChild?: boolean
  children: ReactNode
}

/** Opens the dialog. Focus returns here automatically when it closes. */
export function DialogTrigger({ asChild = false, children }: DialogTriggerProps) {
  const { setOpen } = useDialogContext('DialogTrigger')
  const handleClick = () => setOpen(true)

  if (asChild) {
    return <Slot onClick={handleClick}>{children}</Slot>
  }

  return (
    <button type="button" onClick={handleClick}>
      {children}
    </button>
  )
}

export interface DialogCloseProps {
  /** Merge props into the child element instead of rendering a `<button>`. */
  asChild?: boolean
  children: ReactNode
}

/** Closes the dialog — wrap a Cancel button with it rather than wiring state by hand. */
export function DialogClose({ asChild = false, children }: DialogCloseProps) {
  const { setOpen } = useDialogContext('DialogClose')
  const handleClick = () => setOpen(false)

  if (asChild) {
    return <Slot onClick={handleClick}>{children}</Slot>
  }

  return (
    <button type="button" onClick={handleClick}>
      {children}
    </button>
  )
}
