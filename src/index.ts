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
