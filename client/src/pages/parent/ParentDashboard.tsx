import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { College, VisitBooking } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CallbackModal } from '../../components/CallbackModal';
import {
  FileSpreadsheet,
  ShieldCheck,
  Scale,
  Headphones,
  PhoneCall,
  CalendarCheck,
  Building,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Phone,
} from 'lucide-react';

export const ParentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [colleges, setColleges] = useState<College[]>([]);
  const [upcomingVisit, setUpcomingVisit] = useState<VisitBooking | null>(null);
  const [showCallbackModal, setShowCallbackModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cols, visits] = await Promise.all([
          api.get<College[]>('/compare'),
          api.get<VisitBooking[]>('/visits'),
        ]);
        setColleges(cols);
        if (visits && visits.length > 0) {
          setUpcomingVisit(visits[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const parentTiles = [
    {
      title: 'Fee Transparency',
      desc: 'Year-by-year itemized fees with zero hidden charges & 0% EMI calculator.',
      icon: FileSpreadsheet,
      path: '/parent/fees',
      badge: 'Zero Hidden Costs',
    },
    {
      title: 'Safety & Hostel Inspection',
      desc: '24x7 security, biometric gates, resident wardens, and on-campus clinic.',
      icon: ShieldCheck,
      path: '/parent/safety',
      badge: 'Parent Priority #1',
    },
    {
      title: 'Compare & Decide',
      desc: 'Side-by-side comparison matrix on fees, distance, hostel, and placements.',
      icon: Scale,
      path: '/parent/compare',
      badge: 'Evaluation Matrix',
    },
    {
      title: 'Contact College',
      desc: 'Direct counsellors directory, request instant phone call back, or chat live.',
      icon: Headphones,
      path: '/parent/contact',
      badge: 'Direct Access',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Parent Welcome Hero Banner */}
      <div className="relative rounded-[24px] overflow-hidden bg-gradient-to-r from-[#5B3FA0] to-[#7C5CBF] text-white shadow-purple-lg p-6 sm:p-10">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#E9E0FA]" />
            <span>Parent & Guardian Decision Portal</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-white mb-2">
            Welcome, {user?.name || 'Mrs. Sunita Sharma'}
          </h1>

          <p className="text-xs sm:text-sm text-[#E9E0FA] leading-relaxed mb-6">
            Empowering parents with total financial transparency, authentic hostel safety audits, and unhindered access to senior academic deans. Aspirant: <strong>{profile?.childName || 'Aarav Sharma'}</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate('/parent/fees')}
              icon={<FileSpreadsheet className="w-4 h-4" />}
              className="bg-white text-[#5B3FA0] hover:bg-[#FAF7FF] font-semibold"
            >
              Inspect Year-Wise Fees
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => setShowCallbackModal(true)}
              icon={<PhoneCall className="w-4 h-4" />}
              className="border-white/40 text-white hover:bg-white/10"
            >
              Request Counsellor Call
            </Button>
          </div>
        </div>
      </div>

      {/* Parent Direct Helpline Notice */}
      <div className="p-4 rounded-2xl bg-white border border-[#DDD2F3] shadow-purple-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E9E0FA] text-[#5B3FA0] flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5 text-[#7C5CBF]" />
          </div>
          <div>
            <div className="font-semibold text-[#2D2442] text-sm">
              Dedicated Parent Toll-Free Advisory Hotline
            </div>
            <p className="text-[#7A6F8F]">
              Have questions about student safety, food nutrition, or loan waivers? Call +91 80 2845 7000 (Mon-Sat, 9am - 7pm)
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCallbackModal(true)}
        >
          Request Call Back
        </Button>
      </div>

      {/* Upcoming Campus Visit (if any) */}
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
                    Parent Visit Confirmed
                  </Badge>
                  <span className="text-xs font-mono text-[#7A6F8F]">Pass: {upcomingVisit.passCode}</span>
                </div>
                <h3 className="font-semibold text-base text-[#2D2442]">
                  Scheduled Campus Inspection Visit
                </h3>
                <p className="text-xs text-[#7A6F8F] flex items-center gap-3 mt-1">
                  <span>📅 {new Date(upcomingVisit.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span>⏰ {upcomingVisit.timeSlot}</span>
                  <span>👥 {upcomingVisit.visitorCount} Family Members</span>
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/parent/safety')}
            >
              Review Hostel Checklist
            </Button>
          </div>
        </Card>
      )}

      {/* Action Tiles Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#2D2442]">Parent Decision Modules</h2>
          <span className="text-xs text-[#7A6F8F]">Comprehensive Guidance</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {parentTiles.map((tile) => {
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
                    <div className="w-11 h-11 rounded-2xl bg-[#7C5CBF] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant="lavender" size="sm">
                      {tile.badge}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-base text-[#2D2442] mb-1 group-hover:text-[#7C5CBF] transition-colors">
                    {tile.title}
                  </h3>
                  <p className="text-xs text-[#7A6F8F] leading-relaxed mb-4">
                    {tile.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#DDD2F3]/60 flex items-center justify-between text-xs font-medium text-[#7C5CBF]">
                  <span>View Details</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Shortlisted Colleges Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-[#2D2442]">Shortlisted Institutions</h2>
            <p className="text-xs text-[#7A6F8F]">Direct comparison for final admission decision</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/parent/compare')}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Compare Side-by-Side
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {colleges.slice(0, 2).map((col) => (
            <Card key={col.id} padding="md" className="border-[#DDD2F3]">
              <div className="flex items-start gap-4">
                <img
                  src={col.coverImage}
                  alt={col.name}
                  className="w-24 h-24 rounded-2xl object-cover shrink-0"
                />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <Badge variant={col.id === 'col-kjsce' || col.id === 'col-apex' ? 'primary' : 'outline'} size="sm">
                      {col.naacGrade}
                    </Badge>
                    <span className="text-xs font-semibold text-[#5BAE8A]">
                      {col.placementRate}% Placed
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm text-[#2D2442] truncate">{col.name}</h4>
                  <p className="text-xs text-[#7A6F8F] line-clamp-1">{col.location}</p>
                  <div className="text-xs text-[#5B3FA0] font-semibold pt-1">
                    4-Year Total: ₹{col.totalFeesLakhs} Lakhs • Avg Pkg: ₹{col.avgPackageLpa} LPA
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Callback Modal */}
      <CallbackModal
        isOpen={showCallbackModal}
        onClose={() => setShowCallbackModal(false)}
      />
    </div>
  );
};
