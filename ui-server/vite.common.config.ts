import path from 'path';
import type { UserConfig } from 'vite';
import react from '@vitejs/plugin-react';

export const config: UserConfig = {
    build: {
        outDir: path.resolve('dist', 'assets'),
        assetsDir: '',
        manifest: true,
        ssrManifest: true,
    },
    plugins: [react()],
};
