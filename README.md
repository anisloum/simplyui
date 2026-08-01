# SimplyUI

Accessible, themeable React components built from scratch — no Radix, no React Aria.

Distributed two ways: as an installable npm package, and (later) via a CLI that copies
component source directly into your project.

> **Status: scaffolding only.** There are no components, no design tokens and no theme
> values yet. The build, lint, type-check and Storybook pipelines are wired up and green.

---

## Requirements

- Node `>=20.19.0`
- pnpm 11 (via `corepack pnpm …` if pnpm isn't installed globally)

## Getting started

```bash
corepack pnpm install
```

## Scripts

| Script                  | What it does                                                   |
| ----------------------- | -------------------------------------------------------------- |
| `dev`                   | Vite dev server on :5173 — scratch harness in `dev/`           |
| `build`                 | Builds the package (`tsup`) then the stylesheet (Tailwind CLI) |
| `build:js`              | ESM + CJS bundles and `.d.ts` declarations                     |
| `build:css`             | Compiles `src/styles/theme.css` → `dist/styles.css`            |
| `typecheck`             | `tsc --noEmit`                                                 |
| `lint` / `lint:fix`     | ESLint across the repo                                         |
| `format`/`format:check` | Prettier                                                       |
| `storybook`             | Storybook dev server on :6006                                  |
| `build-storybook`       | Static Storybook build into `storybook-static/`                |

## Project structure

```
src/
  components/     empty — one folder per component (see CONTRIBUTING.md)
  lib/            shared utilities; currently just the `cn` helper
  styles/
    tokens.css    raw design tokens as CSS variables — EMPTY, awaiting design system
    theme.css     Tailwind entry + @theme mapping — mapping block is a TODO
  index.ts        public API barrel
.storybook/       Storybook config + a single Introduction.mdx placeholder
dev/              local dev harness, not published
```

## Build output

`pnpm build` produces a dual-format package:

| File               | Purpose                 |
| ------------------ | ----------------------- |
| `dist/index.mjs`   | ESM bundle              |
| `dist/index.cjs`   | CJS bundle              |
| `dist/index.d.ts`  | Types for ESM consumers |
| `dist/index.d.cts` | Types for CJS consumers |
| `dist/styles.css`  | Compiled stylesheet     |

Resolution was verified with [`@arethetypeswrong/cli`](https://arethetypeswrong.github.io):
the `simplyui` entrypoint resolves cleanly under `node10`, `node16` (CJS **and** ESM) and
`bundler`. The `./styles.css` and `./tokens.css` subpath exports are reported as failures
by that tool simply because it only understands JS/TS entrypoints — CSS exports are fine.

React is declared as a peer dependency and is never bundled.

## Theming

Tailwind v4 is configured **in CSS**, not in a `tailwind.config.js` — this follows the
approach shadcn/ui uses today.

- `src/styles/tokens.css` holds raw values as CSS custom properties, with `:root` for
  light and `.dark` for dark. It is plain CSS and never references Tailwind, so it can be
  consumed standalone via the `simplyui/tokens.css` export.
- `src/styles/theme.css` imports Tailwind and the tokens, then maps tokens onto Tailwind's
  scale inside `@theme inline`. Declaring `--color-background: var(--background)` is what
  generates `bg-background`, `text-background`, and so on.
- Dark mode is class-based via `@custom-variant dark (&:is(.dark *))` — toggle by putting
  `class="dark"` on `<html>`.

Both files carry a clearly-marked `TODO: tokens injected here` block. Nothing else needs
to change when the design system lands.

## Version choices

Pinned exactly (no ranges) so the toolchain is reproducible. Two pins are deliberately
**not** the latest published version:

- **TypeScript `6.0.3`, not `7.0.2`.** TS 7 (the native Go port) is `latest` on npm, but
  `typescript-eslint@8.65` still declares its peer as `typescript >=4.8.4 <6.1.0`. Pinning
  6.0.3 keeps type-aware linting working. Revisit once typescript-eslint ships TS 7 support.
- **ESLint `9.39.5`, not `10.8.0`.** `eslint-plugin-jsx-a11y@6.10.2` declares support only
  up to ESLint `^9`. Since a11y linting is central to the WCAG AA target, the plugin wins.

Everything else is current stable: React `19.2.8`, Vite `8.2.0`, Tailwind `4.3.3`,
Storybook `10.5.5`, tsup `8.5.1`, Prettier `3.9.6`, pnpm `11.18.0`.

**tsup over Vite lib mode** for the package build: it is purpose-built for libraries and
handles ESM + CJS + `.d.ts` in one pass, which leaves Vite to do only what it's good at
here — powering the dev server and Storybook.

One known wart: `tsconfig.build.json` sets `"ignoreDeprecations": "6.0"` because tsup's
declaration worker injects the TS6-deprecated `baseUrl` option. It is scoped to the build
config only and can be removed once tsup stops doing that.

## Accessibility

Target is **WCAG AA**.

- `eslint-plugin-jsx-a11y` runs over all JSX.
- `@storybook/addon-a11y` runs axe-core against every story and is configured to **error**
  on violations, not warn — see `.storybook/preview.ts`.

## Planned phases

- **CLI copy-paste distribution** — a `shadcn`-style CLI that copies component source into
  a consumer's project. Not scaffolded yet.
- **Custom documentation site** — Storybook is the docs surface for now.

## License

MIT — see [LICENSE](LICENSE).
