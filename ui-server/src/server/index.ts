import net from 'net';
import http1 from 'http';
import http2 from 'http2';
import { makeApp } from './server';

const app = makeApp();

const http1Server = http1.createServer(app);
const http2Server = http2.createServer(app);

const server = net.createServer(async (socket) => {
    const chunk: Buffer = await new Promise((resolve) =>
        socket.once('data', resolve)
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    socket._readableState.flowing = null;
    socket.unshift(chunk);
    const firstLine = chunk.toString();
    // console.info(`firstLine ${firstLine}`)
    if (firstLine.startsWith('PRI * HTTP/2.0')) {
        // console.log('emitting h2');
        http2Server.emit('connection', socket);
    } else {
        // console.log('emitting h1');
        http1Server.emit('connection', socket);
    }
});

const port = 8181;

server.listen(port, '0.0.0.0').on('listening', () => {
    console.log(`Server listening on 0.0.0.0:${port}`);
});
