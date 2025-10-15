import {defineConfig} from '@hey-api/openapi-ts';

export default defineConfig({
    input: 'http://localhost:5174/openapi.json',
    output: 'app/client',
});
