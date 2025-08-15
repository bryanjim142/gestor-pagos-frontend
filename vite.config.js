import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',     // Opcional: para asegurarte de que se use 'localhost'
    port: 5173,            // Tu puerto deseado
    strictPort: true       // Si este puerto ya está en uso, Vite devolverá error en vez de usar otro
  },
  // base: '/'           // Puedes definir el base path para producción si es necesario
})
