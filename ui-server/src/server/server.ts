import path from 'path';
import express, { Express } from 'express';
import compression from 'compression';
import { QueryClient } from '@tanstack/react-query';
import {
    getClientAssetPath,
    getHtml,
    getManifests,
    getServerAssetPath,
    renderFile,
} from './utils/render';
// import proxy from 'express-http-proxy';

export const makeApp = (): Express => {
    const manifest = getManifests();
    const clientAssetPath = getClientAssetPath();
    const serverAssetPath = getServerAssetPath();
    const queryClient = new QueryClient();

    const app = express();
    app.use(compression());
    app.use('/assets', express.static(clientAssetPath));

    app.get('/chatNode', async (_request, response) => {
        const [rootHtml, emotionCss] = await renderFile(
            path.join(serverAssetPath, 'chatNode', 'ChatNode.server.mjs'),
            queryClient
        );

        response.status(200).send(
            getHtml(
                { rootHtml, emotionCss },
                {
                    clientFileName: 'src/pages/chatNode/ChatNode.client.tsx',
                    manifest,
                }
            )
        );
    });
    app.get('/chatSpring', async (_request, response) => {
        const [rootHtml, emotionCss] = await renderFile(
            path.join(serverAssetPath, 'chatSpring', 'ChatSpring.server.mjs'),
            queryClient
        );

        response.status(200).send(
            getHtml(
                { rootHtml, emotionCss },
                {
                    clientFileName:
                        'src/pages/chatSpring/ChatSpring.client.tsx',
                    manifest,
                }
            )
        );
    });
    app.get('/chatSse', async (_request, response) => {
        const [rootHtml, emotionCss] = await renderFile(
            path.join(serverAssetPath, 'chatSse', 'ChatSse.server.mjs'),
            queryClient
        );

        response.status(200).send(
            getHtml(
                { rootHtml, emotionCss },
                {
                    clientFileName: 'src/pages/chatSse/ChatSse.client.tsx',
                    manifest,
                }
            )
        );
    });
    // app.use('/chat-app', proxy('http://localhost:8181'));

    return app;
};
