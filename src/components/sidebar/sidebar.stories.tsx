import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Blocks,
  ChartNoAxesColumn,
  LayoutDashboard,
  Menu as MenuIcon,
  Settings,
  ShoppingBag,
  ShoppingBasket,
  User,
  Users,
  UserSearch,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'

import logoFull from '../../assets/logo/simplyui-logo-full.svg'
import logoIcon from '../../assets/logo/simplyui-logo-icon.svg'
import { Sidebar } from './sidebar'
import { SidebarContent } from './sidebar-content'
import { SidebarFooter } from './sidebar-footer'
import { SidebarGroup } from './sidebar-group'
import { SidebarHeader } from './sidebar-header'
import { SidebarItem } from './sidebar-item'

/** The brand mark, as a consumer would pass it — the component ships no asset. */
const BrandLogo = () => <img src={logoFull} alt="SimplyUI" className="h-8 w-auto" />
const BrandMark = () => <img src={logoIcon} alt="SimplyUI" className="h-7 w-auto" />

const GENERAL = [
  { label: 'Dashboard', icon: <LayoutDashboard /> },
  { label: 'Products', icon: <ShoppingBag /> },
  { label: 'Orders', icon: <ShoppingBasket /> },
  { label: 'Categories', icon: <Blocks /> },
]

const ADMIN = [
  { label: 'Customers', icon: <UserSearch /> },
  { label: 'Analytics', icon: <ChartNoAxesColumn /> },
  { label: 'Users', icon: <Users /> },
]

const ACCOUNT = [
  { label: 'Profile', icon: <User /> },
  { label: 'Settings', icon: <Settings /> },
]

/** Gives the sidebar a real height to fill — it is `h-full`, not `h-screen`. */
function Frame({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <div className={dark ? 'dark' : undefined}>
      <div className="flex h-[40rem] overflow-hidden rounded-md bg-bg-default">{children}</div>
    </div>
  )
}

/** The full nav from the mockup, driven by whatever collapse state is passed. */
function Nav({ active = 'Dashboard' }: { active?: string }) {
  return (
    <>
      <SidebarHeader logo={<BrandLogo />} logoCollapsed={<BrandMark />} />
      <SidebarContent>
        <SidebarGroup label="General">
          {GENERAL.map((item) => (
            <SidebarItem
              key={item.label}
              href="#"
              icon={item.icon}
              label={item.label}
              active={item.label === active}
            />
          ))}
        </SidebarGroup>
        <SidebarGroup label="Admin Panel">
          {ADMIN.map((item) => (
            <SidebarItem
              key={item.label}
              href="#"
              icon={item.icon}
              label={item.label}
              active={item.label === active}
            />
          ))}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup label="Account">
          {ACCOUNT.map((item) => (
            <SidebarItem
              key={item.label}
              href="#"
              icon={item.icon}
              label={item.label}
              active={item.label === active}
            />
          ))}
        </SidebarGroup>
      </SidebarFooter>
    </>
  )
}

const meta = {
  title: 'Components/Sidebar',
  component: Sidebar,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    defaultCollapsed: { control: 'boolean' },
    expandedWidth: { control: 'text' },
    collapsedWidth: { control: 'text' },
  },
  args: { defaultCollapsed: false, expandedWidth: '280px', collapsedWidth: '72px' },
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

/** 1. Every prop wired to a control. Toggle collapse from the header button. */
export const Playground: Story = {
  render: (args) => (
    <Frame>
      <Sidebar {...args}>
        <Nav />
      </Sidebar>
      <main className="flex-1 p-4 text-sm text-text-default">Page content.</main>
    </Frame>
  ),
}

/** 2. Expanded, with the real brand logo and all three groups. */
export const Expanded: Story = {
  render: (args) => (
    <Frame>
      <Sidebar expandedWidth={args.expandedWidth}>
        <Nav />
      </Sidebar>
      <main className="flex-1 p-4 text-sm text-text-default">Page content.</main>
    </Frame>
  ),
}

/**
 * 3. Collapsed: icons only at 72px. Group headings drop out of the layout, and
 * each item carries its label as a native `title` — the Tooltip stopgap.
 */
export const Collapsed: Story = {
  render: (args) => (
    <Frame>
      <Sidebar defaultCollapsed collapsedWidth={args.collapsedWidth}>
        <Nav />
      </Sidebar>
      <main className="flex-1 p-4 text-sm text-text-default">Hover an icon to see the label.</main>
    </Frame>
  ),
}

