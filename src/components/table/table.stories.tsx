import type { Meta, StoryObj } from '@storybook/react-vite'
import { MoreVertical } from 'lucide-react'
import { useState } from 'react'

import { Badge } from '../badge'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './table'

interface Product {
  code: string
  name: string
  price: string
  labels: string[]
  quantity: number
}

const PRODUCTS: Product[] = [
  {
    code: 'P01',
    name: 'Product 1',
    price: '1500DZD',
    labels: ['Quality Product', 'Cheap'],
    quantity: 15,
  },
  { code: 'P02', name: 'Product 2', price: '2400DZD', labels: ['Fast Delivery'], quantity: 8 },
  { code: 'P03', name: 'Product 3', price: '900DZD', labels: ['Cheap', 'Popular'], quantity: 42 },
  { code: 'P04', name: 'Product 4', price: '3100DZD', labels: ['Quality Product'], quantity: 3 },
  { code: 'P05', name: 'Product 5', price: '1750DZD', labels: ['New'], quantity: 27 },
]

/** Stand-in for the consumer's own actions trigger — the table ships no menu. */
const KebabButton = () => (
  <button
    type="button"
    aria-label="Row actions"
    className="inline-flex size-control-sm cursor-pointer items-center justify-center rounded-control text-text-subtle hover:bg-primary-wash-hover hover:text-text-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring-default"
  >
    <MoreVertical aria-hidden="true" className="size-icon-md" />
  </button>
)

const meta = {
  title: 'Components/Table',
  component: Table,
  argTypes: {
    striped: { control: 'boolean' },
    stickyHeader: { control: 'boolean' },
  },
  args: { striped: false, stickyHeader: false },
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

function BasicTable({ striped = false }: { striped?: boolean }) {
  return (
    <Table striped={striped}>
      <TableCaption visuallyHidden>Products</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead>Product Name</TableHead>
          <TableHead align="right">Price</TableHead>
          <TableHead align="right">Quantity</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {PRODUCTS.map((product) => (
          <TableRow key={product.code}>
            <TableCell>{product.code}</TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell align="right">{product.price}</TableCell>
            <TableCell align="right">{product.quantity}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

/** 1. Real `<table>` markup, named by a visually hidden `<caption>`. */
export const Basic: Story = {
  render: (args) => <BasicTable striped={args.striped} />,
}

/** 2. Striped rows. Hover steps to `bg-muted` so it stays visible on stripes. */
export const Striped: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-1 text-xs text-text-subtle">striped={'{false}'}</p>
        <BasicTable />
      </div>
      <div>
        <p className="mb-1 text-xs text-text-subtle">striped</p>
        <BasicTable striped />
      </div>
    </div>
  ),
}

/** 3. Sticky header — the container is height-capped, so the body scrolls under it. */
export const StickyHeader: Story = {
  render: () => (
    <Table stickyHeader containerClassName="max-h-[16rem]">
      <TableCaption visuallyHidden>Many products</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead>Product Name</TableHead>
          <TableHead align="right">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 20 }, (_, index) => (
          <TableRow key={index}>
            <TableCell>P{String(index + 1).padStart(2, '0')}</TableCell>
            <TableCell>Product {index + 1}</TableCell>
            <TableCell align="right">{(index + 1) * 150}DZD</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}

/** 4. Per-column alignment: text left, numbers right, actions centered. */
export const Alignment: Story = {
  render: () => (
    <Table>
      <TableCaption visuallyHidden>Alignment demo</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead align="left">Left</TableHead>
          <TableHead align="center">Center</TableHead>
          <TableHead align="right">Right</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {PRODUCTS.slice(0, 3).map((product) => (
          <TableRow key={product.code}>
            <TableCell align="left">{product.name}</TableCell>
            <TableCell align="center">
              <KebabButton />
            </TableCell>
            <TableCell align="right">{product.price}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell align="center">—</TableCell>
          <TableCell align="right">5800DZD</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
}

/**
 * 5. `maxWidth` caps a column and the content **wraps** — the chips reflow onto
 * a second line rather than being clipped. `truncate` is the opt-out.
 */
export const CellMaxWidth: Story = {
  render: () => (
    <Table>
      <TableCaption visuallyHidden>Cell width behaviour</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead maxWidth="16rem">Labels (wraps)</TableHead>
          <TableHead maxWidth="12rem">Notes (truncates)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {PRODUCTS.slice(0, 3).map((product) => (
          <TableRow key={product.code}>
            <TableCell>{product.name}</TableCell>
            <TableCell maxWidth="16rem">
              <div className="flex flex-wrap gap-1">
                {['Quality Product', 'Cheap', 'Fast Delivery'].map((label) => (
                  <Badge key={label} size="sm">
                    {label}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell maxWidth="12rem" truncate>
              A deliberately long note that has nowhere to go on one line.
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}

/**
 * 6. Horizontal scroll with the Actions column pinned right — scroll sideways
 * and it stays put, opaque, with an edge border.
 */
export const PinnedActions: Story = {
  render: (args) => (
    <Table striped={args.striped}>
      <TableCaption visuallyHidden>Wide table with pinned actions</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead pinned="left">Code</TableHead>
          {Array.from({ length: 8 }, (_, index) => (
            <TableHead key={index}>Column {index + 1}</TableHead>
          ))}
          <TableHead align="center" pinned="right">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {PRODUCTS.map((product) => (
          <TableRow key={product.code}>
            <TableCell pinned="left">{product.code}</TableCell>
            {Array.from({ length: 8 }, (_, index) => (
              <TableCell key={index} className="whitespace-nowrap">
                Some value {index + 1}
              </TableCell>
            ))}
            <TableCell align="center" pinned="right">
              <KebabButton />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}

/** 7. Selected rows outrank hover and stripes — click a row to toggle it. */
export const SelectedRows: Story = {
  render: (args) => {
    const [selected, setSelected] = useState<string[]>(['P02'])
    return (
      <Table striped={args.striped}>
        <TableCaption visuallyHidden>Selection precedence</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead align="right">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {PRODUCTS.map((product) => (
            <TableRow
              key={product.code}
              selected={selected.includes(product.code)}
              className="cursor-pointer"
              onClick={() =>
                setSelected((current) =>
                  current.includes(product.code)
                    ? current.filter((code) => code !== product.code)
                    : [...current, product.code],
                )
              }
            >
              <TableCell>{product.code}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell align="right">{product.price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  },
}

/** 8. Dark mode. */
export const DarkMode: Story = {
  parameters: { backgrounds: { disable: true } },
  render: () => (
    <div className="dark rounded-md bg-bg-default p-4">
      <BasicTable striped />
    </div>
  ),
}
