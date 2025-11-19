import express, { Express } from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import { userIdToSocket, userIdToChats } from './sharedData';

export const makeAppServer = (): Express => {
    const app = express();
    app.use(compression());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.get<
        object,
        {
            userIdToSocket: string[];
            userIdToChats: typeof userIdToChats;
        }
    >('/users', (_request, response) => {
        response.status(200).json({
            userIdToSocket: Array.from(Object.keys(userIdToSocket)),
            userIdToChats: userIdToChats,
        });
    });
    app.get<{ userId: string }, Record<string, string[]>>(
        '/chat',
        (request, response) => {
            const userId = request.query.userId;
            if (typeof userId !== 'string') {
                return;
            }

            if (Object.prototype.hasOwnProperty.call(userIdToChats, userId)) {
                const content = userIdToChats[userId];
                response.status(200).json(content);
                return;
            }

            response.status(404).json({});
        }
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    app.use((err, _req, _res, _next) => {
        console.error(err.message, err.stack);
    });

    return app;
};
