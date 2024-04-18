import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import path from 'path';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  base: 'http://localhost:8080/front',
  resolve: {
    alias: {
      '@': "/src",
    },
  },
})
