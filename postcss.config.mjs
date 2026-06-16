/**
 * PostCSS Configuration
 *
 * Tailwind CSS v4 is wired into Next.js via the dedicated PostCSS plugin.
 * (The old Vite setup used `@tailwindcss/vite`; under Next we use PostCSS.)
 */
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
