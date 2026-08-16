import React, {
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'

import { cn } from '../../lib/cn'
import { Slot } from '../../lib/slot'
import { usePopover } from '../../lib/use-popover'
import { Button, type ButtonProps } from '../button'
import {
  contentStyles,
  iconStyles,
  itemStyles,
  separatorStyles,
  menuButtonStyles,
  type MenuItemVariant,
} from './menu.styles'

interface MenuContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  anchorRef: React.RefObject<HTMLElement | null>
  menuId: string
  triggerId: string
}

const MenuContext = createContext<MenuContextValue | null>(null)

function useMenuContext(component: string) {
  const context = useContext(MenuContext)
  if (!context) {
    throw new Error(`<${component}> must be used within a <Menu>`)
  }
  return context
}

export interface MenuProps extends Omit<ButtonProps, 'children'> {
  children: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  icon?: ReactNode
}

export function Menu({ children, open: controlledOpen, onOpenChange, icon, ...buttonProps }: MenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) setUncontrolledOpen(nextOpen)
      onOpenChange?.(nextOpen)
    },
    [isControlled, onOpenChange],
  )

  const anchorRef = useRef<HTMLElement>(null)
  const generatedId = useId()
  const menuId = `${generatedId}-menu`
  const triggerId = `${generatedId}-trigger`

  return (
    <MenuContext.Provider value={{ open, setOpen, anchorRef, menuId, triggerId }}>
      <MenuTrigger asChild>
        <Button className={cn(buttonProps.className, menuButtonStyles)} variant="ghost" iconOnly icon={icon} {...buttonProps} />
      </MenuTrigger>
      <MenuContent>{children}</MenuContent>
    </MenuContext.Provider>
  )
}

export interface MenuTriggerProps extends ComponentPropsWithRef<'button'> {
  asChild?: boolean
}

export function MenuTrigger({ asChild, children, onClick, onKeyDown, ...rest }: MenuTriggerProps) {
  const { open, setOpen, anchorRef, menuId, triggerId } = useMenuContext('MenuTrigger')
  const Comp = asChild ? Slot : 'button'

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e)
    setOpen(!open)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(e)
    if (
      !open &&
      (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp')
    ) {
      e.preventDefault()
      setOpen(true)
    }
  }

  return (
    <Comp
      {...rest}
      ref={anchorRef as React.Ref<HTMLButtonElement>}
      id={triggerId}
      aria-haspopup="menu"
      aria-expanded={open}
      aria-controls={open ? menuId : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {children}
    </Comp>
  )
}

export type MenuContentProps = ComponentPropsWithRef<'div'>

export function MenuContent({ children, className, ...rest }: MenuContentProps) {
  const { open, setOpen, anchorRef, menuId, triggerId } = useMenuContext('MenuContent')
  const contentRef = useRef<HTMLDivElement>(null)
  const [darkContext, setDarkContext] = useState(false)

  const popover = usePopover({
    open,
    anchorRef,
    popoverRef: contentRef,
    offset: 8,
    onDismiss: useCallback(() => setOpen(false), [setOpen]),
  })

  useEffect(() => {
    if (open && anchorRef.current) {
      setDarkContext(anchorRef.current.closest('.dark') != null)
    }
  }, [open, anchorRef])

  useEffect(() => {
    if (open) {
      const frame = requestAnimationFrame(() => {
        if (!contentRef.current) return
        const firstItem = contentRef.current.querySelector<HTMLElement>(
          '[role="menuitem"]:not([disabled])',
        )
        firstItem?.focus()
      })
      return () => cancelAnimationFrame(frame)
    } else {
      anchorRef.current?.focus()
    }
  }, [open, anchorRef])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!open) return

    const items = Array.from(
      contentRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])') || [],
    )
    if (items.length === 0) return

    const currentIndex = items.indexOf(document.activeElement as HTMLElement)

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (currentIndex < items.length - 1) items[currentIndex + 1]?.focus()
        else items[0]?.focus()
        break
      case 'ArrowUp':
        e.preventDefault()
        if (currentIndex > 0) items[currentIndex - 1]?.focus()
        else items[items.length - 1]?.focus()
        break
      case 'Home':
        e.preventDefault()
        items[0]?.focus()
        break
      case 'End':
        e.preventDefault()
        items[items.length - 1]?.focus()
        break
      case 'Escape':
      case 'Tab':
        e.preventDefault()
        setOpen(false)
        anchorRef.current?.focus()
        break
    }
  }

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div
      {...rest}
      ref={contentRef}
      id={menuId}
      role="menu"
      tabIndex={-1}
      aria-labelledby={triggerId}
      className={cn(darkContext && 'dark', contentStyles, className)}
      onKeyDown={handleKeyDown}
      style={{
        position: 'fixed',
        top: popover?.top ?? -9999,
        left: popover?.left ?? -9999,
        minWidth: popover?.width,
        maxHeight: popover?.maxHeight ?? Number.POSITIVE_INFINITY,
        visibility: popover ? 'visible' : 'hidden',
        ...rest.style,
      }}
    >
      {children}
    </div>,
    document.body,
  )
}

export interface MenuItemProps extends ComponentPropsWithRef<'button'> {
  variant?: MenuItemVariant
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  asChild?: boolean
}

export function MenuItem({
  variant = 'default',
  leftIcon,
  rightIcon,
  className,
  children,
  asChild,
  onClick,
  disabled,
  ...rest
}: MenuItemProps) {
  const { setOpen } = useMenuContext('MenuItem')

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      e.preventDefault()
      return
    }
    onClick?.(e)
    setOpen(false)
  }

  const renderContent = (label: ReactNode) => (
    <>
      {leftIcon ? (
        <span aria-hidden="true" className={iconStyles}>
          {leftIcon}
        </span>
      ) : null}
      <span className="flex-1 truncate text-left">{label}</span>
      {rightIcon ? (
        <span aria-hidden="true" className={iconStyles}>
          {rightIcon}
        </span>
      ) : null}
    </>
  )

  const classes = cn(itemStyles({ variant }), className)

  if (asChild) {
    const childElement = isValidElement<{ children?: ReactNode }>(children) ? children : null
    return (
      <Slot
        {...rest}
        role="menuitem"
        tabIndex={-1}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        className={classes}
        onClick={handleClick}
      >
        {childElement
          ? cloneElement(
              childElement as React.ReactElement<{ children?: ReactNode }>,
              undefined,
              renderContent(childElement.props.children),
            )
          : children}
      </Slot>
    )
  }

  return (
    <button
      {...rest}
      type="button"
      role="menuitem"
      tabIndex={-1}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      className={classes}
      onClick={handleClick}
    >
      {renderContent(children)}
    </button>
  )
}

export type MenuSeparatorProps = ComponentPropsWithRef<'hr'>

export function MenuSeparator({ className, ...rest }: MenuSeparatorProps) {
  return <hr {...rest} aria-orientation="horizontal" className={cn(separatorStyles, className)} />
}
