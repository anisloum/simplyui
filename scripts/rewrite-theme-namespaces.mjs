import { readFileSync, writeFileSync } from 'node:fs'

/**
 * Renames Tailwind-reserved theme namespaces in the COMPILED stylesheet so that
 * importing it cannot re-scale a consumer's own utilities.
 *
 * WHY THIS EXISTS
 * ---------------
 * Tailwind v4 resolves utilities through theme custom properties, and it reads
 * them from `:root` wherever they are declared — including from a stylesheet we
 * ship. Our design system deliberately redefines several of those namespaces,
 * so a consumer who imports `styles.css` silently inherits our scale for THEIR
 * markup:
 *
 *   p-6   ->  var(--spacing-6)         40px, not the stock 24px
 *   p-0   ->  var(--spacing-0)          4px, not 0        <-- the dangerous one
 *
 * The `p-0` case is the reason this is a defect and not a documented feature: a
 * consumer gets a 4px gap where they wrote zero, with nothing in their own code
 * to explain it.
 *
 * WHAT IS RENAMED
 * ---------------
 * Every Tailwind-owned namespace we declare, EXCEPT `--color-*`.
 *
 * Colours are deliberately left alone: our names (`--color-bg-default`,
 * `--color-text-link`, ...) do not exist in Tailwind's default theme, so they
 * ADD utilities (`bg-bg-default`) rather than redefining any. They are also the
 * intended theming API — consumers override them on purpose.
 *
 * `--tw-*` (Tailwind's internal runtime state), `--primitive-*` (ours, private)
 * and `--default-*` are untouched.
 *
 * The RAW token path (`dist/theme.css` + the layer files) is NOT processed.
 * Opting into the full design-system scale stays available there, deliberately.
 */

const FILE = 'dist/styles.css'
const PREFIX = 'simply-ui'

/**
 * `font` intentionally subsumes `font-weight`. `shadow` is listed even though
 * the current build emits none — it is a Tailwind namespace, and a future
 * component using `shadow-md` should not silently reintroduce the bug.
 */
const RESERVED = ['spacing', 'text', 'radius', 'shadow', 'font']

const original = readFileSync(FILE, 'utf8')

// Matches only at a custom-property boundary: the literal `--name-`. Values like
// `--color-text-default` or `--primitive-text-xs` contain `-text-` with a single
// leading dash and are therefore never touched.
const pattern = new RegExp(`--(${RESERVED.join('|')})-`, 'g')

const rewritten = original.replace(pattern, `--${PREFIX}-$1-`)

// --- self-check -------------------------------------------------------------
// A rename that missed a declaration is worse than no rename at all: the
// stylesheet would still hijack the namespace while looking like it had been
// fixed. Fail the build rather than ship that.
const leaked = []
for (const ns of RESERVED) {
  const declared = new RegExp(`(^|[^a-z-])--${ns}-[a-z0-9-]*\\s*:`, 'gm')
  const found = rewritten.match(declared)
  if (found) leaked.push(`${ns}: ${found.length} declaration(s) still present`)
}

if (leaked.length > 0) {
  console.error('rewrite-theme-namespaces: reserved namespaces survived the rewrite:')
  for (const line of leaked) console.error(`  - ${line}`)
  process.exit(1)
}

// Colours must be exactly as they were — they are the public theming API.
const countColors = (css) => (css.match(/--color-[a-z0-9-]+\s*:/g) ?? []).length
if (countColors(original) !== countColors(rewritten)) {
  console.error('rewrite-theme-namespaces: --color-* declarations changed. Aborting.')
  process.exit(1)
}

writeFileSync(FILE, rewritten)

const renamed = (original.match(pattern) ?? []).length
console.log(
  `rewrite-theme-namespaces: ${FILE} — ${renamed} reference(s) across ` +
    `${RESERVED.map((n) => `--${n}-*`).join(', ')} -> --${PREFIX}-*  ` +
    `(--color-* untouched: ${countColors(rewritten)})`,
)
