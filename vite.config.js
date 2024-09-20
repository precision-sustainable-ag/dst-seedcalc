import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import istanbul from 'vite-plugin-istanbul';

export default defineConfig(() => ({
  build: {
    outDir: 'build',
  },
  plugins: [
    react(), eslint(),
    istanbul({
      include: 'src/*', // Files to be instrumented for coverage
      exclude: ['node_modules', 'src/features/'], // Exclude folders like tests and node_modules
      extension: ['.js', '.jsx', '.ts', '.tsx'],
      cypress: true, // Enable Cypress-specific instrumentation
    }),
  ],
  server: {
    open: true,
    port: 3000,
  },
}));
