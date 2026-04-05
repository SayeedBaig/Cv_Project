import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const spaFallback = () => {
  const rewriteToIndex = (req, _res, next) => {
    const url = req.url || "/"

    if (
      req.method !== "GET" ||
      url.startsWith("/@") ||
      url.startsWith("/src/") ||
      url.startsWith("/node_modules/") ||
      url.startsWith("/service-worker.js") ||
      url.startsWith("/manifest.json") ||
      url.includes(".")
    ) {
      next()
      return
    }

    req.url = "/index.html"
    next()
  }

  return {
    name: "spa-fallback",
    configureServer(server) {
      server.middlewares.use(rewriteToIndex)
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewriteToIndex)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  appType: "spa",
  server: {
    open: false,
  },
  plugins: [react(), spaFallback()],
})
