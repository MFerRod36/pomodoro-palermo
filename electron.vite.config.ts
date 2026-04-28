import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    root: 'src/renderer',
    build: {
      rollupOptions: {
        input: {
          timer: resolve(__dirname, 'src/renderer/timer/index.html'),
          overlay: resolve(__dirname, 'src/renderer/overlay/index.html'),
          settings: resolve(__dirname, 'src/renderer/settings/index.html')
        }
      }
    },
    resolve: {
      alias: {
        '@shared': resolve('src/shared')
      }
    },
    plugins: [react(), tailwindcss()]
  }
})
