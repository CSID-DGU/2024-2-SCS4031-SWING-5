import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const URL = 'http://localhost:8080/stomp/chat';

export const connectWebSocket = (onMessageReceived) => {
  const client = new Client({
    webSocketFactory: () => new SockJS(URL),
    debug: (str) => console.log(str),
    reconnectDelay: 5000,
  });

  client.onConnect = () => {
    console.log('WebSocket connected');
    client.subscribe('/sub/chat/room/1', (message) => {
      if (message.body) {
        onMessageReceived(JSON.parse(message.body));
      }
    });
  };

  client.onStompError = (frame) => {
    console.error('WebSocket error:', frame.headers['message']);
    console.error('Details:', frame.body);
  };

  client.activate();
  return client;
};

export const sendMessage = (client, message) => {
  if (client && client.connected) {
    client.publish({
      destination: '/pub/chat/message',
      body: JSON.stringify(message),
    });
  } else {
    console.error('Cannot send message: WebSocket is not connected.');
  }
};
