import type { Meta, StoryObj } from '@storybook/react-vite'
import { Eye, Globe, MoreVertical, Pen, Trash } from 'lucide-react'

import { Menu, MenuItem } from './menu'

const meta: Meta<typeof Menu> = {
  title: 'Components/Menu',
  component: Menu,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof Menu>

export const Default: Story = {
  render: () => (
    <div className="flex w-[600px] justify-between p-8">
      <div>
        <Menu icon={<MoreVertical />} aria-label="Actions">
          <MenuItem leftIcon={<Eye />}>View Product</MenuItem>
          <MenuItem leftIcon={<Pen />}>Modify Product</MenuItem>
          <MenuItem leftIcon={<Trash />} variant="destructive">
            Delete Product
          </MenuItem>
        </Menu>
      </div>

      <div>
        <Menu icon={<Globe />} aria-label="Change Language">
          <MenuItem>العربية</MenuItem>
          <MenuItem>English</MenuItem>
          <MenuItem>Français</MenuItem>
        </Menu>
      </div>
    </div>
  ),
}

export const Controlled: Story = {
  render: () => (
    <Menu open={true} icon={<MoreVertical />} aria-label="Always Open">
      <MenuItem>Item 1</MenuItem>
      <MenuItem>Item 2</MenuItem>
    </Menu>
  ),
}
