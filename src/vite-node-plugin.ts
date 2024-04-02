import { type Plugin } from 'vite'
import {
  vitePluginIstanbulInstrument,
  type VitePluginIstanbulInstrumentOptions,
} from './vite-plugin-istanbul-instrument'

export interface ViteNodePluginOptions {
  enableInstrumentation?: boolean
  instrumenterOptions?: VitePluginIstanbulInstrumentOptions
}
export function viteNodePlugin(options: ViteNodePluginOptions): Plugin[] {
  const plugins: Plugin[] = [
    {
      name: 'vite-node-plugin',
    },
  ]

  if (options.enableInstrumentation) {
    plugins.push(...vitePluginIstanbulInstrument(options.instrumenterOptions))
  }

  return plugins
}
