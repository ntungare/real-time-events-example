import path from 'path';
import { defineConfig } from 'vite';
import { config } from './vite.common.config';

const outDir = path.join(config.build?.outDir ?? '', 'client');

export default defineConfig({
    ...config,
    build: {
        ...config.build,
        outDir,
        sourcemap: true,
        rollupOptions: {
            input: {
                'chatNode/ChatNode.client':
                    './src/pages/chatNode/ChatNode.client.tsx',
                'chatSpring/ChatSpring.client':
                    './src/pages/chatSpring/ChatSpring.client.tsx',
                'chatSse/ChatSse.client':
                    './src/pages/chatSse/ChatSse.client.tsx',
            },
            output: {
                entryFileNames: '[hash]/[name].js',
                chunkFileNames: '[hash]/[name].js',
                assetFileNames: '[hash]/[name].[ext]',
            },
        },
    },
});
