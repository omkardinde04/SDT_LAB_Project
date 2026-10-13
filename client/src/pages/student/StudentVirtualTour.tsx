import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
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
} from 'lucide-react';

export const StudentVirtualTour: React.FC = () => {
  const location = useLocation();
  const [spots, setSpots] = useState<TourSpot[]>([]);
  const [activeSpotId, setActiveSpotId] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [savedSpots, setSavedSpots] = useState<Set<string>>(new Set(['spot-1', 'spot-3']));
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
    'Academics',
    'Labs',
    'Campus Life',
    'Hostel',
    'Cafeteria',
    'Sports',
    'Innovation',
  ];

  const filteredSpots =
    selectedCategory === 'All'
      ? spots
      : spots.filter((s) => s.category === selectedCategory);

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
        <Skeleton className="h-10 w-64 rounded-full" />
        <Skeleton className="h-[500px] w-full rounded-2xl" />
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Top Header & Category Filter Chips */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7C5CBF]">
              Virtual Experience
            </span>
            <span className="text-xs text-[#7A6F8F]">•</span>
            <span className="text-xs text-[#7A6F8F]">
              Progress: Spot {currentIndex + 1} of {spots.length} ({Math.round(((currentIndex + 1) / spots.length) * 100)}%)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#2D2442] flex items-center gap-2">
            Interactive 360° Campus Tour
          </h1>
        </div>

        {/* Progress Bar & Share Button */}
        <div className="flex items-center gap-3">
          <div className="w-36 bg-[#E9E0FA] h-2.5 rounded-full overflow-hidden hidden sm:block">
            <div
              className="bg-[#7C5CBF] h-full transition-all duration-300 rounded-full"
              style={{ width: `${((currentIndex + 1) / spots.length) * 100}%` }}
            />
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

      {/* Location Filter Chips (Scrollable row) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
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

      {/* Spot Description & Details Card */}
      <Card padding="lg" className="border-[#DDD2F3]">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">{activeSpot.category}</Badge>
              <Badge variant="outline">Verified Panoramic Capture</Badge>
              {savedSpots.has(activeSpot.id) && (
                <Badge variant="lavender" size="sm">
                  Saved in Wishlist
                </Badge>
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
                <h4 className="text-xs font-semibold text-[#5B3FA0] uppercase tracking-wider mb-2">
                  Facility Specifications & Highlights
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeSpot.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs text-[#2D2442] bg-[#FAF7FF] p-2.5 rounded-xl border border-[#DDD2F3]/60"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#5BAE8A] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick jump to connected spots */}
          <div className="w-full lg:w-72 bg-[#FAF7FF] rounded-2xl p-4 border border-[#DDD2F3] shrink-0 space-y-3">
            <h4 className="text-xs font-semibold text-[#2D2442] uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#7C5CBF]" />
              Hotspot Waypoints
            </h4>
            <div className="space-y-1.5">
              {activeSpot.hotspots && activeSpot.hotspots.length > 0 ? (
                activeSpot.hotspots.map((hs, i) => (
                  <button
                    key={i}
                    onClick={() => hs.targetSpotId && setActiveSpotId(hs.targetSpotId)}
                    disabled={!hs.targetSpotId}
                    className="w-full flex items-center justify-between text-left p-2.5 rounded-xl bg-white border border-[#DDD2F3] hover:border-[#7C5CBF] text-xs text-[#2D2442] transition-colors cursor-pointer disabled:opacity-60"
                  >
                    <span className="font-medium truncate">{hs.title}</span>
                    {hs.targetSpotId && <ChevronRight className="w-3.5 h-3.5 text-[#7C5CBF] shrink-0" />}
                  </button>
                ))
              ) : (
                <p className="text-xs text-[#7A6F8F]">No adjacent waypoints linked</p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
