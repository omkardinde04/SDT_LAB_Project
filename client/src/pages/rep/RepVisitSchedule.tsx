import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { VisitBooking } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import {
  CalendarCheck,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  Calendar,
  Phone,
  Mail,
  RotateCcw,
} from 'lucide-react';

export const RepVisitSchedule: React.FC = () => {
  const [visits, setVisits] = useState<VisitBooking[]>([]);
  const [filterView, setFilterView] = useState<'all' | 'today' | 'week'>('all');
  const [rescheduleTarget, setRescheduleTarget] = useState<VisitBooking | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState('10:30 AM – 12:30 PM');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      const data = await api.get<VisitBooking[]>('/visits');
      setVisits(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'confirmed' | 'completed' | 'cancelled') => {
    try {
      await api.patch(`/visits/${id}`, { status });
      setVisits((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleTarget) return;

    try {
      await api.patch(`/visits/${rescheduleTarget.id}`, {
        status: 'rescheduled',
        date: newDate || rescheduleTarget.date,
        timeSlot: newSlot,
      });
      setVisits((prev) =>
        prev.map((v) =>
          v.id === rescheduleTarget.id
            ? { ...v, status: 'rescheduled', date: newDate || v.date, timeSlot: newSlot }
            : v
        )
      );
      setRescheduleTarget(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9E0FA] text-[#5B3FA0] text-xs font-semibold mb-2">
            <CalendarCheck className="w-3.5 h-3.5" />
            Admissions Tour Coordination
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#2D2442]">
            Campus Visit Schedule & Appointments
          </h1>
          <p className="text-xs sm:text-sm text-[#7A6F8F] mt-1">
            Accept upcoming prospective applicant visits, reschedule slots, and verify gate passes
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-[#DDD2F3] shadow-xs">
          {(['all', 'today', 'week'] as const).map((view) => (
            <button
              key={view}
              onClick={() => setFilterView(view)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                filterView === view
                  ? 'bg-[#7C5CBF] text-white shadow-xs'
                  : 'text-[#7A6F8F] hover:text-[#2D2442]'
              }`}
            >
              {view === 'all' ? 'All Bookings' : view === 'today' ? "Today's Tours" : 'This Week'}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table / Cards Grid */}
      <div className="space-y-4">
        {visits.map((v) => (
          <Card key={v.id} padding="lg" className="border-[#DDD2F3]">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
              {/* Left Column: Visitor Details */}
              <div className="space-y-2.5 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant={
                      v.status === 'confirmed'
                        ? 'success'
                        : v.status === 'rescheduled'
                        ? 'warning'
                        : 'lavender'
                    }
                    dot
                  >
                    {v.status.toUpperCase()}
                  </Badge>
                  <span className="font-mono text-xs font-bold text-[#7C5CBF] bg-[#FAF7FF] px-2 py-0.5 rounded-md border border-[#DDD2F3]">
                    {v.passCode}
                  </span>
                  <Badge variant="outline" size="sm">
                    {v.userRole.toUpperCase()}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-[#2D2442]">
                    {v.userName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#7A6F8F] mt-1">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      {v.userEmail}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      {v.userMobile}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {v.visitorCount} Guests
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-[#FAF7FF] rounded-xl border border-[#DDD2F3]/60 text-xs">
                  <span className="text-[#7A6F8F] font-medium">Stated Interest: </span>
                  <span className="text-[#2D2442]">{v.purpose}</span>
                </div>
              </div>

              {/* Middle: Date and Slot */}
              <div className="bg-[#FAF7FF] p-3.5 rounded-2xl border border-[#DDD2F3] text-center shrink-0 min-w-[200px]">
                <span className="text-[11px] text-[#7A6F8F] block">Schedule Slot</span>
                <strong className="text-sm font-semibold text-[#2D2442] block mt-0.5">
                  {new Date(v.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </strong>
                <span className="text-xs text-[#7C5CBF] font-medium block mt-1">
                  {v.timeSlot}
                </span>
              </div>

              {/* Right Column: Actions */}
              <div className="flex flex-wrap lg:flex-col gap-2 shrink-0 w-full sm:w-auto">
                {v.status !== 'confirmed' && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleUpdateStatus(v.id, 'confirmed')}
                    icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  >
                    Accept Visit
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setRescheduleTarget(v);
                    setNewDate(v.date);
                    setNewSlot(v.timeSlot);
                  }}
                  icon={<RotateCcw className="w-3.5 h-3.5" />}
                >
                  Reschedule
                </Button>

                {v.status === 'confirmed' && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleUpdateStatus(v.id, 'completed')}
                  >
                    Mark Visited
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Reschedule Modal */}
      {rescheduleTarget && (
        <Modal
          isOpen={Boolean(rescheduleTarget)}
          onClose={() => setRescheduleTarget(null)}
          title="Reschedule Campus Visit"
          description={`Updating appointment for ${rescheduleTarget.userName} (${rescheduleTarget.passCode})`}
        >
          <form onSubmit={handleRescheduleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#2D2442] mb-1">
                New Visit Date
              </label>
              <input
                type="date"
                required
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#2D2442] mb-1">
                New Time Slot
              </label>
              <select
                value={newSlot}
                onChange={(e) => setNewSlot(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-white"
              >
                <option value="09:30 AM – 11:30 AM (Morning Batch)">09:30 AM – 11:30 AM (Morning Batch)</option>
                <option value="10:30 AM – 12:30 PM (Main Session)">10:30 AM – 12:30 PM (Main Session)</option>
                <option value="02:00 PM – 04:00 PM (Afternoon Batch)">02:00 PM – 04:00 PM (Afternoon Batch)</option>
                <option value="04:00 PM – 06:00 PM (Evening Tour & Labs)">04:00 PM – 06:00 PM (Evening Tour & Labs)</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#DDD2F3]">
              <Button type="button" variant="ghost" onClick={() => setRescheduleTarget(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save & Notify Visitor
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
