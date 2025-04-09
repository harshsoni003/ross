/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Add any custom colors here
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundColor: {
        'gray-900': '#111827',
        'gray-800': '#1f2937',
        'gray-700': '#374151',
      },
      textColor: {
        'white': '#ffffff',
        'gray-300': '#d1d5db',
        'gray-400': '#9ca3af',
      }
    },
  },
  plugins: [],
  safelist: [
    'bg-gray-900',
    'bg-gray-800',
    'bg-gray-700',
    'text-white',
    'text-gray-300',
    'text-gray-400',
    'flex',
    'flex-col',
    'h-screen',
    'w-full'
  ]
} 