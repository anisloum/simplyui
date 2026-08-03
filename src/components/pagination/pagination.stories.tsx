import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { useState, type ComponentProps } from 'react'

import { Pagination } from './pagination'

/** Paint the real surface token — Storybook's canvas is pure white. */
const withSurface: Decorator = (Story) => (
  <div className="bg-bg-default p-4">
    <Story />
  </div>
)

/** Pagination is controlled-only, so every story needs local state. */
function Demo({
  initialPage = 1,
  ...props
}: { initialPage?: number } & Omit<
  ComponentProps<typeof Pagination>,
  'currentPage' | 'onPageChange'
>) {
  const [page, setPage] = useState(initialPage)
  return (
    <div className="flex flex-col gap-2">
      <Pagination {...props} currentPage={page} onPageChange={setPage} />
      <p className="text-xs text-text-subtle">
        Page {page} of {props.totalPages}
      </p>
    </div>
  )
}

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  argTypes: {
    currentPage: { control: { type: 'number', min: 1 } },
    totalPages: { control: { type: 'number', min: 1 } },
    siblingCount: { control: { type: 'number', min: 0, max: 3 } },
    showFirstLast: { control: 'boolean' },
  },
  // `onPageChange` is required, so it has to live here for the stories that
  // render their own stateful demo and never read args.
  args: {
    currentPage: 3,
    totalPages: 27,
    siblingCount: 1,
    showFirstLast: true,
    onPageChange: () => {},
  },
  decorators: [withSurface],
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

/** 1. Every prop wired to a control — including a live `currentPage`. */
export const Playground: Story = {
  render: (args) => <Pagination {...args} onPageChange={() => {}} />,
}

/** 2. Few enough pages that nothing truncates. */
export const FewPages: Story = {
  render: () => <Demo totalPages={7} initialPage={3} />,
}

/** 3. Many pages — walk through to see the ellipsis lead and trail. */
export const ManyPages: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Demo totalPages={27} initialPage={1} />
      <Demo totalPages={27} initialPage={13} />
      <Demo totalPages={27} initialPage={27} />
    </div>
  ),
}

/** 4. Without the double-chevron jump buttons. */
export const NoFirstLast: Story = {
  render: () => <Demo totalPages={27} initialPage={13} showFirstLast={false} />,
}

/** 5. Edge pages: first/prev disabled on page 1, next/last on the final page. */
export const EdgeStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <span className="text-xs text-text-default">page 1 — first and prev are disabled</span>
        <Demo totalPages={27} initialPage={1} />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-text-default">last page — next and last are disabled</span>
        <Demo totalPages={27} initialPage={27} />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-text-default">a single page — everything is disabled</span>
        <Demo totalPages={1} initialPage={1} />
      </div>
    </div>
  ),
}

/** Wider sibling windows. */
export const SiblingCount: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {[0, 1, 2].map((siblingCount) => (
        <div key={siblingCount} className="flex flex-col gap-1">
          <span className="text-xs text-text-default">siblingCount={siblingCount}</span>
          <Demo totalPages={27} initialPage={13} siblingCount={siblingCount} />
        </div>
      ))}
    </div>
  ),
}

/** 6. Under a `.dark` wrapper. */
export const DarkMode: Story = {
  parameters: { backgrounds: { disable: true } },
  render: () => (
    <div className="dark flex flex-col gap-4 rounded-md bg-bg-default p-8 text-text-default">
      <Demo totalPages={27} initialPage={13} />
      <Demo totalPages={7} initialPage={1} />
    </div>
  ),
}
