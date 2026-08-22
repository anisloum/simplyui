# @simply-ui/react

Accessible, themeable React components built from scratch — no Radix, no React Aria.
Styled with Tailwind v4 tokens, shipped with a compiled stylesheet so you don't need
Tailwind to use them.

> **0.x — the API may still break.** See the [versioning policy](CONTRIBUTING.md#versioning-policy).

---

## Install

```bash
npm install @simply-ui/react
```

`react` and `react-dom` are **peer dependencies** — the package never bundles its own
copy, because two Reacts in one tree breaks hooks:

```bash
npm install react react-dom
```

| Requirement       | Version                |
| ----------------- | ---------------------- |
| `react`           | `^18.3.0 \|\| ^19.0.0` |
| `react-dom`       | `^18.3.0 \|\| ^19.0.0` |
| Node (to install) | `>=18`                 |

Tailwind is **not** required.

## Import the stylesheet

**This is the step people miss.** Components render unstyled without it. Import it once,
at your application's entry point:

```tsx
// main.tsx / index.tsx / app/layout.tsx — once, at the root
import '@simply-ui/react/styles.css'
```

That single file carries the design tokens, the component styles, and the self-hosted
fonts. Nothing else to configure.

> **Already using Tailwind in your app?** Do **not** `@import` this file from your
> Tailwind entry CSS. Read [Using this with Tailwind](#using-this-with-tailwind) first —
> it changes what your own `p-0` means.

## Quick start

```tsx
import { Button, Card, CardBody, CardHeader, CardTitle } from '@simply-ui/react'
import '@simply-ui/react/styles.css'

export default function App() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
      </CardHeader>
      <CardBody>
        <Button onClick={() => alert('hello')}>Get started</Button>
      </CardBody>
    </Card>
  )
}
```

## Dark mode

Every token has a dark counterpart. Put `dark` on a parent — usually `<html>` — and the
whole tree flips. There is no provider and no JavaScript in the library that reads it.

```tsx
document.documentElement.classList.toggle('dark', isDark)
```

```html
<html class="dark">
  ...
</html>
```

Scoping it to a subtree works too, which is handy for side-by-side previews:

```tsx
<div className="dark">
  <Button>Dark button</Button>
</div>
```

Respecting the OS preference is your call, so that a user's explicit choice can win:

```tsx
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
document.documentElement.classList.toggle('dark', stored ?? prefersDark)
```

## Using this with Tailwind

The compiled stylesheet contains real utility classes (`.p-2`, `.text-sm`, `.rounded-md`)
generated from **our** scale. If you route it through your own Tailwind build, those rules
land in the same cascade layer as yours and win — which silently changes what your
utilities mean in your own markup.

**Do this** — load the stylesheet outside your Tailwind pipeline, from JS or a `<link>`:

```tsx
// main.tsx
import './index.css' // your own `@import "tailwindcss";`
import '@simply-ui/react/styles.css' // ours, kept separate
```

**Not this:**

```css
/* index.css — DON'T: your Tailwind inlines ours and adopts our scale */
@import 'tailwindcss';
@import '@simply-ui/react/styles.css';
```

What the wrong version does to _your_ markup, measured against a stock Tailwind app:

| Your class   | Stock Tailwind | Via a Tailwind `@import` of our CSS |
| ------------ | -------------- | ----------------------------------- |
| `p-0`        | `0px`          | **`4px`**                           |
| `p-2`        | `8px`          | `12px`                              |
| `p-6`        | `24px`         | `40px`                              |
| `text-lg`    | `18px`         | `24px`                              |
| `rounded-md` | `6px`          | `10px`                              |

The `p-0` row is the one that will cost you an afternoon: a 4px gap where you wrote zero,
with nothing in your code to explain it.

Loaded correctly, your utilities keep their stock values **and** our components stay fully
styled — the two coexist.

## Utility naming

Our tokens live in Tailwind's `--color-*` namespace, and the token names themselves start
with their role (`bg`, `text`, `border`). That produces a doubled-looking prefix, which is
correct and not a typo:

```tsx
<div className="bg-bg-default text-text-default border-border-subtle">
```

Read it as `bg-` (the CSS property) + `bg-default` (the token name).

**`text-` is overloaded — by Tailwind, not by us:**

| Class                                 | Means                                 |
| ------------------------------------- | ------------------------------------- |
| `text-lg`, `text-sm`                  | font **size** (Tailwind's own scale)  |
| `text-text-default`, `text-text-link` | text **colour** (our token)           |
| `text-primary-fg`                     | text colour, primary foreground token |

So `text-lg text-text-subtle` is a size _and_ a colour, not a mistake.

Commonly used tokens:

| Group      | Examples                                                                        |
| ---------- | ------------------------------------------------------------------------------- |
| Surfaces   | `bg-bg-default`, `bg-bg-subtle`, `bg-surface-default`                           |
| Text       | `text-text-default`, `text-text-subtle`, `text-text-link`, `text-text-disabled` |
| Borders    | `border-border-default`, `border-border-subtle`, `border-divider-default`       |
| Primary    | `bg-primary-default`, `bg-primary-hover`, `text-text-on-primary`                |
| Feedback   | `text-success-fg`, `text-warning-fg`, `text-error-fg`                           |
| Focus ring | `outline-ring-default`                                                          |

## Theming

Override any `--color-*` variable after importing the stylesheet. These are the public
theming API and are the one namespace the compiled stylesheet deliberately leaves in
Tailwind's `--color-*` space, so they add utilities rather than redefining Tailwind's own:

```css
/* your app's CSS, loaded after @simply-ui/react/styles.css */
:root {
  --color-primary-default: #7c3aed;
  --color-primary-hover: #6d28d9;
  --color-bg-default: #ffffff;
}

.dark {
  --color-primary-default: #a78bfa;
  --color-bg-default: #0b0b12;
}
```

Every component picks the change up — nothing is hard-coded to a hex value.

Contrast is your responsibility once you override: the shipped palette is checked for WCAG
AA, a replacement is not. `--color-text-on-primary` is the label colour used on primary
fills; if you darken or lighten `--color-primary-default`, re-check that pair.

### Advanced: the raw token path

If you _want_ the design system to become your Tailwind theme — our spacing, type scale,
radii and weights applied to your utilities too — import the raw entry from your Tailwind
CSS instead of the compiled stylesheet:

```css
@import 'tailwindcss';
@import '@simply-ui/react/theme.css';
```

This is the deliberate opt-in version of the collision described above: your `p-6` becomes
40px because you asked for our scale. The individual layers are exported too, if you want
to compose them yourself:

```css
@import '@simply-ui/react/primitives.css'; /* raw values, mode-independent */
@import '@simply-ui/react/semantic.css'; /* light/dark semantic tokens */
@import '@simply-ui/react/fonts.css'; /* @font-face declarations */
```

**The compiled `styles.css` does not do this.** It is deliberately namespaced so it cannot
touch your scale. Pick one path — do not import both.

## Components

Every component below is exported from the package root. Props are fully typed; see
Storybook for the exhaustive prop tables.

### Button

```tsx
import { Button } from '@simply-ui/react'
import { Plus } from 'lucide-react'

<Button variant="solid" size="md" icon={<Plus />}>Add item</Button>
<Button variant="ghost" isLoading>Saving</Button>
<Button iconOnly icon={<Plus />} aria-label="Add item" />
```

`iconOnly` renders no text, so it requires `aria-label` — the library warns in development
if you forget.

### Badge

```tsx
import { Badge } from '@simply-ui/react'

<Badge intent="success">Paid</Badge>
<Badge variant="outlined" intent="warning">Pending</Badge>
<Badge onRemove={() => remove(id)}>Removable chip</Badge>
```

### Input / Textarea

```tsx
import { Input, Textarea } from '@simply-ui/react'
import { Search } from 'lucide-react'

<Input label="Email" placeholder="you@example.com" leftIcon={<Search />} />
<Input label="Password" type="password" status="error" statusText="Too short" />
<Textarea label="Notes" helperText="Markdown supported" />
```

### Checkbox / Radio / Switch

```tsx
import { Checkbox, Radio, RadioGroup, Switch } from '@simply-ui/react'

<Checkbox label="Accept terms" checked={ok} onChange={(e) => setOk(e.target.checked)} />
<Checkbox label="Select all" indeterminate />

<RadioGroup value={plan} onValueChange={setPlan} orientation="vertical">
  <Radio value="free" label="Free" />
  <Radio value="pro" label="Pro" />
</RadioGroup>

<Switch label="Email notifications" checked={on} onChange={(e) => setOn(e.target.checked)} />
```

### Select

```tsx
import { Select } from '@simply-ui/react'

;<Select
  label="Country"
  placeholder="Pick one"
  options={[
    { value: 'dz', label: 'Algeria' },
    { value: 'fr', label: 'France' },
  ]}
  value={country}
  onValueChange={(v) => setCountry(v as string)}
  clearable
/>
```

Pass `multiple` for multi-select; `value` becomes a `string[]`.

### Card

```tsx
import { Card, CardBody, CardFooter, CardHeader, CardTitle, StatCard } from '@simply-ui/react'

<Card>
  <CardHeader>
    <CardTitle>Revenue</CardTitle>
  </CardHeader>
  <CardBody>Body content.</CardBody>
  <CardFooter>Footer</CardFooter>
</Card>

<StatCard label="Revenue" value="1 500 DZD" />
```

### Tabs

```tsx
import { Tab, TabList, TabPanel, Tabs } from '@simply-ui/react'

;<Tabs defaultValue="overview" variant="underline">
  <TabList aria-label="Sections">
    <Tab value="overview">Overview</Tab>
    <Tab value="specs">Specs</Tab>
  </TabList>
  <TabPanel value="overview">Overview content</TabPanel>
  <TabPanel value="specs">Specs content</TabPanel>
</Tabs>
```

### Dialog / AlertDialog

```tsx
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogTitle,
  Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@simply-ui/react'

<Dialog>
  <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader><DialogTitle>Edit profile</DialogTitle></DialogHeader>
    <DialogBody>Form goes here.</DialogBody>
  </DialogContent>
</Dialog>

<AlertDialog>
  <AlertDialogContent>
    <AlertDialogTitle>Delete this item?</AlertDialogTitle>
    <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={remove}>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

Both trap focus, close on Escape and outside press, lock background scroll, and return
focus to whatever opened them.

### Menu

```tsx
import { Menu, MenuItem, MenuSeparator } from '@simply-ui/react'
import { MoreVertical } from 'lucide-react'

;<Menu icon={<MoreVertical />} aria-label="Row actions">
  <MenuItem onClick={edit}>Edit</MenuItem>
  <MenuSeparator />
  <MenuItem variant="destructive" onClick={remove}>
    Delete
  </MenuItem>
</Menu>
```

### Table

```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@simply-ui/react'

;<Table striped>
  <TableHeader>
    <TableRow>
      <TableHead>Code</TableHead>
      <TableHead align="right">Qty</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>P01</TableCell>
      <TableCell align="right">15</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

`stickyHeader`, per-cell `align`, `maxWidth`, `truncate` and `pinned="left" | "right"` are
all supported.

### DataTable

Sorting, filtering, pagination and selection, driven by
[TanStack Table](https://tanstack.com/table) for logic only — every element rendered is
ours.

```tsx
import { DataTable, createDataTableColumns, type DataTableColumn } from '@simply-ui/react'

interface Product { code: string; name: string; price: number }

const column = createDataTableColumns<Product>()
const columns = column.columns([
  column.accessor('code', { header: 'Code', meta: { width: '6rem' } }),
  column.accessor('name', { header: 'Product' }),
  column.accessor('price', { header: 'Price', meta: { align: 'right' } }),
]) as DataTableColumn<Product>[]

<DataTable
  columns={columns}
  data={products}
  caption="Products"
  selectable
  globalFilter
  pageSize={10}
  onRowSelectionChange={setSelected}
/>
```

Column presentation travels on `meta`: `align`, `width`, `maxWidth`, `truncate`, `pinned`,
`filterable`, `sortLabel`. Declaring `width` also gives you a loading skeleton with zero
layout shift.

### Pagination

```tsx
import { Pagination } from '@simply-ui/react'

;<Pagination currentPage={page} totalPages={12} onPageChange={setPage} />
```

### Breadcrumbs

```tsx
import { Breadcrumbs } from '@simply-ui/react'

;<Breadcrumbs
  maxItems={4}
  items={[
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Product 1' }, // current page — no href
  ]}
/>
```

### Sidebar

```tsx
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
} from '@simply-ui/react'
import { LayoutDashboard, Settings } from 'lucide-react'

;<Sidebar defaultCollapsed={false} expandedWidth="280px">
  <SidebarHeader logo={<Logo />} />
  <SidebarContent>
    <SidebarGroup label="General">
      <SidebarItem href="/" icon={<LayoutDashboard />} label="Dashboard" active />
    </SidebarGroup>
  </SidebarContent>
  <SidebarFooter>
    <SidebarGroup label="Account">
      <SidebarItem href="/settings" icon={<Settings />} label="Settings" />
    </SidebarGroup>
  </SidebarFooter>
</Sidebar>
```

Below the `md` breakpoint it becomes a modal off-canvas drawer, driven by `mobileOpen`.

Collapse state is never persisted for you — storage isn't available in every environment
the component can render in. It's a controlled prop, so persistence is a few lines:

```tsx
const [collapsed, setCollapsed] = useState(
  () => globalThis.localStorage?.getItem('sidebar:collapsed') === 'true',
)

<Sidebar
  collapsed={collapsed}
  onCollapsedChange={(next) => {
    setCollapsed(next)
    globalThis.localStorage?.setItem('sidebar:collapsed', String(next))
  }}
/>
```

For SSR, read it from a cookie during render so the first paint has the right width.

### `cn`

The class merger every component uses — `clsx` plus `tailwind-merge`, so later utilities
beat earlier conflicting ones.

```tsx
import { cn } from '@simply-ui/react'

cn('px-2 py-1', isActive && 'font-bold', className)
cn('px-2', 'px-4') // -> 'px-4'
```

## Accessibility

Target is **WCAG AA**. Every component is keyboard operable with a visible focus ring, and
every Storybook story is checked with axe-core configured to **error**, not warn.

Where a component can't guarantee correctness on its own it tells you: `Button iconOnly`
warns in development without an accessible name, and `Sidebar`/`Table` expose the ARIA
hooks (`aria-current`, `aria-sort`, `aria-selected`) rather than guessing.

## Package exports

| Entry                             | What it is                                      |
| --------------------------------- | ----------------------------------------------- |
| `@simply-ui/react`                | Components, hooks, `cn`. ESM + CJS, with types. |
| `@simply-ui/react/styles.css`     | **Compiled stylesheet — the one you want.**     |
| `@simply-ui/react/theme.css`      | Raw Tailwind v4 entry (advanced, opt-in scale). |
| `@simply-ui/react/primitives.css` | Raw primitive tokens.                           |
| `@simply-ui/react/semantic.css`   | Raw semantic tokens (light + dark).             |
| `@simply-ui/react/fonts.css`      | `@font-face` declarations only.                 |

## Roadmap

- **CLI copy-paste distribution** — a `shadcn`-style CLI that copies component source into
  your project, for when you'd rather own the code than depend on it. Planned.
- **Documentation site** — Storybook is the docs surface for now.

See [BACKLOG.md](BACKLOG.md) for what's queued next.

## Contributing

Setup, folder conventions, how to add a component, and the versioning policy live in
[CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT — see [LICENSE](LICENSE).
