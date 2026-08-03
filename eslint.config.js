import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactHooks from 'eslint-plugin-react-hooks'
import storybook from 'eslint-plugin-storybook'
import prettier from 'eslint-config-prettier'

export default tseslint.config(
  {
    ignores: ['dist/**', 'storybook-static/**', 'coverage/**', 'node_modules/**'],
  },

  js.configs.recommended,

  // Type-aware linting for all TypeScript sources.
  {
    files: ['**/*.{ts,tsx}'],
    extends: [...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  // React hooks rules (rules-of-hooks + exhaustive-deps).
  // Note: `configs.flat.*`, not the top-level `configs.*` (those are eslintrc format).
  reactHooks.configs.flat.recommended,

  // Accessibility. We target WCAG AA, so these are errors, not warnings.
  jsxA11y.flatConfigs.recommended,

  // Storybook-specific rules, scoped to story files by the plugin itself.
  ...storybook.configs['flat/recommended'],

  // Config files and build scripts run in Node and are not covered by the
  // type-aware program.
  {
    files: ['*.config.{ts,js,mjs}', '.storybook/**/*.{ts,tsx}', 'scripts/**/*.{js,mjs}'],
    languageOptions: { globals: globals.node },
  },

  // Must stay last: turns off everything that fights Prettier.
  prettier,
)
