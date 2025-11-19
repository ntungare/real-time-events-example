import type { WebSocket } from 'ws';

export const userIdToSocket: Record<string, WebSocket> = {};

export const userIdToChats: Record<string, Record<string, string[]>> = {};
