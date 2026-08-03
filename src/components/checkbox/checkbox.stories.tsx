import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { useState, type ReactNode } from 'react'

import { Checkbox } from './checkbox'

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
  title: 'Components/Checkbox',
  component: Checkbox,
  argTypes: {
    label: { control: 'text' },
    indeterminate: { control: 'boolean' },
    checked: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: { label: 'Accept terms' },
  decorators: [withSurface],
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

/** 1. Every prop wired to a control. */
export const Playground: Story = {}

/** 2. The three looks. Tick and dash carry the state, not just the fill colour. */
export const States: Story = {
  render: (args) => (
    <Stack>
      <Checkbox {...args} label="Unchecked" />
      <Checkbox {...args} label="Checked" defaultChecked />
      <Checkbox {...args} label="Indeterminate" indeterminate />
    </Stack>
  ),
}

/** 3. Disabled, in each state. */
export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <Stack>
      <Checkbox {...args} label="Disabled unchecked" />
      <Checkbox {...args} label="Disabled checked" defaultChecked />
      <Checkbox {...args} label="Disabled indeterminate" indeterminate />
    </Stack>
  ),
}

/** 4. With and without a label — Select uses the bare box in its rows. */
export const WithAndWithoutLabel: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Stack label="with label">
        <Checkbox {...args} label="Send me updates" defaultChecked />
      </Stack>
      <Stack label="bare box — needs its own accessible name">
        <Checkbox {...args} label={undefined} aria-label="Select row" defaultChecked />
      </Stack>
    </div>
  ),
}

/** 5. Tab to it — the ring shows only on keyboard focus, not on click. */
export const FocusVisible: Story = {
  render: (args) => (
    <Stack label="press Tab">
      <Checkbox {...args} label="First" />
      <Checkbox {...args} label="Second" defaultChecked />
      <Checkbox {...args} label="Third" indeterminate />
    </Stack>
  ),
}

/** A parent driving its children — the usual reason indeterminate exists. */
export const ParentChild: Story = {
  render: () => {
    const [items, setItems] = useState([true, false, false])
    const allOn = items.every(Boolean)
    const someOn = items.some(Boolean)
    return (
      <div className="flex flex-col gap-2">
        <Checkbox
          label="All permissions"
          checked={allOn}
          indeterminate={someOn && !allOn}
          onChange={(event) => setItems(items.map(() => event.target.checked))}
        />
        <div className="flex flex-col gap-2 pl-4">
          {['Read', 'Write', 'Delete'].map((name, index) => (
            <Checkbox
              key={name}
              label={name}
              checked={items[index] ?? false}
              onChange={(event) =>
                setItems((current) =>
                  current.map((entry, i) => (i === index ? event.target.checked : entry)),
                )
              }
            />
          ))}
        </div>
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
        <Checkbox {...args} label="Unchecked" />
        <Checkbox {...args} label="Checked" defaultChecked />
        <Checkbox {...args} label="Indeterminate" indeterminate />
      </Stack>
      <Stack label="disabled">
        <Checkbox {...args} label="Disabled unchecked" disabled />
        <Checkbox {...args} label="Disabled checked" defaultChecked disabled />
        <Checkbox {...args} label="Disabled indeterminate" indeterminate disabled />
      </Stack>
    </div>
  ),
}
