import type { EmotionCache } from '@emotion/cache';
import type { Theme } from '@emotion/react';
import type { QueryClient } from '@tanstack/react-query';

export interface RenderFile {
    render: (
        cache: EmotionCache,
        theme: Theme,
        queryClient: QueryClient
    ) => string;
}
