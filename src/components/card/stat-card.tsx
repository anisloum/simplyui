import type { ReactNode } from 'react'

import { Badge, type BadgeIntent } from '../badge'
import { Card, type CardProps } from './card'
import { CardBody } from './card-body'
import { CardHeader } from './card-header'
import { CardTitle } from './card-title'
import {
  statBadgeGroupStyles,
  statBadgeLabelStyles,
  statSuffixStyles,
  statValueGroupStyles,
  statValueRowStyles,
  statValueStyles,
} from './card.styles'

export interface StatCardProps extends Omit<CardProps, 'children'> {
  /** Small heading, e.g. "Total Products". */
  title: string
  /** Info hint beside the title. */
  hint?: string
  /** The headline figure, e.g. "50" or "124". */
  value: ReactNode
  /** Muted trailing text, e.g. "in total" or "/150". */
  suffix?: ReactNode
  /** Trailing badge, e.g. "82.66%". */
  badge?: string
  /** Caption above the badge, e.g. "Validation Rate". */
  badgeLabel?: string
  /** @default "primary" */
  badgeIntent?: BadgeIntent
}

/**
 * The number-tile preset, built from the same primitives as any other card —
 * it takes every `Card` prop, so variant, padding and `interactive` all work.
 *
 * Presentational only; the figures come from props.
 */
export function StatCard({
  title,
  hint,
  value,
  suffix,
  badge,
  badgeLabel,
  badgeIntent = 'primary',
  ...cardProps
}: StatCardProps) {
  return (
    <Card {...cardProps}>
      <CardHeader hint={hint}>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardBody className={statValueRowStyles}>
        <span className={statValueGroupStyles}>
          <span className={statValueStyles}>{value}</span>
          {suffix != null && suffix !== false ? (
            <span className={statSuffixStyles}>{suffix}</span>
          ) : null}
        </span>

        {badge ? (
          <span className={statBadgeGroupStyles}>
            {badgeLabel ? <span className={statBadgeLabelStyles}>{badgeLabel}</span> : null}
            <Badge size="sm" intent={badgeIntent}>
              {badge}
            </Badge>
          </span>
        ) : null}
      </CardBody>
    </Card>
  )
}
