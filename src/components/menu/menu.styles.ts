import { cn } from '../../lib/cn'

export const contentStyles = cn(
  'z-dropdown flex flex-col items-center overflow-y-auto rounded-md border border-border-subtle bg-bg-default px-[0.5rem] py-1 shadow-md',
  'animate-dropdown min-w-[10rem] scrollbar-subtle outline-none',
)

export type MenuItemVariant = 'default' | 'destructive'

export function itemStyles({ variant = 'default' }: { variant?: MenuItemVariant } = {}) {
  return cn(
    'flex h-[2.5rem] w-full items-center gap-2 rounded-sm px-3 outline-none select-none',
    'cursor-pointer text-sm font-medium transition-colors duration-150 ease-out motion-reduce:transition-none',
    variant === 'destructive'
      ? 'text-error-subtle hover:bg-error-subtle hover:text-bg-default focus-visible:bg-error-subtle focus-visible:text-bg-default'
      : 'text-text-default hover:bg-bg-subtle focus-visible:bg-bg-subtle',
    'disabled:cursor-not-allowed disabled:text-text-disabled disabled:hover:bg-transparent',
  )
}

export const menuButtonStyles = 'text-text-subtle rounded-sm'

export const separatorStyles = 'my-1 h-px w-[90%] bg-border-subtle border-0 rounded-sm'

export const iconStyles = 'flex size-icon-md shrink-0 items-center justify-center [&>svg]:size-full'
