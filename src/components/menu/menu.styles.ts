import { cn } from '../../lib/cn'

export const contentStyles = cn(
  'flex flex-col items-center z-dropdown overflow-y-auto rounded-md px-[0.5rem] bg-bg-default py-1 shadow-md',
  'scrollbar-subtle outline-none animate-dropdown min-w-[10rem]',
)

export type MenuItemVariant = 'default' | 'destructive'

export function itemStyles({ variant = 'default' }: { variant?: MenuItemVariant } = {}) {
  return cn(
    'flex h-[2.5rem] rounded-sm w-full select-none items-center gap-2 px-3 outline-none',
    'text-sm font-medium transition-colors duration-150 ease-out motion-reduce:transition-none cursor-pointer',
    variant === 'destructive'
      ? 'text-error-subtle hover:text-bg-default hover:bg-error-subtle focus-visible:bg-error-subtle focus-visible:text-bg-default'
      : 'text-text-default hover:bg-bg-subtle focus-visible:bg-bg-subtle',
    'disabled:cursor-not-allowed disabled:text-text-disabled disabled:hover:bg-transparent',
  )
}

export const menuButtonStyles = 'text-text-subtle rounded-sm'

export const separatorStyles = 'my-1 h-px w-[90%] bg-border-subtle border-0 rounded-sm'

export const iconStyles = 'flex size-icon-md shrink-0 items-center justify-center [&>svg]:size-full'
