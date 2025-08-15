import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost', // Esto es opcional, pero útil para seguridad
    port: 5177,       // Aquí defines el puerto que quieres usar
  },
})