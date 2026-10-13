import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { api } from '../../lib/api';
import { Conversation, Message, UserRole } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  Send,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  Clock,
  User,
  CheckCheck,
} from 'lucide-react';

export const RepChats: React.FC = () => {
  const { user } = useAuth();
  const {
    sendMessage,
    sendTyping,
    activeTypers,
    joinConversation,
    leaveConversation,
    messages: socketMessages,
    setMessages: setSocketMessages,
  } = useSocket();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>('');
  const [filterRole, setFilterRole] = useState<'all' | 'student' | 'parent'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Canned responses
  const cannedResponses = [
    'Admissions are officially open for Academic Year 2026-27.',
    'Hostel accommodation is guaranteed for all outstation students with biometric security.',
    'Undergraduate merit scholarships grant 50% tuition waiver for >= 95% in Class 12 / JEE.',
    'Visitors receive priority gate passes and complimentary cafeteria dining cards.',
    'You are warmly invited to attend our Saturday Guided Lab Immersion Session.',
  ];

  useEffect(() => {
    const fetchConvs = async () => {
      try {
        const data = await api.get<Conversation[]>('/conversations');
        setConversations(data);
        if (data.length > 0) {
          setActiveConvId(data[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchConvs();
  }, []);

  // When active conversation changes, load messages and join room
  useEffect(() => {
    if (!activeConvId) return;

    joinConversation(activeConvId);
    api
      .get<Message[]>(`/messages/${activeConvId}`)
      .then((msgs) => setSocketMessages(msgs))
      .catch(console.error);

    return () => {
      leaveConversation(activeConvId);
    };
  }, [activeConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [socketMessages]);

  const activeConv = conversations.find((c) => c.id === activeConvId);

  const filteredConvs = conversations.filter((c) => {
    const matchesRole =
      filterRole === 'all' || c.studentOrParentRole === filterRole;
    const matchesSearch =
      c.studentOrParentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || !activeConvId) return;

    sendMessage(activeConvId, text);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-120px)] flex flex-col sm:flex-row gap-5">
      {/* Left Sidebar: Conversations Inbox */}
      <Card
        padding="none"
        className="w-full sm:w-80 md:w-96 flex flex-col border-[#DDD2F3] shadow-purple-sm shrink-0 bg-white"
      >
        {/* Search & Role Filter Tabs */}
        <div className="p-3.5 border-b border-[#DDD2F3] space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#7A6F8F] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student or parent..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#DDD2F3] text-xs text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-[#FAF7FF] rounded-xl border border-[#DDD2F3]">
            {(['all', 'student', 'parent'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setFilterRole(r)}
                className={`flex-1 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  filterRole === r
                    ? 'bg-[#7C5CBF] text-white shadow-xs'
                    : 'text-[#7A6F8F] hover:text-[#2D2442]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#DDD2F3]/60">
          {filteredConvs.map((conv) => {
            const isSelected = conv.id === activeConvId;
            return (
              <div
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`p-3.5 transition-colors cursor-pointer ${
                  isSelected ? 'bg-[#E9E0FA]/40' : 'hover:bg-[#FAF7FF]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-xs sm:text-sm text-[#2D2442]">
                      {conv.studentOrParentName}
                    </strong>
                    <Badge variant={conv.studentOrParentRole === 'student' ? 'primary' : 'lavender'} size="sm">
                      {conv.studentOrParentRole}
                    </Badge>
                  </div>
                  <span className="text-[10px] text-[#7A6F8F]">
                    {new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-[#7A6F8F] line-clamp-1">
                  {conv.lastMessage}
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Right Column: Chat Feed & Canned Responses */}
      <Card
        padding="none"
        className="flex-1 flex flex-col justify-between border-[#DDD2F3] shadow-purple-sm overflow-hidden bg-white"
      >
        {activeConv ? (
          <>
            {/* Active Header */}
            <div className="p-3.5 border-b border-[#DDD2F3] bg-[#FAF7FF] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E9E0FA] text-[#5B3FA0] flex items-center justify-center font-bold text-sm">
                  {activeConv.studentOrParentName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-[#2D2442]">
                      {activeConv.studentOrParentName}
                    </h3>
                    <Badge variant="success" size="sm" dot>
                      Aspirant Active
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[#7A6F8F] capitalize">
                    Role: {activeConv.studentOrParentRole} • CampusTour Online Session
                  </p>
                </div>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FAF7FF]/20">
              {socketMessages.map((msg) => {
                const isMe = msg.senderRole === 'rep';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="text-[11px] text-[#7A6F8F] mb-1 px-1">
                      {isMe ? 'You (Admissions)' : msg.senderName}
                    </div>
                    <div
                      className={`max-w-[85%] sm:max-w-md px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
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
              <div ref={messagesEndRef} />
            </div>

            {/* Canned Responses Strip */}
            <div className="p-2 sm:px-4 bg-[#FAF7FF] border-t border-[#DDD2F3]/60 overflow-x-auto scrollbar-none flex items-center gap-2">
              <span className="text-[11px] text-[#7A6F8F] uppercase font-semibold shrink-0">
                Quick Template:
              </span>
              {cannedResponses.map((cr, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(cr)}
                  className="text-[11px] px-3 py-1 rounded-full bg-white hover:bg-[#E9E0FA] text-[#5B3FA0] border border-[#DDD2F3] transition-colors whitespace-nowrap cursor-pointer shrink-0"
                >
                  {cr.slice(0, 38)}...
                </button>
              ))}
            </div>

            {/* Input Composer */}
            <div className="p-3 sm:p-4 bg-white border-t border-[#DDD2F3] flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your official response..."
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
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-[#7A6F8F]">
            Select an enquiry conversation to begin live messaging
          </div>
        )}
      </Card>
    </div>
  );
};
