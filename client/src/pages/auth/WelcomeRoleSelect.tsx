import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import {
  GraduationCap,
  Users2,
  Headphones,
  ShieldCheck,
  Compass,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Play,
  MapPin,
  Building2,
  Trophy,
  BookOpen,
} from 'lucide-react';
import { UserRole } from '../../types';

export const WelcomeRoleSelect: React.FC = () => {
  const navigate = useNavigate();
  const { quickDemoLogin } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [isLoading, setIsLoading] = useState(false);

  // Key campus highlights to show directly on the welcome screen
  const campusSpotlights = [
    {
      id: 'spot-entrance',
      title: 'Main Campus Entrance',
      image: '/somaiya/somaiya_main_gate.jpg',
      category: 'Entrance',
      desc: 'Grand Somaiya Trust gateway & security check',
    },
    {
      id: 'spot-kjsce',
      title: 'KJSCE – Aryabhat Building',
      image: '/somaiya/kjsce_aryabhat.jpg',
      category: 'Engineering',
      desc: 'Iconic stone steps & premier engineering labs',
    },
    {
      id: 'spot-sports',
      title: 'Olympic Sports Stadium',
      image: '/somaiya/somaiya_sports_ground.jpg',
      category: 'Sports',
      desc: 'Synthetic 400m track & full-size football turf',
    },
    {
      id: 'spot-auditorium',
      title: 'Grand Convocation Hall',
      image: '/somaiya/somaiya_grand_auditorium.jpg',
      category: 'Auditorium',
      desc: '1,200+ capacity acoustically tuned auditorium',
    },
    {
      id: 'spot-canteen',
      title: 'Student Dining Pavilion',
      image: '/somaiya/somaiya_canteen_pavilion.jpg',
      category: 'Canteen',
      desc: 'Award-winning sP+a cafeteria & food court',
    },
    {
      id: 'spot-gardens',
      title: 'Central Botanical Lawns',
      image: '/somaiya/somaiya_gardens_lawn.jpg',
      category: 'Gardens',
      desc: '60 acres of lush greenery & palm groves in Mumbai',
    },
  ];

  const roles = [
    {
      id: 'student' as UserRole,
      title: 'Prospective Student',
      tagline: 'Experience 360° campus walkthrough, inspect labs, and discover your engineering stream.',
      icon: GraduationCap,
      highlights: ['Interactive 360° Virtual Campus Tour', 'KJSCE Maker Labs & Department Specs', 'Realtime College Representative Chat'],
      badge: 'Recommended',
    },
    {
      id: 'parent' as UserRole,
      title: 'Parent / Guardian',
      tagline: 'Itemized fee transparency, safety protocols, hostel walkthrough & compare colleges.',
      icon: Users2,
      highlights: ['100% Itemized Fee Schedules', '24x7 Campus Security & Hostels', 'Side-by-Side College Decision Matrix'],
      badge: 'Parent Support',
    },
    {
      id: 'rep' as UserRole,
      title: 'College Representative',
      tagline: 'Manage campus visit schedules, reply to prospective student queries & guide applicants.',
      icon: Headphones,
      highlights: ['Admissions Inbox & Live Inquiries', 'Campus Visit Pass Approvals', 'Canned Expert Answer Templates'],
      badge: 'Admissions Desk',
    },
    {
      id: 'admin' as UserRole,
      title: 'Campus Administrator',
      tagline: 'Curate 360 tour spots, manage course fees, review counsellor analytics & system settings.',
      icon: ShieldCheck,
      highlights: ['360 Tour CMS & Hotspot Editor', 'Curriculum & Fee Schedule CRUD', 'Admissions Audit & System Reset'],
      badge: 'Institutional Governance',
    },
  ];

  const handleDemoAccess = async (role: UserRole) => {
    setIsLoading(true);
    try {
      await quickDemoLogin(role);
      const roleDashboards: Record<UserRole, string> = {
        student: '/student/dashboard',
        parent: '/parent/dashboard',
        rep: '/rep/dashboard',
        admin: '/admin/dashboard',
      };
      navigate(roleDashboards[role]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 lavender-header-bg">
      {/* Hero Header Section */}
      <div className="max-w-5xl mx-auto w-full text-center space-y-4 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#DDD2F3] shadow-purple-sm">
          <Sparkles className="w-4 h-4 text-[#7C5CBF]" />
          <span className="text-xs font-semibold text-[#5B3FA0]">
            K. J. Somaiya College of Engineering • Somaiya Vidyavihar University, Mumbai
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-[#2D2442] tracking-tight">
          Explore Somaiya Vidyavihar – <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5CBF] to-[#5B3FA0]">
            360° Campus Tour
          </span>
        </h1>

        <p className="text-sm sm:text-base text-[#7A6F8F] max-w-3xl mx-auto leading-relaxed">
          Step inside our vibrant 60-acre lush green campus in Vidyavihar, Mumbai. Experience interactive panoramic views of the celebrated Aryabhat engineering building, Olympic synthetic sports stadium, state-of-the-art riidl maker labs, and architectural dining pavilion.
        </p>

        {/* Primary Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <Button
            size="lg"
            variant="primary"
            onClick={() => navigate('/tour')}
            icon={<Compass className="w-5 h-5 animate-spin-slow" />}
            className="shadow-purple-md px-8 py-3.5 text-base font-semibold"
          >
            Start Virtual Tour
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              const el = document.getElementById('campus-spots');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            icon={<Play className="w-4 h-4 text-[#7C5CBF]" />}
            className="px-6 py-3.5 text-base bg-white"
          >
            Explore 15 Campus Landmarks
          </Button>
        </div>

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-4">
          <div className="bg-white/80 backdrop-blur-xs p-3 rounded-2xl border border-[#DDD2F3] text-center shadow-2xs">
            <div className="text-lg font-bold text-[#5B3FA0]">60 Acres</div>
            <div className="text-[11px] text-[#7A6F8F]">Lush Green Campus</div>
          </div>
          <div className="bg-white/80 backdrop-blur-xs p-3 rounded-2xl border border-[#DDD2F3] text-center shadow-2xs">
            <div className="text-lg font-bold text-[#5B3FA0]">15 Locations</div>
            <div className="text-[11px] text-[#7A6F8F]">Authentic 360° Spots</div>
          </div>
          <div className="bg-white/80 backdrop-blur-xs p-3 rounded-2xl border border-[#DDD2F3] text-center shadow-2xs">
            <div className="text-lg font-bold text-[#5B3FA0]">NAAC 'A+'</div>
            <div className="text-[11px] text-[#7A6F8F]">Autonomous & NBA</div>
          </div>
          <div className="bg-white/80 backdrop-blur-xs p-3 rounded-2xl border border-[#DDD2F3] text-center shadow-2xs">
            <div className="text-lg font-bold text-[#5B3FA0]">95.8%</div>
            <div className="text-[11px] text-[#7A6F8F]">Placement Record</div>
          </div>
        </div>
      </div>

      {/* Featured Campus Landmarks Preview Carousel */}
      <div id="campus-spots" className="max-w-6xl mx-auto w-full mb-12">
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-[#2D2442] flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#7C5CBF]" />
              Featured Somaiya Vidyavihar Tour Spots
            </h2>
            <p className="text-xs text-[#7A6F8F]">
              Click any authentic photograph to launch directly into the 360° interactive viewer
            </p>
          </div>
          <Link
            to="/tour"
            className="text-xs font-semibold text-[#7C5CBF] hover:text-[#5B3FA0] flex items-center gap-1"
          >
            View All 15 Spots
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {campusSpotlights.map((spot) => (
            <div
              key={spot.id}
              onClick={() => navigate('/tour', { state: { spotId: spot.id } })}
              className="group relative rounded-2xl overflow-hidden bg-white border border-[#DDD2F3] hover:border-[#7C5CBF] shadow-sm hover:shadow-purple-md transition-all duration-300 cursor-pointer -translate-y-0 hover:-translate-y-1"
            >
              <div className="relative h-48 w-full overflow-hidden bg-[#2D2442]">
                <img
                  src={spot.image}
                  alt={spot.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-white/90 text-[#2D2442] backdrop-blur-xs">
                    {spot.category}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-semibold text-sm leading-snug drop-shadow-sm group-hover:text-[#B9A6E8] transition-colors">
                    {spot.title}
                  </h3>
                  <p className="text-[11px] text-white/80 line-clamp-1 drop-shadow-xs">
                    {spot.desc}
                  </p>
                </div>

                {/* 360 Overlay Badge */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center group-hover:bg-[#7C5CBF] transition-colors">
                  <Compass className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role Selection & Instant Demo Access Grid */}
      <div className="max-w-5xl mx-auto w-full mb-8">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-[#2D2442]">
            Role-Based Portals & Admissions Workspace
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6F8F] max-w-xl mx-auto mt-1">
            Choose your persona below for customized tools, transparent fee sheets, or representative chats:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = selectedRole === r.id;
            return (
              <div
                key={r.id}
                onClick={() => setSelectedRole(r.id)}
                className={`p-6 rounded-[22px] transition-all cursor-pointer border text-left flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-[#7C5CBF] ring-2 ring-[#7C5CBF]/30 shadow-purple-lg -translate-y-0.5'
                    : 'bg-white/85 hover:bg-white border-[#DDD2F3] shadow-purple-sm hover:border-[#B9A6E8]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-[#7C5CBF] text-white' : 'bg-[#E9E0FA] text-[#5B3FA0]'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant={isSelected ? 'primary' : 'lavender'}>{r.badge}</Badge>
                  </div>

                  <h3 className="text-lg font-semibold text-[#2D2442] mb-1">{r.title}</h3>
                  <p className="text-xs text-[#7A6F8F] leading-relaxed mb-4">{r.tagline}</p>

                  <div className="space-y-1.5 border-t border-[#DDD2F3]/60 pt-3 mb-4">
                    {r.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-[#2D2442]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#5BAE8A] shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between border-t border-[#DDD2F3]/60">
                  <span className="text-xs font-medium text-[#7C5CBF]">
                    {isSelected ? 'Active Selection' : 'Click to select'}
                  </span>
                  <Button
                    size="sm"
                    variant={isSelected ? 'primary' : 'secondary'}
                    isLoading={isLoading && selectedRole === r.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDemoAccess(r.id);
                    }}
                  >
                    1-Click Demo
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="max-w-md mx-auto w-full text-center space-y-3">
        <Button
          fullWidth
          size="lg"
          variant="primary"
          onClick={() => navigate('/login', { state: { role: selectedRole } })}
        >
          Sign In as {roles.find((r) => r.id === selectedRole)?.title}
        </Button>

        <div className="flex items-center justify-center gap-4 text-xs text-[#7A6F8F]">
          <span>Direct access without login?</span>
          <Link
            to="/tour"
            className="text-[#7C5CBF] font-semibold hover:underline"
          >
            Launch 360° Virtual Tour
          </Link>
        </div>
      </div>
    </div>
  );
};
