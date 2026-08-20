import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Badge } from '../badge'
import { Button } from '../button'
import { Input } from '../input'
import { Select } from '../select'
import { Textarea } from '../textarea'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogBody,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from './alert-dialog'
import { Dialog, DialogClose, DialogTrigger } from './dialog'
import { DialogContent } from './dialog-content'
import { DialogBody, DialogFooter, DialogHeader, DialogTitle } from './dialog-parts'
import type { DialogSize } from './dialog.styles'

const SIZES: DialogSize[] = ['sm', 'md', 'lg', 'xl', 'full']

const CATEGORIES = [
  { value: 'phone', label: 'Phone' },
  { value: 'laptop', label: 'Laptop' },
  { value: 'tablet', label: 'Tablet' },
  { value: 'accessory', label: 'Accessory' },
]

/** Paint the real surface token — Storybook's canvas is pure white. */
const withPage: Decorator = (Story) => (
  <div className="min-h-[24rem] bg-bg-default p-6">
    <Story />
  </div>
)

/** Stands in for a real chart, which is out of scope for this component. */
function ChartPlaceholder() {
  return (
    <div
      role="img"
      aria-label="Sales chart placeholder"
      className="flex h-[10rem] w-full items-end justify-around gap-2 rounded-control border border-border-subtle p-2"
    >
      {[30, 45, 38, 58, 78, 52, 64].map((value, index) => (
        <span
          key={index}
          style={{ height: `${value}%` }}
          className="w-full rounded-control bg-primary-fg"
        />
      ))}
    </div>
  )
}

const meta = {
  title: 'Components/Dialog',
  component: DialogContent,
  argTypes: {
    size: { control: 'inline-radio', options: SIZES },
    showClose: { control: 'boolean' },
  },
  args: { size: 'md', showClose: true },
  decorators: [withPage],
} satisfies Meta<typeof DialogContent>

export default meta
type Story = StoryObj<typeof meta>

/** 1. Every content prop wired to a control, plus the two dismiss switches. */
export const Playground: Story = {
  render: (args) => {
    const [backdrop, setBackdrop] = useState(true)
    const [escape, setEscape] = useState(true)
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-4 text-sm text-text-default">
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={backdrop}
              onChange={(event) => setBackdrop(event.target.checked)}
            />
            dismissOnBackdrop
          </label>
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={escape}
              onChange={(event) => setEscape(event.target.checked)}
            />
            dismissOnEscape
          </label>
        </div>

        <Dialog dismissOnBackdrop={backdrop} dismissOnEscape={escape}>
          <DialogTrigger asChild>
            <Button>Open dialog</Button>
          </DialogTrigger>
          <DialogContent {...args}>
            <DialogHeader>
              <DialogTitle>Dialog title</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <p className="text-sm text-text-default">
                Body content. Try Escape, a backdrop click, and Tab — focus cycles inside and
                returns to the trigger on close.
              </p>
            </DialogBody>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button>Confirm</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  },
}

