const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  mode: "jit",
  darkMode: "media",
  content: ["./app/**/*.{ts,tsx,jsx,js}", "../../node_modules/ui/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      typography: ({ theme }) => ({
        DEFAULT: {               
          css: {
            '--tw-prose-p': theme('colors.gray[800]'),
            '--tw-prose-headings': theme('colors.gray[600]'),
            '--tw-prose-lead': theme('colors.gray[600]'),
            '--tw-prose-links': theme('colors.sky[600]'),
            '--tw-prose-bold': theme('colors.gray[600]'),
            '--tw-prose-counters': theme('colors.gray[600]'),
            '--tw-prose-bullets': theme('colors.gray[600]'),
            '--tw-prose-hr': theme('colors.gray[300]'),
            '--tw-prose-quotes': theme('colors.gray[600]'),
            '--tw-prose-quote-borders': theme('colors.gray[600]'),
            '--tw-prose-captions': theme('colors.gray[600]'),
            '--tw-prose-code': theme('colors.gray[600]'),
            '--tw-prose-pre-code': theme('colors.gray[300]'),
            '--tw-prose-pre-bg': theme('colors.gray[800]'),
            '--tw-prose-th-borders': theme('colors.gray[600]'),
            '--tw-prose-td-borders': theme('colors.gray[600]'),
            '--tw-prose-invert-p': theme('colors.gray[800]'),
            '--tw-prose-invert-headings': '#D1D1D1',
            '--tw-prose-invert-lead': theme('colors.gray[200]'),
            '--tw-prose-invert-links': theme('colors.sky[600]'),
            '--tw-prose-invert-bold': theme('colors.white'),
            '--tw-prose-invert-counters': theme('colors.gray[200]'),
            '--tw-prose-invert-bullets': theme('colors.gray[200]'),
            '--tw-prose-invert-hr': theme('colors.gray[200]'),
            '--tw-prose-invert-quotes': theme('colors.gray[200]'),
            '--tw-prose-invert-quote-borders': theme('colors.gray[200]'),
            '--tw-prose-invert-captions': theme('colors.gray[200]'),
            '--tw-prose-invert-code': theme('colors.gray[200]'),
            '--tw-prose-invert-pre-code': theme('colors.gray[200]'),
            '--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 50%)',
            '--tw-prose-invert-th-borders': theme('colors.gray[200]'),
            '--tw-prose-invert-td-borders': theme('colors.gray[200]'),
          },
        }, 
      }),
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      colors: {      
        'light': "#FAFAFA",
        'dark': "#303131", 
      },
      textColor: {
        "light": "#111827",
        "light-accent": "#6B7280",
        "dark": "#D1D1D1",
        "dark-accent": "#A5A7AD",
      }
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),    
  ]
};