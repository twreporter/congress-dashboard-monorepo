import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'], // Your entry file
  format: ['cjs', 'esm'], // Output both CJS & ESM
  dts: true, // Generate type declarations
  sourcemap: true, // Optional: Add source maps
  clean: true, // Clean the output directory before building
  outDir: 'lib',
})
