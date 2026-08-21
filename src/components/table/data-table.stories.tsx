import type { Meta, StoryObj } from '@storybook/react-vite'
import { MoreVertical } from 'lucide-react'
import { useState } from 'react'

import { Badge } from '../badge'
import { DataTable } from './data-table'
import { createDataTableColumns, type DataTableColumn } from './data-table-features'

interface Product {
  code: string
  name: string
  price: number
  labels: string[]
  quantity: number
}

const LABEL_POOL = ['Quality Product', 'Cheap', 'Fast Delivery', 'Popular', 'New Arrival']

const PRODUCTS: Product[] = Array.from({ length: 34 }, (_, index) => ({
  code: `P${String(index + 1).padStart(2, '0')}`,
  name: `Product ${index + 1}`,
  price: 500 + index * 137,
  labels: LABEL_POOL.slice(0, (index % 3) + 1),
  quantity: (index * 7) % 60,
}))

/**
 * The Actions trigger is the consumer's, not the table's. A real app would put
 * our `Menu` here; a plain button keeps the story focused on the table.
 */
const KebabButton = () => (
  <button
    type="button"
    aria-label="Row actions"
    className="inline-flex size-control-sm cursor-pointer items-center justify-center rounded-control text-text-subtle hover:bg-primary-wash-hover hover:text-text-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring-default"
  >
    <MoreVertical aria-hidden="true" className="size-icon-md" />
  </button>
)

const column = createDataTableColumns<Product>()

/** The screenshot's column set. `meta` carries every presentation decision. */
const COLUMNS = column.columns([
  column.accessor('code', { header: 'Code', meta: { sortLabel: 'Code', width: '6rem' } }),
  column.accessor('name', {
    header: 'Product Name',
    meta: { sortLabel: 'Product Name', width: '12rem' },
  }),
  column.accessor('price', {
    header: 'Price',
    meta: { align: 'right', sortLabel: 'Price', width: '8rem' },
    cell: ({ getValue }) => `${getValue()}DZD`,
  }),
  column.accessor('labels', {
    header: 'Labels',
    enableSorting: false,
    meta: { width: '20rem', maxWidth: '20rem', filterable: false, sortLabel: 'Labels' },
    cell: ({ getValue }) => (
      // The mockup clips these chips; capping the column and wrapping is the fix.
      <div className="flex flex-wrap gap-1">
        {getValue().map((label) => (
          <Badge key={label} size="sm">
            {label}
          </Badge>
        ))}
      </div>
    ),
  }),
  column.accessor('quantity', {
    header: 'Quantity',
    meta: { align: 'right', sortLabel: 'Quantity', width: '7rem' },
  }),
  column.display({
    id: 'actions',
    header: 'Actions',
    meta: { align: 'center', pinned: 'right', filterable: false, width: '6rem' },
    cell: () => <KebabButton />,
  }),
]) as DataTableColumn<Product>[]

const meta = {
  title: 'Components/DataTable',
  component: DataTable<Product>,
  argTypes: {
    sorting: { control: 'boolean' },
    selectable: { control: 'boolean' },
    pagination: { control: 'boolean' },
    globalFilter: { control: 'boolean' },
    columnFilters: { control: 'boolean' },
    striped: { control: 'boolean' },
    loading: { control: 'boolean' },
    pageSize: { control: 'number' },
  },
  args: {
    columns: COLUMNS,
    data: PRODUCTS,
    caption: 'Products',
    sorting: true,
    selectable: false,
    pagination: true,
    pageSize: 5,
    globalFilter: false,
    columnFilters: false,
    striped: false,
    loading: false,
  },
} satisfies Meta<typeof DataTable<Product>>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 1. The mockup, rebuilt: Code / Product Name / Price / Labels chips /
 * Quantity / pinned Actions. The chips wrap instead of being clipped.
 */
export const Screenshot: Story = {
  args: { pageSize: 5, pagination: true },
}

/** 2. Every prop wired to a control. */
export const Playground: Story = {
  args: { selectable: true, globalFilter: true, pageSize: 8 },
}

/** 3. Sorting cycles ascending → descending → none, with `aria-sort` on the `<th>`. */
export const Sorting: Story = {
  args: { sorting: true, pageSize: 8 },
}

/** 4. Row selection, including the indeterminate header box on a partial selection. */
export const RowSelection: Story = {
  render: (args) => {
    const [selected, setSelected] = useState<Product[]>([])
    return (
      <div className="flex flex-col gap-2">
        <DataTable
          {...args}
          selectable
          getRowId={(row) => row.code}
          onRowSelectionChange={setSelected}
        />
        <p className="text-xs text-text-subtle">
          Selected: {selected.length === 0 ? 'none' : selected.map((p) => p.code).join(', ')}
        </p>
      </div>
    )
  },
}

/** 5. Pagination through our own `<Pagination>`, with an "N of M" summary. */
export const Paginated: Story = {
  args: { pagination: true, pageSize: 5 },
}

/** 6. Debounced global search across every column except the checkbox. */
export const GlobalSearch: Story = {
  args: { globalFilter: true, pageSize: 5 },
}

/** 7. Per-column text filters in a second header row. */
export const ColumnFilters: Story = {
  args: { columnFilters: true, pageSize: 5 },
}

/** 8. Loading — `pageSize` skeleton rows, same columns, `aria-busy` on the table. */
export const Loading: Story = {
  args: { loading: true, pageSize: 5 },
}

/** 9. Empty because there is no data at all. */
export const EmptyNoData: Story = {
  args: { data: [], globalFilter: true },
}

/** 10. Empty because a filter matched nothing — different wording on purpose. */
export const EmptyNoMatches: Story = {
  args: { globalFilter: true, pageSize: 5 },
  render: (args) => (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-text-subtle">
        Type something like <code>zzz</code> in the search box.
      </p>
      <DataTable {...args} />
    </div>
  ),
}

/** 11. Striped rows plus selection, showing the precedence. */
export const StripedSelectable: Story = {
  args: { striped: true, selectable: true, pageSize: 6 },
}

/** 12. Everything on at once. */
export const FullFeatured: Story = {
  args: {
    selectable: true,
    globalFilter: true,
    columnFilters: true,
    striped: true,
    pageSize: 6,
  },
}

/**
 * 13. Dark mode. `striped` is passed on purpose: stripes are a light-mode
 * device, so every row here should sit on the default surface.
 */
export const DarkMode: Story = {
  parameters: { backgrounds: { disable: true } },
  render: (args) => (
    <div className="dark rounded-md bg-bg-default p-4">
      <DataTable {...args} selectable striped globalFilter pageSize={6} />
    </div>
  ),
}
