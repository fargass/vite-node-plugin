import { defineConfig } from 'vitest/config'

export default defineConfig({

        test: {
            reporters:['default'],
            coverage: {
                all:true,
                reporter:["html","text-summary"],
                reportsDirectory: './coverage',
                provider: 'istanbul',
                include: [
                    'src/**/*.ts',
                ]
            },
            globals: true,
        },
    })
