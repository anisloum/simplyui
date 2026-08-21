import { cn } from '../../lib/cn'

export type TableAlign = 'left' | 'center' | 'right'
export type TablePinned = 'left' | 'right'

/**
 * The scroll container. `overflow-x-auto` is what lets a wide table scroll on a
 * narrow screen instead of blowing out the page, and it is also the positioning
 * context sticky headers and pinned cells resolve against.
 *
 * Setting `overflow-x` computes `overflow-y` to `auto` as well, which is what
 * clips the header's corners to the container radius. Give the container a
 * height (`max-h-*`) to make `stickyHeader` meaningful.
 */
export const containerStyles = cn(
  'scrollbar-subtle relative w-full overflow-x-auto',
  'rounded-md border border-border-subtle bg-surface-default',
)

export const tableStyles = 'w-full border-collapse text-left text-sm text-text-default'

export const captionStyles = 'px-3 py-2 text-left text-sm text-text-subtle'

/* -------------------------------------------------------------------------- */
/* Sections                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * `sticky` lives on the cells rather than on `<thead>`: a sticky `<thead>` is
 * still not honoured everywhere, while sticky `<th>` is. The opaque fill is
 * mandatory — a transparent sticky header lets body rows show through as they
 * scroll under it.
 */
export function headerStyles({ sticky = false } = {}) {
  return cn(sticky && '[&_th]:sticky [&_th]:top-[0] [&_th]:z-sticky')
}

export const bodyStyles = ''

/**
 * The fill shared by the header band, the footer band and any pinned cell
 * inside them. Kept as one constant so a pinned header can never end up a
 * different colour from the header it sits in.
 */
export const bandFillStyles = 'bg-bg-subtle dark:bg-bg-subtle'

export const footerStyles = cn('border-t border-divider-default font-medium', bandFillStyles)

/* -------------------------------------------------------------------------- */
/* Rows                                                                        */
/* -------------------------------------------------------------------------- */

export interface RowStyleOptions {
  selected?: boolean
  striped?: boolean
}

/**
 * Every row carries an explicit background, even the plain one. That is what
 * makes pinned cells work: they use `bg-inherit`, so they pick up whatever the
 * row currently is — default, striped, hovered or selected — instead of needing
 * a hard-coded fill per state that would desync the moment a state changes.
 *
 * The three cases are mutually exclusive branches rather than layered
 * utilities, so precedence (selected > hover > stripe) is decided here in JS
 * and never depends on CSS specificity between `:nth-child(even)` and `:hover`,
 * which is a coin toss that Tailwind's variant ordering controls, not `cn`.
 *
 * TOKEN NOTE — why these are not the tokens the spec names. A table needs three
 * *simultaneously* distinguishable row surfaces (default / stripe / selected),
 * and the obvious tokens collapse into each other:
 *
 *   light  surface-default #e9f1ff · bg-subtle #dee6f4 · primary-wash-hover #dee6f4
 *   dark   surface-default #1f2633 · bg-subtle #1f2633 · primary-wash-hover #1f2633
 *
 * So `primary-wash-hover` (the spec's selected fill) is literally the same
 * colour as a stripe in light, and in dark every one of them is the same
 * colour — stripes, hover and selection would all be invisible. `bg-muted` is
 * no help either: it is #7e8695 in both modes, a mid-grey far too heavy for a
 * row fill.
 *
 * `primary-wash-active` is the one step that differs in both modes (#ccd3df /
 * #444e5f), so selection uses it, and the dark stripe drops to `bg-default`.
 * The real fix is dedicated row-surface tokens in the design system; until then
 * these are the only combinations that stay legible in both themes.
 */
export function rowStyles({ selected = false, striped = false }: RowStyleOptions = {}) {
  const base = cn(
    'border-b border-divider-default last:border-b-[0]',
    'transition-colors duration-150 ease-out motion-reduce:transition-none',
  )

  if (selected) {
    // No hover class at all — selected outranks hover, so it must not change.
    return cn(base, 'bg-primary-wash-active')
  }
  if (striped) {
    // Stripes are a light-mode device only: dark rows have so little tonal
    // range to work with that alternating fills read as banding rather than as
    // structure. `dark:even:` pins the even row back to the default surface,
    // stated outright instead of relying on two tokens happening to share a
    // value in dark today.
    //
    // The stripe already occupies `bg-subtle`, so hover has to step past it.
    return cn(
      base,
      'bg-surface-default even:bg-bg-subtle dark:bg-bg-default dark:even:bg-bg-default',
      'hover:bg-primary-wash-active',
    )
  }
  return cn(base, 'bg-surface-default hover:bg-bg-subtle dark:hover:bg-primary-wash-active')
}

/* -------------------------------------------------------------------------- */
/* Cells                                                                       */
/* -------------------------------------------------------------------------- */

const alignStyles: Record<TableAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

/**
 * Geometry only — deliberately no fill. The background belongs to the caller,
 * because body and header cells need different ones: a body cell takes
 * `bg-inherit` so it tracks its row through default/stripe/hover/selected,
 * while a header cell has to keep the header band's own colour. Baking
 * `bg-inherit` in here made the pinned header inherit the *row* colour instead.
 *
 * The border is the edge that signals content passing beneath, drawn from a
 * token rather than an arbitrary shadow so it holds up in both themes.
 */
const pinnedStyles: Record<TablePinned, string> = {
  left: 'sticky left-[0] border-r border-border-subtle',
  right: 'sticky right-[0] border-l border-border-subtle',
}

