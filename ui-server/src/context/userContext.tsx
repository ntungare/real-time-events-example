import React, { createContext, useContext } from 'react';
import { StompSessionProvider } from 'react-stomp-hooks';

export interface UserContextT {
    userId: string;
}

export const UserContext = createContext<UserContextT>(null);

export const UserContextProvider = UserContext.Provider;

export const useUserContext = () => {
    const userContext = useContext(UserContext);

    if (!userContext) {
        throw new Error('userContext not initialized');
    }

    return userContext;
};

export const MessageAndUserProvider: React.FC<
    React.PropsWithChildren<React.ComponentProps<typeof UserContextProvider>>
> = ({ value, children }) => {
    const shouldMakeConnection =
        !!value.userId && typeof window !== 'undefined';

    return (
        <UserContextProvider value={value}>
            <StompSessionProvider
                url="http://localhost:8282/ws"
                enabled={shouldMakeConnection}
            >
                {children}
            </StompSessionProvider>
        </UserContextProvider>
    );
};
