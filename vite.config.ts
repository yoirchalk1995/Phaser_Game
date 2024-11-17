import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Ensures relative paths are used for assets
  build: {
    outDir: 'dist', // Default output folder for Vite
  },
});
