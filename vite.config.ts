import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
     host: true, // <- permite que sea accesible por IP local
    port: 5173
  }
});
