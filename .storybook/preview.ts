import type { Preview } from '@storybook/react-vite'

import '../src/styles/theme.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // Fail the story on accessibility violations rather than merely reporting
      // them. We target WCAG AA, so regressions should be loud.
      test: 'error',
    },
  },
}

export default preview
