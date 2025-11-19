import axios from 'axios';
import { useEffect, useMemo } from 'react';
import {
    useQuery,
    useMutation,
    useQueryClient,
    DefaultError,
} from '@tanstack/react-query';
import { useEventSource } from 'react-use-websocket';
import { cloneDeep } from 'lodash-es';
import { useUserContext } from '../context/userContext';

export const makeFetchChats = (userId: string) => async () => {
    const response = await axios.get<Record<string, string[]>>(
        'http://localhost:8080/chatSse/chat',
        {
            params: { userId },
        }
    );

    return response.data;
};

export const useGetChats = () => {
    const { userId } = useUserContext();
    const fetchChatsFn = useMemo(() => makeFetchChats(userId), [userId]);

    return useQuery({
        queryKey: ['chat', userId],
        queryFn: fetchChatsFn,
    });
};

interface SendMessageParams {
    toUserId: string;
    message: string;
}

export const makeSendMessage =
    (fromUserId: string) =>
    async ({ toUserId, message }: SendMessageParams) => {
        const response = await axios.post<void>(
            'http://localhost:8080/chatSse/chat',
            { fromUserId, toUserId, message }
        );

        return response.data;
    };

export const useSendMessage = () => {
    const { userId } = useUserContext();
    const sendMessageFn = useMemo(() => makeSendMessage(userId), [userId]);

    return useMutation<void, DefaultError, SendMessageParams>({
        mutationFn: (params, _) => sendMessageFn(params),
    });
};

export const useReactQuerySubscription = () => {
    const { userId } = useUserContext();
    const queryClient = useQueryClient();
    const shouldMakeConnection = !!userId && typeof window !== 'undefined';

    const { lastEvent, ...other } = useEventSource(
        `http://localhost:8080/chatSse/listen/${userId}`,
        {
            heartbeat: true,
            shouldReconnect: (event) => {
                console.log(event);
                return true;
            },
        },
        shouldMakeConnection
    );

    useEffect(() => {
        if (!lastEvent) {
            return;
        }
        console.log(lastEvent);
        const { userId: userIdToUpdate, message } = JSON.parse(lastEvent.data);

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

            console.log(updatedData);

            return updatedData;
        });
    }, [lastEvent]);

    return { lastEvent, ...other };
};
