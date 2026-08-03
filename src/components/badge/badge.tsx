import { X } from 'lucide-react'
import type { ComponentPropsWithRef, ReactNode } from 'react'

import { cn } from '../../lib/cn'
import {
  badgeIconSizeStyles,
  badgeIconStyles,
  badgeLabelStyles,
  badgeRemoveStyles,
  badgeStyles,
  type BadgeIntent,
  type BadgeShape,
  type BadgeSize,
  type BadgeVariant,
} from './badge.styles'

export type { BadgeIntent, BadgeShape, BadgeSize, BadgeVariant }

export interface BadgeProps extends ComponentPropsWithRef<'span'> {
  /** Colour intent. @default "primary" */
  intent?: BadgeIntent
  /** Filled or outlined. @default "filled" */
  variant?: BadgeVariant
  /** Size. @default "md" */
  size?: BadgeSize
  /** Pill or the 5px control corner. @default "pill" */
  shape?: BadgeShape
  /** Optional leading icon. Decorative. */
  icon?: ReactNode
  /** Greys the badge out and disables its remove control. @default false */
  disabled?: boolean
  /** Supplying this renders a trailing remove control, turning the badge into a chip. */
  onRemove?: () => void
  /** Accessible name for the remove control. @default "Remove" */
  removeLabel?: string
}

/**
 * Small pill-shaped status label. Passing `onRemove` turns it into a
 * dismissible chip, which is how `Select` renders multi-select values.
 *
 * The badge itself is a `<span>` — it is status text, not a control. Only the
 * remove affordance is interactive, and it is a real `<button>`.
 */
export function Badge({
  intent = 'primary',
  variant = 'filled',
  size = 'md',
  shape = 'pill',
  icon,
  disabled = false,
  onRemove,
  removeLabel = 'Remove',
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      {...rest}
      className={cn(badgeStyles({ intent, variant, size, shape, disabled }), className)}
    >
      {icon ? (
        <span aria-hidden="true" className={cn(badgeIconStyles, badgeIconSizeStyles[size])}>
          {icon}
        </span>
      ) : null}

      {children != null && children !== false ? (
        <span className={badgeLabelStyles}>{children}</span>
      ) : null}

      {onRemove ? (
        <button
          type="button"
          className={cn(badgeRemoveStyles, badgeIconSizeStyles[size])}
          onClick={disabled ? undefined : onRemove}
          disabled={disabled}
          aria-label={removeLabel}
        >
          <X aria-hidden="true" />
        </button>
      ) : null}
    </span>
  )
}
