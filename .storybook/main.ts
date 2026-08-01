import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../.storybook/**/*.mdx', '../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
    // Runs axe-core against every story — our WCAG AA safety net.
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    // Generates prop tables in docs from TypeScript types.
    reactDocgen: 'react-docgen-typescript',
  },
}

export default config
