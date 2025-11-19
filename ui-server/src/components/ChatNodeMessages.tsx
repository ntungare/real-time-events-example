import React, { FC, useState } from 'react';
import { Button, CardContent, Input, Typography } from '@mui/material';

import { Card } from './FloatCard';
import { useChats, useReactQuerySubscription } from '../api/chatNode';
import { useUserContext } from '../context/userContext';

export const ChatMessages: FC<{
    chattingWith1: string;
    chattingWith2: string;
}> = ({ chattingWith1, chattingWith2 }) => {
    const { userId } = useUserContext();
    const { sendJsonMessage } = useReactQuerySubscription();
    const [message, setMessage] = useState('');
    const { data, isLoading } = useChats();

    return (
        <Card variant="outlined">
            <CardContent>
                <Typography
                    gutterBottom
                    sx={{ color: 'text.secondary', fontSize: 14 }}
                >
                    My User Id: {userId}
                </Typography>
                <Button
                    onClick={() => {
                        sendJsonMessage({
                            fromUserId: userId,
                            toUserId: chattingWith1,
                            message,
                        });
                        setMessage('');
                    }}
                >
                    Emit message to {chattingWith1}
                </Button>
                <Button
                    onClick={() => {
                        sendJsonMessage({
                            fromUserId: userId,
                            toUserId: chattingWith2,
                            message,
                        });
                        setMessage('');
                    }}
                >
                    Emit message to {chattingWith2}
                </Button>
                <Input
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                />
                {isLoading ? (
                    <></>
                ) : (
                    Object.entries(data ?? {}).map(
                        ([fromUserId, messages], userIdIdx) => {
                            return (
                                <Typography key={`${fromUserId}-${userIdIdx}`}>
                                    With User Id: {fromUserId}
                                    {(messages ?? []).map(
                                        (message, messageIdx) => {
                                            return (
                                                <Typography
                                                    key={`${fromUserId}-${userIdIdx}-${messageIdx}`}
                                                >
                                                    {message}
                                                </Typography>
                                            );
                                        }
                                    )}
                                </Typography>
                            );
                        }
                    )
                )}
            </CardContent>
        </Card>
    );
};
