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
