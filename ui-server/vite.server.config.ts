import path from 'path';
import { defineConfig } from 'vite';
import { config } from './vite.common.config';

const outDir = path.join(config.build?.outDir ?? '', 'server');

export default defineConfig({
    ...config,
    build: {
        ...config.build,
        outDir,
        ssr: true,
        rollupOptions: {
            input: {
                'chatNode/ChatNode.server':
                    './src/pages/chatNode/ChatNode.server.tsx',
                'chatSpring/ChatSpring.server':
                    './src/pages/chatSpring/ChatSpring.server.tsx',
                'chatSse/ChatSse.server':
                    './src/pages/chatSse/ChatSse.server.tsx',
            },
        },
    },
});
