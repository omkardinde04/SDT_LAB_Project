import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { TourSpot } from '../../types';
import { VirtualTourViewer } from '../../components/VirtualTourViewer';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import {
  Compass,
  Heart,
  Sparkles,
  Share2,
  CheckCircle2,
  MapPin,
  ChevronRight,
  Info,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Building,
} from 'lucide-react';

export const StudentVirtualTour: React.FC = () => {
  const location = useLocation();
  const [spots, setSpots] = useState<TourSpot[]>([]);
  const [activeSpotId, setActiveSpotId] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [savedSpots, setSavedSpots] = useState<Set<string>>(new Set(['spot-entrance', 'spot-kjsce']));
  const [loading, setLoading] = useState(true);
  const [copyFeedback, setCopyFeedback] = useState(false);

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const data = await api.get<TourSpot[]>('/tour-spots');
        setSpots(data);
        const initialId = (location.state as any)?.spotId || data[0]?.id || '';
        setActiveSpotId(initialId);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpots();
  }, [location.state]);

  const activeSpot = spots.find((s) => s.id === activeSpotId) || spots[0];

  const categories = [
    'All',
    'Entrance',
    'Engineering',
    'Academics',
    'Library',
    'Auditorium',
    'Gardens & Outdoors',
    'Sports',
    'Canteen',
    'Student Activity',
    'Innovation',
    'Hostel',
  ];

  const filteredSpots =
    selectedCategory === 'All'
      ? spots
      : spots.filter((s) => s.category.toLowerCase() === selectedCategory.toLowerCase());

  const toggleSave = async (id: string) => {
    setSavedSpots((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    try {
      await api.post('/shortlist', { collegeId: id });
    } catch {}
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-10 w-72 rounded-full" />
        <Skeleton className="h-[540px] w-full rounded-2xl" />
      </div>
    );
  }

  if (!activeSpot) {
    return (
      <div className="text-center py-20 text-[#7A6F8F]">
        No campus tour spots found. Please check back soon.
      </div>
    );
  }

  const currentIndex = spots.findIndex((s) => s.id === activeSpot.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7C5CBF] bg-[#E9E0FA] px-2.5 py-0.5 rounded-full">
              Somaiya Vidyavihar Campus, Mumbai
            </span>
            <span className="text-xs text-[#7A6F8F] hidden sm:inline">•</span>
            <span className="text-xs text-[#7A6F8F]">
              K. J. Somaiya College of Engineering (KJSCE)
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold text-[#2D2442] flex items-center gap-2">
            Explore Somaiya Vidyavihar – 360° Campus Tour
          </h1>
        </div>

        {/* Progress Tracker & Share */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-[#7A6F8F] font-medium">
              Progress: <span className="font-semibold text-[#5B3FA0]">{currentIndex + 1} of {spots.length}</span> ({Math.round(((currentIndex + 1) / spots.length) * 100)}%)
            </div>
            <div className="w-36 bg-[#E9E0FA] h-2 rounded-full overflow-hidden mt-1">
              <div
                className="bg-[#7C5CBF] h-full transition-all duration-300 rounded-full"
                style={{ width: `${((currentIndex + 1) / spots.length) * 100}%` }}
              />
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={handleShare}
            icon={<Share2 className="w-3.5 h-3.5" />}
          >
            {copyFeedback ? 'Link Copied!' : 'Share'}
          </Button>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#7C5CBF] text-white shadow-purple-sm'
                : 'bg-white text-[#7A6F8F] hover:text-[#2D2442] border border-[#DDD2F3]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 360° Virtual Tour Canvas Viewer */}
      <VirtualTourViewer
        spot={activeSpot}
        allSpots={spots}
        onSelectSpot={(id) => setActiveSpotId(id)}
        isSaved={savedSpots.has(activeSpot.id)}
        onToggleSave={() => toggleSave(activeSpot.id)}
      />

      {/* Authenticity & Simulated Panorama Note */}
      <div className="flex items-start sm:items-center gap-3 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-emerald-950 text-xs">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
        <div className="leading-relaxed">
          <span className="font-semibold text-emerald-900">Authentic Campus Photography: </span>
          All scenes in this tour feature genuine, verified photographs of Somaiya Vidyavihar campus and K. J. Somaiya College of Engineering. High-resolution authentic photographs are mapped into our interactive panoramic canvas projection engine to allow drag-to-look 360° horizontal rotation, vertical pitch adjustment, focal zoom, and clickable waypoints without artificial rendering.
        </div>
      </div>

      {/* Spot Description & Details Card */}
      <Card padding="lg" className="border-[#DDD2F3]">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">{activeSpot.category}</Badge>
              <Badge variant="outline">Verified Campus Photograph</Badge>
              {activeSpot.locationDetails && (
                <span className="text-xs text-[#7A6F8F] font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#7C5CBF]" />
                  {activeSpot.locationDetails}
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-semibold text-[#2D2442]">
              {activeSpot.title}
            </h2>

            <p className="text-sm text-[#7A6F8F] leading-relaxed">
              {activeSpot.description}
            </p>

            {/* Key Features bullet grid */}
            {activeSpot.features && activeSpot.features.length > 0 && (
              <div className="pt-2">
                <h4 className="text-xs font-semibold text-[#5B3FA0] uppercase tracking-wider mb-2.5">
                  Verified Facility Highlights & Equipment
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeSpot.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 text-xs text-[#2D2442] bg-[#FAF7FF] p-3 rounded-xl border border-[#DDD2F3]/60 shadow-xs"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#5BAE8A] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* In-Person Visit & Representative Chat CTAs */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <Link to="/student/visit">
                <Button size="sm" variant="primary" icon={<Calendar className="w-4 h-4" />}>
                  Book In-Person Campus Visit
                </Button>
              </Link>
              <Link to="/student/chat">
                <Button size="sm" variant="secondary" icon={<MessageSquare className="w-4 h-4" />}>
                  Chat with Somaiya Representative
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick jump to connected Hotspot Waypoints */}
          <div className="w-full lg:w-80 bg-[#FAF7FF] rounded-2xl p-5 border border-[#DDD2F3] shrink-0 space-y-3.5">
            <h4 className="text-xs font-semibold text-[#2D2442] uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#7C5CBF]" />
              Connected Campus Waypoints
            </h4>
            <p className="text-[11px] text-[#7A6F8F]">
              Click below or tap on-screen waypoint pins to walk to adjacent locations:
            </p>
            <div className="space-y-2">
              {activeSpot.hotspots && activeSpot.hotspots.length > 0 ? (
                activeSpot.hotspots.map((hs, i) => (
                  <button
                    key={i}
                    onClick={() => hs.targetSpotId && setActiveSpotId(hs.targetSpotId)}
                    disabled={!hs.targetSpotId}
                    className="w-full flex items-center justify-between text-left p-3 rounded-xl bg-white border border-[#DDD2F3] hover:border-[#7C5CBF] hover:shadow-xs text-xs text-[#2D2442] transition-all cursor-pointer disabled:opacity-60 group"
                  >
                    <div>
                      <span className="font-medium block text-[#2D2442] group-hover:text-[#5B3FA0]">
                        {hs.title}
                      </span>
                      <span className="text-[10px] text-[#7A6F8F] line-clamp-1">
                        {hs.description}
                      </span>
                    </div>
                    {hs.targetSpotId && (
                      <ChevronRight className="w-4 h-4 text-[#7C5CBF] group-hover:translate-x-0.5 transition-transform shrink-0 ml-1.5" />
                    )}
                  </button>
                ))
              ) : (
                <p className="text-xs text-[#7A6F8F]">No adjacent waypoints linked</p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* All Campus Locations Visual Gallery */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[#2D2442]">
              Explore All 15 Somaiya Campus Locations
            </h3>
            <p className="text-xs text-[#7A6F8F]">
              Browse the complete portfolio of authentic facilities across the 60-acre Vidyavihar campus
            </p>
          </div>
          <span className="text-xs font-medium text-[#7C5CBF] bg-[#E9E0FA] px-3 py-1 rounded-full">
            {filteredSpots.length} Locations
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredSpots.map((s) => {
            const isSelected = s.id === activeSpot.id;
            return (
              <div
                key={s.id}
                onClick={() => {
                  setActiveSpotId(s.id);
                  window.scrollTo({ top: 180, behavior: 'smooth' });
                }}
                className={`group relative rounded-2xl overflow-hidden border cursor-pointer transition-all duration-200 bg-white shadow-sm hover:shadow-md ${
                  isSelected
                    ? 'border-[#7C5CBF] ring-2 ring-[#7C5CBF]/30 scale-[1.02]'
                    : 'border-[#DDD2F3] hover:border-[#B9A6E8]'
                }`}
              >
                {/* Thumbnail Image */}
                <div className="relative h-40 w-full overflow-hidden bg-[#2D2442]">
                  <img
                    src={s.thumbnailUrl}
                    alt={s.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

                  {/* Category Pill */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/90 text-[#2D2442] backdrop-blur-xs">
                      {s.category}
                    </span>
                  </div>

                  {/* Spot Order */}
                  <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-[#7C5CBF] text-white flex items-center justify-center text-[10px] font-bold shadow-md">
                    {s.order}
                  </div>

                  {/* Current Active Indicator */}
                  {isSelected && (
                    <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Now Viewing
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-3.5 space-y-1">
                  <h4 className="font-semibold text-xs sm:text-sm text-[#2D2442] line-clamp-1 group-hover:text-[#5B3FA0] transition-colors">
                    {s.title}
                  </h4>
                  <p className="text-[11px] text-[#7A6F8F] line-clamp-2 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
