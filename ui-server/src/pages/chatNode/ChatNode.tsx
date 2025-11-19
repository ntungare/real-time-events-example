import React, { FC } from 'react';
// import * as uuid from 'uuid';
import Stack from '@mui/material/Stack';
import { ChatMessages } from '../../components/ChatNodeMessages';
import { UserContextProvider } from '../../context/userContext';

export const Chat: FC = () => {
    // const userId1 = uuid.v7();
    // const userId2 = uuid.v7();
    // const userId3 = uuid.v7();
    const userId1 = 'user-id-1';
    const userId2 = 'user-id-2';
    const userId3 = 'user-id-3';

    return (
        <Stack direction="column" justifyContent="space-between">
            <UserContextProvider value={{ userId: userId1 }}>
                <ChatMessages chattingWith1={userId2} chattingWith2={userId3} />
            </UserContextProvider>
            <UserContextProvider value={{ userId: userId2 }}>
                <ChatMessages chattingWith1={userId1} chattingWith2={userId3} />
            </UserContextProvider>
            <UserContextProvider value={{ userId: userId3 }}>
                <ChatMessages chattingWith1={userId1} chattingWith2={userId2} />
            </UserContextProvider>
        </Stack>
    );
};
