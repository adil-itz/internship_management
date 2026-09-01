import { io } from 'socket.io-client';

let socket = null;

export const getSocket = () => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  if (!token) {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
    return null;
  }

  if (socket && socket.auth && socket.auth.token !== token) {
    socket.disconnect();
    socket = null;
  }

  if (!socket) {
    const host = window.location.port === '5173' ? 'http://localhost:5000' : window.location.origin;
    socket = io(host, {
      auth: { token },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });
  } else if (!socket.connected && socket.disconnected) {
    socket.auth = { token };
    socket.connect();
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const joinConversationRoom = (conversationId) => {
  const s = getSocket();
  if (s && conversationId) {
    s.emit('joinConversation', { conversationId });
  }
};

export const leaveConversationRoom = (conversationId) => {
  const s = getSocket();
  if (s && conversationId) {
    s.emit('leaveConversation', { conversationId });
  }
};

export const emitSocketSendMessage = (conversationId, message) => {
  const s = getSocket();
  if (s && conversationId && message) {
    s.emit('sendMessage', { conversationId, message });
  }
};

export const emitTyping = (conversationId) => {
  const s = getSocket();
  if (s && conversationId) {
    s.emit('typing', { conversationId });
  }
};

export const emitStopTyping = (conversationId) => {
  const s = getSocket();
  if (s && conversationId) {
    s.emit('stopTyping', { conversationId });
  }
};

export const emitMarkMessagesAsRead = (conversationId) => {
  const s = getSocket();
  if (s && conversationId) {
    s.emit('markMessagesAsRead', { conversationId });
  }
};
