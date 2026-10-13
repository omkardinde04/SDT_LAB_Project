import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { User, Mail, Phone, MapPin, BookOpen, Heart, Bell, Calendar, Check } from 'lucide-react';
import { VisitBooking, Notification } from '../../types';

export const StudentProfile: React.FC = () => {
  const { user, profile, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [board, setBoard] = useState(profile?.board || 'CBSE');
  const [stream, setStream] = useState(profile?.stream || 'Science (PCM)');
  const [preferredCity, setPreferredCity] = useState(profile?.preferredCity || 'Bengaluru');
  const [visits, setVisits] = useState<VisitBooking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    api.get<VisitBooking[]>('/visits').then(setVisits).catch(() => {});
    api.get<Notification[]>('/notifications').then(setNotifications).catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile({
        name,
        mobile,
        board,
        stream,
        preferredCity,
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#2D2442]">
          Student Profile & History
        </h1>
        <p className="text-xs sm:text-sm text-[#7A6F8F] mt-1">
          Manage your contact credentials, academic stream, and booked tour visits
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: User Card */}
        <Card padding="md" className="border-[#DDD2F3] text-center space-y-3">
          <div className="relative inline-block mx-auto">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80'}
              alt={user?.name}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-[#DDD2F3] mx-auto"
            />
            <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#5BAE8A] ring-2 ring-white" />
          </div>

          <div>
            <h3 className="font-semibold text-base text-[#2D2442]">{user?.name}</h3>
            <p className="text-xs text-[#7A6F8F]">{user?.email}</p>
          </div>

          <Badge variant="primary" size="sm">
            Prospective Student
          </Badge>

          <div className="pt-3 border-t border-[#DDD2F3]/60 text-xs text-[#7A6F8F] space-y-1.5 text-left">
            <div><strong>Registered Mobile:</strong> {user?.mobile}</div>
            <div><strong>Board:</strong> {board}</div>
            <div><strong>Stream:</strong> {stream}</div>
          </div>
        </Card>

        {/* Right: Editable Form */}
        <div className="md:col-span-2">
          <Card padding="lg" className="border-[#DDD2F3]">
            <h3 className="font-semibold text-base text-[#2D2442] mb-4">
              Academic & Contact Preferences
            </h3>

            {isSaved && (
              <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl flex items-center gap-2 border border-emerald-200">
                <Check className="w-4 h-4 text-emerald-600" />
                Profile changes saved successfully!
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#2D2442] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#2D2442] mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#2D2442] mb-1">
                    Education Board
                  </label>
                  <input
                    type="text"
                    value={board}
                    onChange={(e) => setBoard(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#2D2442] mb-1">
                    Preferred Campus City
                  </label>
                  <input
                    type="text"
                    value={preferredCity}
                    onChange={(e) => setPreferredCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2D2442] mb-1">
                  12th Subject Stream
                </label>
                <input
                  type="text"
                  value={stream}
                  onChange={(e) => setStream(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
              >
                Save Profile Updates
              </Button>
            </form>
          </Card>
        </div>
      </div>

      {/* Booked Visits History */}
      <Card padding="lg" className="border-[#DDD2F3]">
        <h3 className="font-semibold text-base text-[#2D2442] mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#7C5CBF]" />
          Booked Campus Visits History
        </h3>

        {visits.length === 0 ? (
          <p className="text-xs text-[#7A6F8F]">No campus visits booked yet.</p>
        ) : (
          <div className="space-y-2.5">
            {visits.map((v) => (
              <div
                key={v.id}
                className="p-3 rounded-xl border border-[#DDD2F3] bg-[#FAF7FF]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <strong className="text-sm font-semibold text-[#2D2442]">
                      {new Date(v.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </strong>
                    <Badge variant={v.status === 'confirmed' ? 'success' : 'warning'} size="sm">
                      {v.status.toUpperCase()}
                    </Badge>
                    <span className="font-mono text-[#7A6F8F]">Pass: {v.passCode}</span>
                  </div>
                  <p className="text-[#7A6F8F]">
                    Slot: {v.timeSlot} • {v.visitorCount} Visitors • Host: {v.repName || 'Dr. Priya Nair'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
