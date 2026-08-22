import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Stages everything the two CSS consumption paths need into `dist/`.
 *
 * PATH 1 (default, documented) — `@simply/ui/styles.css`: the compiled
 * stylesheet, produced by the Tailwind CLI before this script runs. Works for
 * any consumer, Tailwind or not.
 *
 * PATH 2 (advanced) — the raw token layers, for consumers on Tailwind v4 who
 * want to re-map or override tokens. These are copied verbatim so their
 * relative `@import`s keep resolving: `theme.css` pulls in `fonts.css`,
 * `primitives.css` and `semantic.css`, and they all land as siblings in
 * `dist/`, exactly as they sit in `src/styles/`.
 *
 * Fonts land at `dist/fonts/` because both paths reference `./fonts/*`: the
 * Tailwind CLI inlines the @import'ed CSS but does NOT rebase `url()`, so the
 * compiled `dist/styles.css` still points at `./fonts/*` relative to `dist`.
 * Keeping the raw CSS in the `dist/` root rather than a subfolder means one
 * copy of the font binaries serves both paths.
 *
 * Node's own fs is used rather than a shell `cp -r`, which is not portable to
 * Windows.
 */

const SRC = 'src/styles'
const OUT = 'dist'

/** Copied byte-for-byte; their relative imports already line up in `dist/`. */
const VERBATIM = ['primitives.css', 'semantic.css', 'fonts.css']

if (!existsSync(OUT)) {
  console.error(`copy-styles: "${OUT}" not found - run the JS build first`)
  process.exit(1)
}

// --- fonts ------------------------------------------------------------------
const fontsFrom = join(SRC, 'fonts')
if (!existsSync(fontsFrom)) {
  console.error(`copy-styles: "${fontsFrom}" not found`)
  process.exit(1)
}
mkdirSync(join(OUT, 'fonts'), { recursive: true })
cpSync(fontsFrom, join(OUT, 'fonts'), { recursive: true })

// --- raw token layers -------------------------------------------------------
for (const file of VERBATIM) {
  const from = join(SRC, file)
  if (!existsSync(from)) {
    console.error(`copy-styles: "${from}" not found`)
    process.exit(1)
  }
  cpSync(from, join(OUT, file))
}

// --- Tailwind entry, with its content sources repointed ---------------------
/**
 * Tailwind v4 auto-detects content when no `@source` is declared, walking up
 * from the CSS file. That works in this repo (it finds `src/`), but it is
 * useless once the file ships: auto-detection deliberately skips
 * `node_modules`, so a consumer importing the raw theme would get none of the
 * utilities the components ask for, and every component would render unstyled.
 *
 * The shipped copy therefore points explicitly at the built bundles — an
 * explicit `@source` path IS honoured inside `node_modules`, unlike detection.
 */
const themeFrom = join(SRC, 'theme.css')
const theme = readFileSync(themeFrom, 'utf8')

const SOURCE_RE = /@source\s+['"][^'"]*['"]\s*;/g
const SHIPPED_SOURCES = ["@source './index.mjs';", "@source './index.cjs';"].join('\n')

let shippedTheme

if (SOURCE_RE.test(theme)) {
  SOURCE_RE.lastIndex = 0
  // Collapse whatever globs the repo uses down to the two shipped bundles.
  let written = false
  shippedTheme = theme.replace(SOURCE_RE, () => {
    if (written) return ''
    written = true
    return SHIPPED_SOURCES
  })
} else {
  // Nothing to replace, so anchor a fresh directive to the Tailwind import.
  const TAILWIND_IMPORT = /@import\s+['"]tailwindcss['"]\s*;/
  if (!TAILWIND_IMPORT.test(theme)) {
    console.error(`copy-styles: ${themeFrom} has no \`@import 'tailwindcss'\` to`)
    console.error('             anchor an @source onto. Aborting rather than')
    console.error('             shipping a theme that scans nothing.')
    process.exit(1)
  }
  shippedTheme = theme.replace(TAILWIND_IMPORT, (match) => `${match}\n\n${SHIPPED_SOURCES}`)
}

writeFileSync(join(OUT, 'theme.css'), shippedTheme)

console.log(
  `copy-styles: ${SRC} -> ${OUT} (fonts/, ${VERBATIM.join(', ')}, theme.css [@source -> dist bundles])`,
)
