import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge class names, resolving conflicting Tailwind utilities in favour of the
 * last one passed. This is what lets consumers override a component's internal
 * styling through `className` without fighting specificity.
 *
 * @example
 * cn('px-2 py-1', condition && 'font-bold', className)
 * cn('px-2', 'px-4') // -> 'px-4'
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export type { ClassValue }
