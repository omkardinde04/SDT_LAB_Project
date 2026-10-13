import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { TourSpot, Facility, Course, Scholarship } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import {
  Compass,
  Building,
  GraduationCap,
  Award,
  Plus,
  Trash2,
  Edit2,
  Eye,
  Check,
  Sparkles,
} from 'lucide-react';

export const AdminManageContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'spots' | 'facilities' | 'courses' | 'scholarships'>('spots');

  const [spots, setSpots] = useState<TourSpot[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);

  // Modals
  const [showAddSpotModal, setShowAddSpotModal] = useState(false);
  const [spotTitle, setSpotTitle] = useState('');
  const [spotCategory, setSpotCategory] = useState<TourSpot['category']>('Campus Life');
  const [spotDesc, setSpotDesc] = useState('');
  const [spotPanoramaUrl, setSpotPanoramaUrl] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [s, f, c, sch] = await Promise.all([
        api.get<TourSpot[]>('/tour-spots'),
        api.get<Facility[]>('/facilities'),
        api.get<Course[]>('/courses'),
        api.get<Scholarship[]>('/scholarships'),
      ]);
      setSpots(s);
      setFacilities(f);
      setCourses(c);
      setScholarships(sch);
    } catch (err) {
      console.error(err);
    }
  };

  // Spot actions
  const handleCreateSpot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newSpot = await api.post('/tour-spots', {
        title: spotTitle,
        category: spotCategory,
        description: spotDesc,
        panoramaUrl: spotPanoramaUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=2000&q=80',
        features: ['Smart Wi-Fi 6', 'Air-Conditioned', 'Wheelchair Accessible'],
      });
      setSpots((prev) => [...prev, newSpot]);
      setShowAddSpotModal(false);
      setSpotTitle('');
      setSpotDesc('');
      setSpotPanoramaUrl('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSpot = async (id: string) => {
    if (!confirm('Are you sure you want to delete this 360 tour location?')) return;
    try {
      await api.delete(`/tour-spots/${id}`);
      setSpots((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleSpotStatus = async (spot: TourSpot) => {
    const nextStatus = spot.status === 'published' ? 'draft' : 'published';
    try {
      await api.put(`/tour-spots/${spot.id}`, { status: nextStatus });
      setSpots((prev) => prev.map((s) => (s.id === spot.id ? { ...s, status: nextStatus } : s)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#2D2442]">
            Content Management System (CMS)
          </h1>
          <p className="text-xs sm:text-sm text-[#7A6F8F] mt-1">
            Publish 360 panorama scenes, update facility specs, and edit course fee structures
          </p>
        </div>

        {activeTab === 'spots' && (
          <Button
            variant="primary"
            size="md"
            onClick={() => setShowAddSpotModal(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Add New Tour Spot
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#DDD2F3]">
        <button
          onClick={() => setActiveTab('spots')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all cursor-pointer ${
            activeTab === 'spots'
              ? 'bg-white border-t border-x border-[#DDD2F3] text-[#7C5CBF] -mb-[1px]'
              : 'text-[#7A6F8F] hover:text-[#2D2442]'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>360° Tour Spots ({spots.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('facilities')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all cursor-pointer ${
            activeTab === 'facilities'
              ? 'bg-white border-t border-x border-[#DDD2F3] text-[#7C5CBF] -mb-[1px]'
              : 'text-[#7A6F8F] hover:text-[#2D2442]'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Facilities ({facilities.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all cursor-pointer ${
            activeTab === 'courses'
              ? 'bg-white border-t border-x border-[#DDD2F3] text-[#7C5CBF] -mb-[1px]'
              : 'text-[#7A6F8F] hover:text-[#2D2442]'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Courses & Fees ({courses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('scholarships')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all cursor-pointer ${
            activeTab === 'scholarships'
              ? 'bg-white border-t border-x border-[#DDD2F3] text-[#7C5CBF] -mb-[1px]'
              : 'text-[#7A6F8F] hover:text-[#2D2442]'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Scholarships ({scholarships.length})</span>
        </button>
      </div>

      {/* Tab: Tour Spots */}
      {activeTab === 'spots' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {spots.map((s) => (
            <Card key={s.id} padding="none" className="border-[#DDD2F3] flex flex-col justify-between">
              <div>
                <div className="relative h-40 overflow-hidden">
                  <img src={s.thumbnailUrl} alt={s.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <Badge variant="primary" size="sm">
                      {s.category}
                    </Badge>
                    <Badge variant={s.status === 'published' ? 'success' : 'outline'} size="sm" dot>
                      {s.status}
                    </Badge>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-sm text-[#2D2442] line-clamp-1">{s.title}</h3>
                  <p className="text-xs text-[#7A6F8F] line-clamp-2">{s.description}</p>
                </div>
              </div>

              <div className="p-3 bg-[#FAF7FF] border-t border-[#DDD2F3]/60 flex items-center justify-between text-xs">
                <button
                  onClick={() => handleToggleSpotStatus(s)}
                  className="text-xs font-medium text-[#7C5CBF] hover:underline cursor-pointer"
                >
                  {s.status === 'published' ? 'Move to Draft' : 'Publish Spot'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteSpot(s.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                    title="Delete spot"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tab: Facilities */}
      {activeTab === 'facilities' && (
        <div className="space-y-3">
          {facilities.map((f) => (
            <Card key={f.id} padding="md" className="border-[#DDD2F3] flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img src={f.imageUrl} alt={f.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm text-[#2D2442]">{f.name}</h4>
                    <Badge variant="lavender" size="sm">{f.category}</Badge>
                  </div>
                  <p className="text-xs text-[#7A6F8F] mt-0.5">{f.shortDesc}</p>
                  <span className="text-[11px] text-[#7A6F8F]">Timings: {f.timings}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tab: Courses & Fees */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          {courses.map((c) => (
            <Card key={c.id} padding="md" className="border-[#DDD2F3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="primary" size="sm">{c.code}</Badge>
                  <span className="text-xs text-[#7A6F8F]">{c.department}</span>
                </div>
                <h4 className="font-semibold text-base text-[#2D2442]">{c.title}</h4>
                <p className="text-xs text-[#7A6F8F] mt-1">
                  Duration: {c.durationYears} Years • Seats: {c.totalSeats} • Highest Pkg: {c.highestPackage}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-[#7A6F8F] block">Starting EMI:</span>
                <strong className="text-base font-bold text-[#7C5CBF]">
                  ₹{c.fees?.emiStartsAt.toLocaleString('en-IN')}/mo
                </strong>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tab: Scholarships */}
      {activeTab === 'scholarships' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scholarships.map((sch) => (
            <Card key={sch.id} padding="md" className="border-[#DDD2F3] space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="lavender" size="sm">{sch.badge}</Badge>
                <span className="text-[11px] text-[#7A6F8F]">Deadline: {sch.deadline}</span>
              </div>
              <h4 className="font-semibold text-sm text-[#2D2442]">{sch.title}</h4>
              <p className="text-xs text-[#5BAE8A] font-semibold">{sch.coverage}</p>
              <p className="text-xs text-[#7A6F8F]">{sch.eligibility}</p>
            </Card>
          ))}
        </div>
      )}

      {/* Add Spot Modal */}
      <Modal
        isOpen={showAddSpotModal}
        onClose={() => setShowAddSpotModal(false)}
        title="Add New 360° Tour Spot"
        description="Enter the spot name, category, and equirectangular panoramic image link."
      >
        <form onSubmit={handleCreateSpot} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#2D2442] mb-1">
              Spot Title *
            </label>
            <input
              type="text"
              required
              value={spotTitle}
              onChange={(e) => setSpotTitle(e.target.value)}
              placeholder="e.g. Mechanical Workshop & Aerodynamics Lab"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#2D2442] mb-1">
              Category
            </label>
            <select
              value={spotCategory}
              onChange={(e) => setSpotCategory(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-white"
            >
              <option value="Entrance">Entrance</option>
              <option value="Academics">Academics</option>
              <option value="Labs">Labs</option>
              <option value="Campus Life">Campus Life</option>
              <option value="Hostel">Hostel</option>
              <option value="Cafeteria">Cafeteria</option>
              <option value="Sports">Sports</option>
              <option value="Innovation">Innovation</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#2D2442] mb-1">
              360° Panoramic Image URL (Equirectangular)
            </label>
            <input
              type="url"
              value={spotPanoramaUrl}
              onChange={(e) => setSpotPanoramaUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
            />
            <span className="text-[11px] text-[#7A6F8F] mt-1 block">
              Leave blank to use an automatic high-res sample university panorama
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#2D2442] mb-1">
              Location Description
            </label>
            <textarea
              rows={3}
              value={spotDesc}
              onChange={(e) => setSpotDesc(e.target.value)}
              placeholder="Detailed description for prospective students and parents..."
              className="w-full px-3.5 py-2 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#DDD2F3]">
            <Button type="button" variant="ghost" onClick={() => setShowAddSpotModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create & Publish Spot
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
