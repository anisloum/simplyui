import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { useState, type ReactNode } from 'react'

import { Textarea } from './textarea'
import { type TextareaResize, type TextareaValidationStatus } from './textarea.styles'

const STATUSES: TextareaValidationStatus[] = ['success', 'warning', 'error']
const RESIZES: TextareaResize[] = ['vertical', 'none', 'both']

const STATUS_TEXT: Record<TextareaValidationStatus, string> = {
  success: 'Saved. Your description is live.',
  warning: 'This is quite long — consider trimming it.',
  error: 'Description is required.',
}

const SAMPLE =
  'Ada Lovelace wrote the first algorithm intended to be processed by a machine, ' +
  'which is why she is often described as the first computer programmer.'

function Stack({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      {label ? <span className="text-xs text-text-default">{label}</span> : null}
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  )
}

/**
 * Fields are 100% wide, so keep them at a realistic form width. `bg-bg-default`
 * matters for more than looks: Storybook's canvas is pure white, but the light
 * surface token is #e9f1ff, and without it the a11y addon measures contrast
 * against the wrong background.
 */
const withFormWidth: Decorator = (Story) => (
  <div className="max-w-2xl bg-bg-default p-4">
    <Story />
  </div>
)

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  argTypes: {
    status: { control: 'inline-radio', options: ['default', 'success', 'warning', 'error'] },
    resize: { control: 'inline-radio', options: RESIZES },
    rows: { control: { type: 'number', min: 1, max: 20 } },
    maxLength: { control: { type: 'number', min: 0 } },
    showCount: { control: 'boolean' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    helperText: { control: 'text' },
    statusText: { control: 'text' },
    placeholder: { control: 'text' },
  },
  args: {
    label: 'Description',
    placeholder: 'Tell us a little about yourself…',
    status: 'default',
    resize: 'vertical',
    rows: 3,
  },
  decorators: [withFormWidth],
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

/** 1. Every prop wired to a control. */
export const Playground: Story = {}

/** 2. Base states. `Filled` proves a value does not alter the border. */
export const BaseStates: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Textarea {...args} label="Default" />
      <Textarea {...args} label="Focused — click or tab in" placeholder="focus me" />
      <Textarea {...args} label="Filled" defaultValue={SAMPLE} />
      <Textarea {...args} label="Disabled" defaultValue={SAMPLE} disabled />
      <Textarea {...args} label="Disabled + empty" disabled />
    </div>
  ),
}

/** 3. `required` renders the asterisk *and* sets the `required` attribute. */
export const RequiredLabel: Story = {
  args: { required: true, label: 'Bio', placeholder: 'A sentence or two' },
}

/** 4. Neutral helper text. */
export const HelperText: Story = {
  args: {
    label: 'Bio',
    helperText: 'Shown on your public profile. Markdown is not supported.',
  },
}

/** 5. Each status: border, top-right icon and coloured message. */
export const Statuses: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      {STATUSES.map((status) => (
        <Textarea
          {...args}
          key={status}
          label={status}
          status={status}
          statusText={STATUS_TEXT[status]}
          defaultValue={SAMPLE}
        />
      ))}
    </div>
  ),
}

/**
 * 6. Focus an error field: the border stays red and the ring layers on top,
 * rather than reverting to the neutral focus blue.
 */
export const FocusWithError: Story = {
  args: {
    label: 'Description',
    status: 'error',
    statusText: STATUS_TEXT.error,
    defaultValue: 'too short',
    autoFocus: true,
  },
}

/** 7. The three resize modes. Drag the bottom-right grip to compare. */
export const ResizeVariants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      {RESIZES.map((resize) => (
        <Textarea
          {...args}
          key={resize}
          label={`resize="${resize}"`}
          resize={resize}
          helperText={
            resize === 'none'
              ? 'No grip — the field cannot be dragged.'
              : `Drag the grip: ${resize}.`
          }
        />
      ))}
    </div>
  ),
}

/** 8. `rows` sets the starting height, and the min-height it cannot go below. */
export const Rows: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Textarea {...args} label="rows=3 (default)" rows={3} />
      <Textarea {...args} label="rows=6" rows={6} />
      <Textarea {...args} label="rows=1" rows={1} />
    </div>
  ),
}

/** 9. The counter, including the at-limit colour and the no-maxLength format. */
export const CharacterCounter: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Textarea
        {...args}
        label="With maxLength — type to watch it climb"
        showCount
        maxLength={120}
        helperText="Keep it short."
      />
      <Textarea
        {...args}
        label="At the limit — counter turns red"
        showCount
        maxLength={24}
        defaultValue="Exactly twenty-four chars"
      />
      <Textarea {...args} label="No maxLength — bare count" showCount defaultValue={SAMPLE} />
    </div>
  ),
}

/** A controlled example, driving status from the value. */
export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState('')
    const tooShort = value.length > 0 && value.length < 20
    return (
      <Textarea
        {...args}
        label="Description"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        showCount
        maxLength={200}
        status={tooShort ? 'error' : value ? 'success' : 'default'}
        statusText={tooShort ? 'At least 20 characters.' : 'Looks good.'}
        helperText="Type to see the status change."
      />
    )
  },
}

/** 10. The status set under a `.dark` wrapper. */
export const DarkMode: Story = {
  parameters: { backgrounds: { disable: true } },
  render: (args) => (
    <div className="dark flex flex-col gap-4 rounded-md bg-bg-default p-8 text-text-default">
      <Stack label="base">
        <Textarea {...args} label="Default" />
        <Textarea {...args} label="Filled" defaultValue={SAMPLE} />
        <Textarea {...args} label="Disabled" defaultValue={SAMPLE} disabled />
        <Textarea {...args} label="Helper text" helperText="Shown on your public profile." />
      </Stack>
      <Stack label="statuses">
        {STATUSES.map((status) => (
          <Textarea
            {...args}
            key={status}
            label={status}
            status={status}
            statusText={STATUS_TEXT[status]}
            defaultValue={SAMPLE}
          />
        ))}
      </Stack>
      <Stack label="counter">
        <Textarea
          {...args}
          label="At the limit"
          showCount
          maxLength={24}
          defaultValue="Exactly twenty-four chars"
        />
      </Stack>
    </div>
  ),
}
