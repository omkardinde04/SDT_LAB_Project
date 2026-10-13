import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { PhoneCall, CheckCircle } from 'lucide-react';
import { api } from '../lib/api';

interface CallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCounsellor?: string;
}

export const CallbackModal: React.FC<CallbackModalProps> = ({
  isOpen,
  onClose,
  defaultCounsellor = 'Admissions & Fee Specialist',
}) => {
  const [parentName, setParentName] = useState('');
  const [mobile, setMobile] = useState('');
  const [childName, setChildName] = useState('');
  const [preferredTime, setPreferredTime] = useState('Today, Afternoon (02:00 PM – 05:00 PM)');
  const [counsellorType, setCounsellorType] = useState(defaultCounsellor);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!parentName.trim() || !mobile.trim()) {
      setError('Please provide parent name and mobile number.');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/callback', {
        parentName,
        mobile,
        childName,
        preferredTime,
        counsellorType,
        notes,
      });
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit callback request.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setParentName('');
    setMobile('');
    setChildName('');
    setNotes('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title="Request Priority Call Back"
      description="Speak directly with an authorized college dean or admissions counsellor."
    >
      {isSuccess ? (
        <div className="py-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#5BAE8A]/20 text-[#2E7D5C] mx-auto flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-[#5BAE8A]" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-[#2D2442]">Call Request Registered!</h4>
            <p className="text-sm text-[#7A6F8F] mt-1 max-w-sm mx-auto">
              Our {counsellorType} will contact you at <strong>{mobile}</strong> during your preferred window ({preferredTime}).
            </p>
          </div>
          <Button variant="primary" onClick={handleReset} className="mt-2">
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-50 text-rose-600 rounded-xl border border-rose-200">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#2D2442] mb-1">
                Parent / Guardian Name *
              </label>
              <input
                type="text"
                required
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="e.g. Rajesh Sharma"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#2D2442] mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+91 98765 00000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#2D2442] mb-1">
                Candidate / Child Name
              </label>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#2D2442] mb-1">
                Department / Specialist
              </label>
              <select
                value={counsellorType}
                onChange={(e) => setCounsellorType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-white"
              >
                <option value="Admissions & Fee Specialist">Admissions & Fee Specialist</option>
                <option value="Hostel & Student Safety Warden">Hostel & Student Safety Warden</option>
                <option value="Scholarship & Financial Aid Cell">Scholarship & Financial Aid Cell</option>
                <option value="Engineering Academic Dean">Engineering Academic Dean</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#2D2442] mb-1">
              Preferred Callback Time
            </label>
            <select
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-white"
            >
              <option value="Within 30 minutes (Urgent)">Within 30 minutes (Urgent)</option>
              <option value="Today, Afternoon (02:00 PM – 05:00 PM)">Today, Afternoon (02:00 PM – 05:00 PM)</option>
              <option value="Today, Evening (05:00 PM – 08:00 PM)">Today, Evening (05:00 PM – 08:00 PM)</option>
              <option value="Tomorrow Morning (10:00 AM – 01:00 PM)">Tomorrow Morning (10:00 AM – 01:00 PM)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#2D2442] mb-1">
              Specific Query / Topic (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Questions regarding mess dietary choices, loan subsidy, or JEE cutoff..."
              className="w-full px-3.5 py-2 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#DDD2F3]">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              icon={<PhoneCall className="w-4 h-4" />}
            >
              Request Call Now
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
