import React, { FC, PropsWithChildren } from 'react';
import { Theme } from '@emotion/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ColorModeSelect } from './ColorSelect';
import './layout.css';

export interface LayoutProps {
    theme: Theme;
    queryClient: QueryClient;
}

export const Layout: FC<PropsWithChildren<LayoutProps>> = ({
    theme,
    queryClient,
    children,
}) => {
    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools />
            <ThemeProvider
                theme={theme}
                disableTransitionOnChange
                defaultMode="system"
            >
                <CssBaseline />
                <ColorModeSelect
                    sx={{ position: 'fixed', top: '1rem', right: '1rem' }}
                />
                {children}
            </ThemeProvider>
        </QueryClientProvider>
    );
};
