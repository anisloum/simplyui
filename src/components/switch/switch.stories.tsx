import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { useState, type ReactNode } from 'react'

import { Switch } from './switch'

function Stack({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      {label ? <span className="text-xs text-text-default">{label}</span> : null}
      <div className="flex flex-col gap-2">{children}</div>
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
  title: 'Components/Switch',
  component: Switch,
  argTypes: {
    label: { control: 'text' },
    labelPosition: { control: 'inline-radio', options: ['left', 'right'] },
    checked: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: { label: 'Email notifications', labelPosition: 'right' },
  decorators: [withSurface],
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

/** 1. Every prop wired to a control. */
export const Playground: Story = {}

/** 2. Off and on — the thumb position carries the state, not just the track colour. */
export const OnOff: Story = {
  render: (args) => (
    <Stack>
      <Switch {...args} label="Off" />
      <Switch {...args} label="On" defaultChecked />
    </Stack>
  ),
}

/** 3. Disabled. Off stays grey; on keeps a lighter blue, per the Figma frame. */
export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <Stack>
      <Switch {...args} label="Off, disabled" />
      <Switch {...args} label="On, disabled" defaultChecked />
    </Stack>
  ),
}

/** 4. Label on either side. The DOM order is unchanged — only the row reverses. */
export const LabelPosition: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Stack label='labelPosition="right" (default)'>
        <Switch {...args} label="Right-hand label" defaultChecked />
      </Stack>
      <Stack label='labelPosition="left"'>
        <Switch {...args} label="Left-hand label" labelPosition="left" defaultChecked />
      </Stack>
      <Stack label="no label — needs its own accessible name">
        <Switch {...args} label={undefined} aria-label="Toggle dark mode" />
      </Stack>
    </div>
  ),
}

/** 5. Tab to it — the ring shows only on keyboard focus. Space toggles. */
export const FocusVisible: Story = {
  render: (args) => (
    <Stack label="press Tab, then Space">
      <Switch {...args} label="First" />
      <Switch {...args} label="Second" defaultChecked />
    </Stack>
  ),
}

/** Controlled, reporting its state. */
export const Controlled: Story = {
  render: (args) => {
    const [on, setOn] = useState(false)
    return (
      <div className="flex flex-col gap-2">
        <Switch
          {...args}
          label="Airplane mode"
          checked={on}
          onChange={(event) => setOn(event.target.checked)}
        />
        <p className="text-xs text-text-subtle">Currently {on ? 'on' : 'off'}.</p>
      </div>
    )
  },
}

/** 6. The full set under a `.dark` wrapper. */
export const DarkMode: Story = {
  parameters: { backgrounds: { disable: true } },
  render: (args) => (
    <div className="dark flex flex-col gap-4 rounded-md bg-bg-default p-8 text-text-default">
      <Stack label="enabled">
        <Switch {...args} label="Off" />
        <Switch {...args} label="On" defaultChecked />
      </Stack>
      <Stack label="disabled">
        <Switch {...args} label="Off, disabled" disabled />
        <Switch {...args} label="On, disabled" defaultChecked disabled />
      </Stack>
      <Stack label="label on the left">
        <Switch {...args} label="Left-hand label" labelPosition="left" defaultChecked />
      </Stack>
    </div>
  ),
}
