import { cn } from '../../lib/cn'

/**
 * The real `<input type="checkbox">` stays in the DOM — focusable, in the a11y
 * tree, only visually replaced. `peer` lets the painted box react to its
 * `:checked`, `:indeterminate`, `:disabled` and `:focus-visible` states purely
 * in CSS, so what you see can never drift from what the input reports (native
 * form reset, autofill and label clicks all keep working).
 */
/**
 * The root is the `<label>`, so the whole row — box included — is the click
 * target. The painted box is only a sibling of the `sr-only` input, so on its
 * own it would swallow clicks instead of toggling.
 */
export const rootStyles = cn(
  'inline-flex w-fit cursor-pointer items-center gap-1',
  'has-disabled:cursor-not-allowed',
)

export const inputStyles = 'peer sr-only'

/** 20px box with a fixed 4px corner — deliberately not `radius-md` (12px). */
export const boxStyles = cn(
  'inline-flex size-[1.25rem] shrink-0 items-center justify-center rounded-[4px] border',
  'border-border-default bg-bg-default text-text-on-primary',
  'transition-[color,background-color,border-color] duration-150 ease-out',
  'motion-reduce:transition-none',

  // Checked and indeterminate share one filled look; only the glyph differs.
  'peer-checked:border-primary-default peer-checked:bg-primary-default',
  'peer-indeterminate:border-primary-default peer-indeterminate:bg-primary-default',

  // The glyph lives inside the box, so it is not a sibling of the input and
  // cannot be a `peer-*` target itself. Reach it as a descendant instead.
  // Only ever one glyph is rendered, so these two rules cannot fight.
  'peer-checked:[&_[data-slot=glyph]]:block',
  'peer-indeterminate:[&_[data-slot=glyph]]:block',

  'peer-not-disabled:peer-hover:border-primary-fg',

  'peer-disabled:border-border-disabled peer-disabled:bg-bg-disabled',
  'peer-checked:peer-disabled:bg-bg-muted peer-checked:peer-disabled:text-text-disabled',
  'peer-indeterminate:peer-disabled:bg-bg-muted peer-indeterminate:peer-disabled:text-text-disabled',

  'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring-default',
)

/** ~14px glyph inside the 20px box, hidden until the box CSS reveals it. */
export const glyphStyles = 'hidden size-[0.875rem]'

export const labelStyles = cn(
  'text-sm font-regular text-text-default select-none',
  'peer-disabled:text-text-disabled',
)
