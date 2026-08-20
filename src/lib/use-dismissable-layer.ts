import { useEffect, useId, type RefObject } from 'react'

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

/* -------------------------------------------------------------------------- */
/* Layer stack                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Module-level because "which layer is on top" is a property of the page, not
 * of any one component. Ordered bottom to top.
 */
const layerStack: string[] = []
const layerRefs = new Map<string, RefObject<HTMLElement | null>>()

/**
 * Whether this layer is the one keyboard and pointer dismissal should act on.
 * Read at event time rather than kept in state: a nested layer opening does not
 * change anything the outer layer *renders*, so re-rendering every layer just
 * to track it would be waste.
 */
function isTopmostLayer(id: string): boolean {
  return layerStack[layerStack.length - 1] === id
}

/* -------------------------------------------------------------------------- */
/* Scroll lock (ref-counted)                                                   */
/* -------------------------------------------------------------------------- */

let scrollLockCount = 0
let savedOverflow = ''
let savedPaddingRight = ''

/**
 * Ref-counted so nested layers cannot unlock the page early. Save/restore alone
 * only works if layers close in the exact reverse of the order they opened;
 * close the outer one first and the inner one is left on an unlocked page.
 */
function lockBodyScroll(): void {
  if (typeof document === 'undefined') return
  const { body } = document
  if (scrollLockCount === 0) {
    savedOverflow = body.style.overflow
    savedPaddingRight = body.style.paddingRight
    // Add the scrollbar's width back as padding so the page behind does not
    // visibly jump when it disappears.
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`
  }
  scrollLockCount += 1
}

function unlockBodyScroll(): void {
  if (typeof document === 'undefined' || scrollLockCount === 0) return
  scrollLockCount -= 1
  if (scrollLockCount === 0) {
    document.body.style.overflow = savedOverflow
    document.body.style.paddingRight = savedPaddingRight
  }
}

/* -------------------------------------------------------------------------- */
/* Background inert                                                            */
/* -------------------------------------------------------------------------- */

const inertMarks = new Map<Element, { ariaHidden: string | null; inert: boolean }>()

/**
 * Hides everything behind the open layers from assistive tech and from the tab
 * order, so a screen-reader user cannot wander out of a modal into the page
 * underneath.
 *
 * Recomputed from the whole stack rather than per layer: a nested dialog
 * portals into a *new* body child that did not exist when the outer one opened,
 * so a layer marking its own siblings once would miss it.
 */
function syncBackgroundInert(): void {
  if (typeof document === 'undefined') return

  const openLayers = [...layerRefs.values()]
    .map((ref) => ref.current)
    .filter((element): element is HTMLElement => element != null)

  for (const child of Array.from(document.body.children)) {
    const marked = inertMarks.has(child)
    const shouldMark = openLayers.length > 0 && !openLayers.some((layer) => child.contains(layer))

    if (shouldMark && !marked) {
      inertMarks.set(child, {
        ariaHidden: child.getAttribute('aria-hidden'),
        inert: (child as HTMLElement).inert,
      })
      child.setAttribute('aria-hidden', 'true')
      ;(child as HTMLElement).inert = true
    } else if (!shouldMark && marked) {
      const previous = inertMarks.get(child)
      if (previous?.ariaHidden == null) child.removeAttribute('aria-hidden')
      else child.setAttribute('aria-hidden', previous.ariaHidden)
      ;(child as HTMLElement).inert = previous?.inert ?? false
      inertMarks.delete(child)
    }
  }

  // A child can be removed from the DOM while still marked (a closing portal),
  // which would otherwise leak one entry per open/close cycle.
  for (const child of [...inertMarks.keys()]) {
    if (!child.isConnected) inertMarks.delete(child)
  }
}

/* -------------------------------------------------------------------------- */
/* Hook                                                                        */
/* -------------------------------------------------------------------------- */

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
  /** Dismiss when Escape is pressed. @default true */
  dismissOnEscape?: boolean
  /** Dismiss on a pointer press outside the layer. @default true */
  dismissOnOutside?: boolean
  /** Where to send focus on open. Falls back to the first focusable element. */
  initialFocus?: RefObject<HTMLElement | null>
  /** Hide background content from assistive tech while open. @default true */
  inertBackground?: boolean
}

/**
 * The behaviour shared by every modal surface: dismiss on Escape and outside
 * press, trap Tab, lock background scroll, hide the page behind, and hand focus
 * back to the opener on close.
 *
 * Split out of any one component so Dialog, Drawer and Sidebar's mobile
 * off-canvas panel cannot drift apart — a focus trap that only *mostly* matches
 * across three components is worse than one shared implementation.
 *
 * Layers stack: Escape and outside presses act on the topmost one only, and the
 * scroll lock is ref-counted so it lifts when the last layer closes rather than
 * the first. Paint order needs no z-index arithmetic — portals append to
 * `document.body` in the order they open, so a nested layer is already later in
 * the DOM than its opener and paints above it.
 *
 * Deliberately styling-free, and deliberately not a positioning hook; see
 * `usePopover` for that.
 */
export function useDismissableLayer({
  open,
  layerRef,
  onDismiss,
  trapFocus = true,
  lockScroll = true,
  returnFocus = true,
  dismissOnEscape = true,
  dismissOnOutside = true,
  initialFocus,
  inertBackground = true,
}: UseDismissableLayerOptions): void {
  const id = useId()

  // Register in the stack first, so the behaviour effects below can rely on the
  // stack already knowing about this layer.
  useEffect(() => {
    if (!open) return

    layerStack.push(id)
    layerRefs.set(id, layerRef)
    if (inertBackground) syncBackgroundInert()

    return () => {
      const index = layerStack.indexOf(id)
      if (index !== -1) layerStack.splice(index, 1)
      layerRefs.delete(id)
      if (inertBackground) syncBackgroundInert()
    }
  }, [open, id, layerRef, inertBackground])

  // Escape to dismiss, Tab to cycle. Capture phase so the layer sees the key
  // before anything inside it can stop propagation.
  useEffect(() => {
    if (!open || typeof document === 'undefined') return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // Topmost only, so Escape peels a nested stack one layer at a time
        // rather than collapsing all of it at once.
        if (!dismissOnEscape || !isTopmostLayer(id)) return
        event.stopPropagation()
        onDismiss()
        return
      }

      if (event.key !== 'Tab' || !trapFocus || !isTopmostLayer(id)) return

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
  }, [open, onDismiss, trapFocus, dismissOnEscape, layerRef, id])

  // Outside press. `pointerdown` rather than `click` so a press that starts
  // outside and drags onto the panel still dismisses, matching native menus.
  useEffect(() => {
    if (!open || !dismissOnOutside || typeof document === 'undefined') return

    const handlePointerDown = (event: PointerEvent) => {
      if (!isTopmostLayer(id)) return
      const target = event.target as Node | null
      if (!target) return
      if (layerRef.current?.contains(target)) return
      onDismiss()
    }

    document.addEventListener('pointerdown', handlePointerDown, true)
    return () => document.removeEventListener('pointerdown', handlePointerDown, true)
  }, [open, onDismiss, dismissOnOutside, layerRef, id])

  useEffect(() => {
    if (!open || !lockScroll) return
    lockBodyScroll()
    return () => unlockBodyScroll()
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
      const target = initialFocus?.current ?? getFocusable(layer)[0]
      ;(target ?? layer).focus()
    }

    return () => {
      // `isConnected` guards the case where the opener unmounted while open.
      if (returnFocus && opener?.isConnected) opener.focus()
    }
  }, [open, layerRef, returnFocus, initialFocus])
}
