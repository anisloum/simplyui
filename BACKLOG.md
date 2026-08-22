# Backlog

Work that is understood and deliberately deferred. Each item records why the current
state is the right call _now_, so nobody "fixes" it without knowing what they are trading.

---

## v0.2

### `./table` subpath export, so `@tanstack/react-table` can become an optional peer

**Status:** deferred — the current arrangement is correct, not a bug.

`@tanstack/react-table` is a regular `dependency`. Every consumer downloads it, including
the ones who never render a `DataTable`.

It cannot simply be moved to `peerDependencies` with `peerDependenciesMeta.optional`,
because the root barrel imports `DataTable` statically:

```ts
// src/index.ts
export { DataTable, ... } from './components/table'
```

With an optional peer that a consumer has not installed, _any_ import from
`@simply-ui/react` fails to resolve at bundle time — not just `DataTable`. That is a worse
failure than the extra download: it breaks people who were never using the feature.

**The fix, in order:**

1. Add a `./table` subpath export (`@simply-ui/react/table`) with its own tsup entry, and
   move `DataTable`, `createDataTableColumns`, `dataTableFeatures`, `DataTableToolbar` and
   `DataTablePagination` behind it. The Layer 1 `Table` primitives have no TanStack
   dependency and stay on the root barrel.
2. Drop those exports from `src/index.ts` so nothing in the root entry reaches TanStack.
3. Move `@tanstack/react-table` to `peerDependencies` + `peerDependenciesMeta: { optional: true }`.
4. Verify in a fresh app _without_ TanStack installed that importing from the root still
   builds, and that importing `@simply-ui/react/table` fails with a clear message.

**Breaking:** yes — `import { DataTable } from '@simply-ui/react'` stops working. Minor
bump on 0.x. Worth doing before 1.0, not worth a patch release now.

---

### Prefix the library's own generated utility classes

**Status:** partially mitigated in 0.1.0; the remaining half is real.

The compiled `dist/styles.css` ships literal Tailwind utility classes (`.p-0`, `.p-2`,
`.text-sm`, `.rounded-md`) generated from our scale, because that is what the components'
`className` strings resolve to.

0.1.0 fixed the _theme-variable_ half of this: `scripts/rewrite-theme-namespaces.mjs`
renames every Tailwind-reserved namespace to `--simply-ui-*`, so importing our stylesheet
can no longer redefine what `--spacing-6` means.

The _class-name_ half remains. If a consumer routes our stylesheet through their own
Tailwind build (`@import '@simply-ui/react/styles.css'` inside their Tailwind entry), our
`.p-0 { padding: var(--simply-ui-spacing-0) }` lands in the same cascade layer as their
`.p-0 { padding: 0 }` and wins on source order. Measured:

| Class        | Stock  | Ours imported into their Tailwind entry |
| ------------ | ------ | --------------------------------------- |
| `p-0`        | `0px`  | `4px`                                   |
| `p-2`        | `8px`  | `12px`                                  |
| `p-6`        | `24px` | `40px`                                  |
| `text-lg`    | `18px` | `24px`                                  |
| `rounded-md` | `6px`  | `10px`                                  |

Loading the stylesheet outside the Tailwind graph (a JS import or a `<link>`) is correct
and verified — stock values are preserved and our components stay styled. That is what the
README documents, and it is a real fix for the supported path, but it depends on the
consumer reading the docs.

**Candidate fixes, roughly in order of preference:**

1. Build the library's CSS with Tailwind's `prefix()` option
   (`@import "tailwindcss" prefix(su)`) so our utilities emit as `.su\:p-2`, and update the
   components' `className` strings to match. Fully removes the collision; a large but
   mechanical source change, and it makes `className` pass-through from consumers behave
   differently, which needs thought.
2. Ship the compiled stylesheet wrapped in a named cascade layer and document a
   `@layer` order for Tailwind consumers. Cheaper, but layer order depends on import
   order, which is exactly the thing consumers get wrong.
3. Keep the current split and make the wrong path loud — e.g. a build-time check in a
   companion ESLint/stylelint rule.

Option 1 is the only one that removes the footgun rather than documenting it.

---

## Unscheduled

### Dedicated row-surface tokens

`Table` needs three simultaneously distinguishable row surfaces (default / stripe /
selected). The obvious tokens collapse: in light, `bg-subtle` and `primary-wash-hover` are
both `#dee6f4`; in dark, `surface-default`, `bg-subtle` and `primary-wash-hover` are all
`#1f2633`. `table.styles.ts` works around it with `primary-wash-active` plus a `dark:`
variant. Proper fix is dedicated tokens in the design system.

### Tooltip

`SidebarItem` falls back to a native `title` attribute for collapsed labels. Marked
`// TODO: <Tooltip>` in `sidebar-item.tsx`.

### Skeleton

`DataTable`'s loading rows draw their own placeholder bars. Marked `// TODO: <Skeleton>`
in `table.styles.ts` — swap them when the component lands.

### Sidebar and Tabs scrollbars

Both use `scrollbar-none` deliberately (the tab rail is its own affordance; a 14px bar
inside the sidebar's 72px collapsed rail would eat a fifth of its width). Revisit if the
inconsistency with `scrollbar-subtle` elsewhere starts to show.
