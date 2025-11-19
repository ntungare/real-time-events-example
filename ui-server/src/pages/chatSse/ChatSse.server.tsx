import React from 'react';
import { renderToString } from 'react-dom/server';
import { CacheProvider } from '@emotion/react';
import type { RenderFile } from '../render';
import { Layout } from '../../template/Layout';
import { Chat } from './ChatSse';

export const render: RenderFile['render'] = (cache, theme, queryClient) => {
    return renderToString(
        <CacheProvider value={cache}>
            <Layout theme={theme} queryClient={queryClient}>
                <Chat />
            </Layout>
        </CacheProvider>
    );
};
