import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { api } from '../../lib/api';
import { Conversation, Message } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Send, Clock, Sparkles, User, ShieldCheck } from 'lucide-react';

export const StudentChat: React.FC = () => {
  const { user } = useAuth();
  const { sendMessage, sendTyping, activeTypers, joinConversation, leaveConversation, messages: socketMessages, setMessages: setSocketMessages } = useSocket();

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<any>(null);

  // Quick reply pills
  const quickReplies = [
    'What is the eligibility for B.Tech CS & AI?',
    'Is hostel accommodation mandatory?',
    'What was the highest placement package last year?',
    'How do I apply for the Presidential Merit Scholarship?',
  ];

  // Initialize or fetch conversation
  useEffect(() => {
    const initChat = async () => {
      try {
        const conv = await api.post<Conversation>('/conversations');
        setConversation(conv);
        joinConversation(conv.id);

        const msgs = await api.get<Message[]>(`/messages/${conv.id}`);
        setSocketMessages(msgs);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    initChat();

    return () => {
      if (conversation) leaveConversation(conversation.id);
    };
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [socketMessages]);

  const handleSend = (textToSend?: string) => {
    const msg = (textToSend || inputText).trim();
    if (!msg || !conversation) return;

    sendMessage(conversation.id, msg);
    setInputText('');
    sendTyping(conversation.id, false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (val: string) => {
    setInputText(val);
    if (!conversation) return;

    sendTyping(conversation.id, true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      sendTyping(conversation.id, false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-140px)] flex flex-col">
      {/* Representative Header Card */}
      <Card padding="sm" className="mb-3 border-[#DDD2F3] shadow-purple-sm shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80"
                alt="Dr. Priya Nair"
                className="w-11 h-11 rounded-full object-cover ring-2 ring-[#DDD2F3]"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#5BAE8A] ring-2 ring-white" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm sm:text-base text-[#2D2442]">
                  Dr. Priya Nair
                </h3>
                <Badge variant="success" size="sm" dot>
                  Online
                </Badge>
              </div>
              <p className="text-xs text-[#7A6F8F]">
                Senior Admissions Counsellor • Admissions Advisory Cell
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#7A6F8F] bg-[#FAF7FF] px-3 py-1.5 rounded-full border border-[#DDD2F3]">
            <Clock className="w-3.5 h-3.5 text-[#7C5CBF]" />
            <span>Reply time: ~3 mins</span>
          </div>
        </div>
      </Card>

      {/* Messages Feed Area */}
      <Card
        padding="none"
        className="flex-1 flex flex-col justify-between overflow-hidden border-[#DDD2F3] shadow-purple-soft bg-[#FAF7FF]/40"
      >
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {socketMessages.map((msg) => {
            const isMe = msg.senderId === user?.id;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="text-[11px] text-[#7A6F8F] mb-1 px-1">
                  {isMe ? 'You' : msg.senderName}
                </div>
                <div
                  className={`max-w-[85%] sm:max-w-md px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                    isMe
                      ? 'bg-[#7C5CBF] text-white rounded-br-xs'
                      : 'bg-white text-[#2D2442] border border-[#DDD2F3] rounded-bl-xs'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-[#7A6F8F] mt-1 px-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {Object.keys(activeTypers).length > 0 && (
            <div className="flex items-center gap-2 text-xs text-[#7A6F8F] italic py-1">
              <span className="w-2 h-2 rounded-full bg-[#7C5CBF] animate-ping" />
              <span>Representative is typing a response...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies Strip */}
        <div className="p-2 sm:px-4 bg-white border-t border-[#DDD2F3]/60 overflow-x-auto scrollbar-none flex gap-2">
          {quickReplies.map((qr, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(qr)}
              className="text-[11px] px-3 py-1.5 rounded-full bg-[#FAF7FF] hover:bg-[#E9E0FA] text-[#5B3FA0] border border-[#DDD2F3] transition-colors whitespace-nowrap cursor-pointer shrink-0"
            >
              {qr}
            </button>
          ))}
        </div>

        {/* Input Composer */}
        <div className="p-3 sm:p-4 bg-white border-t border-[#DDD2F3] flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question for Dr. Priya Nair..."
            className="flex-1 px-4 py-2.5 rounded-full border border-[#DDD2F3] text-xs sm:text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
          />
          <Button
            size="md"
            variant="primary"
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
            icon={<Send className="w-4 h-4" />}
          >
            Send
          </Button>
        </div>
      </Card>
    </div>
  );
};
