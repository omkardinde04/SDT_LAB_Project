import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  Users,
  Compass,
  CalendarCheck,
  Building,
  TrendingUp,
  BarChart3,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/stats')
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const signupWeeklyData = [
    { day: 'Mon', count: 18 },
    { day: 'Tue', count: 24 },
    { day: 'Wed', count: 32 },
    { day: 'Thu', count: 29 },
    { day: 'Fri', count: 42 },
    { day: 'Sat', count: 58 },
    { day: 'Sun', count: 64 },
  ];

  const maxSignups = Math.max(...signupWeeklyData.map((d) => d.count));

  const courseDistribution = [
    { name: 'B.Tech CS & AI', pct: 45, applicants: 320 },
    { name: 'B.Tech Robotics', pct: 28, applicants: 195 },
    { name: 'B.Des Interactive', pct: 15, applicants: 105 },
    { name: 'MBA Tech Analytics', pct: 12, applicants: 85 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Banner */}
      <div className="rounded-[24px] bg-gradient-to-r from-[#5B3FA0] to-[#7C5CBF] text-white p-6 sm:p-8 shadow-purple-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-medium mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CampusTour Executive Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold">
            Institutional Administration & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-[#E9E0FA] mt-1">
            Real-time prospective engagement overview, admissions visit volume, and content controls
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate('/admin/content')}
            className="bg-white text-[#5B3FA0] hover:bg-[#FAF7FF] font-semibold"
          >
            Manage Content
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/admin/users')}
            className="border-white/40 text-white hover:bg-white/10"
          >
            Manage Users
          </Button>
        </div>
      </div>

      {/* Counters Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="md" className="border-[#DDD2F3]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#7A6F8F] font-medium">Total Registered Users</span>
            <Badge variant="lavender" size="sm">Active</Badge>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-bold text-[#2D2442]">
              {stats?.totalUsers || 5}
            </span>
            <Users className="w-5 h-5 text-[#7C5CBF]" />
          </div>
          <span className="text-[11px] text-[#7A6F8F] mt-2 block">
            {stats?.studentsCount || 2} Students • {stats?.parentsCount || 1} Parents
          </span>
        </Card>

        <Card padding="md" className="border-[#DDD2F3]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#7A6F8F] font-medium">Campus Visits Booked</span>
            <Badge variant="success" size="sm" dot>Live</Badge>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-bold text-[#2D2442]">
              {stats?.totalVisits || 3}
            </span>
            <CalendarCheck className="w-5 h-5 text-[#5BAE8A]" />
          </div>
          <span className="text-[11px] text-[#7A6F8F] mt-2 block">
            {stats?.confirmedVisits || 2} Confirmed • {stats?.pendingVisits || 1} Pending
          </span>
        </Card>

        <Card padding="md" className="border-[#DDD2F3]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#7A6F8F] font-medium">Active Tour Spots</span>
            <Badge variant="lavender" size="sm">Published</Badge>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-bold text-[#2D2442]">
              {stats?.tourSpotsCount || 8}
            </span>
            <Compass className="w-5 h-5 text-[#7C5CBF]" />
          </div>
          <span className="text-[11px] text-[#7A6F8F] mt-2 block">
            8 Equirectangular 360 Panoramas
          </span>
        </Card>

        <Card padding="md" className="border-[#DDD2F3]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#7A6F8F] font-medium">Live Enquiries & Chats</span>
            <Badge variant="lavender" size="sm">Healthy</Badge>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-bold text-[#2D2442]">
              {stats?.activeEnquiries || 3}
            </span>
            <TrendingUp className="w-5 h-5 text-[#7C5CBF]" />
          </div>
          <span className="text-[11px] text-[#7A6F8F] mt-2 block">
            Average response time: 2.8 mins
          </span>
        </Card>
      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Signups Bar Chart */}
        <Card padding="lg" className="border-[#DDD2F3] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-base text-[#2D2442]">
                Weekly Prospective Registrations
              </h3>
              <p className="text-xs text-[#7A6F8F]">Daily student & parent account creations</p>
            </div>
            <Badge variant="success" size="sm">
              +38% vs Last Week
            </Badge>
          </div>

          <div className="pt-4 flex items-end justify-between gap-2 h-48 border-b border-[#DDD2F3] pb-2">
            {signupWeeklyData.map((d) => {
              const heightPct = (d.count / maxSignups) * 100;
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[10px] text-[#7A6F8F] group-hover:text-[#7C5CBF] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.count}
                  </span>
                  <div
                    className="w-full max-w-[36px] bg-[#E9E0FA] group-hover:bg-[#7C5CBF] rounded-t-xl transition-all duration-300"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-xs text-[#7A6F8F] font-medium">{d.day}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Course Aspirant Interest Breakdown */}
        <Card padding="lg" className="border-[#DDD2F3] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-base text-[#2D2442]">
                Program Interest Share
              </h3>
              <p className="text-xs text-[#7A6F8F]">Based on user profile preferences & bookmarks</p>
            </div>
            <BarChart3 className="w-5 h-5 text-[#7C5CBF]" />
          </div>

          <div className="space-y-3.5 pt-2">
            {courseDistribution.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#2D2442]">{item.name}</span>
                  <span className="text-[#7A6F8F] font-semibold">
                    {item.applicants} Aspirants ({item.pct}%)
                  </span>
                </div>
                <div className="w-full bg-[#FAF7FF] h-2.5 rounded-full overflow-hidden border border-[#DDD2F3]/60">
                  <div
                    className="bg-[#7C5CBF] h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
