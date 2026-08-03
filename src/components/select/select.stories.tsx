import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { useState, type ReactNode } from 'react'

import { Select, type SelectOption } from './select'
import { type SelectValidationStatus } from './select.styles'

const FRUITS: SelectOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' },
  { value: 'fig', label: 'Fig' },
  { value: 'grape', label: 'Grape' },
]

const TEAMS: SelectOption[] = [
  { value: 'design', label: 'Design' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'support', label: 'Support' },
  { value: 'finance', label: 'Finance' },
]

const LONG_LIST: SelectOption[] = Array.from({ length: 40 }, (_, i) => ({
  value: `option-${i + 1}`,
  label: `Option ${i + 1}`,
}))

const STATUSES: SelectValidationStatus[] = ['success', 'warning', 'error']
const STATUS_TEXT: Record<SelectValidationStatus, string> = {
  success: 'Looks good.',
  warning: 'This choice limits some features.',
  error: 'Pick at least one option.',
}

function Stack({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      {label ? <span className="text-xs text-text-default">{label}</span> : null}
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  )
}

/** Real surface token — Storybook's canvas is pure white, the token is #e9f1ff. */
const withSurface: Decorator = (Story) => (
  <div className="max-w-2xl bg-bg-default p-4">
    <Story />
  </div>
)

const meta = {
  title: 'Components/Select',
  component: Select,
  argTypes: {
    multiple: { control: 'boolean' },
    clearable: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    status: { control: 'inline-radio', options: ['default', 'success', 'warning', 'error'] },
    maxVisibleOptions: { control: { type: 'number', min: 1, max: 12 } },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    statusText: { control: 'text' },
    options: { table: { disable: true } },
  },
  args: { options: FRUITS, label: 'Favourite fruit', placeholder: 'Select a fruit…' },
  decorators: [withSurface],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

/** 1. Every prop wired to a control. */
export const Playground: Story = {}

/** 2. Pick one — the list closes and focus returns to the trigger. */
export const SingleSelect: Story = {
  args: { defaultValue: 'cherry' },
}

/** 3. The clear control appears only once something is selected. */
export const SingleClearable: Story = {
  args: { clearable: true, defaultValue: 'banana' },
}

/** 4. Multi-select. Chips are Badges; each X deselects. The list stays open. */
export const MultiSelect: Story = {
  args: {
    options: TEAMS,
    multiple: true,
    clearable: true,
    label: 'Teams',
    placeholder: 'Select teams…',
    defaultValue: ['design', 'engineering'],
  },
}

/** 5. Past three selections the remainder collapses into a `+N` badge. */
export const MultiOverflow: Story = {
  args: {
    options: TEAMS,
    multiple: true,
    clearable: true,
    label: 'Teams',
    defaultValue: ['design', 'engineering', 'marketing', 'support', 'finance'],
  },
}

/** 6. `required` renders the asterisk and sets `aria-required`. */
export const RequiredLabel: Story = {
  args: { required: true, label: 'Favourite fruit' },
}

/** 7. Neutral helper text. */
export const HelperText: Story = {
  args: { helperText: 'You can change this later in settings.' },
}

/** 8. Each status: border, message colour and the status icon in the message row. */
export const Statuses: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      {STATUSES.map((status) => (
        <Select
          {...args}
          key={status}
          label={status}
          status={status}
          statusText={STATUS_TEXT[status]}
          defaultValue="apple"
        />
      ))}
    </div>
  ),
}

/** 9. A disabled select, and a live select containing disabled options. */
export const DisabledStates: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Stack label="whole select disabled">
        <Select {...args} disabled defaultValue="apple" />
      </Stack>
      <Stack label="disabled options — unselectable, and skipped by the arrow keys">
        <Select
          {...args}
          label="Favourite fruit"
          options={[
            { value: 'apple', label: 'Apple' },
            { value: 'banana', label: 'Banana — out of stock', disabled: true },
            { value: 'cherry', label: 'Cherry' },
            { value: 'date', label: 'Date — out of stock', disabled: true },
            { value: 'fig', label: 'Fig' },
          ]}
        />
      </Stack>
      <Stack label="multi, disabled with a selection">
        <Select {...args} options={TEAMS} multiple disabled defaultValue={['design', 'support']} />
      </Stack>
    </div>
  ),
}

/**
 * 10. A 40-option list. It scrolls after `maxVisibleOptions`, and the popover
 * flips above the trigger when there is no room below — scroll this story so
 * the field sits near the bottom of the viewport, then open it.
 */
export const LongListAndCollision: Story = {
  args: { options: LONG_LIST, label: 'Option', placeholder: 'Pick one of 40…' },
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Stack label="opens downward — plenty of room below">
        <Select {...args} />
      </Stack>
      <div className="h-[70vh] rounded-md border border-border-subtle bg-bg-subtle p-4 text-xs text-text-subtle">
        spacer — scroll down so the next field is near the bottom edge
      </div>
      <Stack label="flips upward — no room below">
        <Select {...args} label="Option (near the bottom edge)" />
      </Stack>
    </div>
  ),
}

/** 12. Keyboard model, and a live readout of what the component reports. */
export const KeyboardNavigation: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | string[]>([])
    return (
      <div className="flex flex-col gap-4">
        <Select
          {...args}
          options={TEAMS}
          multiple
          clearable
          label="Teams"
          value={value}
          onValueChange={setValue}
          helperText="Tab to the trigger, then try the keys below."
        />
        <p className="text-xs text-text-subtle">
          Selected: {Array.isArray(value) && value.length ? value.join(', ') : '(none)'}
        </p>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs text-text-default">
          <dt className="font-medium">Enter / Space / ↓ / ↑</dt>
          <dd className="text-text-subtle">open the list</dd>
          <dt className="font-medium">↓ / ↑</dt>
          <dd className="text-text-subtle">move the active row, skipping disabled ones</dd>
          <dt className="font-medium">Home / End</dt>
          <dd className="text-text-subtle">first / last enabled row</dd>
          <dt className="font-medium">Enter / Space</dt>
          <dd className="text-text-subtle">
            select — single closes and returns focus, multi stays open
          </dd>
          <dt className="font-medium">a–z</dt>
          <dd className="text-text-subtle">typeahead to the next matching row</dd>
          <dt className="font-medium">Escape</dt>
          <dd className="text-text-subtle">close, keep the value, focus the trigger</dd>
          <dt className="font-medium">Tab</dt>
          <dd className="text-text-subtle">close and move on</dd>
        </dl>
      </div>
    )
  },
}

/** 11. Single, multi and the statuses under a `.dark` wrapper. */
export const DarkMode: Story = {
  parameters: { backgrounds: { disable: true } },
  render: (args) => (
    <div className="dark flex flex-col gap-4 rounded-md bg-bg-default p-8 text-text-default">
      <Stack label="single">
        <Select {...args} defaultValue="cherry" clearable />
      </Stack>
      <Stack label="multi">
        <Select
          {...args}
          options={TEAMS}
          multiple
          clearable
          label="Teams"
          defaultValue={['design', 'engineering']}
        />
      </Stack>
      <Stack label="statuses">
        {STATUSES.map((status) => (
          <Select
            {...args}
            key={status}
            label={status}
            status={status}
            statusText={STATUS_TEXT[status]}
            defaultValue="apple"
          />
        ))}
      </Stack>
      <Stack label="disabled">
        <Select {...args} disabled defaultValue="apple" />
      </Stack>
    </div>
  ),
}