/** 4. Side by side, the way the mockup shows them. */
export const ExpandedAndCollapsed: Story = {
  render: () => (
    <Frame>
      <Sidebar expandedWidth="280px">
        <Nav />
      </Sidebar>
      <Sidebar defaultCollapsed>
        <Nav />
      </Sidebar>
      <main className="flex-1 p-4 text-sm text-text-default">Page content.</main>
    </Frame>
  ),
}

/** 5. Item states: default, active (filled), disabled. */
export const ItemStates: Story = {
  render: () => (
    <Frame>
      <Sidebar expandedWidth="280px">
        <SidebarHeader logo={<BrandLogo />} logoCollapsed={<BrandMark />} />
        <SidebarContent>
          <SidebarGroup label="States">
            <SidebarItem href="#" icon={<LayoutDashboard />} label="Default — hover me" />
            <SidebarItem href="#" icon={<ShoppingBag />} label="Active (aria-current)" active />
            <SidebarItem href="#" icon={<ShoppingBasket />} label="Disabled" disabled />
            <SidebarItem href="#" icon={<Blocks />} label="Tab to me for the focus ring" />
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main className="flex-1 p-4 text-sm text-text-default">
        The disabled row drops its href, so it is neither focusable nor clickable.
      </main>
    </Frame>
  ),
}

/** 6. Footer pinned to the bottom by `mt-auto`, even with a short nav. */
export const PinnedFooter: Story = {
  render: () => (
    <Frame>
      <Sidebar expandedWidth="280px">
        <SidebarHeader logo={<BrandLogo />} logoCollapsed={<BrandMark />} />
        <SidebarContent>
          <SidebarGroup label="General">
            <SidebarItem href="#" icon={<LayoutDashboard />} label="Dashboard" active />
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarGroup label="Account">
            {ACCOUNT.map((item) => (
              <SidebarItem key={item.label} href="#" icon={item.icon} label={item.label} />
            ))}
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>
      <main className="flex-1 p-4 text-sm text-text-default">
        One nav item, footer still at the bottom.
      </main>
    </Frame>
  ),
}

/**
 * 7. Mobile off-canvas. Resize the preview below 768px — the inline sidebar
 * disappears and the hamburger opens it as a modal drawer: backdrop, focus
 * trap, Escape and backdrop-click to dismiss, focus returned to the button.
 */
export const MobileOffCanvas: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <Frame>
        <Sidebar mobileOpen={open} onMobileOpenChange={setOpen} expandedWidth="280px">
          <Nav />
        </Sidebar>
        <main className="flex flex-1 flex-col gap-2 p-4 text-sm text-text-default">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex w-fit cursor-pointer items-center gap-1 rounded-control border border-border-default px-2 py-1 text-sm font-medium text-text-default hover:bg-primary-wash-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring-default"
          >
            <MenuIcon className="size-icon-md" aria-hidden="true" />
            Open navigation
          </button>
          <p>Below the md breakpoint the sidebar only exists as this drawer.</p>
        </main>
      </Frame>
    )
  },
}

/**
 * 8. `asChild` merges the item's props into a router link instead of rendering
 * an `<a>`. `MockLink` stands in for `react-router`'s `Link` / `next/link`.
 */
export const RouterLinks: Story = {
  render: () => {
    const MockLink = ({ to, children, ...rest }: { to: string; children?: ReactNode }) => (
      <a href={to} data-router-link="true" {...rest}>
        {children}
      </a>
    )
    return (
      <Frame>
        <Sidebar expandedWidth="280px">
          <SidebarHeader logo={<BrandLogo />} logoCollapsed={<BrandMark />} />
          <SidebarContent>
            <SidebarGroup label="General">
              <SidebarItem asChild icon={<LayoutDashboard />} label="Dashboard" active>
                <MockLink to="/dashboard" />
              </SidebarItem>
              <SidebarItem asChild icon={<ShoppingBag />} label="Products">
                <MockLink to="/products" />
              </SidebarItem>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 p-4 text-sm text-text-default">
          Both rows render the router component, keeping its `href`, while the icon, label, styling
          and <code>aria-current</code> come from SidebarItem.
        </main>
      </Frame>
    )
  },
}

/** 9. Dark mode, expanded and collapsed. */
export const DarkMode: Story = {
  parameters: { backgrounds: { disable: true } },
  render: () => (
    <Frame dark>
      <Sidebar expandedWidth="280px">
        <Nav />
      </Sidebar>
      <Sidebar defaultCollapsed>
        <Nav />
      </Sidebar>
      <main className="flex-1 p-4 text-sm text-text-default">Page content.</main>
    </Frame>
  ),
}
