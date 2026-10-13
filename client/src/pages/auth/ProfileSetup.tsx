import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Sparkles, Check, ArrowRight } from 'lucide-react';

export const ProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();

  // Student Fields
  const [board, setBoard] = useState('CBSE');
  const [stream, setStream] = useState('Science (Physics, Chemistry, Maths, CS)');
  const [preferredCity, setPreferredCity] = useState('Bengaluru');

  // Parent Fields
  const [childName, setChildName] = useState('');
  const [childStream, setChildStream] = useState('12th Standard (PCM)');
  const [budgetPreference, setBudgetPreference] = useState('₹14L - ₹20L All Inclusive');

  // Rep Fields
  const [department, setDepartment] = useState('Admissions & Academic Advisory');
  const [title, setTitle] = useState('Senior Admissions Counsellor');

  // Selected Courses
  const [interestedCourses, setInterestedCourses] = useState<string[]>([
    'B.Tech Computer Science & AI',
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const availableCourses = [
    'B.Tech Computer Science & AI',
    'B.Tech Robotics & Autonomous Systems',
    'B.Des Interactive Design & HCI',
    'MBA Tech Management & Business Analytics',
  ];

  const toggleCourse = (c: string) => {
    setInterestedCourses((prev) =>
      prev.includes(c) ? prev.filter((item) => item !== c) : [...prev, c]
    );
  };

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (user?.role === 'student') {
        await updateProfile({
          board,
          stream,
          preferredCity,
          interestedCourses,
        });
        navigate('/student/dashboard');
      } else if (user?.role === 'parent') {
        await updateProfile({
          childName,
          childStream,
          budgetPreference,
          interestedCourses,
        });
        navigate('/parent/dashboard');
      } else if (user?.role === 'rep') {
        await updateProfile({
          department,
          title,
        });
        navigate('/rep/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      console.error(err);
      // Fallback redirect
      navigate(
        user?.role === 'student'
          ? '/student/dashboard'
          : user?.role === 'parent'
          ? '/parent/dashboard'
          : user?.role === 'rep'
          ? '/rep/dashboard'
          : '/admin/dashboard'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const roleTitle =
    user?.role === 'student'
      ? 'Student Academic Preferences'
      : user?.role === 'parent'
      ? 'Family & Aspirant Profile'
      : user?.role === 'rep'
      ? 'Representative Credentials'
      : 'Administrator Setup';

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 lavender-header-bg">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9E0FA] text-[#5B3FA0] text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Step 2 of 2: Personalize Experience
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold text-[#2D2442] tracking-tight">
          {roleTitle}
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-[#7A6F8F]">
          Tailor your campus recommendations, fee calculators, and counselling alerts
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <Card padding="lg" className="border-[#DDD2F3] shadow-purple-lg">
          <form onSubmit={handleComplete} className="space-y-4">
            {/* Student specific fields */}
            {user?.role === 'student' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#2D2442] mb-1">
                      Education Board
                    </label>
                    <select
                      value={board}
                      onChange={(e) => setBoard(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
                    >
                      <option value="CBSE">CBSE (Class 12)</option>
                      <option value="ICSE / ISC">ISC (Class 12)</option>
                      <option value="State Board">State Higher Secondary</option>
                      <option value="IB / Cambridge">IB / Cambridge Diploma</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#2D2442] mb-1">
                      Preferred City
                    </label>
                    <input
                      type="text"
                      value={preferredCity}
                      onChange={(e) => setPreferredCity(e.target.value)}
                      placeholder="e.g. Bengaluru, Pune"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#2D2442] mb-1">
                    Current Stream / Subject Combination
                  </label>
                  <input
                    type="text"
                    value={stream}
                    onChange={(e) => setStream(e.target.value)}
                    placeholder="e.g. PCM with Computer Science"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
                  />
                </div>
              </>
            )}

            {/* Parent specific fields */}
            {user?.role === 'parent' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#2D2442] mb-1">
                      Candidate's Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#2D2442] mb-1">
                      Target Academic Batch
                    </label>
                    <input
                      type="text"
                      value={childStream}
                      onChange={(e) => setChildStream(e.target.value)}
                      placeholder="e.g. 12th PCM (2026 Batch)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#2D2442] mb-1">
                    Target 4-Year Budget Preference
                  </label>
                  <select
                    value={budgetPreference}
                    onChange={(e) => setBudgetPreference(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
                  >
                    <option value="Under ₹12 Lakhs">Under ₹12 Lakhs (Subsidized/Scholarship)</option>
                    <option value="₹12L - ₹16L">₹12 Lakhs – ₹16 Lakhs</option>
                    <option value="₹16L - ₹20L">₹16 Lakhs – ₹20 Lakhs</option>
                    <option value="₹20L+">Flexible / Premium Tier</option>
                  </select>
                </div>
              </>
            )}

            {/* Rep specific fields */}
            {user?.role === 'rep' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-[#2D2442] mb-1">
                    Designated Department
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
                    Official Title / Designation
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
                  />
                </div>
              </>
            )}

            {/* Courses of Interest for Student & Parent */}
            {(user?.role === 'student' || user?.role === 'parent') && (
              <div>
                <label className="block text-xs font-medium text-[#2D2442] mb-2">
                  Interested Undergraduate / Postgraduate Programs
                </label>
                <div className="space-y-2">
                  {availableCourses.map((c) => {
                    const isSelected = interestedCourses.includes(c);
                    return (
                      <div
                        key={c}
                        onClick={() => toggleCourse(c)}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#E9E0FA]/60 border-[#7C5CBF] text-[#5B3FA0] font-semibold'
                            : 'bg-[#FAF7FF]/50 border-[#DDD2F3] text-[#2D2442] hover:bg-white'
                        }`}
                      >
                        <span>{c}</span>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                            isSelected
                              ? 'bg-[#7C5CBF] border-[#7C5CBF] text-white'
                              : 'border-[#DDD2F3] bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              isLoading={isLoading}
              className="mt-6"
            >
              Save Profile & Launch Dashboard
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
