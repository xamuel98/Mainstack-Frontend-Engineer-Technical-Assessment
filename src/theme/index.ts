import {
    createSystem,
    defaultConfig,
    defineConfig,
    defineTokens,
} from '@chakra-ui/react';

const tokens = defineTokens({
    colors: {
        black: {
            300: { value: '#131316' },
        },
        gray: {
            50: { value: '#EFF1F6' },
            100: { value: '#DBDEE5' },
            300: { value: '#C4C4C4' },
            400: { value: '#56616B' },
        },
        white: {
            value: '#FFFFFF',
        },
    },
    fonts: {
        heading: { value: '"Degular", system-ui, sans-serif' },
        body: { value: '"Degular", system-ui, sans-serif' },
    },
});

const config = defineConfig({
    cssVarsPrefix: 'ms',
    theme: { tokens },
});

// Custom theme configuration using Chakra UI
const system = createSystem(defaultConfig, config);

export default system;
