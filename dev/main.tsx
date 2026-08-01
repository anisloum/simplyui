/**
 * Local dev harness (`pnpm dev`). Not part of the published package — it exists
 * to poke at components in a real browser outside of Storybook. Scratch space:
 * feel free to rewrite the body of <Harness /> at will.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '../src/styles/theme.css'
import { cn } from '../src/lib/cn'

function Harness() {
  return (
    <main className={cn('mx-auto flex min-h-dvh max-w-2xl flex-col justify-center gap-2 p-8')}>
      <h1 className="text-2xl font-semibold">SimplyUI dev harness</h1>
      <p>Tailwind and the token stylesheet are wired up. Nothing else is built yet.</p>
    </main>
  )
}

const container = document.getElementById('root')
if (!container) throw new Error('Root element #root not found')

createRoot(container).render(
  <StrictMode>
    <Harness />
  </StrictMode>,
)
