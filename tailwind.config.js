/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Add classes here to avoid "unknown utility class" errors during build
    'border-border', // Safelist this class to prevent errors like "Cannot apply unknown utility class 'border-border'"
  ],
  theme: {
    extend: {
      colors: {
        ...defaultTheme.colors,
        // Using CSS variables for dynamic theming
        border: 'var(--border)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        popover: 'var(--popover)',
        'popover-foreground': 'var(--popover-foreground)',
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        secondary: 'var(--secondary)',
        'secondary-foreground': 'var(--secondary-foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        accent: 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
        destructive: 'var(--destructive)',
        input: 'var(--input)',
        sidebar: 'var(--sidebar)',
        'sidebar-foreground': 'var(--sidebar-foreground)',
        'sidebar-primary': 'var(--sidebar-primary)',
        'sidebar-primary-foreground': 'var(--sidebar-primary-foreground)',
        'sidebar-accent': 'var(--sidebar-accent)',
        'sidebar-accent-foreground': 'var(--sidebar-accent-foreground)',
        'sidebar-border': 'var(--sidebar-border)',
        'sidebar-ring': 'var(--sidebar-ring)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};

/*
  Error handling notes:
  - The `safelist` option is used here to avoid errors caused by dynamically generated or unknown utility classes at build time.
  - Add any other utility classes you dynamically generate or expect but are not directly referenced in your source files.
  - This approach prevents the build from failing with errors like:
    "Cannot apply unknown utility class `border-border`"
  - For runtime error handling in your build scripts, consider wrapping build commands in try/catch (outside of this config).
*/
