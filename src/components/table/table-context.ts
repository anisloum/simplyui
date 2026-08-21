import { createContext, useContext } from 'react'

export interface TableContextValue {
  striped: boolean
  stickyHeader: boolean
}

/**
 * Defaulted rather than nullable: unlike Tabs or Sidebar, the table parts are
 * plain styled elements that stay meaningful on their own. A `<TableRow>` lifted
 * into some other markup should render, not throw.
 */
export const TableContext = createContext<TableContextValue>({
  striped: false,
  stickyHeader: false,
})

export function useTableContext(): TableContextValue {
  return useContext(TableContext)
}
