import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_PROXY_TARGET || 'http://localhost:5219'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api-proxy': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api-proxy/, ''),
          configure: (proxy) => {
            proxy.on('error', (err, _req, res) => {
              console.error(
                `[vite proxy] Backend no disponible en ${apiTarget}. Ejecuta: dotnet run (puerto 5219)`,
              )
              if (res && !res.headersSent) {
                res.writeHead(502, { 'Content-Type': 'application/json' })
                res.end(
                  JSON.stringify({
                    message: `API no disponible en ${apiTarget}. Inicia el backend con dotnet run.`,
                  }),
                )
              }
            })
          },
        },
      },
    },
  }
})
