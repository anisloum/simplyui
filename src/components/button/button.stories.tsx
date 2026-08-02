import type { Meta, StoryObj } from '@storybook/react-vite'
import { ArrowRight, Download, Heart, Plus, Settings, Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from './button'
import { type ButtonSize, type ButtonVariant } from './button.styles'

const VARIANTS: ButtonVariant[] = ['solid', 'outline', 'ghost']
const SIZES: ButtonSize[] = ['sm', 'md', 'lg']

function Stack({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      {label ? <span className="text-xs text-text-default">{label}</span> : null}
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  )
}

const meta = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: { control: 'inline-radio', options: VARIANTS },
    size: { control: 'inline-radio', options: SIZES },
    iconPosition: { control: 'inline-radio', options: ['left', 'right'] },
    iconOnly: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
    asChild: { table: { disable: true } },
    icon: {
      control: 'select',
      options: ['none', 'plus', 'arrow', 'download'],
      mapping: {
        none: undefined,
        plus: <Plus />,
        arrow: <ArrowRight />,
        download: <Download />,
      },
    },
  },
  args: {
    children: 'Button',
    variant: 'solid',
    size: 'md',
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/** 1. Every prop wired to a control. */
export const Playground: Story = {}

/** 2. The three variants, resting state. */
export const Variants: Story = {
  render: (args) => (
    <Stack>
      {VARIANTS.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </Stack>
  ),
}

/**
 * 3. The three sizes. Note `sm` is a 32px hit target — under the 44px AAA
 * recommendation, so reserve it for dense UIs.
 */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      {VARIANTS.map((variant) => (
        <Stack key={variant} label={variant}>
          {SIZES.map((size) => (
            <Button key={size} {...args} variant={variant} size={size}>
              {size}
            </Button>
          ))}
        </Stack>
      ))}
    </div>
  ),
}

/** 4. Leading and trailing icons, on every variant. */
export const WithIcon: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Stack label='iconPosition="left"'>
        {VARIANTS.map((variant) => (
          <Button key={variant} {...args} variant={variant} icon={<Plus />}>
            Add item
          </Button>
        ))}
      </Stack>
      <Stack label='iconPosition="right"'>
        {VARIANTS.map((variant) => (
          <Button
            key={variant}
            {...args}
            variant={variant}
            icon={<ArrowRight />}
            iconPosition="right"
          >
            Continue
          </Button>
        ))}
      </Stack>
      <Stack label="every size, leading icon">
        {SIZES.map((size) => (
          <Button key={size} {...args} size={size} icon={<Download />}>
            Download
          </Button>
        ))}
      </Stack>
    </div>
  ),
}

/** 5. Square icon-only buttons. `aria-label` is mandatory — dev-warned if absent. */
export const IconOnly: Story = {
  args: { iconOnly: true, children: undefined },
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Stack label="variants">
        <Button {...args} variant="solid" icon={<Plus />} aria-label="Add item" />
        <Button {...args} variant="outline" icon={<Settings />} aria-label="Open settings" />
        <Button {...args} variant="ghost" icon={<Heart />} aria-label="Add to favourites" />
      </Stack>
      <Stack label="sizes">
        {SIZES.map((size) => (
          <Button
            key={size}
            {...args}
            size={size}
            icon={<Trash2 />}
            aria-label={`Delete (${size})`}
          />
        ))}
      </Stack>
    </div>
  ),
}

/**
 * 6. Loading. The text buttons keep the exact width they had at rest — the
 * label stays in flow but `invisible`, and the spinner is overlaid. Icon-only
 * buttons swap their icon for the spinner instead.
 */
export const Loading: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Stack label="at rest">
        <Button {...args} variant="solid">
          Save changes
        </Button>
        <Button {...args} variant="outline" icon={<Download />}>
          Download
        </Button>
        <Button {...args} variant="ghost">
          Cancel
        </Button>
        <Button {...args} iconOnly icon={<Plus />} aria-label="Add item" />
      </Stack>
      <Stack label="isLoading — widths above and below should line up exactly">
        <Button {...args} variant="solid" isLoading>
          Save changes
        </Button>
        <Button {...args} variant="outline" icon={<Download />} isLoading>
          Download
        </Button>
        <Button {...args} variant="ghost" isLoading>
          Cancel
        </Button>
        <Button {...args} iconOnly icon={<Plus />} aria-label="Add item" isLoading />
      </Stack>
    </div>
  ),
}

