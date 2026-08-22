# Contributing

## Setup

```bash
corepack pnpm install
```

Run `corepack pnpm storybook` while working — it is the primary development surface.

## Folder conventions

```
src/
  components/<component-name>/    one folder per component, kebab-case
  lib/                            shared utilities used by more than one component
  styles/                         tokens.css (raw values) + theme.css (Tailwind entry)
  index.ts                        public API barrel — every export goes through here
```

Rules that keep the published package clean:

- **Library source uses relative imports only.** The `@/*` alias exists for `dev/` and
  `.storybook/`, but never use it inside `src/` — the build config deliberately drops
  `paths`, so an aliased import in `src/` will break the `.d.ts` output.
- **Everything public is re-exported from `src/index.ts`.** Nothing is reachable via deep
  imports, so the barrel is the whole API surface.
- **Stories live next to the component** and are excluded from the published build.
- **Never hard-code theme values.** Colors, spacing, radii and type come from tokens via
  Tailwind utilities. If a utility you need doesn't exist, the token mapping in
  `src/styles/theme.css` is missing something — fix it there, not in the component.

## Adding a new component

Given a component named `Button`:

**1. Create the folder**

```
src/components/button/
  button.tsx           implementation
  button.stories.tsx   Storybook stories
  index.ts             re-exports
```

**2. `button.tsx`** — the component itself.

- Accept and forward `className`, merging with `cn()` so consumers can override styling:
  ```ts
  import { cn } from '../../lib/cn'
  ```
- Spread remaining props onto the underlying element, and forward `ref`.
- Type props by extending the intrinsic element's props where it makes sense
  (`React.ComponentPropsWithRef<'button'>`).
- Export both the component and its props type.

**3. `index.ts`** — re-export the public surface:

```ts
export { Button, type ButtonProps } from './button'
```

**4. `button.stories.tsx`** — at minimum a default story plus one per meaningful variant
and state (including disabled and focus-visible). The a11y addon errors on axe violations,
so a failing story blocks the work.

**5. Register it in `src/index.ts`**, alphabetically:

```ts
export { Button, type ButtonProps } from './components/button'
```

**6. Verify before opening a PR**

```bash
corepack pnpm lint && corepack pnpm typecheck && corepack pnpm build
```

## Accessibility bar

We target **WCAG AA**. Components are built from scratch, so behaviour that a primitive
library would normally hand you is your responsibility:

- Correct roles and semantics; prefer a native element over `div` + `role`.
- Full keyboard operability, with a visible `focus-visible` indicator.
- Correct focus management for anything that opens, closes, or traps focus.
- State communicated via ARIA (`aria-expanded`, `aria-selected`, `aria-disabled`, …).
- Respect `prefers-reduced-motion` for any animation.

Passing the axe checks is the floor, not the goal — keyboard-test every interactive
component by hand.

## Commit checks

There is no pre-commit hook yet. Run lint, typecheck and build yourself.

## Versioning policy

Releases are driven by [Changesets](https://github.com/changesets/changesets). Any
pull request that changes what a consumer can see ships a changeset alongside the
code:

```bash
pnpm changeset
```

We are on **0.x**, so the API may still break. While the major stays `0`, the
_minor_ carries breaking changes and the _patch_ carries everything else — that is
what `0.x` means in semver, and it is why "breaking" below maps to a minor bump.
`1.0.0` will be the signal that the API is stable.

### Which bump

| Change                                                               | 0.x bump       | After 1.0 |
| -------------------------------------------------------------------- | -------------- | --------- |
| Rename or remove a prop                                              | **minor**      | major     |
| Change a prop's type, or its default, in a way existing code notices | **minor**      | major     |
| Remove or rename an export                                           | **minor**      | major     |
| Rename a CSS custom property consumers theme with (`--color-*`)      | **minor**      | major     |
| Change the DOM structure or ARIA roles a consumer may depend on      | **minor**      | major     |
| Add a new component or a new export                                  | patch          | minor     |
| Add a new **optional** prop                                          | patch          | minor     |
| Add a token, or a new value to an existing variant union             | patch          | minor     |
| Visual/style fix inside a component                                  | patch          | patch     |
| Accessibility fix that does not change the API                       | patch          | patch     |
| Bug fix                                                              | patch          | patch     |
| Docs, tests, CI, refactors with no consumer-visible effect           | _no changeset_ | —         |

### Judgement calls

- **A default that changes is breaking.** Consumers who never passed the prop still
  get different output.
- **Tightening a type is breaking; widening it is not.** Going from `string` to a
  union rejects code that used to compile.
- **A visual fix is a patch even if it looks different**, unless the change moves
  layout enough to break a consumer's surrounding composition — then treat it as
  breaking and say so in the changeset.
- **Token renames are breaking.** `--color-*` is the public theming API; anyone
  overriding a variable you rename loses their override silently.
- When two readings are defensible, take the larger bump. An over-cautious minor
  costs nothing; a surprise break costs trust.

### Writing the changeset

Write for someone reading the changelog to decide whether to upgrade — not for a
reviewer of the diff:

> `Button`'s `iconOnly` now requires an accessible name; passing neither
> `aria-label` nor `aria-labelledby` logs a development warning.

not

> refactor button warning logic

## Toolchain

Dev dependencies are pinned exactly (no ranges) so the toolchain is reproducible. Two pins
are deliberately **not** the latest published version:

- **TypeScript `6.0.3`, not `7.0.2`.** TS 7 (the native Go port) is `latest` on npm, but
  `typescript-eslint@8.65` still declares its peer as `typescript >=4.8.4 <6.1.0`. Pinning
  6.0.3 keeps type-aware linting working. Revisit once typescript-eslint ships TS 7 support.
- **ESLint `9.39.5`, not `10.8.0`.** `eslint-plugin-jsx-a11y@6.10.2` declares support only
  up to ESLint `^9`. Since a11y linting is central to the WCAG AA target, the plugin wins.

Runtime `dependencies` use caret ranges instead, so consumers can dedupe them.

**tsup over Vite lib mode** for the package build: it is purpose-built for libraries and
handles ESM + CJS + `.d.ts` in one pass, which leaves Vite doing only what it is good at
here — the dev server and Storybook.

`tsconfig.build.json` sets `"ignoreDeprecations": "6.0"` because tsup's declaration worker
injects the TS6-deprecated `baseUrl`. It is scoped to the build config and can go once
tsup stops doing that.

## The build pipeline

`pnpm build` runs three steps, in order:

1. **`tsup`** — ESM + CJS bundles and `.d.ts`, with React external.
2. **Tailwind CLI** — compiles `src/styles/theme.css` into `dist/styles.css`.
3. **`scripts/rewrite-theme-namespaces.mjs`** — renames Tailwind-reserved theme
   namespaces in the _compiled_ stylesheet to `--simply-ui-*`. Without this, a consumer
   who imports `styles.css` inherits our spacing/type/radius scale for their own
   utilities, and `p-0` silently renders as 4px. `--color-*` is deliberately left alone:
   those names do not exist in Tailwind's default theme, so they add utilities rather than
   redefining any, and they are the public theming API.
4. **`scripts/copy-styles.mjs`** — stages the fonts and the raw token layers, and rewrites
   `@source` in the shipped `theme.css` to point at the built bundles (Tailwind's content
   auto-detection skips `node_modules`, so without this the raw path would generate no
   utilities at all).

Both scripts fail the build rather than emit a subtly broken artifact. If you change
`src/styles/theme.css`, re-run `pnpm build` and check `dist/styles.css` still declares no
bare `--spacing-*` / `--text-*` / `--radius-*` / `--shadow-*` / `--font-*`.
