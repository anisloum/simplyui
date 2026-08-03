import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { Check, Star, TriangleAlert } from 'lucide-react'
import { useState } from 'react'

import { Badge } from './badge'
import { type BadgeIntent, type BadgeSize, type BadgeVariant } from './badge.styles'

const INTENTS: BadgeIntent[] = ['primary', 'success', 'warning', 'error']
const VARIANTS: BadgeVariant[] = ['filled', 'outlined']
const SIZES: BadgeSize[] = ['sm', 'md']

function Row({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      {label ? <span className="text-xs text-text-default">{label}</span> : null}
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  )
}

/**
 * Storybook's canvas is pure white, but the light surface token is #e9f1ff.
 * Without painting it, the a11y addon measures contrast against the wrong
 * background.
 */
const withSurface: Decorator = (Story) => (
  <div className="bg-bg-default p-4">
    <Story />
  </div>
)

const meta = {
  title: 'Components/Badge',
  component: Badge,
  argTypes: {
    intent: { control: 'inline-radio', options: INTENTS },
    variant: { control: 'inline-radio', options: VARIANTS },
    size: { control: 'inline-radio', options: SIZES },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
    removeLabel: { control: 'text' },
    onRemove: { table: { disable: true } },
    icon: { table: { disable: true } },
  },
  args: { children: 'Badge', intent: 'primary', variant: 'filled', size: 'md' },
  decorators: [withSurface],
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

/** 1. Every prop wired to a control. */
export const Playground: Story = {}

/** 2. All four intents, filled. */
export const Intents: Story = {
  render: (args) => (
    <Row>
      {INTENTS.map((intent) => (
        <Badge key={intent} {...args} intent={intent}>
          {intent}
        </Badge>
      ))}
    </Row>
  ),
}

/** 3. Filled against outlined, per intent. */
export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      {VARIANTS.map((variant) => (
        <Row key={variant} label={variant}>
          {INTENTS.map((intent) => (
            <Badge key={intent} {...args} intent={intent} variant={variant}>
              {intent}
            </Badge>
          ))}
        </Row>
      ))}
    </div>
  ),
}

/** 4. sm (20px) and md (28px). */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      {SIZES.map((size) => (
        <Row key={size} label={size}>
          {INTENTS.map((intent) => (
            <Badge key={intent} {...args} intent={intent} size={size}>
              {intent}
            </Badge>
          ))}
          <Badge {...args} size={size} icon={<Star />}>
            with icon
          </Badge>
        </Row>
      ))}
    </div>
  ),
}

/** 5. Optional leading icon. */
export const WithIcon: Story = {
  render: (args) => (
    <Row>
      <Badge {...args} intent="primary" icon={<Star />}>
        Featured
      </Badge>
      <Badge {...args} intent="success" icon={<Check />}>
        Verified
      </Badge>
      <Badge {...args} intent="warning" icon={<TriangleAlert />}>
        Expiring
      </Badge>
      <Badge {...args} intent="error" variant="outlined" icon={<TriangleAlert />}>
        Failed
      </Badge>
    </Row>
  ),
}

/** 6. Dismissible chips — click an X to remove one. This is the Select chip. */
export const Removable: Story = {
  render: (args) => {
    const [items, setItems] = useState(['Design', 'Engineering', 'Marketing', 'Support'])
    return (
      <div className="flex flex-col gap-4">
        <Row label="click an X to remove">
          {items.map((item) => (
            <Badge
              key={item}
              {...args}
              onRemove={() => setItems((current) => current.filter((entry) => entry !== item))}
              removeLabel={`Remove ${item}`}
            >
              {item}
            </Badge>
          ))}
          {items.length === 0 ? (
            <button
              type="button"
              className="text-xs text-text-link underline"
              onClick={() => setItems(['Design', 'Engineering', 'Marketing', 'Support'])}
            >
              reset
            </button>
          ) : null}
        </Row>
        <Row label="both sizes, both variants">
          <Badge {...args} size="sm" onRemove={() => {}} removeLabel="Remove small chip">
            small chip
          </Badge>
          <Badge
            {...args}
            variant="outlined"
            intent="success"
            onRemove={() => {}}
            removeLabel="Remove outlined chip"
          >
            outlined chip
          </Badge>
        </Row>
      </div>
    )
  },
}

/** 7. Disabled greys the badge and disables its remove control. */
export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <div className="flex flex-col gap-4">
      {VARIANTS.map((variant) => (
        <Row key={variant} label={variant}>
          {INTENTS.map((intent) => (
            <Badge key={intent} {...args} intent={intent} variant={variant}>
              {intent}
            </Badge>
          ))}
          <Badge {...args} variant={variant} onRemove={() => {}} removeLabel="Remove (disabled)">
            chip
          </Badge>
        </Row>
      ))}
    </div>
  ),
}

/** 8. The full matrix under a `.dark` wrapper. */
export const DarkMode: Story = {
  parameters: { backgrounds: { disable: true } },
  render: (args) => (
    <div className="dark flex flex-col gap-4 rounded-md bg-bg-default p-8 text-text-default">
      {VARIANTS.map((variant) => (
        <Row key={variant} label={variant}>
          {INTENTS.map((intent) => (
            <Badge key={intent} {...args} intent={intent} variant={variant}>
              {intent}
            </Badge>
          ))}
        </Row>
      ))}
      <Row label="chips + disabled">
        <Badge {...args} onRemove={() => {}} removeLabel="Remove chip">
          chip
        </Badge>
        <Badge {...args} intent="success" icon={<Check />}>
          with icon
        </Badge>
        <Badge {...args} disabled>
          disabled
        </Badge>
      </Row>
    </div>
  ),
}
