/**
 * SimplyUI — public API barrel.
 *
 * Every component gets re-exported from here, one line per component, kept in
 * alphabetical order. See CONTRIBUTING.md.
 */

// Shared utilities
export { cn, type ClassValue } from './lib/cn'
export { Slot, type SlotProps } from './lib/slot'

// Components
export {
  Badge,
  type BadgeIntent,
  type BadgeProps,
  type BadgeSize,
  type BadgeVariant,
} from './components/badge'
export {
  Breadcrumbs,
  collapseItems,
  type BreadcrumbItem,
  type BreadcrumbsProps,
} from './components/breadcrumbs'
export { Checkbox, type CheckboxProps } from './components/checkbox'
export {
  getPaginationRange,
  PAGINATION_ELLIPSIS,
  Pagination,
  usePaginationRange,
  type PaginationItem,
  type PaginationProps,
  type PaginationRangeOptions,
} from './components/pagination'
export {
  Steps,
  type Step,
  type StepsOrientation,
  type StepsProps,
  type StepStatus,
} from './components/steps'
export {
  Tab,
  TabList,
  TabPanel,
  Tabs,
  type TabListProps,
  type TabPanelProps,
  type TabProps,
  type TabsProps,
  type TabsVariant,
} from './components/tabs'
export {
  Radio,
  RadioGroup,
  type RadioGroupProps,
  type RadioOrientation,
  type RadioProps,
} from './components/radio'
export {
  Select,
  usePopover,
  type PopoverPlacement,
  type PopoverPosition,
  type SelectOption,
  type SelectProps,
  type SelectStatus,
  type SelectValidationStatus,
  type UsePopoverOptions,
} from './components/select'
export { Switch, type SwitchLabelPosition, type SwitchProps } from './components/switch'
export {
  Button,
  buttonStyles,
  type ButtonProps,
  type ButtonSize,
  type ButtonStyleOptions,
  type ButtonVariant,
} from './components/button'
export {
  Input,
  type InputProps,
  type InputStatus,
  type InputValidationStatus,
} from './components/input'
export {
  Textarea,
  type TextareaProps,
  type TextareaResize,
  type TextareaStatus,
  type TextareaValidationStatus,
} from './components/textarea'
