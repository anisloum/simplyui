import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Input } from '../input'

export interface DataTableToolbarProps {
  /** Current committed value, so the field stays right when cleared externally. */
  value: string
  onValueChange: (value: string) => void
  /** Debounce before committing, in ms. @default 200 */
  debounceMs?: number
  placeholder?: string
  /** Visually-hidden label for the field. @default "Search table" */
  label?: string
}

/**
 * The global search field.
 *
 * Keeps its own immediate value so typing never feels laggy, and commits
 * upstream on a debounce — filtering re-runs the row model over every row, and
 * doing that per keystroke is what makes big tables stutter.
 */
export function DataTableToolbar({
  value,
  onValueChange,
  debounceMs = 200,
  placeholder = 'Search…',
  label = 'Search table',
}: DataTableToolbarProps) {
  const [draft, setDraft] = useState(value)
  const [lastCommitted, setLastCommitted] = useState(value)

  // Re-sync when the committed value changes from elsewhere (a reset button, a
  // controlled parent) without clobbering what is being typed right now.
  // Adjusted during render rather than in an effect: React re-runs this
  // component before touching the DOM, so there is no intermediate paint of the
  // stale value and no cascading render.
  if (value !== lastCommitted) {
    setLastCommitted(value)
    setDraft(value)
  }

  useEffect(() => {
    if (draft === value) return
    const timer = setTimeout(() => onValueChange(draft), debounceMs)
    return () => clearTimeout(timer)
  }, [draft, value, debounceMs, onValueChange])

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="w-full max-w-[20rem]">
        <Input
          type="search"
          aria-label={label}
          placeholder={placeholder}
          leftIcon={<Search aria-hidden="true" />}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
      </div>
    </div>
  )
}
