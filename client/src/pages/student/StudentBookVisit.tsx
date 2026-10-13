import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { api } from '../../lib/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  CheckCircle2,
  QrCode,
  MapPin,
  Download,
  Printer,
  Sparkles,
} from 'lucide-react';

export const StudentBookVisit: React.FC = () => {
  const [date, setDate] = useState('2026-10-24');
  const [timeSlot, setTimeSlot] = useState('10:30 AM – 12:30 PM');
  const [visitorCount, setVisitorCount] = useState(2);
  const [purpose, setPurpose] = useState('Inspect Robotics lab & discuss B.Tech CS admission');
  const [isLoading, setIsLoading] = useState(false);
  const [confirmedVisit, setConfirmedVisit] = useState<any | null>(null);

  const availableSlots = [
    '09:30 AM – 11:30 AM (Morning Batch)',
    '10:30 AM – 12:30 PM (Main Session)',
    '02:00 PM – 04:00 PM (Afternoon Batch)',
    '04:00 PM – 06:00 PM (Evening Tour & Labs)',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newVisit = await api.post('/visits', {
        date,
        timeSlot,
        visitorCount,
        purpose,
      });

      setConfirmedVisit(newVisit);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#7C5CBF', '#B9A6E8', '#5BAE8A'],
        });
      } catch {}
    } catch (err: any) {
      alert(err.message || 'Failed to book visit.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9E0FA] text-[#5B3FA0] text-xs font-semibold mb-2">
          <CalendarIcon className="w-3.5 h-3.5" />
          Campus Admissions Cell
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#2D2442]">
          Book In-Person Campus Visit
        </h1>
        <p className="text-xs sm:text-sm text-[#7A6F8F] mt-1">
          Tour our 48-acre facility, meet faculty mentors, and inspect resident halls in person
        </p>
      </div>

      {confirmedVisit ? (
        /* Confirmed Visit Pass View */
        <div className="space-y-6">
          <Card
            variant="white"
            padding="lg"
            className="border-[#DDD2F3] shadow-purple-lg print:border-none print:shadow-none"
            id="campus-pass-card"
          >
            <div className="border-b border-[#DDD2F3] pb-4 mb-5 flex items-center justify-between">
              <div>
                <Badge variant="success" dot>
                  Confirmed Visitor Pass
                </Badge>
                <h3 className="text-xl font-bold text-[#2D2442] mt-1.5">
                  Apex Institute of Technology & Sciences
                </h3>
                <p className="text-xs text-[#7A6F8F]">
                  Gate 1 Welcome Reception • Verification Pass
                </p>
              </div>

              {/* Pass Code Pill */}
              <div className="text-right">
                <span className="text-[11px] text-[#7A6F8F] uppercase tracking-wider block font-semibold">
                  Pass ID
                </span>
                <span className="text-lg font-mono font-bold text-[#7C5CBF]">
                  {confirmedVisit.passCode}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Visit Details */}
              <div className="md:col-span-2 space-y-3.5 text-xs sm:text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-[#FAF7FF] rounded-xl border border-[#DDD2F3]/60">
                    <span className="text-[#7A6F8F] block text-xs">Scheduled Date</span>
                    <strong className="text-[#2D2442] font-semibold text-sm">
                      {new Date(confirmedVisit.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </strong>
                  </div>

                  <div className="p-3 bg-[#FAF7FF] rounded-xl border border-[#DDD2F3]/60">
                    <span className="text-[#7A6F8F] block text-xs">Time Slot</span>
                    <strong className="text-[#2D2442] font-semibold text-sm">
                      {confirmedVisit.timeSlot}
                    </strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-[#FAF7FF] rounded-xl border border-[#DDD2F3]/60">
                    <span className="text-[#7A6F8F] block text-xs">Visitor Name</span>
                    <strong className="text-[#2D2442] font-semibold">{confirmedVisit.userName}</strong>
                  </div>

                  <div className="p-3 bg-[#FAF7FF] rounded-xl border border-[#DDD2F3]/60">
                    <span className="text-[#7A6F8F] block text-xs">Total Guests</span>
                    <strong className="text-[#2D2442] font-semibold">{confirmedVisit.visitorCount} Persons</strong>
                  </div>
                </div>

                <div className="p-3 bg-[#FAF7FF] rounded-xl border border-[#DDD2F3]/60">
                  <span className="text-[#7A6F8F] block text-xs">Host / Assigned Representative</span>
                  <strong className="text-[#5B3FA0] font-semibold">{confirmedVisit.repName || 'Dr. Priya Nair'}</strong>
                </div>

                <div className="p-3 bg-[#FAF7FF] rounded-xl border border-[#DDD2F3]/60">
                  <span className="text-[#7A6F8F] block text-xs">Purpose</span>
                  <span className="text-[#2D2442]">{confirmedVisit.purpose}</span>
                </div>
              </div>

              {/* QR Code Column */}
              <div className="flex flex-col items-center justify-center p-4 bg-[#FAF7FF] rounded-2xl border border-[#DDD2F3] text-center">
                <div className="w-36 h-36 bg-white p-2.5 rounded-2xl border border-[#DDD2F3] shadow-sm flex items-center justify-center mb-3">
                  <QrCode className="w-28 h-28 text-[#2D2442]" />
                </div>
                <span className="text-[11px] text-[#7A6F8F]">
                  Show this QR at Welcome Gate 1 for priority entry & guest parking
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#DDD2F3] flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-[#7A6F8F]">
                Free parking assigned at Bay P-2 • Complementary cafeteria dining voucher included
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  icon={<Printer className="w-4 h-4" />}
                >
                  Print Pass
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setConfirmedVisit(null)}
                >
                  Book Another Visit
                </Button>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        /* Booking Form */
        <Card padding="lg" className="border-[#DDD2F3] shadow-purple-soft">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#2D2442] mb-1">
                  Preferred Visit Date *
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2D2442] mb-1">
                  Total Attendees (Including Parents) *
                </label>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setVisitorCount(count)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        visitorCount === count
                          ? 'bg-[#7C5CBF] text-white border-[#7C5CBF] shadow-sm'
                          : 'bg-[#FAF7FF]/50 border-[#DDD2F3] text-[#2D2442] hover:bg-white'
                      }`}
                    >
                      {count} {count === 1 ? 'Person' : 'People'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#2D2442] mb-2">
                Select Guided Tour Time Slot *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {availableSlots.map((slot) => {
                  const isSelected = timeSlot === slot;
                  return (
                    <div
                      key={slot}
                      onClick={() => setTimeSlot(slot)}
                      className={`p-3 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#E9E0FA]/60 border-[#7C5CBF] text-[#5B3FA0] font-semibold'
                          : 'bg-[#FAF7FF]/50 border-[#DDD2F3] text-[#2D2442] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#7C5CBF]" />
                        <span>{slot}</span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'bg-[#7C5CBF] border-[#7C5CBF] text-white' : 'border-[#DDD2F3]'
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#2D2442] mb-1">
                Specific Interests / Purpose of Visit
              </label>
              <textarea
                rows={3}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Would like to see the NVIDIA robotics lab, girls hostel safety systems, and meet the CSE department head..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50 resize-none"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              isLoading={isLoading}
              icon={<CheckCircle2 className="w-4 h-4" />}
            >
              Confirm Campus Visit Pass
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
};
