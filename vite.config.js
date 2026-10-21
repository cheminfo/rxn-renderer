import { defineConfig } from 'vite';

// The project's own port, never Vite's stock 5173: two checkouts must not
// fight over the same one.
const port = Number(process.env.PORT ?? 40611);

export default defineConfig({
  root: 'debug',
  server: { port, strictPort: true },
  preview: { port, strictPort: true },
});
