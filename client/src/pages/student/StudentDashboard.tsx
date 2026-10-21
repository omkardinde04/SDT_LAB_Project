import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { api } from '../../lib/api';
import { TourSpot, VisitBooking } from '../../types';
import {
  Compass,
  Building,
  GraduationCap,
  MessageSquare,
  CalendarCheck,
  QrCode,
  MapPin,
  Sparkles,
  ArrowRight,
  Clock,
  Heart,
  ExternalLink,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tourSpots, setTourSpots] = useState<TourSpot[]>([]);
  const [upcomingVisit, setUpcomingVisit] = useState<VisitBooking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [spotsData, visitsData] = await Promise.all([
          api.get<TourSpot[]>('/tour-spots'),
          api.get<VisitBooking[]>('/visits'),
        ]);
        setTourSpots(spotsData);
        if (visitsData && visitsData.length > 0) {
          const confirmed = visitsData.find((v) => v.status === 'confirmed') || visitsData[0];
          setUpcomingVisit(confirmed);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const actionTiles = [
    {
      title: '360° Virtual Tour',
      desc: 'Explore 15 authentic panoramic zones from Aryabhat Building to Olympic sports grounds.',
      icon: Compass,
      path: '/student/tour',
      badge: 'Interactive',
      color: 'bg-[#7C5CBF]',
    },
    {
      title: 'Campus Facilities',
      desc: '10 world-class amenities with equipment specs and open hours.',
      icon: Building,
      path: '/student/facilities',
      badge: 'Verified',
      color: 'bg-[#5B3FA0]',
    },
    {
      title: 'Courses & Fees',
      desc: 'Curriculum details, career outcomes, and transparent fee tables.',
      icon: GraduationCap,
      path: '/student/courses',
      badge: 'Year-wise',
      color: 'bg-[#7C5CBF]',
    },
    {
      title: 'Chat with Counsellor',
      desc: 'Connect live with Dr. Priya Nair with instant replies.',
      icon: MessageSquare,
      path: '/student/chat',
      badge: 'Online Now',
      badgeSuccess: true,
      color: 'bg-[#5B3FA0]',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Campus Hero Banner */}
      <div className="relative rounded-[24px] overflow-hidden bg-gradient-to-r from-[#5B3FA0] to-[#7C5CBF] text-white shadow-purple-lg p-6 sm:p-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#E9E0FA]" />
            <span>Welcome, {user?.name || 'Aarav'}!</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-white mb-2">
            K. J. Somaiya College of Engineering
          </h1>

          <p className="text-xs sm:text-sm text-[#E9E0FA] leading-relaxed mb-6">
            Somaiya Vidyavihar University, Mumbai • NAAC 'A+' Grade • Autonomous • 60-Acre Green Campus in Vidyavihar. Explore 15 authentic panoramic zones across engineering labs, library, and sports grounds.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate('/student/tour')}
              icon={<Compass className="w-4 h-4" />}
              className="bg-white text-[#5B3FA0] hover:bg-[#FAF7FF] font-semibold"
            >
              Start 360° Campus Tour
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/student/visit')}
              className="border-white/40 text-white hover:bg-white/10"
            >
              Book In-Person Visit
            </Button>
          </div>
        </div>
      </div>

      {/* Upcoming Visit Card (if confirmed) */}
      {upcomingVisit && (
        <Card variant="lavender" padding="md" className="border-[#DDD2F3]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#7C5CBF] text-white flex items-center justify-center shrink-0 shadow-sm">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="success" dot>
                    Visit Confirmed
                  </Badge>
                  <span className="text-xs text-[#7A6F8F]">Pass: {upcomingVisit.passCode}</span>
                </div>
                <h3 className="font-semibold text-base text-[#2D2442]">
                  Upcoming In-Person Campus Visit
                </h3>
                <p className="text-xs text-[#7A6F8F] flex items-center gap-3 mt-1">
                  <span>📅 {new Date(upcomingVisit.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span>⏰ {upcomingVisit.timeSlot}</span>
                  <span>👥 {upcomingVisit.visitorCount} Visitors</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/student/visit')}
                icon={<QrCode className="w-4 h-4" />}
              >
                View Pass & QR
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Main Feature Tiles Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#2D2442]">Campus Exploration Hub</h2>
          <span className="text-xs text-[#7A6F8F]">4 Core Modules</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {actionTiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <Card
                key={tile.title}
                hoverable
                onClick={() => navigate(tile.path)}
                className="cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-11 h-11 rounded-2xl ${tile.color} text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {tile.badgeSuccess ? (
                      <Badge variant="success" dot size="sm">
                        {tile.badge}
                      </Badge>
                    ) : (
                      <Badge variant="lavender" size="sm">
                        {tile.badge}
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-base text-[#2D2442] mb-1 group-hover:text-[#7C5CBF] transition-colors">
                    {tile.title}
                  </h3>
                  <p className="text-xs text-[#7A6F8F] leading-relaxed mb-4">
                    {tile.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#DDD2F3]/60 flex items-center justify-between text-xs font-medium text-[#7C5CBF]">
                  <span>Explore Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Popular 360 Tour Spots Row */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-[#2D2442]">Featured 360° Spots</h2>
            <p className="text-xs text-[#7A6F8F]">Click any spot to jump straight into the panoramic viewer</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/student/tour')}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            All 8 Spots
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-white rounded-2xl p-4 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tourSpots.slice(0, 4).map((spot) => (
              <div
                key={spot.id}
                onClick={() => navigate('/student/tour', { state: { spotId: spot.id } })}
                className="group relative rounded-[16px] overflow-hidden bg-white border border-[#DDD2F3] shadow-purple-sm hover:shadow-purple-lg transition-all cursor-pointer hover:-translate-y-0.5"
              >
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={spot.thumbnailUrl}
                    alt={spot.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2D2442]/80 via-transparent to-transparent" />
                  <div className="absolute top-2.5 left-2.5">
                    <Badge variant="primary" size="sm">
                      {spot.category}
                    </Badge>
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-xs">
                    <span className="font-semibold truncate">{spot.title}</span>
                    <Compass className="w-4 h-4 shrink-0 text-[#B9A6E8]" />
                  </div>
                </div>
                <div className="p-3 text-xs text-[#7A6F8F] line-clamp-2">
                  {spot.description}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
