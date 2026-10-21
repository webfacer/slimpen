import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Local playground: `npm run dev`
export default defineConfig({
  root: 'demo',
  plugins: [vue()],
})
