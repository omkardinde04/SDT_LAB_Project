import http from 'http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';
import { router } from './routes.js';
import { db } from './db.js';
import { Message } from './types.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// Setup CORS
app.use(
  cors({
    origin: [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);

app.use(express.json());

// API Routes
app.use('/api', router);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    app: 'CampusTour API',
    timestamp: new Date().toISOString(),
  });
});

// Setup Socket.io
const io = new SocketIOServer(server, {
  cors: {
    origin: [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Map of userId -> socketId
const userSocketMap = new Map<string, string>();

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId as string;
  if (userId) {
    userSocketMap.set(userId, socket.id);
    io.emit('user_status', { userId, status: 'online' });
  }

  // Join conversation room
  socket.on('join_conversation', ({ conversationId }) => {
    socket.join(`conversation:${conversationId}`);
  });

  // Leave conversation room
  socket.on('leave_conversation', ({ conversationId }) => {
    socket.leave(`conversation:${conversationId}`);
  });

  // Handle send message realtime
  socket.on('send_message', (data: { conversationId: string; senderId: string; senderName: string; senderRole: any; text: string }) => {
    const { conversationId, senderId, senderName, senderRole, text } = data;
    if (!text || !conversationId) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      conversationId,
      senderId,
      senderName,
      senderRole,
      text: text.trim(),
      createdAt: new Date().toISOString(),
      read: false,
    };

    // Save to db
    db.update('messages', (list) => [...list, newMessage]);

    // Update conversation lastMessage
    db.update('conversations', (list) =>
      list.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              lastMessage: newMessage.text,
              lastMessageAt: newMessage.createdAt,
              unreadCountRep: senderRole !== 'rep' ? c.unreadCountRep + 1 : c.unreadCountRep,
              unreadCountStudent: senderRole === 'rep' ? c.unreadCountStudent + 1 : c.unreadCountStudent,
            }
          : c
      )
    );

    // Broadcast to room
    io.to(`conversation:${conversationId}`).emit('new_message', newMessage);

    // Also broadcast global event for conversation list updates
    io.emit('conversation_updated', {
      conversationId,
      lastMessage: newMessage.text,
      lastMessageAt: newMessage.createdAt,
    });
  });

  // Typing indicators
  socket.on('typing', ({ conversationId, userName, isTyping }) => {
    socket.to(`conversation:${conversationId}`).emit('user_typing', { userName, isTyping });
  });

  socket.on('disconnect', () => {
    if (userId) {
      userSocketMap.delete(userId);
      io.emit('user_status', { userId, status: 'offline' });
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 CampusTour Server running on http://localhost:${PORT}`);
  console.log(`📡 Socket.io ready for realtime messaging`);
});
