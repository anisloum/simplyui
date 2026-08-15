import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Badge } from '../badge'
import { Card } from './card'
import { CardBody } from './card-body'
import { CardDescription } from './card-description'
import { CardFooter } from './card-footer'
import { CardHeader } from './card-header'
import { CardTitle } from './card-title'
import { StatCard } from './stat-card'
import type { CardVariant } from './card.styles'

const VARIANTS: CardVariant[] = ['elevated', 'outlined', 'filled', 'ghost']

/**
 * Cards are painted on `bg-default` — the page colour from the source design.
 * It also matters for the a11y addon, which would otherwise measure contrast
 * against Storybook's pure-white canvas rather than the real #e9f1ff surface.
 */
const withPage: Decorator = (Story) => (
  <div className="max-w-2xl bg-bg-default p-6">
    <Story />
  </div>
)

/** Stands in for a real chart, which is out of scope for this component. */
function ChartPlaceholder({ height = 160 }: { height?: number }) {
  return (
    <div
      role="img"
      aria-label="Chart placeholder"
      style={{ height }}
      className="flex w-full items-end justify-around gap-2 rounded-control p-2"
    >
      {[45, 30, 100, 62, 55].map((value, index) => (
        <span
          key={index}
          style={{ height: `${value}%` }}
          className="w-full rounded-control bg-primary-fg"
        />
      ))}
    </div>
  )
}

const meta = {
  title: 'Components/Card',
  component: Card,
  argTypes: {
    variant: { control: 'inline-radio', options: VARIANTS },
    padding: { control: 'inline-radio', options: ['none', 'sm', 'md', 'lg'] },
    interactive: { control: 'boolean' },
    asChild: { table: { disable: true } },
  },
  args: { variant: 'elevated', padding: 'md', interactive: false },
  decorators: [withPage],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

/** 1. Every container prop wired to a control. */
export const Playground: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader hint="Where this number comes from.">
        <CardTitle>Card title</CardTitle>
        <CardDescription>A short supporting line beneath the title.</CardDescription>
      </CardHeader>
      <CardBody>Body content goes here.</CardBody>
    </Card>
  ),
}

/** 2. The four variants side by side on the page background. */
export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      {VARIANTS.map((variant) => (
        <Card {...args} key={variant} variant={variant}>
          <CardHeader>
            <CardTitle>{variant}</CardTitle>
            <CardDescription>
              {variant === 'elevated'
                ? 'Shadow in light; picks up a border in dark, where a shadow would not read.'
                : variant === 'outlined'
                  ? 'A 1px border and no shadow.'
                  : variant === 'filled'
                    ? 'A recessed tile — bg-subtle, no border or shadow.'
                    : 'Transparent. Padding only.'}
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  ),
}

/** 3. Every part composed: header with hint and action, body, and a footer. */
export const Composed: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader
        hint="Counts only orders that cleared payment."
        action={<Badge size="sm">Live</Badge>}
      >
        <CardTitle>Orders this week</CardTitle>
        <CardDescription>Updated a few minutes ago.</CardDescription>
      </CardHeader>
      <CardBody>
        <p className="text-sm text-text-default">
          Body content is whatever you put here — prose, a list, or a chart.
        </p>
      </CardBody>
      <CardFooter className="border-t border-divider-default pt-2">
        <span className="text-xs text-text-subtle">Footer content</span>
      </CardFooter>
    </Card>
  ),
}

/** 4. `interactive` — hover for elevation, Tab for the ring, Enter or Space to activate. */
export const Interactive: Story = {
  render: (args) => {
    const [count, setCount] = useState(0)
    return (
      <div className="flex flex-col gap-4">
        {VARIANTS.map((variant) => (
          <Card
            {...args}
            key={variant}
            variant={variant}
            interactive
            onClick={() => setCount((n) => n + 1)}
          >
            <CardHeader>
              <CardTitle>Clickable {variant}</CardTitle>
              <CardDescription>The whole card is one tab stop.</CardDescription>
            </CardHeader>
          </Card>
        ))}
        <p className="text-xs text-text-subtle">Activated {count} times.</p>
      </div>
    )
  },
}

