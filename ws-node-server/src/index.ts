import http1 from 'http';
import { makeAppServer } from './appServer';
import { makeWebsocketServer } from './webSocketServer';

const appServer = makeAppServer();
const webSocketServer = makeWebsocketServer();
const http1Server = http1.createServer(appServer);

http1Server.on('upgrade', (request, socket, head) => {
    const { pathname } = new URL(request.url, 'ws://local.url');

    if (pathname.startsWith('/ws')) {
        webSocketServer.handleUpgrade(request, socket, head, function done(ws) {
            webSocketServer.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});

const port = 8282;

http1Server.listen(port, '0.0.0.0').on('listening', () => {
    console.log(`Server listening on 0.0.0.0:${port}`);
});
