import path from 'path';
import fs from 'fs';
import createEmotionServer from '@emotion/server/create-instance';
import { createEmotionCache } from '../../utils/render';
import { RenderFile } from '../../pages/render';
import { theme } from '../../theme/theme';

import type { QueryClient } from '@tanstack/react-query';

export const getClientAssetPath = (): string => {
    return path.resolve('dist', 'assets', 'client');
};

export const getServerAssetPath = (): string => {
    return path.resolve('dist', 'assets', 'server');
};

export interface Manifest {
    [name: string]: {
        file: string;
        name: string;
        src?: string;
        isEntry?: boolean;
        imports?: Array<string>;
        css?: Array<string>;
    };
}

export const getManifests = (): Manifest => {
    const clientAssetPath = getClientAssetPath();
    const manifest: Manifest = JSON.parse(
        fs
            .readFileSync(path.join(clientAssetPath, '.vite', 'manifest.json'))
            .toString()
    );

    return manifest;
};

export const collectCssFiles = (
    fileName: string,
    manifest: Manifest
): Array<string> => {
    const cssFiles = new Set<string>();

    const currentFileData = manifest[fileName];
    if (currentFileData && currentFileData.css) {
        currentFileData.css.forEach(cssFiles.add, cssFiles);
    }
    if (currentFileData && currentFileData.imports) {
        const subFiles = currentFileData.imports.flatMap((importedFile) =>
            collectCssFiles(importedFile, manifest)
        );
        subFiles.forEach(cssFiles.add, cssFiles);
    }

    return Array.from(cssFiles);
};

export const getHtml = (
    renderedContent: {
        rootHtml: string;
        emotionCss: string;
    },
    clientAsset: {
        clientFileName: string;
        manifest: Manifest;
    }
): string => {
    const { rootHtml, emotionCss } = renderedContent;
    const { clientFileName, manifest } = clientAsset;

    const cssFiles = collectCssFiles(clientFileName, manifest);
    const clientFileData = manifest[clientFileName];

    return `
<!DOCTYPE html>
<html lang="en" data-bs-theme="dark">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>My First Webpage</title>
    ${emotionCss}
    ${cssFiles
        .map(
            (cssPath) =>
                `<link rel="stylesheet" crossorigin="anonymous" href="/assets/${cssPath}" />`
        )
        .join('\n')}
</head>
<body>
    <div id="root">${rootHtml}</div>
    <script async src="/assets/${clientFileData.file}" type="module"></script>
</body>
</html>
`;
};

export const renderFile = async (
    fileName: string,
    queryClient: QueryClient
): Promise<[string, string]> => {
    const cache = createEmotionCache();
    const { extractCriticalToChunks, constructStyleTagsFromChunks } =
        createEmotionServer(cache);
    const file: RenderFile = await import(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        fileName
    );

    let rootHtml = '';
    try {
        rootHtml = file.render(cache, theme, queryClient);
    } catch (err) {
        console.error('Render failed', err);
    }

    const emotionChunks = extractCriticalToChunks(rootHtml);
    const emotionCss = constructStyleTagsFromChunks(emotionChunks);

    return [rootHtml, emotionCss];
};
