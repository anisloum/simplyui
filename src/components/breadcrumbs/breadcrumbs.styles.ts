import { cn } from '../../lib/cn'

export const listStyles = 'flex flex-wrap items-center gap-0 text-sm'

export const itemStyles = 'flex items-center gap-0'

/**
 * Links start muted and take the link colour on hover, so the trail reads as
 * secondary chrome until you reach for it.
 */
export const linkStyles = cn(
  'rounded-control text-text-subtle',
  'cursor-pointer hover:text-text-link',
  'transition-colors duration-150 ease-out motion-reduce:transition-none',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring-default',
)

/** The last crumb is where you already are, so it is text rather than a link. */
export const currentStyles = 'font-medium text-text-default'

/** v1 ellipsis is inert text. TODO: make it a popover menu of the hidden crumbs. */
export const ellipsisStyles = 'flex items-center text-text-subtle'

export const separatorStyles =
  'flex size-icon-sm shrink-0 items-center text-text-subtle [&>svg]:size-full'