/** An interactive card wrapping a real link, via `asChild`. */
export const AsLink: Story = {
  render: (args) => (
    <Card {...args} interactive asChild>
      <a href="https://example.com">
        <CardHeader>
          <CardTitle>A card that is a link</CardTitle>
          <CardDescription>
            Stays a real anchor, so middle-click and “open in new tab” work.
          </CardDescription>
        </CardHeader>
      </a>
    </Card>
  ),
}

/** 5. `padding="none"` lets content run edge to edge. */
export const EdgeToEdge: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Card {...args} padding="none">
        <ChartPlaceholder height={140} />
        <div className="p-3">
          <CardTitle as="h4">Edge-to-edge media</CardTitle>
          <CardDescription>The card has no padding; this block adds its own.</CardDescription>
        </div>
      </Card>
      <Card {...args} padding="lg">
        <CardHeader>
          <CardTitle>padding=&quot;lg&quot;</CardTitle>
        </CardHeader>
        <CardBody>For comparison.</CardBody>
      </Card>
    </div>
  ),
}

/** 6. StatCard: title, value and a muted suffix. */
export const StatPlain: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      <StatCard
        {...args}
        className="min-w-[16rem] flex-1"
        title="Total Products"
        value="50"
        suffix="in total"
      />
      <StatCard
        {...args}
        className="min-w-[16rem] flex-1"
        title="Active Users"
        value="1 284"
        suffix="this month"
        hint="Unique sign-ins over the last 30 days."
      />
    </div>
  ),
}

/** 7. StatCard with a badge and caption — the “Orders Validated” tile. */
export const StatWithBadge: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      <StatCard
        {...args}
        className="min-w-[16rem] flex-1"
        title="Total Products"
        value="50"
        suffix="in total"
        hint="Every product in the catalogue."
      />
      <StatCard
        {...args}
        className="min-w-[16rem] flex-1"
        title="Orders Validated"
        value="124"
        suffix="/150"
        hint="Orders that passed validation."
        badgeLabel="Validation Rate"
        badge="82.66%"
      />
    </div>
  ),
}

/** 8. Chart containers — the card handles the layout; the chart itself is out of scope. */
export const ChartCards: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Card {...args}>
        <CardHeader hint="Gross earnings before fees.">
          <CardTitle>Total Earnings this Year</CardTitle>
        </CardHeader>
        <CardBody>
          <ChartPlaceholder height={180} />
        </CardBody>
      </Card>
      <Card {...args}>
        <CardHeader hint="Daily breakdown for the selected month.">
          <CardTitle>Total Earnings March</CardTitle>
        </CardHeader>
        <CardBody>
          <ChartPlaceholder height={140} />
        </CardBody>
      </Card>
    </div>
  ),
}

/** 9. Everything under a `.dark` wrapper. */
export const DarkMode: Story = {
  parameters: { backgrounds: { disable: true } },
  render: (args) => (
    <div className="dark flex flex-col gap-4 rounded-md bg-bg-default p-6 text-text-default">
      {VARIANTS.map((variant) => (
        <Card {...args} key={variant} variant={variant}>
          <CardHeader hint={`About the ${variant} card.`}>
            <CardTitle>{variant}</CardTitle>
            <CardDescription>Elevated gains a border here so it clears the page.</CardDescription>
          </CardHeader>
        </Card>
      ))}
      <div className="flex flex-wrap gap-4">
        <StatCard
          {...args}
          className="min-w-[16rem] flex-1"
          title="Total Products"
          value="50"
          suffix="in total"
        />
        <StatCard
          {...args}
          className="min-w-[16rem] flex-1"
          title="Orders Validated"
          value="124"
          suffix="/150"
          badgeLabel="Validation Rate"
          badge="82.66%"
        />
      </div>
      <Card {...args}>
        <CardHeader hint="Gross earnings before fees.">
          <CardTitle>Total Earnings this Year</CardTitle>
        </CardHeader>
        <CardBody>
          <ChartPlaceholder height={160} />
        </CardBody>
      </Card>
    </div>
  ),
}
