import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    css: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'src/pages/**',
        'src/services/**',
        'src/layouts/**',
        'src/context/**',
        'src/hooks/**',
        'cypress/**'
      ]
    },
  },
})