import { useEffect, type RefObject } from 'react'

/**
 * Elements that can hold focus. `[tabindex="-1"]` is excluded on purpose: it is
 * programmatically focusable but must not be a Tab stop.
 */
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

/** Focusable descendants that are actually rendered (zero-box elements are skipped). */
function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => element.offsetWidth > 0 || element.offsetHeight > 0,
  )
}

export interface UseDismissableLayerOptions {
  /** Whether the layer is currently rendered. */
  open: boolean
  /** The layer's outermost element — the panel, not the backdrop. */
  layerRef: RefObject<HTMLElement | null>
  /** Called on Escape and on a pointer press outside `layerRef`. */
  onDismiss: () => void
  /** Keep Tab inside the layer while open. @default true */
  trapFocus?: boolean
  /** Freeze background scrolling while open. @default true */
  lockScroll?: boolean
  /** Restore focus to whatever was focused before opening. @default true */
  returnFocus?: boolean
}

/**
 * The behaviour shared by every modal surface: dismiss on Escape and outside
 * press, trap Tab, lock background scroll, and hand focus back to the opener on
 * close.
 *
 * Split out of any one component so Modal, Drawer and Sidebar's mobile
 * off-canvas panel cannot drift apart — a focus trap that only *mostly* matches
 * across three components is worse than one shared implementation.
 *
 * Deliberately not a positioning hook; see `usePopover` for that.
 */
export function useDismissableLayer({
  open,
  layerRef,
  onDismiss,
  trapFocus = true,
  lockScroll = true,
  returnFocus = true,
}: UseDismissableLayerOptions): void {
  // Escape to dismiss, Tab to cycle. Capture phase so the layer sees the key
  // before anything inside it can stop propagation.
  useEffect(() => {
    if (!open || typeof document === 'undefined') return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onDismiss()
        return
      }

      if (event.key !== 'Tab' || !trapFocus) return

      const layer = layerRef.current
      if (!layer) return

      const focusable = getFocusable(layer)
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      // Nothing focusable inside: park focus on the layer itself rather than
      // letting Tab escape to the page behind.
      if (!first || !last) {
        event.preventDefault()
        layer.focus()
        return
      }

      const active = document.activeElement
      if (event.shiftKey && (active === first || !layer.contains(active))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown, true)
    return () => document.removeEventListener('keydown', handleKeyDown, true)
  }, [open, onDismiss, trapFocus, layerRef])

  // Outside press. `pointerdown` rather than `click` so a press that starts
  // outside and drags onto the panel still dismisses, matching native menus.
  useEffect(() => {
    if (!open || typeof document === 'undefined') return

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null
      if (!target) return
      if (layerRef.current?.contains(target)) return
      onDismiss()
    }

    document.addEventListener('pointerdown', handlePointerDown, true)
    return () => document.removeEventListener('pointerdown', handlePointerDown, true)
  }, [open, onDismiss, layerRef])

  // Background scroll lock. The scrollbar's width is added back as padding so
  // the page behind does not visibly jump when it disappears.
  useEffect(() => {
    if (!open || !lockScroll || typeof document === 'undefined') return

    const { body } = document
    const previousOverflow = body.style.overflow
    const previousPaddingRight = body.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

    body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`

    return () => {
      body.style.overflow = previousOverflow
      body.style.paddingRight = previousPaddingRight
    }
  }, [open, lockScroll])

  // Move focus in on open, hand it back on close.
  useEffect(() => {
    if (!open || typeof document === 'undefined') return

    const opener = document.activeElement as HTMLElement | null

    // Synchronous, not deferred to an animation frame: React has already
    // attached the portal's refs and committed its children by the time a
    // passive effect runs, so there is nothing to wait for. Deferring to an
    // animation frame would also mean never firing at all in a background tab,
    // or under a test runner that stubs rAF — leaving a modal dialog open with
    // focus still outside it.
    const layer = layerRef.current
    if (layer && !layer.contains(document.activeElement)) {
      const [first] = getFocusable(layer)
      ;(first ?? layer).focus()
    }

    return () => {
      // `isConnected` guards the case where the opener unmounted while open.
      if (returnFocus && opener?.isConnected) opener.focus()
    }
  }, [open, layerRef, returnFocus])
}
