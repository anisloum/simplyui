import { X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type HTMLAttributes } from 'react'
import { createPortal } from 'react-dom'

import { cn } from '../../lib/cn'
import { useDismissableLayer } from '../../lib/use-dismissable-layer'
import { useDialogContext } from './dialog-context'
import {
  backdropStyles,
  closeStyles,
  contentStyles,
  layerStyles,
  type DialogSize,
} from './dialog.styles'

export interface DialogContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Max-width scale. @default "md" */
  size?: DialogSize
  /** Show the built-in X button. @default true */
  showClose?: boolean
}

/**
 * The portalled panel: backdrop, focus trap, scroll lock and ARIA wiring, all
 * from `useDismissableLayer`.
 *
 * Renders nothing until open, so the trap and the scroll lock have nothing to
 * tear down in the common case.
 */
export function DialogContent({
  size = 'md',
  showClose = true,
  className,
  children,
  style,
  ...rest
}: DialogContentProps) {
  const {
    open,
    setOpen,
    titleId,
    descriptionId,
    dismissOnBackdrop,
    dismissOnEscape,
    initialFocus,
    role,
  } = useDialogContext('DialogContent')

  const panelRef = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setOpen(false), [setOpen])

  useDismissableLayer({
    open,
    layerRef: panelRef,
    onDismiss: close,
    dismissOnEscape,
    // Backdrop dismissal is the outside press: the panel is the layer, so any
    // pointer landing outside it is on the backdrop.
    dismissOnOutside: dismissOnBackdrop,
    initialFocus,
  })

  // A portal escapes any `.dark` ancestor, so the theme has to be carried over
  // explicitly — same approach Select's listbox and Sidebar's drawer take.
  const [darkContext, setDarkContext] = useState(false)
  const probeRef = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (open) setDarkContext(probeRef.current?.closest('.dark') != null)
  }, [open])

  return (
    <>
      {/* Anchors the theme probe in the consumer's tree, where `.dark` lives. */}
      <span ref={probeRef} hidden />
      {open && typeof document !== 'undefined'
        ? // No per-layer z-index: portals append to body in the order they open,
          // so a nested dialog is already later in the DOM than its opener and
          // paints above it.
          createPortal(
            <div className={cn(darkContext && 'dark', layerStyles)}>
              <div className={backdropStyles} aria-hidden="true" />
              <div
                {...rest}
                ref={panelRef}
                role={role}
                aria-modal="true"
                aria-labelledby={titleId || undefined}
                aria-describedby={descriptionId || undefined}
                tabIndex={-1}
                className={cn(contentStyles({ size }), className)}
                style={style}
              >
                {showClose ? (
                  <button
                    type="button"
                    onClick={close}
                    aria-label="Close"
                    className={cn(closeStyles, 'absolute top-3 right-3 z-10')}
                  >
                    <X aria-hidden="true" />
                  </button>
                ) : null}
                {children}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
