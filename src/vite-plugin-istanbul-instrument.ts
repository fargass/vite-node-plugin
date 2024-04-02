import { type Plugin } from 'vite'
import {
  createInstrumenter,
  type InstrumenterOptions,
} from 'istanbul-lib-instrument'

import {
  vitePluginCoverageMiddleware,
  type VitePluginCoverageMiddlewareOptions,
} from './vite-plugin-coverage-middleware'
import { type SourceMapInput } from 'rollup'

export interface VitePluginIstanbulInstrumentOptions
  extends Partial<InstrumenterOptions> {
  /**
   * Enable the plugin (default: `true`)
   */
  enable?: boolean
  /**
   * Enable the coverage middleware to serve the coverage data (default: `false`)
   */
  enableCoverageMiddleware?: boolean
  /**
   * Options for the coverage middleware
   */
  coverageMiddlewareOptions?: VitePluginCoverageMiddlewareOptions
}

export function vitePluginIstanbulInstrument(
  options?: VitePluginIstanbulInstrumentOptions,
): Plugin[] {
  if (options?.enable === false) {
    return []
  }
  let instrumenter: ReturnType<typeof createInstrumenter>

  const plugins: Plugin[] = [
    {
      name: 'vite-plugin-istanbul-instrument',
      apply: 'serve',
      enforce: 'post',
      transform(code, id) {
        if (!instrumenter) {
          const instrumenterOpts: Partial<InstrumenterOptions> = {
            ...options,
            produceSourceMap: true,
          }
          instrumenter = createInstrumenter(instrumenterOpts)
        }

        return {
          code: instrumenter.instrumentSync(code, id) || code,
          map: convertSourceMapToSourceMapInput(instrumenter.lastSourceMap()),
        }
      },
    },
  ]

  if (options?.enableCoverageMiddleware) {
    plugins.push(
      vitePluginCoverageMiddleware(options?.coverageMiddlewareOptions),
    )
  }

  return plugins
}

function convertSourceMapToSourceMapInput(map: {
  version: string
  sources: string[]
  names: string[]
  sourcesContent?: string[]
  mappings: string
}): SourceMapInput {
  return {
    version: Number(map.version),
    sources: map.sources,
    sourcesContent: map.sourcesContent,
    names: map.names,
    mappings: map.mappings,
  }
}
