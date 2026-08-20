import { createContext, useContext, type RefObject } from 'react'

export interface DialogContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  /** Ids the content wires into `aria-labelledby` / `aria-describedby`. */
  titleId: string
  descriptionId: string
  /** Set by the title/description parts so the content only references ids that exist. */
  registerTitle: (present: boolean) => void
  registerDescription: (present: boolean) => void
  dismissOnBackdrop: boolean
  dismissOnEscape: boolean
  initialFocus?: RefObject<HTMLElement | null>
  /** `alertdialog` for the confirmation preset, `dialog` otherwise. */
  role: 'dialog' | 'alertdialog'
}

export const DialogContext = createContext<DialogContextValue | null>(null)

export function useDialogContext(component: string): DialogContextValue {
  const context = useContext(DialogContext)
  if (!context) {
    throw new Error(`<${component}> must be rendered inside <Dialog>.`)
  }
  return context
}
