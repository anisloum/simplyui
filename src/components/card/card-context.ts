import { createContext, useContext } from 'react'

export interface CardContextValue {
  /** Id a `CardTitle` puts on itself so the Card can point `aria-labelledby` at it. */
  titleId: string
  /** Called by `CardTitle` on mount so the Card knows a heading exists. */
  registerTitle: (present: boolean) => void
  /**
   * True when the Card itself is the control. Sub-parts use this to avoid
   * rendering their own focusable elements inside it, which would be a
   * nested-interactive violation and a second tab stop.
   */
  interactive: boolean
}

export const CardContext = createContext<CardContextValue | null>(null)

export function useCardContext() {
  return useContext(CardContext)
}
