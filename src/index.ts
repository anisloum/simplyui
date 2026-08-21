/**
 * SimplyUI — public API barrel.
 *
 * Every component gets re-exported from here, one line per component, kept in
 * alphabetical order. See CONTRIBUTING.md.
 */

// Shared utilities
export { cn, type ClassValue } from './lib/cn'
export { Slot, type SlotProps } from './lib/slot'
export { useDismissableLayer, type UseDismissableLayerOptions } from './lib/use-dismissable-layer'
export { useMediaQuery } from './lib/use-media-query'

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
export {
  Card,
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
  CardHint,
  CardTitle,
  StatCard,
  type CardBodyProps,
  type CardDescriptionProps,
  type CardFooterProps,
  type CardHeaderProps,
  type CardHintProps,
  type CardPadding,
  type CardProps,
  type CardTitleProps,
  type CardVariant,
  type StatCardProps,
} from './components/card'
export { Checkbox, type CheckboxProps } from './components/checkbox'
export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogBody,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  type AlertDialogActionProps,
  type AlertDialogCancelProps,
  type AlertDialogContentProps,
  type AlertDialogProps,
  type DialogBodyProps,
  type DialogCloseProps,
  type DialogContentProps,
  type DialogDescriptionProps,
  type DialogFooterProps,
  type DialogHeaderProps,
  type DialogProps,
  type DialogSize,
  type DialogTitleProps,
  type DialogTriggerProps,
} from './components/dialog'
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
  createDataTableColumns,
  DataTable,
  DataTablePagination,
  DataTableToolbar,
  dataTableFeatures,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  type DataTableColumn,
  type DataTableColumnMeta,
  type DataTableFeatures,
  type DataTablePaginationProps,
  type DataTableProps,
  type DataTableToolbarProps,
  type TableAlign,
  type TableBodyProps,
  type TableCaptionProps,
  type TableCellProps,
  type TableFooterProps,
  type TableHeadProps,
  type TableHeaderProps,
  type TablePinned,
  type TableProps,
  type TableRowProps,
} from './components/table'
export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  type SidebarContentProps,
  type SidebarFooterProps,
  type SidebarGroupProps,
  type SidebarHeaderProps,
  type SidebarItemProps,
  type SidebarProps,
} from './components/sidebar'
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
