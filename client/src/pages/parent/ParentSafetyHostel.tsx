import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CallbackModal } from '../../components/CallbackModal';
import {
  ShieldCheck,
  Camera,
  HeartPulse,
  UserCheck,
  Lock,
  Bed,
  CheckCircle2,
  PhoneCall,
  Sparkles,
} from 'lucide-react';

export const ParentSafetyHostel: React.FC = () => {
  const [showCallbackModal, setShowCallbackModal] = useState(false);

  const safetyFeatures = [
    {
      title: 'Biometric Access Turnstiles',
      desc: 'Fingerprint & RFID card scanners at all hostel wings and residential block entry points.',
      icon: Lock,
      status: 'Active 24x7',
    },
    {
      title: '84 IP CCTV Camera Network',
      desc: 'High-definition round-the-clock recorded coverage across hallways, gates, pathways, and common dining.',
      icon: Camera,
      status: 'Monitored 24x7',
    },
    {
      title: 'On-Campus Medical Clinic & Ambulance',
      desc: 'Full-time resident medical officer, 2 nursing staff, observation beds, and emergency tie-up with Apollo Hospital.',
      icon: HeartPulse,
      status: 'Doctor on Campus',
    },
    {
      title: 'Resident Wardens & Female Marshals',
      desc: 'Dedicated female wardens on all girls resident floors, strict visitor logging, and zero-tolerance anti-ragging squad.',
      icon: UserCheck,
      status: 'Resident Faculty',
    },
  ];

  const roomTypes = [
    {
      type: 'Twin-Sharing AC Suite',
      badge: 'Most Popular',
      priceAnnual: '₹75,000 / year',
      messIncluded: true,
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80',
      amenities: [
        'Attached bathroom with 24x7 solar geyser',
        'Individual study desks and ergonomic chairs',
        'Dedicated high-speed Wi-Fi router per room',
        'Weekly automated laundry service included',
      ],
    },
    {
      type: 'Triple-Sharing Non-AC Standard',
      badge: 'Budget Friendly',
      priceAnnual: '₹55,000 / year',
      messIncluded: true,
      image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80',
      amenities: [
        'Spacious airy room with garden facing windows',
        'Three individual wardrobes with digital lockers',
        'High-capacity ceiling fans and cross ventilation',
        'Filtered UV drinking water dispensers on floor',
      ],
    },
    {
      type: 'Single Studio Suite (Final Year / PG)',
      badge: 'Executive',
      priceAnnual: '₹1,05,000 / year',
      messIncluded: true,
      image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80',
      amenities: [
        'Complete private room with attached washroom',
        'Inverter AC with energy monitoring',
        'Book shelf, refrigerator and coffee pantry',
        'Priority quiet study zone',
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9E0FA] text-[#5B3FA0] text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Zero-Tolerance Safety Protocol
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#2D2442]">
            Campus Safety & Student Residential Living
          </h1>
          <p className="text-xs sm:text-sm text-[#7A6F8F] mt-1">
            Certified safe environment with round-the-clock female marshals, clinic, and hygienic dining
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setShowCallbackModal(true)}
          icon={<PhoneCall className="w-4 h-4" />}
        >
          Speak with Hostel Warden
        </Button>
      </div>

      {/* Safety Features 4-Point Checklist */}
      <div>
        <h2 className="text-lg font-semibold text-[#2D2442] mb-3">
          Parent Safety Checklist (100% Compliant)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {safetyFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <Card key={feat.title} padding="md" className="border-[#DDD2F3]">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#E9E0FA] text-[#5B3FA0] flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-[#7C5CBF]" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-[#2D2442]">{feat.title}</h4>
                      <Badge variant="success" size="sm" dot>
                        {feat.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#7A6F8F] leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Residential Room Types and Fee Structure */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#2D2442]">Room Types & Annual Pricing</h2>
            <p className="text-xs text-[#7A6F8F]">Separate wings for Boys and Girls with dedicated wardens</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roomTypes.map((room) => (
            <Card key={room.type} padding="none" className="border-[#DDD2F3] flex flex-col justify-between">
              <div>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.type}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="primary" size="sm">
                      {room.badge}
                    </Badge>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-semibold text-base text-[#2D2442]">{room.type}</h3>
                    <div className="text-lg font-bold text-[#7C5CBF] mt-1">
                      {room.priceAnnual}
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-[#DDD2F3]/60 pt-3 text-xs text-[#2D2442]">
                    {room.amenities.map((am, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#5BAE8A] shrink-0" />
                        <span>{am}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#FAF7FF] border-t border-[#DDD2F3]/60 text-center">
                <span className="text-[11px] text-[#7A6F8F]">
                  4-Meal Balanced Mess Included in Annual Fee
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <CallbackModal
        isOpen={showCallbackModal}
        onClose={() => setShowCallbackModal(false)}
        defaultCounsellor="Hostel & Student Safety Warden"
      />
    </div>
  );
};
