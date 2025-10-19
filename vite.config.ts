import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
    build: {
        sourcemap: 'hidden',
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
    // css: {
    //     preprocessorOptions: {
    //         scss: {
    //             additionalData: ` // just variables loaded globally
    //       '@use "utils/index" as *;' +
    //       '@use "core/index.scss" as *;' +
    //       '@use "theme/index.scss" as *;' +
    //       '@use "components/index.scss" as *;'
    //     `,
    //         },
    //     },
    // },
});
