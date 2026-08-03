import { cpSync, existsSync, mkdirSync } from 'node:fs'

/**
 * The Tailwind CLI bundles the @import'ed CSS but does not rebase `url()`
 * paths, so `dist/styles.css` still points at `./fonts/*` — relative to `dist`,
 * not to `src/styles`. Copy the files across so that reference resolves for
 * anyone consuming the built stylesheet.
 *
 * Node's own fs is used rather than a shell `cp -r`, which is not portable to
 * Windows.
 */
const from = 'src/styles/fonts'
const to = 'dist/fonts'

if (!existsSync(from)) {
  console.error(`copy-fonts: "${from}" not found`)
  process.exit(1)
}

mkdirSync(to, { recursive: true })
cpSync(from, to, { recursive: true })
console.log(`copy-fonts: ${from} -> ${to}`)
