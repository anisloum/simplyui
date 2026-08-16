import { useCallback, useEffect, useLayoutEffect, useState, type RefObject } from 'react'

/** `useLayoutEffect` warns when it runs during SSR; fall back on the server. */
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

export type PopoverPlacement = 'bottom' | 'top'

export interface PopoverPosition {
  top: number
  left: number
  width: number
  /** Space actually available in the chosen direction. */
  maxHeight: number
  placement: PopoverPlacement
}

export interface UsePopoverOptions {
  open: boolean
  anchorRef: RefObject<HTMLElement | null>
  popoverRef: RefObject<HTMLElement | null>
  /** Gap between anchor and popover, in px. @default 4 */
  offset?: number
  /** Upper bound the consumer wants, before available space is considered. */
  preferredMaxHeight?: number
  /** Fired on outside pointerdown. Escape is the consumer's to handle. */
  onDismiss?: () => void
}

/**
 * Positions a fixed-position popover against an anchor, flipping above it when
 * there is not enough room below, and keeping it aligned while the page scrolls
 * or resizes.
 *
 * Deliberately not tied to Select — Combobox, Dropdown and Tooltip need the
 * same three things (place, flip, dismiss).
 *
 * Coordinates are viewport-relative because the popover is `position: fixed`,
 * which is also what lets it be portalled out of any `overflow: hidden`
 * ancestor without being clipped.
 */
export function usePopover({
  open,
  anchorRef,
  popoverRef,
  offset = 4,
  preferredMaxHeight,
  onDismiss,
}: UsePopoverOptions): PopoverPosition | null {
  const [position, setPosition] = useState<PopoverPosition | null>(null)

  const compute = useCallback(() => {
    const anchor = anchorRef.current
    const popover = popoverRef.current
    if (!anchor || !popover) return

    const rect = anchor.getBoundingClientRect()
    // Keep the popover off the very edge of the viewport.
    const edgeMargin = 8
    const spaceBelow = window.innerHeight - rect.bottom - offset - edgeMargin
    const spaceAbove = rect.top - offset - edgeMargin

    // scrollHeight rather than offsetHeight: we want the natural content height,
    // not whatever a previous pass already clamped it to.
    const contentHeight = Math.min(
      popover.scrollHeight,
      preferredMaxHeight ?? Number.POSITIVE_INFINITY,
    )

    // Prefer below; only flip when below cannot fit it AND above is roomier.
    const placeBelow = spaceBelow >= contentHeight || spaceBelow >= spaceAbove
    const available = Math.max(placeBelow ? spaceBelow : spaceAbove, 0)
    const height = Math.min(contentHeight, available)

    setPosition({
      placement: placeBelow ? 'bottom' : 'top',
      top: placeBelow ? rect.bottom + offset : rect.top - offset - height,
      left: rect.left,
      width: rect.width,
      maxHeight: available,
    })
  }, [anchorRef, popoverRef, offset, preferredMaxHeight])

  useIsomorphicLayoutEffect(() => {
    if (!open) {
      setPosition(null)
      return
    }
    compute()
  }, [open, compute])

  // Reposition on scroll/resize, coalesced into one frame so a scroll burst
  // cannot queue a layout read per event.
  useEffect(() => {
    if (!open) return

    let frame = 0
    const schedule = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        compute()
      })
    }

    // Capture phase, so scrolling inside any ancestor container counts too.
    window.addEventListener('scroll', schedule, true)
    window.addEventListener('resize', schedule)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule, true)
      window.removeEventListener('resize', schedule)
    }
  }, [open, compute])

  useEffect(() => {
    if (!open || !onDismiss) return

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null
      if (!target) return
      if (anchorRef.current?.contains(target)) return
      if (popoverRef.current?.contains(target)) return
      onDismiss()
    }

    document.addEventListener('pointerdown', handlePointerDown, true)
    return () => document.removeEventListener('pointerdown', handlePointerDown, true)
  }, [open, onDismiss, anchorRef, popoverRef])

  return position
}
