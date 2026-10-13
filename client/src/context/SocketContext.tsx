import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { Message } from '../types';

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: Set<string>;
  sendMessage: (conversationId: string, text: string) => void;
  sendTyping: (conversationId: string, isTyping: boolean) => void;
  activeTypers: Record<string, string>;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [activeTypers, setActiveTypers] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!user) {
      if (socket) socket.disconnect();
      return;
    }

    const socketUrl = window.location.origin;
    const newSocket = io(socketUrl, {
      query: { userId: user.id },
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      // Rep is always marked online by default
      setOnlineUsers((prev) => new Set([...prev, 'usr-rep-1', user.id]));
    });

    newSocket.on('user_status', ({ userId, status }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        if (status === 'online') next.add(userId);
        else next.delete(userId);
        return next;
      });
    });

    newSocket.on('new_message', (msg: Message) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });

    newSocket.on('user_typing', ({ userName, isTyping }) => {
      setActiveTypers((prev) => {
        const next = { ...prev };
        if (isTyping) next[userName] = userName;
        else delete next[userName];
        return next;
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const joinConversation = (conversationId: string) => {
    if (socket) socket.emit('join_conversation', { conversationId });
  };

  const leaveConversation = (conversationId: string) => {
    if (socket) socket.emit('leave_conversation', { conversationId });
  };

  const sendMessage = (conversationId: string, text: string) => {
    if (!socket || !user || !text.trim()) return;
    socket.emit('send_message', {
      conversationId,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      text: text.trim(),
    });
  };

  const sendTyping = (conversationId: string, isTyping: boolean) => {
    if (!socket || !user) return;
    socket.emit('typing', {
      conversationId,
      userName: user.name,
      isTyping,
    });
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
        sendMessage,
        sendTyping,
        activeTypers,
        joinConversation,
        leaveConversation,
        messages,
        setMessages,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
