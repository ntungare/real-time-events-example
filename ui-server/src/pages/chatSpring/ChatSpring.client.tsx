import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { CacheProvider } from '@emotion/react';
import { QueryClient } from '@tanstack/react-query';
import { Layout } from '../../template/Layout';
import { theme } from '../../theme/theme';
import { createEmotionCache } from '../../utils/render';
import { Chat } from './ChatSpring';

const domNode = document.getElementById('root');

const cache = createEmotionCache();
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
        },
    },
});

hydrateRoot(
    domNode,
    <CacheProvider value={cache}>
        <Layout theme={theme} queryClient={queryClient}>
            <Chat />
        </Layout>
    </CacheProvider>
);
