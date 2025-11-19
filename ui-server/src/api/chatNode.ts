import axios from 'axios';
import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useWebSocket from 'react-use-websocket';
import { cloneDeep } from 'lodash-es';
import { useUserContext } from '../context/userContext';

export const fetchChats = (userId: string) => async () => {
    const response = await axios.get<Record<string, string[]>>(
        'http://localhost:8080/chatNode/other/chat',
        {
            params: { userId },
        }
    );

    return response.data;
};

export const useChats = () => {
    const { userId } = useUserContext();

    return useQuery({
        queryKey: ['chat', userId],
        queryFn: fetchChats(userId),
    });
};

export const useReactQuerySubscription = () => {
    const { userId } = useUserContext();
    const queryClient = useQueryClient();
    const shouldMakeConnection = !!userId && typeof window !== 'undefined';

    const { lastJsonMessage, ...webSocketContent } = useWebSocket<{
        userId: string;
        message: string;
    }>(
        shouldMakeConnection
            ? `ws://localhost:8080/chatNode/ws/${userId}`
            : null
    );

    useEffect(() => {
        if (!lastJsonMessage) {
            return;
        }
        const { userId: userIdToUpdate, message } = lastJsonMessage;

        queryClient.setQueriesData<
            Record<string, string[]>,
            { queryKey: ['chat', string] }
        >({ queryKey: ['chat', userId] }, (oldData) => {
            const updatedData = cloneDeep(oldData ?? {});
            if (
                !Object.prototype.hasOwnProperty.call(
                    updatedData,
                    userIdToUpdate
                )
            ) {
                updatedData[userIdToUpdate] = [];
            }

            updatedData[userIdToUpdate].push(message);

            return updatedData;
        });
    }, [lastJsonMessage]);

    return { lastJsonMessage, ...webSocketContent };
};