/** 2. The "Add new product" form. Backdrop dismissal is off, to protect the entry. */
export const FormDialog: Story = {
  render: (args) => {
    const [labels, setLabels] = useState(['Quality Product', 'Cheap'])
    return (
      <Dialog dismissOnBackdrop={false}>
        <DialogTrigger asChild>
          <Button>Add new product</Button>
        </DialogTrigger>
        <DialogContent {...args} size="lg">
          <DialogHeader>
            <DialogTitle>Add new product</DialogTitle>
          </DialogHeader>

          <DialogBody>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Name" placeholder="Enter name here..." />
                <Select
                  label="Category"
                  options={CATEGORIES}
                  placeholder="Choose the product category..."
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[2fr_1fr_1fr]">
                <div className="flex flex-col gap-0">
                  <span className="text-sm font-medium text-text-default">Labels</span>
                  <div className="flex flex-wrap items-center gap-0 pt-0">
                    {labels.map((label) => (
                      <Badge
                        key={label}
                        size="sm"
                        shape="rounded"
                        onRemove={() => setLabels((all) => all.filter((entry) => entry !== label))}
                        removeLabel={`Remove ${label}`}
                      >
                        {label}
                      </Badge>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      iconOnly
                      icon={<span aria-hidden="true">+</span>}
                      aria-label="Add label"
                      onClick={() => setLabels((all) => [...all, `Label ${all.length + 1}`])}
                    />
                  </div>
                </div>
                <Input
                  label="Price"
                  placeholder="Enter price here..."
                  rightIcon={<span>DZD</span>}
                />
                <Input label="Quantity" type="number" placeholder="Quantity" />
              </div>

              <Textarea label="Description" placeholder="Enter description here..." rows={5} />
            </div>
          </DialogBody>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button>Create Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  },
}

/** 3. The "Product 1 Details" view — a long body that scrolls under a pinned header. */
export const DetailsDialog: Story = {
  render: (args) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View product details</Button>
      </DialogTrigger>
      <DialogContent {...args} size="lg">
        <DialogHeader>
          <DialogTitle>Product 1 Details</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Product Name" value="Product 1" />
              <Field label="Category" value="Phone" />
              <Field label="Quantity" value="63 phones" accent />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_2fr]">
              <Field label="Price" value="32 000 DZD" accent />
              <div className="flex flex-col gap-1">
                <span className="text-md font-bold text-text-default">Labels</span>
                <div className="flex flex-wrap gap-0">
                  <Badge size="sm" shape="rounded">
                    Quality Product
                  </Badge>
                  <Badge size="sm" shape="rounded">
                    Cheap
                  </Badge>
                  <Badge size="sm" shape="rounded">
                    Fast Delivery
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-md font-bold text-text-default">Description</span>
              <p className="text-sm text-text-default">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-md font-bold text-text-default">Product Sales this Month</span>
              <ChartPlaceholder />
            </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

function Field({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex flex-col gap-0">
      <span className="text-md font-bold text-text-default">{label}</span>
      <span className={accent ? 'text-sm text-primary-fg' : 'text-sm text-text-default'}>
        {value}
      </span>
    </div>
  )
}

/** 4. Every size, from sm to full. */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-2">
      {SIZES.map((size) => (
        <Dialog key={size}>
          <DialogTrigger asChild>
            <Button variant="outline">{size}</Button>
          </DialogTrigger>
          <DialogContent {...args} size={size}>
            <DialogHeader>
              <DialogTitle>size=&quot;{size}&quot;</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <p className="text-sm text-text-default">
                Every size is `w-full` and simply caps at its max-width, so the layer&apos;s own
                padding becomes the side margin on a narrow screen.
              </p>
            </DialogBody>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  ),
}

/** 5. `dismissOnBackdrop={false}` — a stray click cannot throw away entered data. */
export const ProtectedFromBackdrop: Story = {
  render: (args) => (
    <div className="flex gap-2">
      <Dialog dismissOnBackdrop>
        <DialogTrigger asChild>
          <Button variant="outline">Dismissable</Button>
        </DialogTrigger>
        <DialogContent {...args}>
          <DialogHeader>
            <DialogTitle>Backdrop closes this</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <p className="text-sm text-text-default">Click outside to dismiss.</p>
          </DialogBody>
        </DialogContent>
      </Dialog>

      <Dialog dismissOnBackdrop={false}>
        <DialogTrigger asChild>
          <Button>Protected</Button>
        </DialogTrigger>
        <DialogContent {...args}>
          <DialogHeader>
            <DialogTitle>Backdrop does nothing</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <p className="text-sm text-text-default">
              Escape and the X still work, so there is always a visible way out.
            </p>
          </DialogBody>
        </DialogContent>
      </Dialog>
    </div>
  ),
}

/** 6. Controlled open state beside the uncontrolled trigger form. */
export const ControlledAndUncontrolled: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setOpen(true)}>
            Open (controlled)
          </Button>
          <span className="text-xs text-text-subtle">open = {String(open)}</span>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent {...args}>
            <DialogHeader>
              <DialogTitle>Controlled</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <p className="text-sm text-text-default">State lives in the story.</p>
            </DialogBody>
            <DialogFooter>
              <Button onClick={() => setOpen(false)}>Done</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Open (uncontrolled)</Button>
          </DialogTrigger>
          <DialogContent {...args}>
            <DialogHeader>
              <DialogTitle>Uncontrolled</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <p className="text-sm text-text-default">The trigger owns it.</p>
            </DialogBody>
          </DialogContent>
        </Dialog>
      </div>
    )
  },
}

/** 7. Nested dialogs — Escape peels one layer at a time, scroll stays locked until both close. */
export const Nested: Story = {
  render: (args) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open the first</Button>
      </DialogTrigger>
      <DialogContent {...args}>
        <DialogHeader>
          <DialogTitle>First dialog</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p className="text-sm text-text-default">
            Open the second, then press Escape once. Only the top one closes, and the page behind
            stays locked until both are gone.
          </p>
        </DialogBody>
        <DialogFooter>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open the second</Button>
            </DialogTrigger>
            <DialogContent {...args} size="sm">
              <DialogHeader>
                <DialogTitle>Second dialog</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <p className="text-sm text-text-default">
                  This one sits a step above its opener and takes Escape first.
                </p>
              </DialogBody>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost">Back</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <DialogClose asChild>
            <Button variant="ghost">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

/** 8. AlertDialog — no X, backdrop does nothing, and focus lands on Cancel. */
export const Alert: Story = {
  render: () => {
    const [deleted, setDeleted] = useState(false)
    return (
      <div className="flex flex-col gap-2">
        <AlertDialog>
          <DialogTrigger asChild>
            <Button variant="outline">Delete product</Button>
          </DialogTrigger>
          <AlertDialogContent>
            <AlertDialogBody>
              <AlertDialogTitle className="text-text-default">
                Delete this product?
              </AlertDialogTitle>
              <AlertDialogDescription className="pt-1">
                This removes Product 1 and its sales history. It cannot be undone.
              </AlertDialogDescription>
            </AlertDialogBody>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button variant="ghost">Cancel</Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild onClick={() => setDeleted(true)}>
                <Button>Delete</Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <p className="text-xs text-text-subtle">
          {deleted
            ? 'Deleted.'
            : 'Nothing deleted yet. Open it and press Enter — Cancel has focus.'}
        </p>
      </div>
    )
  },
}

/** 9. The set under a `.dark` wrapper — the portal carries the theme across. */
export const DarkMode: Story = {
  render: (args) => (
    <div className="dark flex flex-wrap gap-2 rounded-md bg-bg-default p-8 text-text-default">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open dialog</Button>
        </DialogTrigger>
        <DialogContent {...args}>
          <DialogHeader>
            <DialogTitle>Dark dialog</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <p className="text-sm text-text-default">
              The panel portals to `document.body`, outside the `.dark` wrapper, so the theme is
              mirrored onto the portalled node.
            </p>
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button>Confirm</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog>
        <DialogTrigger asChild>
          <Button variant="outline">Open alert</Button>
        </DialogTrigger>
        <AlertDialogContent>
          <AlertDialogBody>
            <AlertDialogTitle className="text-text-default">Discard changes?</AlertDialogTitle>
            <AlertDialogDescription className="pt-1">
              Your edits will be lost.
            </AlertDialogDescription>
          </AlertDialogBody>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="ghost">Keep editing</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button>Discard</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  ),
}
