/** @type {import('postcss-load-config').Config} */
export default {
  plugins: {
    // Tailwind v4 ships its own PostCSS plugin; autoprefixer is no longer needed.
    '@tailwindcss/postcss': {},
  },
}
