import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { useState, type ReactNode } from 'react'

import { Radio } from './radio'
import { RadioGroup } from './radio-group'

const PLANS = [
  { value: 'free', label: 'Free' },
  { value: 'pro', label: 'Pro' },
  { value: 'team', label: 'Team' },
]

function Stack({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      {label ? <span className="text-xs text-text-default">{label}</span> : null}
      {children}
    </div>
  )
}

/** Paint the real surface token — Storybook's canvas is pure white. */
const withSurface: Decorator = (Story) => (
  <div className="bg-bg-default p-4">
    <Story />
  </div>
)

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  argTypes: {
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    disabled: { control: 'boolean' },
    defaultValue: { control: 'text' },
  },
  args: { orientation: 'vertical', defaultValue: 'pro', 'aria-label': 'Plan' },
  decorators: [withSurface],
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

/** 1. Every prop wired to a control. */
export const Playground: Story = {
  render: (args) => (
    <RadioGroup {...args}>
      {PLANS.map((plan) => (
        <Radio key={plan.value} value={plan.value} label={plan.label} />
      ))}
    </RadioGroup>
  ),
}

/** 2. Vertical — items 8px apart. Arrow keys move the selection. */
export const Vertical: Story = {
  render: (args) => (
    <RadioGroup {...args} orientation="vertical">
      {PLANS.map((plan) => (
        <Radio key={plan.value} value={plan.value} label={plan.label} />
      ))}
    </RadioGroup>
  ),
}

/** 3. Horizontal — items 16px apart. */
export const Horizontal: Story = {
  render: (args) => (
    <RadioGroup {...args} orientation="horizontal">
      {PLANS.map((plan) => (
        <Radio key={plan.value} value={plan.value} label={plan.label} />
      ))}
    </RadioGroup>
  ),
}

/** 4. A whole group disabled, and a single item disabled within a live group. */
export const DisabledStates: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Stack label="whole group disabled">
        <RadioGroup {...args} disabled aria-label="Plan (disabled group)">
          {PLANS.map((plan) => (
            <Radio key={plan.value} value={plan.value} label={plan.label} />
          ))}
        </RadioGroup>
      </Stack>
      <Stack label="one item disabled — arrow keys skip it">
        <RadioGroup {...args} aria-label="Plan (one disabled)">
          <Radio value="free" label="Free" />
          <Radio value="pro" label="Pro" />
          <Radio value="team" label="Team — unavailable on your plan" disabled />
        </RadioGroup>
      </Stack>
    </div>
  ),
}

/** 5. Tab into the group, then use the arrow keys. */
export const FocusVisible: Story = {
  render: (args) => (
    <Stack label="Tab enters the group; ArrowUp/ArrowDown move within it">
      <RadioGroup {...args}>
        {PLANS.map((plan) => (
          <Radio key={plan.value} value={plan.value} label={plan.label} />
        ))}
      </RadioGroup>
    </Stack>
  ),
}

/** Controlled, reporting the selected value. */
export const Controlled: Story = {
  render: (args) => {
    const [plan, setPlan] = useState('pro')
    return (
      <div className="flex flex-col gap-2">
        <RadioGroup {...args} value={plan} onValueChange={setPlan} defaultValue={undefined}>
          {PLANS.map((entry) => (
            <Radio key={entry.value} value={entry.value} label={entry.label} />
          ))}
        </RadioGroup>
        <p className="text-xs text-text-subtle">Selected: {plan}</p>
      </div>
    )
  },
}

/** 6. Both orientations and the disabled set under a `.dark` wrapper. */
export const DarkMode: Story = {
  parameters: { backgrounds: { disable: true } },
  render: (args) => (
    <div className="dark flex flex-col gap-4 rounded-md bg-bg-default p-8 text-text-default">
      <Stack label="vertical">
        <RadioGroup {...args} aria-label="Plan (dark)">
          {PLANS.map((plan) => (
            <Radio key={plan.value} value={plan.value} label={plan.label} />
          ))}
        </RadioGroup>
      </Stack>
      <Stack label="horizontal">
        <RadioGroup {...args} orientation="horizontal" aria-label="Plan (dark horizontal)">
          {PLANS.map((plan) => (
            <Radio key={plan.value} value={plan.value} label={plan.label} />
          ))}
        </RadioGroup>
      </Stack>
      <Stack label="disabled">
        <RadioGroup {...args} disabled aria-label="Plan (dark disabled)">
          {PLANS.map((plan) => (
            <Radio key={plan.value} value={plan.value} label={plan.label} />
          ))}
        </RadioGroup>
      </Stack>
    </div>
  ),
}
