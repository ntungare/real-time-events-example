import path from 'path';
import waitOn from 'wait-on';

waitOn({
    resources: [
        path.resolve('dist', 'assets', 'client', '.vite', 'manifest.json'),
        path.resolve('dist', 'assets', 'server', '.vite', 'manifest.json'),
    ],
});
