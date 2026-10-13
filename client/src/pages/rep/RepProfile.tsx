import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Headphones, ShieldCheck, Clock, Check } from 'lucide-react';

export const RepProfile: React.FC = () => {
  const { user, profile, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [department, setDepartment] = useState(profile?.department || 'Admissions Advisory');
  const [title, setTitle] = useState(profile?.title || 'Senior Admissions Counsellor');
  const [status, setStatus] = useState<'online' | 'busy' | 'offline'>(
    profile?.status || 'online'
  );
  const [replyTime, setReplyTime] = useState(profile?.replyTime || 'Usually under 3 minutes');
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile({
        name,
        department,
        title,
        status,
        replyTime,
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#2D2442]">
          Representative Profile & Availability
        </h1>
        <p className="text-xs sm:text-sm text-[#7A6F8F] mt-1">
          Configure how prospective applicants and parents see your online counselling status
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card padding="md" className="border-[#DDD2F3] text-center space-y-3">
          <div className="relative inline-block mx-auto">
            <img
              src={
                user?.avatar ||
                'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80'
              }
              alt={user?.name}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-[#DDD2F3] mx-auto"
            />
            <span
              className={`absolute bottom-1 right-1 w-4 h-4 rounded-full ring-2 ring-white ${
                status === 'online' ? 'bg-[#5BAE8A]' : status === 'busy' ? 'bg-[#E3A94B]' : 'bg-gray-400'
              }`}
            />
          </div>

          <div>
            <h3 className="font-semibold text-base text-[#2D2442]">{user?.name}</h3>
            <p className="text-xs text-[#7A6F8F]">{title}</p>
          </div>

          <Badge variant={status === 'online' ? 'success' : 'warning'} dot>
            {status.toUpperCase()}
          </Badge>

          <div className="pt-3 border-t border-[#DDD2F3]/60 text-xs text-[#7A6F8F] space-y-1 text-left">
            <div><strong>Department:</strong> {department}</div>
            <div><strong>Rating:</strong> ⭐ 4.9 (480 reviews)</div>
            <div><strong>Reply Pace:</strong> {replyTime}</div>
          </div>
        </Card>

        <div className="md:col-span-2">
          <Card padding="lg" className="border-[#DDD2F3]">
            <h3 className="font-semibold text-base text-[#2D2442] mb-4">
              Availability & Duty Settings
            </h3>

            {isSaved && (
              <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl flex items-center gap-2 border border-emerald-200">
                <Check className="w-4 h-4 text-emerald-600" />
                Representative settings updated successfully!
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              {/* Online status chips */}
              <div>
                <label className="block text-xs font-medium text-[#2D2442] mb-1.5">
                  Current Presence Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['online', 'busy', 'offline'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatus(st)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold capitalize border transition-all cursor-pointer ${
                        status === st
                          ? st === 'online'
                            ? 'bg-emerald-50 border-[#5BAE8A] text-emerald-700 shadow-xs'
                            : 'bg-amber-50 border-amber-300 text-amber-800 shadow-xs'
                          : 'bg-white border-[#DDD2F3] text-[#7A6F8F]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#2D2442] mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#2D2442] mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2D2442] mb-1">
                  Reply-Time Hint
                </label>
                <input
                  type="text"
                  value={replyTime}
                  onChange={(e) => setReplyTime(e.target.value)}
                  placeholder="e.g. Usually within 3 minutes"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
              >
                Save Availability Updates
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
