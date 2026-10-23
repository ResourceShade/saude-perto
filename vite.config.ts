import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
// defineConfig vem do vitest/config para que a chave `test` seja tipada.
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
/**
 * O GitHub Pages publica em https://<usuario>.github.io/<repositorio>/, um
 * subcaminho. Sem `base`, o build gera referências a partir da raiz e todos os
 * ativos retornam 404. `VITE_BASE` permite ajustar sem editar este arquivo.
 */
const base = process.env['VITE_BASE'] ?? '/'

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
})
