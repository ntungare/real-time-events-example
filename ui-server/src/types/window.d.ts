export {};

declare global {
    interface Window {
        __initialState: {
            userId: string;
        };
    }
}
