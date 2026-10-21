import { defineConfig } from 'vitest/config';

// Takes precedence over vite.config.js, whose root is the debug page.
export default defineConfig({
  test: {
    coverage: {
      include: ['src/**'],
      provider: 'v8',
    },
    snapshotFormat: {
      maxOutputLength: Number.MAX_SAFE_INTEGER,
    },
  },
});