/** 7. Disabled: not focusable, no hover/press, and `onClick` never fires. */
export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Stack label="text">
        {VARIANTS.map((variant) => (
          <Button key={variant} {...args} variant={variant}>
            {variant}
          </Button>
        ))}
      </Stack>
      <Stack label="icon-only">
        {VARIANTS.map((variant) => (
          <Button
            key={variant}
            {...args}
            variant={variant}
            iconOnly
            icon={<Trash2 />}
            aria-label={`Delete (${variant})`}
          />
        ))}
      </Stack>
    </div>
  ),
}

/**
 * 8. Static states grid mirroring the Figma frame.
 *
 * Hover and pressed are pseudo-class-driven in the real component, so they
 * cannot be triggered from props. The middle rows force the same token
 * combinations through `className` purely so the whole matrix can be eyeballed
 * side by side for visual QA.
 */
const forcedStates: Record<ButtonVariant, { hover: string; pressed: string }> = {
  solid: {
    hover: 'bg-primary-hover',
    pressed: 'bg-primary-active',
  },
  outline: {
    hover: 'bg-primary-wash-hover',
    pressed: 'border-primary-active bg-primary-wash-active text-primary-active',
  },
  ghost: {
    hover: 'bg-primary-wash-hover',
    pressed: 'bg-primary-wash-active text-primary-active',
  },
}

export const StatesReference: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <p className="max-w-2xl text-xs text-text-default">
        Row 1 is live — hover and press it. Rows 2 and 3 are the same token combinations pinned open
        via <code>className</code> so the matrix can be compared against Figma.
      </p>
      <div className="grid grid-cols-[auto_repeat(3,minmax(0,1fr))] items-center gap-4">
        <span aria-hidden="true" />
        {VARIANTS.map((variant) => (
          <span key={variant} className="text-xs text-text-default">
            {variant}
          </span>
        ))}

        <span className="text-xs text-text-default">default / live</span>
        {VARIANTS.map((variant) => (
          <Button key={variant} {...args} variant={variant}>
            {variant}
          </Button>
        ))}

        <span className="text-xs text-text-default">hover (forced)</span>
        {VARIANTS.map((variant) => (
          <Button key={variant} {...args} variant={variant} className={forcedStates[variant].hover}>
            {variant}
          </Button>
        ))}

        <span className="text-xs text-text-default">pressed (forced)</span>
        {VARIANTS.map((variant) => (
          <Button
            key={variant}
            {...args}
            variant={variant}
            className={forcedStates[variant].pressed}
          >
            {variant}
          </Button>
        ))}

        <span className="text-xs text-text-default">disabled</span>
        {VARIANTS.map((variant) => (
          <Button key={variant} {...args} variant={variant} disabled>
            {variant}
          </Button>
        ))}
      </div>
    </div>
  ),
}

/** 9. The Variants story under a `.dark` wrapper. */
export const DarkMode: Story = {
  parameters: { backgrounds: { disable: true } },
  render: (args) => (
    <div className="dark flex flex-col gap-4 rounded-md bg-bg-default p-8 text-text-default">
      {SIZES.map((size) => (
        <Stack key={size} label={size}>
          {VARIANTS.map((variant) => (
            <Button key={variant} {...args} variant={variant} size={size}>
              {variant}
            </Button>
          ))}
        </Stack>
      ))}
      <Stack label="icon-only + loading">
        <Button {...args} iconOnly icon={<Plus />} aria-label="Add item" />
        <Button {...args} variant="outline" iconOnly icon={<Settings />} aria-label="Settings" />
        <Button {...args} variant="ghost" isLoading>
          Loading
        </Button>
      </Stack>
    </div>
  ),
}

/**
 * `asChild` merges the button's styling and props into its single element
 * child, so a link can look and behave like a button while staying a real
 * `<a>` for assistive tech and middle-click.
 */
export const AsChild: Story = {
  render: (args) => (
    <Stack>
      {VARIANTS.map((variant) => (
        <Button
          key={variant}
          {...args}
          variant={variant}
          asChild
          icon={<ArrowRight />}
          iconPosition="right"
        >
          <a href="https://example.com">Visit docs</a>
        </Button>
      ))}
    </Stack>
  ),
}
