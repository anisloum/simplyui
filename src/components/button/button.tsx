import { Loader2 } from 'lucide-react'
import {
  cloneElement,
  isValidElement,
  useEffect,
  type ComponentPropsWithRef,
  type ReactNode,
} from 'react'

import { cn } from '../../lib/cn'
import { Slot } from '../../lib/slot'
import {
  buttonStyles,
  disabledStyles,
  iconSizeStyles,
  type ButtonSize,
  type ButtonVariant,
} from './button.styles'

export type { ButtonSize, ButtonVariant }

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  /** Visual style. @default "solid" */
  variant?: ButtonVariant
  /** Size. @default "md" */
  size?: ButtonSize
  /** Optional icon element (a Lucide icon, or any SVG that scales to its box). */
  icon?: ReactNode
  /** Which side the icon sits on. Ignored when `iconOnly`. @default "left" */
  iconPosition?: 'left' | 'right'
  /** Icon-only (square) button. Requires `aria-label`. @default false */
  iconOnly?: boolean
  /** Shows a spinner, hides content, and disables the button. @default false */
  isLoading?: boolean
  /** Full-width block button. @default false */
  fullWidth?: boolean
  /** Merge props into the single element child instead of rendering a `<button>`. @default false */
  asChild?: boolean
}

/**
 * Warns once per state change when an icon-only button would ship with no
 * accessible name. Children count: `iconOnly` renders them `sr-only`, so they
 * still name the control even though nothing is visible.
 */
function useAccessibleNameWarning(iconOnly: boolean, hasName: boolean): void {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return
    if (iconOnly && !hasName) {
      console.warn(
        '[@simply-ui/react] <Button iconOnly> renders no visible text, so it needs an accessible name. Pass `aria-label` (or `aria-labelledby`).',
      )
    }
  }, [iconOnly, hasName])
}

const isPresent = (node: ReactNode): boolean =>
  node !== undefined && node !== null && node !== false && node !== ''

export function Button({
  variant = 'solid',
  size = 'md',
  icon,
  iconPosition = 'left',
  iconOnly = false,
  isLoading = false,
  fullWidth = false,
  asChild = false,
  disabled = false,
  className,
  children,
  type,
  onClick,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || isLoading
  const ariaLabel = rest['aria-label']
  const ariaLabelledBy = rest['aria-labelledby']

  useAccessibleNameWarning(
    iconOnly,
    Boolean(ariaLabel?.trim()) || Boolean(ariaLabelledBy?.trim()) || isPresent(children),
  )

  const iconBox = iconSizeStyles[size]

  const spinner = (
    <Loader2
      aria-hidden="true"
      className={cn('shrink-0 animate-spin motion-reduce:animate-none', iconBox)}
    />
  )

  const renderedIcon = isPresent(icon) ? (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex shrink-0 items-center justify-center [&>svg]:size-full',
        iconBox,
        isLoading && !iconOnly && 'opacity-0',
      )}
    >
      {icon}
    </span>
  ) : null

  /**
   * `label` is the button's own children for a plain button, or the child
   * element's children when `asChild` is in play.
   */
  const renderContent = (label: ReactNode) => {
    if (iconOnly) {
      return (
        <>
          {isLoading ? spinner : renderedIcon}
          {isPresent(label) && <span className="sr-only">{label}</span>}
        </>
      )
    }

    return (
      <>
        {/* Absolutely positioned, so it leaves the flex flow entirely: the
            hidden label keeps its intrinsic width and the button does not
            resize when loading starts. */}
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">{spinner}</span>
        )}
        {iconPosition === 'left' && renderedIcon}
        {/* `opacity-0`, never `invisible`: visibility:hidden would drop the
            label out of the accessibility tree, leaving a loading button with
            no accessible name. Opacity hides it while keeping both its
            intrinsic width and its name. */}
        {isPresent(label) && <span className={cn(isLoading && 'opacity-0')}>{label}</span>}
        {iconPosition === 'right' && renderedIcon}
      </>
    )
  }

  const classes = cn(buttonStyles({ variant, size, iconOnly, fullWidth }), className)

  if (asChild) {
    const childElement = isValidElement<{ children?: ReactNode }>(children) ? children : null

    return (
      <Slot
        {...rest}
        // A non-button child has no `disabled` attribute for the `disabled:`
        // variants to key off, so the look has to be forced and pointer events
        // shut off by hand.
        className={cn(
          classes,
          isDisabled && cn(disabledStyles[variant], 'pointer-events-none cursor-not-allowed'),
        )}
        aria-disabled={isDisabled || undefined}
        aria-busy={isLoading || undefined}
        onClick={isDisabled ? undefined : onClick}
      >
        {childElement
          ? cloneElement(childElement, undefined, renderContent(childElement.props.children))
          : children}
      </Slot>
    )
  }

  return (
    <button
      {...rest}
      type={type ?? 'button'}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      aria-disabled={isLoading || undefined}
      onClick={isDisabled ? undefined : onClick}
      className={classes}
    >
      {renderContent(children)}
    </button>
  )
}
