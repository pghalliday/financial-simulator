import {defineConfig} from '@hey-api/openapi-ts';

export default defineConfig({
    input: 'http://localhost:5174/openapi.json',
    output: {
        format: 'prettier',
        lint: 'eslint',
        path: './client',
    },
    plugins: [
        '@hey-api/sdk',
        {
            enums: 'javascript',
            name: '@hey-api/typescript',
        },
    ],
});
