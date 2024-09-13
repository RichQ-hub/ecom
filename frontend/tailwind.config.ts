/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'ecom-brand': '#F3FF6A',
        'ecom-light-blue': {
          DEFAULT: '#66c0f4',
          900: '#529ac3',
        },
        'ecom-header-blue': '#142948',
        'ecom-nav-bg': '#0E141B',
        'ecom-body-bg': '#E7EEF1',
        'auth-modal-bg': '#20283a',
        'ecom-med-blue': '#037CBF',
        'ecom-search-bg': '#051a33eb',
        'ecom-card-bg-light': '#2a6c9c1a',
        'ecom-card-bg-dark': '#2a6c9c40',
        'ecom-dark-blue': '#0C4260',
        'ecom-green': '#6dad2d75',
        'ecom-divider': '#27577340',
        'ecom-bg-metric': '#2a6c9c40',
        'ecom-teal': '#2A838F',
        'ecom-comparison-card-bg': {
          DEFAULT: '#bacfdc',
          200: '#c7cccf',
          900: '#a6aeb3',
        },
        'ecom-comparison-pillar': '#406b8a',
        'ecom-comparison-value': '#264a64',
        'ecom-comparison-metric-divide': '#94b0c2',
        'ecom-framework-score': '#da9f4666',
        'ecom-modal-bg': '#EEEEEE',
        'ecom-modal-submit-btn': '#8CBFCF',
      },
      fontFamily: {
        title: ['Rajdhani'],
        body: ['Roboto'],
      },
      boxShadow: {
        'ecom-header': '0px 8px 2px 0px rgba(0, 0, 0, 0.80)',
        'ecom-search': '0px 6px 4px 2px rgba(0, 0, 0, 0.60)',
        'ecom-card': '0px 2px 0px 2px rgba(0, 0, 0, 0.30)',
        'ecom-btn': '0px 4px 2px 0px rgba(0, 0, 0, 0.50)',
        'ecom-modal': '-4px 6px 0px 0px rgba(0, 0, 0, 0.80)',
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out 1',
      },
      keyframes: {
        wiggle: {
          '0%': { transform: 'scaleY(0)' },
          '100%': { transform: 'scaleY(1)' },
        },
      },
    },
  },
  plugins: [],
};
