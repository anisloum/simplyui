import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Tab } from './tab'
import { TabList } from './tab-list'
import { TabPanel } from './tab-panel'
import { Tabs } from './tabs'
import type { TabsVariant } from './tabs.styles'

const VARIANTS: TabsVariant[] = ['pill', 'underline']

const SECTIONS = [
  { value: 'overview', label: 'Overview', body: 'A summary of everything below.' },
  { value: 'specs', label: 'Specs', body: 'Dimensions, materials and tolerances.' },
  { value: 'reviews', label: 'Reviews', body: 'What people made of it.' },
]

/** Paint the real surface token — Storybook's canvas is pure white. */
const withSurface: Decorator = (Story) => (
  <div className="max-w-2xl bg-bg-default p-4">
    <Story />
  </div>
)

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  argTypes: {
    variant: { control: 'inline-radio', options: VARIANTS },
    defaultValue: { control: 'text' },
  },
  args: { variant: 'underline', defaultValue: 'overview' },
  decorators: [withSurface],
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

function Basic({ variant, defaultValue }: { variant?: TabsVariant; defaultValue?: string }) {
  return (
    <Tabs variant={variant} defaultValue={defaultValue}>
      <TabList aria-label="Product sections">
        {SECTIONS.map((section) => (
          <Tab key={section.value} value={section.value}>
            {section.label}
          </Tab>
        ))}
      </TabList>
      {SECTIONS.map((section) => (
        <TabPanel key={section.value} value={section.value}>
          {section.body}
        </TabPanel>
      ))}
    </Tabs>
  )
}

/** 1. Every prop wired to a control. */
export const Playground: Story = {
  render: (args) => <Basic variant={args.variant} defaultValue={args.defaultValue} />,
}

/** 2. Pill: the active tab is a filled chip. */
export const Pill: Story = {
  render: (args) => <Basic variant="pill" defaultValue={args.defaultValue} />,
}

/** 3. Underline: the active tab's 2px rule sits on the list's border. */
export const Underline: Story = {
  render: (args) => <Basic variant="underline" defaultValue={args.defaultValue} />,
}

/** 4. Panels switch with the selection, and stay mounted so their state survives. */
export const WithPanels: Story = {
  render: () => {
    const [value, setValue] = useState('overview')
    return (
      <div className="flex flex-col gap-4">
        <Tabs value={value} onValueChange={setValue}>
          <TabList aria-label="Product sections">
            {SECTIONS.map((section) => (
              <Tab key={section.value} value={section.value}>
                {section.label}
              </Tab>
            ))}
          </TabList>
          {SECTIONS.map((section) => (
            <TabPanel key={section.value} value={section.value}>
              <div className="flex flex-col gap-2">
                <p>{section.body}</p>
                <input
                  aria-label={`Scratch field in ${section.label}`}
                  placeholder="type here, then switch tabs and come back"
                  className="w-full rounded-control border border-border-default bg-bg-default px-2 py-1 text-sm text-text-default"
                />
              </div>
            </TabPanel>
          ))}
        </Tabs>
        <p className="text-xs text-text-subtle">Active: {value}</p>
      </div>
    )
  },
}

/** 5. A disabled tab — unselectable, and skipped by the arrow keys. */
export const DisabledTab: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      {VARIANTS.map((variant) => (
        <Tabs key={variant} variant={variant} defaultValue="overview">
          <TabList aria-label={`Sections (${variant})`}>
            <Tab value="overview">Overview</Tab>
            <Tab value="specs" disabled>
              Specs — unavailable
            </Tab>
            <Tab value="reviews">Reviews</Tab>
          </TabList>
          <TabPanel value="overview">Overview content.</TabPanel>
          <TabPanel value="specs">Specs content.</TabPanel>
          <TabPanel value="reviews">Reviews content.</TabPanel>
        </Tabs>
      ))}
      <p className="text-xs text-text-subtle">
        Arrow from Overview and focus jumps straight past Specs to Reviews. Unused: {args.variant}
      </p>
    </div>
  ),
}

/** 6. Overflow — the rail scrolls horizontally with no visible scrollbar. */
export const Overflow: Story = {
  render: (args) => {
    const many = Array.from({ length: 18 }, (_, i) => ({
      value: `tab-${i + 1}`,
      label: `Section ${i + 1}`,
    }))
    return (
      <div className="flex flex-col gap-4">
        <Tabs variant={args.variant} defaultValue="tab-1">
          <TabList aria-label="Many sections">
            {many.map((tab) => (
              <Tab key={tab.value} value={tab.value}>
                {tab.label}
              </Tab>
            ))}
          </TabList>
          {many.map((tab) => (
            <TabPanel key={tab.value} value={tab.value}>
              Content for {tab.label}.
            </TabPanel>
          ))}
        </Tabs>
        <p className="text-xs text-text-subtle">
          Scroll the rail with the wheel or a trackpad. Press End to jump to the last tab — it
          scrolls itself into view.
        </p>
      </div>
    )
  },
}

/** 7. The keyboard model. */
export const KeyboardNavigation: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Basic variant={args.variant} defaultValue="overview" />
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs text-text-default">
        <dt className="font-medium">Tab</dt>
        <dd className="text-text-subtle">enters the set, then moves to the panel</dd>
        <dt className="font-medium">← / →</dt>
        <dd className="text-text-subtle">
          move between tabs and select as you go, wrapping and skipping disabled
        </dd>
        <dt className="font-medium">Home / End</dt>
        <dd className="text-text-subtle">first / last tab</dd>
      </dl>
    </div>
  ),
}

/** 8. Both variants under a `.dark` wrapper. */
export const DarkMode: Story = {
  parameters: { backgrounds: { disable: true } },
  render: () => (
    <div className="dark flex flex-col gap-4 rounded-md bg-bg-default p-8 text-text-default">
      {VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col gap-1">
          <span className="text-xs text-text-default">{variant}</span>
          <Basic variant={variant} defaultValue="overview" />
        </div>
      ))}
    </div>
  ),
}
