import { useCallback, useSyncExternalStore } from 'react'

/**
 * Subscribes to a CSS media query and re-renders when it changes.
 *
 * `useSyncExternalStore` rather than `useState` + an effect: it gives a correct
 * server snapshot instead of flashing the wrong branch on the first client
 * paint, which matters when the query decides between two different DOM trees
 * (Sidebar renders an inline `<aside>` or a portalled dialog, never both).
 *
 * @param query   A media query string, e.g. `"(min-width: 48rem)"`.
 * @param serverFallback  What the query evaluates to during SSR. @default false
 */
export function useMediaQuery(query: string, serverFallback = false): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (typeof window === 'undefined') return () => {}
      const list = window.matchMedia(query)
      list.addEventListener('change', onStoreChange)
      return () => list.removeEventListener('change', onStoreChange)
    },
    [query],
  )

  // Returns a boolean, so referential identity is never an issue here.
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query])
  const getServerSnapshot = useCallback(() => serverFallback, [serverFallback])

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
