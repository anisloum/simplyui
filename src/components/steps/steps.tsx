import type { ComponentPropsWithRef } from 'react'

import { cn } from '../../lib/cn'
import { StepLabel, StepNode } from './step-item'
import {
  connectorFillStyles,
  connectorStyles,
  horizontalRowStyles,
  itemStyles,
  labelWrapStyles,
  listStyles,
  type StepsOrientation,
  type StepStatus,
} from './steps.styles'

export type { StepsOrientation, StepStatus }

export interface Step {
  /** Optional text shown with the number. */
  label?: string
}

export interface StepsProps extends Omit<ComponentPropsWithRef<'ol'>, 'children'> {
  steps: Step[]
  /** 0-based index of the current step. */
  current: number
  /** @default "horizontal" */
  orientation?: StepsOrientation
  /** Makes completed and current steps clickable. Display-only when omitted. */
  onStepClick?: (index: number) => void
}

const statusFor = (index: number, current: number): StepStatus => {
  if (index < current) return 'completed'
  if (index === current) return 'current'
  return 'upcoming'
}

/**
 * Progress across a sequence of steps.
 *
 * Status is derived from `current` alone, so there is one source of truth. The
 * connector leading up to the current step is filled and the rest is muted,
 * which is what shows progress along the line.
 */
export function Steps({
  steps,
  current,
  orientation = 'horizontal',
  onStepClick,
  className,
  ...rest
}: StepsProps) {
  const isHorizontal = orientation === 'horizontal'

  return (
    <ol
      {...rest}
      aria-label={rest['aria-label'] ?? 'Progress'}
      className={cn(listStyles[orientation], className)}
    >
      {steps.map((step, index) => {
        const status = statusFor(index, current)
        const isLast = index === steps.length - 1
        // The segment after this node is filled only once the step is done.
        const connectorFill = index < current ? 'filled' : 'empty'

        if (isHorizontal) {
          return (
            <li
              key={index}
              aria-current={status === 'current' ? 'step' : undefined}
              className={itemStyles.horizontal}
            >
              <div className={horizontalRowStyles}>
                <StepNode
                  index={index}
                  status={status}
                  label={step.label}
                  onStepClick={onStepClick}
                />
                {!isLast ? (
                  <span
                    aria-hidden="true"
                    className={cn(
                      connectorStyles.horizontal,
                      connectorFillStyles[connectorFill],
                      'ml-0',
                    )}
                  />
                ) : null}
              </div>

              {step.label ? (
                <span className={labelWrapStyles.horizontal}>
                  <StepLabel status={status}>{step.label}</StepLabel>
                </span>
              ) : null}
            </li>
          )
        }

        return (
          <li
            key={index}
            aria-current={status === 'current' ? 'step' : undefined}
            className="flex flex-col"
          >
            <div className={itemStyles.vertical}>
              <StepNode
                index={index}
                status={status}
                label={step.label}
                onStepClick={onStepClick}
              />
              {step.label ? (
                <span className={labelWrapStyles.vertical}>
                  <StepLabel status={status}>{step.label}</StepLabel>
                </span>
              ) : null}
            </div>

            {!isLast ? (
              <span className="flex min-h-[1rem] justify-start">
                <span
                  aria-hidden="true"
                  className={cn(connectorStyles.vertical, connectorFillStyles[connectorFill])}
                />
              </span>
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}
