import { defineConfig } from 'vitest/config'
import dts from 'vite-plugin-dts'

// Library build: core (`slimpen`) and Vue wrapper (`slimpen/vue`).
export default defineConfig({
  plugins: [dts({ include: ['src'] })],
  build: {
    lib: {
      entry: {
        index: 'src/index.ts',
        vue: 'src/vue/index.ts',
      },
      formats: ['es'],
      cssFileName: 'style',
    },
    rollupOptions: {
      external: [/^prosemirror-/, /^@floating-ui\//, 'vue'],
    },
  },
  test: {
    environment: 'jsdom',
  },
})
