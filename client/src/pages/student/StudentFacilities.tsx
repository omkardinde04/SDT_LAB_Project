import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Facility } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Skeleton } from '../../components/ui/Skeleton';
import {
  Clock,
  MapPin,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Building,
  Layers,
} from 'lucide-react';

export const StudentFacilities: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacilities = async () => {
      setLoading(true);
      try {
        const url = activeCategory === 'All' ? '/facilities' : `/facilities?category=${activeCategory}`;
        const data = await api.get<Facility[]>(url);
        setFacilities(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFacilities();
  }, [activeCategory]);

  const categories = ['All', 'Labs', 'Sports', 'Hostel', 'Campus Life', 'Academics'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9E0FA] text-[#5B3FA0] text-xs font-semibold mb-2">
          <Building className="w-3.5 h-3.5" />
          Campus Infrastructure
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#2D2442]">
          Facilities & Research Centers
        </h1>
        <p className="text-xs sm:text-sm text-[#7A6F8F] mt-1">
          Explore world-class academic labs, resident halls, and recreation complexes
        </p>
      </div>

      {/* Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === cat
                ? 'bg-[#7C5CBF] text-white shadow-purple-sm'
                : 'bg-white text-[#7A6F8F] hover:text-[#2D2442] border border-[#DDD2F3]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Facilities Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl h-80 p-4 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((fac) => (
            <Card
              key={fac.id}
              hoverable
              padding="none"
              className="flex flex-col justify-between group cursor-pointer border-[#DDD2F3]"
              onClick={() => setSelectedFacility(fac)}
            >
              <div>
                {/* Photo with category badge */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={fac.imageUrl}
                    alt={fac.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="primary" size="sm">
                      {fac.category}
                    </Badge>
                  </div>
                </div>

                <div className="p-5 space-y-2.5">
                  <h3 className="font-semibold text-base text-[#2D2442] group-hover:text-[#7C5CBF] transition-colors line-clamp-1">
                    {fac.name}
                  </h3>

                  <p className="text-xs text-[#7A6F8F] line-clamp-2 leading-relaxed">
                    {fac.shortDesc}
                  </p>

                  <div className="space-y-1.5 pt-2 text-xs text-[#7A6F8F]">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#7C5CBF] shrink-0" />
                      <span className="truncate">{fac.timings}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#7C5CBF] shrink-0" />
                      <span className="truncate">{fac.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#FAF7FF] border-t border-[#DDD2F3]/60 flex items-center justify-between text-xs font-semibold text-[#7C5CBF]">
                <span>View Full Equipment & Specs</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Facility Details Modal */}
      {selectedFacility && (
        <Modal
          isOpen={Boolean(selectedFacility)}
          onClose={() => setSelectedFacility(null)}
          title={selectedFacility.name}
          description={`${selectedFacility.category} • ${selectedFacility.location}`}
          maxWidth="lg"
        >
          <div className="space-y-5 text-[#2D2442]">
            <img
              src={selectedFacility.imageUrl}
              alt={selectedFacility.name}
              className="w-full h-56 object-cover rounded-2xl"
            />

            <div>
              <h4 className="text-xs font-semibold text-[#5B3FA0] uppercase tracking-wider mb-1">
                Overview & Purpose
              </h4>
              <p className="text-xs sm:text-sm text-[#7A6F8F] leading-relaxed">
                {selectedFacility.fullDesc}
              </p>
            </div>

            {/* Operating Hours & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-[#FAF7FF] rounded-xl border border-[#DDD2F3] text-xs">
              <div>
                <span className="text-[#7A6F8F] block">Timings:</span>
                <strong className="text-[#2D2442]">{selectedFacility.timings}</strong>
              </div>
              <div>
                <span className="text-[#7A6F8F] block">Campus Location:</span>
                <strong className="text-[#2D2442]">{selectedFacility.location}</strong>
              </div>
            </div>

            {/* Technical Specifications */}
            {selectedFacility.specs && selectedFacility.specs.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-[#5B3FA0] uppercase tracking-wider mb-2">
                  Technical Specifications & Capacity
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedFacility.specs.map((sp, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl border border-[#DDD2F3] bg-white flex items-center justify-between text-xs"
                    >
                      <span className="text-[#7A6F8F]">{sp.label}</span>
                      <strong className="text-[#2D2442]">{sp.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Highlights */}
            {selectedFacility.highlights && (
              <div>
                <h4 className="text-xs font-semibold text-[#5B3FA0] uppercase tracking-wider mb-2">
                  Key Amenities
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {selectedFacility.highlights.map((hl, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#5BAE8A] shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
