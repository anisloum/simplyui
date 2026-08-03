import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Breadcrumbs, type BreadcrumbItem } from './breadcrumbs'

const TRAIL: BreadcrumbItem[] = [
  { label: 'Home', href: '#' },
  { label: 'Components', href: '#' },
  { label: 'Navigation', href: '#' },
  { label: 'Breadcrumbs' },
]

const DEEP: BreadcrumbItem[] = [
  { label: 'Home', href: '#' },
  { label: 'Docs', href: '#' },
  { label: 'Components', href: '#' },
  { label: 'Navigation', href: '#' },
  { label: 'Patterns', href: '#' },
  { label: 'Breadcrumbs' },
]

/** Paint the real surface token — Storybook's canvas is pure white. */
const withSurface: Decorator = (Story) => (
  <div className="bg-bg-default p-4">
    <Story />
  </div>
)

const meta = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  argTypes: {
    maxItems: { control: { type: 'number', min: 2, max: 8 } },
    items: { table: { disable: true } },
  },
  args: { items: TRAIL },
  decorators: [withSurface],
} satisfies Meta<typeof Breadcrumbs>

export default meta
type Story = StoryObj<typeof meta>

/** 1. Every prop wired to a control. */
export const Playground: Story = {}

/** 2. Links are muted until hovered; the last crumb is plain current text. */
export const BasicTrail: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Breadcrumbs {...args} />
      <p className="text-xs text-text-subtle">
        Hover a link to see it take the link colour. The last crumb is not a link and carries
        <code> aria-current=&quot;page&quot;</code>.
      </p>
    </div>
  ),
}

/** 3. `maxItems` folds the middle away, always keeping the first and last. */
export const Collapsed: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      {[undefined, 4, 3, 2].map((maxItems) => (
        <div key={String(maxItems)} className="flex flex-col gap-1">
          <span className="text-xs text-text-default">
            {maxItems === undefined ? 'no maxItems (6 crumbs)' : `maxItems=${maxItems}`}
          </span>
          <Breadcrumbs {...args} items={DEEP} maxItems={maxItems} />
        </div>
      ))}
    </div>
  ),
}

/** 4. `onClick` crumbs render as buttons, for routers that navigate without a URL. */
export const RouterStyle: Story = {
  render: (args) => {
    const [last, setLast] = useState<string | null>(null)
    return (
      <div className="flex flex-col gap-4">
        <Breadcrumbs
          {...args}
          items={[
            { label: 'Home', onClick: () => setLast('Home') },
            { label: 'Components', onClick: () => setLast('Components') },
            { label: 'Breadcrumbs' },
          ]}
        />
        <p className="text-xs text-text-subtle">
          {last ? `Navigated to: ${last}` : 'Click a crumb.'}
        </p>
      </div>
    )
  },
}

/** 5. Under a `.dark` wrapper. */
export const DarkMode: Story = {
  parameters: { backgrounds: { disable: true } },
  render: (args) => (
    <div className="dark flex flex-col gap-4 rounded-md bg-bg-default p-8 text-text-default">
      <Breadcrumbs {...args} />
      <Breadcrumbs {...args} items={DEEP} maxItems={3} />
    </div>
  ),
}
