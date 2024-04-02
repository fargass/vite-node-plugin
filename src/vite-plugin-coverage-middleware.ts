import type { Plugin } from 'vite'

export type GlobalCoverage = typeof global & { __coverage__?: unknown }

export interface VitePluginCoverageMiddlewareOptions {
  /**
   * The path to serve the coverage data on (default: `/__coverage__`)
   */
  path?: string
}
export function vitePluginCoverageMiddleware(
  options?: VitePluginCoverageMiddlewareOptions,
): Plugin {
  const path = options?.path || '/__coverage__'
  return {
    name: 'vite-plugin-coverage-middleware',
    enforce: 'pre',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url !== path) {
          return next()
        }

        const globalCoverage = global as GlobalCoverage

        if (!globalCoverage.__coverage__) {
          res.statusCode = 200
          res.setHeader('Content-Type', 'text/plain')
          res.end('Coverage data not found')
          return
        }

        let coverage: string

        res.setHeader('Content-Type', 'application/json')
        try {
          coverage = JSON.stringify({ coverage: globalCoverage.__coverage__ })
        } catch (ex) {
          return next(ex)
        }
        res.statusCode = 200
        res.end(coverage)
      })
    },
  }
}
