import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { CreditCard, Mail, Search, User } from 'lucide-react'
import { useState, type ReactNode } from 'react'

import { Input } from './input'
import { type InputValidationStatus } from './input.styles'

const STATUSES: InputValidationStatus[] = ['success', 'warning', 'error']

const STATUS_TEXT: Record<InputValidationStatus, string> = {
  success: 'Username is available.',
  warning: 'This address uses a disposable domain.',
  error: 'Enter a valid email address.',
}

function Stack({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      {label ? <span className="text-xs text-text-default">{label}</span> : null}
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  )
}

/**
 * Fields are 100% wide, so keep them at a realistic form width rather than
 * letting them span the whole canvas. Declared as a named `Decorator` because
 * an inline arrow makes `meta`'s inferred type unnameable under `satisfies`.
 */
const withFormWidth: Decorator = (Story) => (
  // `bg-bg-default` matters for more than looks: Storybook's canvas is pure
  // white, but the light surface token is #e9f1ff. Without it the a11y addon
  // measures every contrast ratio against the wrong background and reports
  // results that are slightly better than what ships.
  <div className="max-w-2xl bg-bg-default p-4">
    <Story />
  </div>
)

const meta = {
  title: 'Components/Input',
  component: Input,
  argTypes: {
    status: { control: 'inline-radio', options: ['default', 'success', 'warning', 'error'] },
    type: { control: 'select', options: ['text', 'password', 'email', 'search', 'tel', 'url'] },
    label: { control: 'text' },
    helperText: { control: 'text' },
    statusText: { control: 'text' },
    placeholder: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    leftIcon: {
      control: 'select',
      options: ['none', 'mail', 'search', 'user'],
      mapping: { none: undefined, mail: <Mail />, search: <Search />, user: <User /> },
    },
    rightIcon: {
      control: 'select',
      options: ['none', 'card'],
      mapping: { none: undefined, card: <CreditCard /> },
    },
  },
  args: {
    label: 'Email address',
    placeholder: 'you@example.com',
    status: 'default',
    type: 'text',
  },
  decorators: [withFormWidth],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

/** 1. Every prop wired to a control. */
export const Playground: Story = {}

/** 2. The base states. `Filled` proves a value does not alter the border. */
export const BaseStates: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Input {...args} label="Default" />
      <Input
        {...args}
        label="Focused — Tab in to see the ring; clicking deliberately shows none"
        placeholder="focus me"
      />
      <Input {...args} label="Filled" defaultValue="ada@example.com" />
      <Input {...args} label="Disabled" defaultValue="ada@example.com" disabled />
      <Input {...args} label="Disabled + empty" disabled />
    </div>
  ),
}

/** 3. `required` renders the asterisk *and* sets the `required` attribute. */
export const RequiredLabel: Story = {
  args: { required: true, label: 'Full name', placeholder: 'Ada Lovelace' },
}

/** 4. Neutral helper text. */
export const HelperText: Story = {
  args: {
    label: 'Username',
    placeholder: 'ada',
    helperText: 'Letters, numbers and underscores. 3–20 characters.',
  },
}

/** 5. Each status: border, right-slot icon and coloured message. */
export const Statuses: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      {STATUSES.map((status) => (
        <Input
          {...args}
          key={status}
          label={status}
          status={status}
          statusText={STATUS_TEXT[status]}
          defaultValue="ada@example.com"
        />
      ))}
    </div>
  ),
}

/**
 * 6. Focus an error field: the border stays red and the ring is added on top,
 * rather than the border reverting to the neutral focus blue.
 */
export const FocusWithError: Story = {
  args: {
    label: 'Email address',
    status: 'error',
    statusText: STATUS_TEXT.error,
    defaultValue: 'not-an-email',
    autoFocus: true,
  },
}

/** 7. Decorative adornments on either side. */
export const WithIcons: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Input {...args} label="Left icon" leftIcon={<Mail />} />
      <Input {...args} label="Right icon" rightIcon={<CreditCard />} placeholder="4242 4242…" />
      <Input {...args} label="Both" leftIcon={<Search />} rightIcon={<CreditCard />} />
      <Input
        {...args}
        label="rightIcon yields to the status icon"
        status="error"
        statusText={STATUS_TEXT.error}
        leftIcon={<Mail />}
        rightIcon={<CreditCard />}
      />
    </div>
  ),
}

/** 8. The reveal toggle, including the case where it outranks a status icon. */
export const Password: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Input {...args} label="Password" type="password" defaultValue="hunter2" placeholder="" />
      <Input
        {...args}
        label="Password + error — toggle keeps the slot, border stays red"
        type="password"
        status="error"
        statusText="Must be at least 12 characters."
        defaultValue="short"
        placeholder=""
      />
      <Input
        {...args}
        label="Password, disabled — toggle is disabled too"
        type="password"
        defaultValue="hunter2"
        placeholder=""
        disabled
      />
    </div>
  ),
}

/** A quick controlled example, since `Input` is uncontrolled by default. */
export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState('')
    const tooShort = value.length > 0 && value.length < 3
    return (
      <Input
        {...args}
        label="Username"
        placeholder="ada"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        status={tooShort ? 'error' : value ? 'success' : 'default'}
        statusText={tooShort ? 'At least 3 characters.' : 'Looks good.'}
        helperText="Type to see the status change."
      />
    )
  },
}

/** 9. The status set under a `.dark` wrapper. */
export const DarkMode: Story = {
  parameters: { backgrounds: { disable: true } },
  render: (args) => (
    <div className="dark flex flex-col gap-4 rounded-md bg-bg-default p-8 text-text-default">
      <Stack label="base">
        <Input {...args} label="Default" />
        <Input {...args} label="Filled" defaultValue="ada@example.com" />
        <Input {...args} label="Disabled" defaultValue="ada@example.com" disabled />
        <Input {...args} label="Helper text" helperText="We never share your address." />
      </Stack>
      <Stack label="statuses">
        {STATUSES.map((status) => (
          <Input
            {...args}
            key={status}
            label={status}
            status={status}
            statusText={STATUS_TEXT[status]}
            defaultValue="ada@example.com"
          />
        ))}
      </Stack>
      <Stack label="icons + password">
        <Input {...args} label="Left icon" leftIcon={<Mail />} />
        <Input {...args} label="Password" type="password" defaultValue="hunter2" placeholder="" />
      </Stack>
    </div>
  ),
}
