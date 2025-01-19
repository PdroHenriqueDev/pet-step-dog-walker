import {io, Socket} from 'socket.io-client';
import Config from 'react-native-config';
import {Platform} from 'react-native';

let socket: Socket | null = null;
let isTryingToReconnect = false;
let isComponentMounted = true;

export const connectSocket = (requestId: string) => {
  if (socket && socket.connected) {
    console.log('Socket.IO já conectado.');
    return;
  }
  try {
    socket = io(
      // Config.API_BASE_URL,
      Platform.OS === 'ios' ? Config.API_BASE_URL : 'http://10.0.2.2:3000',
      {
        query: {request_id: requestId},
      },
    );

    socket.on('connect', () => {
      console.log('Conectado ao servidor Socket.IO com requestId:', requestId);
      emitEvent('joinRoom', requestId);
      isTryingToReconnect = false;
    });

    socket.on('disconnect', (reason: string) => {
      console.warn('Socket.IO desconectado:', reason);
      if (!isTryingToReconnect && isComponentMounted) {
        isTryingToReconnect = true;
        attemptReconnect(requestId);
      }
    });

    socket.on('connect_error', error => {
      console.error('Erro de conexão com o Socket.IO:', error);
      if (!isTryingToReconnect && isComponentMounted) {
        isTryingToReconnect = true;
        attemptReconnect(requestId);
      }
    });
  } catch (error) {
    console.error('Error connecting to Socket.IO:', error);
    throw error;
  }
};

const attemptReconnect = (requestId: string): void => {
  console.log('Tentando reconectar ao Socket.IO...');
  setTimeout(() => {
    if (isComponentMounted && (!socket || !socket.connected)) {
      connectSocket(requestId);
    }
  }, 5000);
};

export const listenToEvent = (
  event: string,
  callback: (data: any) => void,
): void => {
  if (!socket) {
    console.error('Socket.IO not connected. Cannot listen to event:', event);
    return;
  }

  socket.on(event, callback);
};

export const emitEvent = (event: string, data: any): void => {
  if (!socket || !socket.connected) {
    console.error('Socket.IO not connected. Cannot emit event:', event);
    return;
  }

  socket.emit(event, data);
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  } else {
    console.error('Socket.IO not connected. Cannot disconnect.');
  }
  isComponentMounted = false;
};

export const setComponentMounted = (mounted: boolean): void => {
  isComponentMounted = mounted;
};
