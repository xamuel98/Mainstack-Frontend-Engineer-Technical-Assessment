import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
    build: {
        sourcemap: false,
        rollupOptions: {
            onwarn(warning, warn) {
                // Suppress sourcemap warnings for node_modules
                if (
                    warning.code === 'SOURCEMAP_ERROR' &&
                    warning.message.includes('node_modules')
                ) {
                    return;
                }
                warn(warning);
            },
        },
    },
    plugins: [
        react({
            jsxImportSource: '@emotion/react',
            babel: {
                plugins: ['react-dev-locator', '@emotion/babel-plugin'],
            },
        }),
        tsconfigPaths(),
    ],
});