export interface CellStyleOptions {
  align?: TableAlign
  pinned?: TablePinned
  truncate?: boolean
}

const cellBase = cn(
  // 56px rows, per the mockup. Height on the cell rather than the row, which
  // browsers treat as a suggestion.
  'h-[3.5rem] px-3 py-2 align-middle',
)

export function cellStyles({ align = 'left', pinned, truncate = false }: CellStyleOptions = {}) {
  return cn(
    cellBase,
    alignStyles[align],
    // `bg-inherit` against the row's always-present background is what keeps a
    // pinned cell opaque while other columns scroll beneath it. `z-10` lifts it
    // over its siblings but stays under the header's `z-sticky`.
    pinned && cn(pinnedStyles[pinned], 'z-10 bg-inherit'),
    // Wrapping is the default: a capped cell should reflow, not clip. `truncate`
    // is the opt-out for single-line columns where a ragged height is worse.
    truncate ? 'truncate' : 'break-words whitespace-normal',
  )
}

/**
 * Header cells keep the sticky/pin z-order above body cells so a pinned column
 * cannot paint over the header where the two intersect.
 */
export function headCellStyles({
  align = 'left',
  pinned,
  truncate = false,
}: CellStyleOptions = {}) {
  return cn(
    cellBase,
    'h-[3rem] font-medium text-text-default',
    bandFillStyles,
    'border-b border-divider-default',
    alignStyles[align],
    // A pinned header cell re-declares the band fill rather than inheriting:
    // `bg-inherit` would pull the *row's* colour and leave a hole in the header
    // band. `z-sticky` keeps it above pinned body cells where the two meet.
    pinned && cn(pinnedStyles[pinned], 'z-sticky', bandFillStyles),
    truncate ? 'truncate' : 'break-words whitespace-normal',
  )
}

/* -------------------------------------------------------------------------- */
/* Sorting control                                                             */
/* -------------------------------------------------------------------------- */

/**
 * A real `<button>` inside the `<th>`, not a click handler on the cell — the
 * sort has to be reachable and operable from the keyboard, and announced as a
 * control rather than as a header that happens to react to clicks.
 */
export const sortButtonStyles = cn(
  '-mx-1 inline-flex cursor-pointer items-center gap-1 rounded-control px-1 py-[2px]',
  'font-medium text-text-default',
  'transition-colors duration-150 ease-out motion-reduce:transition-none',
  'hover:bg-primary-wash-hover',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring-default',
)

/** Unsorted chevrons sit back; the active direction is full-strength. */
export function sortIconStyles({ active = false } = {}) {
  return cn('size-icon-sm shrink-0', active ? 'text-primary-fg' : 'text-text-subtle')
}

/* -------------------------------------------------------------------------- */
/* States                                                                      */
/* -------------------------------------------------------------------------- */

export const emptyCellStyles = 'h-[8rem] px-3 py-2 text-center text-sm text-text-subtle'

/**
 * Loading placeholder: a soft filled block standing in for the cell's content,
 * the way a content-shaped skeleton reads rather than a full-bleed bar. Width
 * comes from `skeletonBarWidth` so columns keep the ragged, content-like rhythm
 * of a real table instead of a uniform grid of identical rectangles.
 *
 * `inline-block` rather than `block` so the cell's `text-align` still places
 * it — a right-aligned numeric column gets a right-aligned block for free.
 *
 * `primary-wash-active` is the one neutral step that reads as a placeholder
 * against the row in both themes; `bg-muted` is a mid-grey (#7e8695) far too
 * heavy for this. Swap the whole thing for `<Skeleton>` when that lands.
 */
export const skeletonBarStyles = cn(
  'inline-block h-[1rem] rounded-sm bg-primary-wash-active align-middle',
  'animate-pulse motion-reduce:animate-none',
)

/**
 * Deliberately not random: the widths have to be identical on every row, or the
 * skeleton shimmers into a ragged mess instead of reading as columns. Indexing a
 * fixed cycle keeps each column's placeholder stable while still varying across
 * columns.
 */
const SKELETON_WIDTHS = ['55%', '80%', '45%', '70%', '60%', '50%'] as const

export function skeletonBarWidth(columnIndex: number): string {
  return SKELETON_WIDTHS[columnIndex % SKELETON_WIDTHS.length] ?? '60%'
}

/* -------------------------------------------------------------------------- */
/* Column filter                                                               */
/* -------------------------------------------------------------------------- */

/**
 * A deliberately small control, not our `Input`. `Input` is a form field: it
 * carries a label slot, a message line and a 44px `control-md` box, all of which
 * made the filter row taller than the data rows it filters. This is the same
 * border, background and focus treatment at `control-sm`, with the field
 * scaffolding dropped.
 */
export const filterInputStyles = cn(
  'h-control-sm w-full min-w-0 rounded-sm border px-1 text-xs',
  'border-border-default bg-bg-default text-text-default placeholder:text-text-placeholder',
  'transition-colors duration-150 ease-out motion-reduce:transition-none',
  'focus-visible:border-border-focused',
  'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring-default',
)

/** The filter row is chrome, so it sits tighter than a data row. */
export const filterCellStyles = 'h-[2.75rem] px-[0.5rem] pr-3 py-[0.25rem] bg-bg-default'

/** Centres a checkbox in its cell — `text-align` does nothing to a flex label. */
export const checkboxCellStyles = 'flex items-center justify-center'
