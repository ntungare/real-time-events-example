import { WebSocketServer } from 'ws';
import * as uuid from 'uuid';
import { userIdToChats, userIdToSocket } from './sharedData';

export interface ClientMessage {
    fromUserId: string;
    toUserId: string;
    message: string;
}

export const makeWebsocketServer = (): WebSocketServer => {
    const wsServer = new WebSocketServer({ noServer: true });

    wsServer.on('connection', (webSocket, request) => {
        const { pathname } = new URL(request.url, 'ws://local.url');

        const segments = pathname.split('/');
        const userId = segments[segments.length - 1];

        userIdToSocket[userId] = webSocket;
        if (!Object.prototype.hasOwnProperty.call(userIdToChats, userId)) {
            userIdToChats[userId] = {};
        }

        webSocket.on('close', () => {
            delete userIdToSocket[userId];
        });

        webSocket.on('message', (rawData) => {
            const data: ClientMessage = JSON.parse(rawData.toString('utf-8'));

            const { fromUserId, toUserId } = data;
            let { message } = data;
            if (!message) {
                message = `Super cool message from ${fromUserId} to ${toUserId}: ${uuid.v7()}`;
            }

            if (
                Object.prototype.hasOwnProperty.call(userIdToSocket, toUserId)
            ) {
                if (
                    !Object.prototype.hasOwnProperty.call(
                        userIdToSocket[toUserId],
                        fromUserId
                    )
                ) {
                    userIdToChats[toUserId][fromUserId] = [];
                }
                userIdToChats[toUserId][fromUserId].push(message);
                userIdToSocket[data.toUserId].send(
                    JSON.stringify({ userId: fromUserId, message })
                );
            }
            console.log(data);
        });
    });

    return wsServer;
};
