import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  MessageSquare,
  CalendarCheck,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { VisitBooking, Conversation } from '../../types';

export const RepDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [visits, setVisits] = useState<VisitBooking[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vData, cData] = await Promise.all([
          api.get<VisitBooking[]>('/visits'),
          api.get<Conversation[]>('/conversations'),
        ]);
        setVisits(vData);
        setConversations(cData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pendingVisits = visits.filter((v) => v.status === 'pending');
  const todayVisits = visits.filter((v) => v.status === 'confirmed');

  const stats = [
    {
      label: 'New Enquiries',
      value: conversations.length,
      icon: MessageSquare,
      color: 'text-[#7C5CBF]',
      badge: '+3 today',
    },
    {
      label: 'Visits Scheduled',
      value: todayVisits.length,
      icon: CalendarCheck,
      color: 'text-[#5BAE8A]',
      badge: 'Today & Week',
    },
    {
      label: 'Unread Chats',
      value: 1,
      icon: MessageSquare,
      color: 'text-[#E3A94B]',
      badge: 'Action Needed',
    },
    {
      label: 'Pending Approvals',
      value: pendingVisits.length,
      icon: AlertCircle,
      color: 'text-[#7C5CBF]',
      badge: 'Review Queue',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="rounded-[24px] bg-gradient-to-r from-[#5B3FA0] to-[#7C5CBF] text-white p-6 sm:p-8 shadow-purple-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-medium mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Admissions Representative Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold">
            Welcome back, {user?.name || 'Dr. Priya Nair'}
          </h1>
          <p className="text-xs sm:text-sm text-[#E9E0FA] mt-1">
            {profile?.department || 'Admissions & Academic Advisory Cell'} • Status:{' '}
            <span className="font-semibold text-emerald-300">Online & Accepting Queries</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate('/rep/chats')}
            icon={<MessageSquare className="w-4 h-4" />}
            className="bg-white text-[#5B3FA0] hover:bg-[#FAF7FF] font-semibold"
          >
            Open Live Inbox
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/rep/schedule')}
            icon={<CalendarCheck className="w-4 h-4" />}
            className="border-white/40 text-white hover:bg-white/10"
          >
            Visits Schedule
          </Button>
        </div>
      </div>

      {/* Counters Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} padding="md" className="border-[#DDD2F3]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#7A6F8F] font-medium">{s.label}</span>
                <Badge variant="lavender" size="sm">
                  {s.badge}
                </Badge>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl sm:text-3xl font-bold text-[#2D2442]">
                  {s.value}
                </span>
                <Icon className={`w-5 h-5 ${s.color}`} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Two Column Layout: Recent Enquiries Queue & Today's Visits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Enquiries & Active Conversations */}
        <Card padding="lg" className="border-[#DDD2F3] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base text-[#2D2442]">
              Recent Prospective Enquiries
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/rep/chats')}
            >
              View All ({conversations.length})
            </Button>
          </div>

          <div className="space-y-3">
            {conversations.map((c) => (
              <div
                key={c.id}
                onClick={() => navigate('/rep/chats')}
                className="p-3.5 rounded-2xl border border-[#DDD2F3] bg-[#FAF7FF]/50 hover:bg-[#FAF7FF] transition-colors cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#2D2442]">
                      {c.studentOrParentName}
                    </span>
                    <Badge variant={c.studentOrParentRole === 'student' ? 'primary' : 'lavender'} size="sm">
                      {c.studentOrParentRole}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#7A6F8F] truncate">
                    {c.lastMessage}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] text-[#7A6F8F] block">
                    {new Date(c.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#7C5CBF] ml-auto mt-1" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Campus Visits to Host */}
        <Card padding="lg" className="border-[#DDD2F3] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base text-[#2D2442]">
              Assigned Campus Visits
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/rep/schedule')}
            >
              Full Schedule
            </Button>
          </div>

          <div className="space-y-3">
            {visits.slice(0, 3).map((v) => (
              <div
                key={v.id}
                className="p-3.5 rounded-2xl border border-[#DDD2F3] bg-white flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-sm font-semibold text-[#2D2442]">{v.userName}</strong>
                    <Badge variant={v.status === 'confirmed' ? 'success' : 'warning'} size="sm">
                      {v.status.toUpperCase()}
                    </Badge>
                    <span className="font-mono text-[#7A6F8F]">Pass: {v.passCode}</span>
                  </div>
                  <div className="text-[#7A6F8F]">
                    📅 {new Date(v.date).toLocaleDateString()} • ⏰ {v.timeSlot} • 👥 {v.visitorCount} Persons
                  </div>
                  <div className="text-[#2D2442] font-medium pt-1">
                    Purpose: {v.purpose}
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/rep/schedule')}
                >
                  Manage
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
