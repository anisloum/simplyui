import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Steps, type Step } from './steps'

const CHECKOUT: Step[] = [
  { label: 'Cart' },
  { label: 'Shipping' },
  { label: 'Payment' },
  { label: 'Confirm' },
]

const BARE: Step[] = [{}, {}, {}, {}]

/** Paint the real surface token — Storybook's canvas is pure white. */
const withSurface: Decorator = (Story) => (
  <div className="max-w-2xl bg-bg-default p-6">
    <Story />
  </div>
)

const meta = {
  title: 'Components/Steps',
  component: Steps,
  argTypes: {
    current: { control: { type: 'number', min: 0, max: 4 } },
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    steps: { table: { disable: true } },
    onStepClick: { table: { disable: true } },
  },
  args: { steps: CHECKOUT, current: 1, orientation: 'horizontal' },
  decorators: [withSurface],
} satisfies Meta<typeof Steps>

export default meta
type Story = StoryObj<typeof meta>

/** 1. Every prop wired to a control — drag `current` to watch the trail fill. */
export const Playground: Story = {}

/** 2. Horizontal, numbers only. */
export const HorizontalNumbers: Story = {
  args: { steps: BARE, current: 2 },
}

/** 3. Horizontal with labels under each node. */
export const HorizontalLabels: Story = {
  args: { steps: CHECKOUT, current: 2 },
}

/** 4. Vertical, labels beside each node. */
export const VerticalLabels: Story = {
  args: { steps: CHECKOUT, current: 2, orientation: 'vertical' },
}

/** 5. Clickable — only completed and current steps are actionable. */
export const Clickable: Story = {
  render: (args) => {
    const [current, setCurrent] = useState(2)
    return (
      <div className="flex flex-col gap-4">
        <Steps {...args} steps={CHECKOUT} current={current} onStepClick={setCurrent} />
        <p className="text-xs text-text-subtle">
          Click a completed step to go back. Upcoming steps are inert — they render as plain text,
          not disabled buttons, so they stay out of the tab order entirely.
        </p>
      </div>
    )
  },
}

/** 6. Every progress point, from nothing done to all done. */
export const ProgressPoints: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      {[0, 1, 2, 3, 4].map((current) => (
        <div key={current} className="flex flex-col gap-1">
          <span className="text-xs text-text-default">
            {current === 0
              ? 'first step'
              : current === CHECKOUT.length
                ? 'all complete'
                : `step ${current + 1}`}
          </span>
          <Steps {...args} steps={CHECKOUT} current={current} />
        </div>
      ))}
    </div>
  ),
}

/** Both orientations side by side. */
export const Orientations: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <span className="text-xs text-text-default">horizontal</span>
        <Steps {...args} steps={CHECKOUT} current={2} />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-text-default">vertical</span>
        <Steps {...args} steps={CHECKOUT} current={2} orientation="vertical" />
      </div>
    </div>
  ),
}

/** 7. Under a `.dark` wrapper. */
export const DarkMode: Story = {
  parameters: { backgrounds: { disable: true } },
  render: (args) => (
    <div className="dark flex flex-col gap-6 rounded-md bg-bg-default p-8 text-text-default">
      <Steps {...args} steps={CHECKOUT} current={2} />
      <Steps {...args} steps={CHECKOUT} current={2} orientation="vertical" />
      <Steps {...args} steps={BARE} current={1} />
    </div>
  ),
}
