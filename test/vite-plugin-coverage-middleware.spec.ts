import { createServer, type ViteDevServer } from 'vite'
import { vitePluginCoverageMiddleware } from '../src'
import { type GlobalCoverage } from '../src/vite-plugin-coverage-middleware'

describe('Vite plugin coverage middleware', () => {
  let server: ViteDevServer
  beforeAll(async () => {
    const options = { path: '/__coverage__' }
    server = await createServer({
      server: {
        host: '127.0.0.1',
        port: 3000,
        hmr: true,
      },
      plugins: [vitePluginCoverageMiddleware(options)],
    })
  })

  beforeEach(async () => {
    await server.listen()
  })

  afterEach(async () => {
    const globalCoverage = global as GlobalCoverage
    delete globalCoverage.__coverage__
    await server.close()
  })

  it('should skip coverage data', async () => {
    // WHEN
    const response = await fetch('http://localhost:3000/skip')

    console.log(response.statusText)
    // THEN
    expect(response.status).toBe(404)
  })

  it('should return coverage data not found', async () => {
    // WHEN
    const response = await fetch('http://localhost:3000/__coverage__')
    const data = await response.text()

    // THEN
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toBe('text/plain')
    expect(data).toBe('Coverage data not found')
  })

  it('should return coverage data', async () => {
    // GIVEN
    const globalCoverage = global as GlobalCoverage
    globalCoverage.__coverage__ = 'data'

    // WHEN
    const response = await fetch('http://localhost:3000/__coverage__')
    const data = await response.json()

    // THEN
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toBe('application/json')
    expect(data).toEqual({ coverage: 'data' })
  })

  // Test default path

  it('should return coverage data with default path', async () => {
    // GIVEN
    const server = await createServer({
      server: {
        host: '127.0.0.1',
        port: 3000,
        hmr: true,
      },
      plugins: [vitePluginCoverageMiddleware()],
    })
    await server.listen()

    const globalCoverage = global as GlobalCoverage
    globalCoverage.__coverage__ = 'data'

    // WHEN
    const response = await fetch('http://localhost:3000/__coverage__')
    const data = await response.json()

    // THEN
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toBe('application/json')
    expect(data).toEqual({ coverage: 'data' })
  })
})
