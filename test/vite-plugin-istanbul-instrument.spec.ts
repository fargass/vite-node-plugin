import { vitePluginIstanbulInstrument } from '../src'

describe('Vite plugin istanbul instrument', () => {
  it('returns an array of plugins', () => {
    const plugins = vitePluginIstanbulInstrument()
    expect(Array.isArray(plugins)).toBe(true)
  })

  it('returns an array of plugins with coverage middleware', () => {
    const plugins = vitePluginIstanbulInstrument({
      enableCoverageMiddleware: true,
    })
    expect(Array.isArray(plugins)).toBe(true)
  })

  it('returns an empty array of plugins', () => {
    const plugins = vitePluginIstanbulInstrument({ enable: false })
    expect(Array.isArray(plugins)).toBe(true)
    expect(plugins.length).toBe(0)
  })
})
