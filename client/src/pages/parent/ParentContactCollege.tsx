import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CallbackModal } from '../../components/CallbackModal';
import { Modal } from '../../components/ui/Modal';
import {
  Headphones,
  PhoneCall,
  Calendar,
  MessageSquare,
  ShieldCheck,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

export const ParentContactCollege: React.FC = () => {
  const navigate = useNavigate();
  const [showCallbackModal, setShowCallbackModal] = useState(false);
  const [showFacultyModal, setShowFacultyModal] = useState(false);
  const [facultyMeetingSubmitted, setFacultyMeetingSubmitted] = useState(false);

  // Faculty meeting form fields
  const [professorName, setProfessorName] = useState('Dr. Anand Ramanujan (Dean, Computing)');
  const [meetingDate, setMeetingDate] = useState('2026-10-25');
  const [meetingSlot, setMeetingSlot] = useState('03:00 PM – 03:45 PM');
  const [notes, setNotes] = useState('');

  const counsellors = [
    {
      name: 'Dr. Priya Nair',
      role: 'Senior Admissions & Academic Advisory',
      status: 'online',
      replyTime: 'Within 3 minutes',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80',
      phone: '+91 80 2845 7001',
    },
    {
      name: 'Mrs. Rohini Deshmukh',
      role: 'Fee Structure, Loans & Scholarship Head',
      status: 'online',
      replyTime: 'Within 5 minutes',
      image: 'https://images.unsplash.com/photo-1580894732454-defa563b7497?auto=format&fit=crop&w=200&q=80',
      phone: '+91 80 2845 7002',
    },
    {
      name: 'Col. Shantanu Sen (Retd.)',
      role: 'Chief Warden & Student Safety Director',
      status: 'busy',
      replyTime: 'Within 15 minutes',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      phone: '+91 80 2845 7003',
    },
  ];

  const handleFacultySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFacultyMeetingSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9E0FA] text-[#5B3FA0] text-xs font-semibold mb-2">
            <Headphones className="w-3.5 h-3.5" />
            Direct Communication Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#2D2442]">
            Contact Admissions & Faculty Leaders
          </h1>
          <p className="text-xs sm:text-sm text-[#7A6F8F] mt-1">
            Connect directly with department heads, fee loan counsellors, and student safety wardens
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="md"
            onClick={() => setShowFacultyModal(true)}
            icon={<Calendar className="w-4 h-4" />}
          >
            Book Faculty Meeting
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => setShowCallbackModal(true)}
            icon={<PhoneCall className="w-4 h-4" />}
          >
            Request Instant Call Back
          </Button>
        </div>
      </div>

      {/* Counsellors Directory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {counsellors.map((c) => (
          <Card key={c.name} padding="lg" className="border-[#DDD2F3] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="relative">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#DDD2F3]"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ring-2 ring-white ${
                      c.status === 'online' ? 'bg-[#5BAE8A]' : 'bg-[#E3A94B]'
                    }`}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-base text-[#2D2442]">{c.name}</h3>
                  </div>
                  <p className="text-xs text-[#7A6F8F]">{c.role}</p>
                </div>
              </div>

              <div className="p-3 bg-[#FAF7FF] rounded-xl border border-[#DDD2F3]/60 text-xs space-y-1">
                <div className="flex items-center justify-between text-[#7A6F8F]">
                  <span>Status:</span>
                  <Badge variant={c.status === 'online' ? 'success' : 'warning'} size="sm" dot>
                    {c.status === 'online' ? 'Online' : 'In Consultation'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-[#7A6F8F]">
                  <span>Avg Reply:</span>
                  <strong className="text-[#2D2442]">{c.replyTime}</strong>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#DDD2F3]/60 flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={() => navigate('/student/chat')}
                icon={<MessageSquare className="w-3.5 h-3.5" />}
              >
                Chat Live
              </Button>
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => setShowCallbackModal(true)}
                icon={<PhoneCall className="w-3.5 h-3.5" />}
              >
                Call Back
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Modals */}
      <CallbackModal
        isOpen={showCallbackModal}
        onClose={() => setShowCallbackModal(false)}
      />

      {/* Book Faculty Meeting Modal */}
      <Modal
        isOpen={showFacultyModal}
        onClose={() => {
          setShowFacultyModal(false);
          setFacultyMeetingSubmitted(false);
        }}
        title="Schedule Dean / Faculty Consultation"
        description="Book a dedicated 1-on-1 virtual or in-person consultation with academic faculty."
      >
        {facultyMeetingSubmitted ? (
          <div className="py-6 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-[#5BAE8A] mx-auto" />
            <h4 className="text-base font-semibold text-[#2D2442]">
              Consultation Scheduled!
            </h4>
            <p className="text-xs text-[#7A6F8F] max-w-sm mx-auto">
              You will receive an SMS and calendar invite for your meeting with {professorName} on {meetingDate} at {meetingSlot}.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setShowFacultyModal(false);
                setFacultyMeetingSubmitted(false);
              }}
              className="mt-2"
            >
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleFacultySubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#2D2442] mb-1">
                Select Department Head / Professor
              </label>
              <select
                value={professorName}
                onChange={(e) => setProfessorName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
              >
                <option value="Dr. Anand Ramanujan (Dean, Computing & AI)">
                  Dr. Anand Ramanujan (Dean, Computing & AI)
                </option>
                <option value="Prof. Gayatri Sen (Head, Robotics)">
                  Prof. Gayatri Sen (Head, Robotics)
                </option>
                <option value="Dr. M. K. Narayanan (Director, Placements)">
                  Dr. M. K. Narayanan (Director, Placements)
                </option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#2D2442] mb-1">
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2D2442] mb-1">
                  Time Slot
                </label>
                <select
                  value={meetingSlot}
                  onChange={(e) => setMeetingSlot(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
                >
                  <option value="11:30 AM – 12:15 PM">11:30 AM – 12:15 PM</option>
                  <option value="03:00 PM – 03:45 PM">03:00 PM – 03:45 PM</option>
                  <option value="04:30 PM – 05:15 PM">04:30 PM – 05:15 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#2D2442] mb-1">
                Agenda / Topics to Discuss
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Electives in 3rd year, international exchange, research internships..."
                className="w-full px-3.5 py-2 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#DDD2F3]">
              <Button type="button" variant="ghost" onClick={() => setShowFacultyModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Confirm Meeting
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
