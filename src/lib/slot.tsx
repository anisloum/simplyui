import { cloneElement, isValidElement, type CSSProperties, type ReactNode, type Ref } from 'react'

import { cn } from './cn'

type UnknownProps = Record<string, unknown>
type AnyHandler = (...args: unknown[]) => unknown

export type SlotProps = UnknownProps & {
  /** Exactly one React element. Anything else renders nothing. */
  children?: ReactNode
}

const isEventHandlerName = (key: string) => /^on[A-Z]/.test(key)

function assignRef<T>(ref: Ref<T> | undefined, node: T | null): void {
  if (typeof ref === 'function') {
    ref(node)
  } else if (ref) {
    ;(ref as { current: T | null }).current = node
  }
}

function composeRefs<T>(a: Ref<T> | undefined, b: Ref<T> | undefined): Ref<T> | undefined {
  if (!a) return b
  if (!b) return a
  return (node: T | null) => {
    assignRef(a, node)
    assignRef(b, node)
  }
}

/**
 * Minimal `asChild` implementation: merges the props it receives into its single
 * element child instead of rendering a wrapper of its own.
 *
 * Merge rules, in the order surprises usually happen:
 * - `className` is composed through `cn()`, so the child can override utilities.
 * - `style` is shallow-merged, child wins on conflicting keys.
 * - `onX` handlers are chained — the child's runs first, then ours.
 * - everything else: the child's prop wins when it is not `undefined`.
 *
 * Deliberately not Radix. Known limitation: composing the child's *own* ref with
 * ours relies on `props.ref`, which only exists on React 19. Under React 18 the
 * child's ref is dropped in favour of ours.
 */
export function Slot({ children, ...slotProps }: SlotProps) {
  if (!isValidElement(children)) {
    if (process.env.NODE_ENV !== 'production' && children != null) {
      console.warn(
        '[@simply-ui/react] `asChild` expects a single React element child. Received something else, so nothing was rendered.',
      )
    }
    return null
  }

  const childProps = children.props as UnknownProps
  const merged: UnknownProps = { ...slotProps }

  for (const [key, childValue] of Object.entries(childProps)) {
    const slotValue = slotProps[key]

    if (
      isEventHandlerName(key) &&
      typeof childValue === 'function' &&
      typeof slotValue === 'function'
    ) {
      merged[key] = (...args: unknown[]) => {
        ;(childValue as AnyHandler)(...args)
        ;(slotValue as AnyHandler)(...args)
      }
    } else if (childValue !== undefined) {
      merged[key] = childValue
    }
  }

  merged.className = cn(
    slotProps.className as string | undefined,
    childProps.className as string | undefined,
  )
  merged.style = {
    ...(slotProps.style as CSSProperties | undefined),
    ...(childProps.style as CSSProperties | undefined),
  }

  const composedRef = composeRefs(
    slotProps.ref as Ref<never> | undefined,
    childProps.ref as Ref<never> | undefined,
  )
  if (composedRef) {
    merged.ref = composedRef
  } else {
    delete merged.ref
  }

  return cloneElement(children, merged)
}
