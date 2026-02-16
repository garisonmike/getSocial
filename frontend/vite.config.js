import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: '0.0.0.0',
        port: 3000,
        watch: {
            usePolling: true
        },
        proxy: {
            '/api': {
                target: 'http://web:8000',
                changeOrigin: true,
            },
            '/admin': {
                target: 'http://web:8000',
                changeOrigin: true,
            },
            '/graphql': {
                target: 'http://web:8000',
                changeOrigin: true,
            },
            '/media': {
                target: 'http://web:8000',
                changeOrigin: true,
            }
        }
    },
    build: {
        outDir: 'dist',
        sourcemap: true
    }
})
