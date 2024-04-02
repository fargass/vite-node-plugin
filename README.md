# Vite Node Plugin

This plugin allows you to use Vite with Node.js as dev server.
## features
- Hook for configuring the dev server
- Instrumentation for code coverage
- Coverage middleware


## Installation

You can install this plugin via npm:

```bash
npm install vite-node-plugin --save-dev
```
or pnpm:
```bash
pnpm add vite-node-plugin --save-dev
```

## Usage

### Dev server
Comming soon...

### Instrumentation
Add `viteNodeInstrumentPlugin` plugin to `vite.config.js` / `vite.config.ts`.
``` 
// vite.config.js
import viteNodeInstrumentPlugin from 'vite-node-instrument-plugin';

export default {
  plugins: [
    viteNodeInstrumentPlugin({
      enableCoverageMiddleware: true, // Enable coverage middleware (default: false)
      coverageMiddlewareOptions: {
        path: '/coverage', // Path to expose coverage middleware (default: '/__coverage__')
      }
    })
  ]
}
```
You can run your app with `nyc`to show the coverage report:
```bash
nyc --silent node server.js
```
