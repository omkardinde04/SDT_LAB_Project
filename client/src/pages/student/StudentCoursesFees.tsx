import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Course, Scholarship } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { FeeSheetModal } from '../../components/FeeSheetModal';
import { Skeleton } from '../../components/ui/Skeleton';
import {
  GraduationCap,
  Clock,
  Users,
  Award,
  TrendingUp,
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const StudentCoursesFees: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [selectedCourseForFee, setSelectedCourseForFee] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [crsData, schData] = await Promise.all([
          api.get<Course[]>('/courses'),
          api.get<Scholarship[]>('/scholarships'),
        ]);
        setCourses(crsData);
        setScholarships(schData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9E0FA] text-[#5B3FA0] text-xs font-semibold mb-2">
          <GraduationCap className="w-3.5 h-3.5" />
          Academic Programs 2026–27
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#2D2442]">
          Courses & Fee Breakdown
        </h1>
        <p className="text-xs sm:text-sm text-[#7A6F8F] mt-1">
          Industry-aligned curricula with transparent year-wise fee structures and merit scholarships
        </p>
      </div>

      {/* Courses Catalog */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-white rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-5">
          {courses.map((course) => {
            const annualTotal = course.fees?.breakdown[0]?.total || 0;
            const grandTotal = course.fees?.breakdown.reduce((s, r) => s + r.total, 0) || 0;

            return (
              <Card key={course.id} padding="lg" className="border-[#DDD2F3]">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  {/* Left Column: Course Specs */}
                  <div className="space-y-3 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="primary">{course.code}</Badge>
                      <Badge variant="outline">{course.department}</Badge>
                      <Badge variant="lavender" size="sm">
                        Highest CTC: {course.highestPackage}
                      </Badge>
                    </div>

                    <h3 className="text-xl font-semibold text-[#2D2442]">
                      {course.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#7A6F8F] leading-relaxed">
                      {course.description}
                    </p>

                    {/* Eligibility & Metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-[#FAF7FF] border border-[#DDD2F3]/60">
                        <span className="text-[#7A6F8F] block">Duration</span>
                        <strong className="text-[#2D2442]">{course.durationYears} Years</strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#FAF7FF] border border-[#DDD2F3]/60">
                        <span className="text-[#7A6F8F] block">Total Intake</span>
                        <strong className="text-[#2D2442]">{course.totalSeats} Seats</strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#FAF7FF] border border-[#DDD2F3]/60">
                        <span className="text-[#7A6F8F] block">Average CTC</span>
                        <strong className="text-[#5BAE8A]">{course.avgPackage}</strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#FAF7FF] border border-[#DDD2F3]/60">
                        <span className="text-[#7A6F8F] block">Starting EMI</span>
                        <strong className="text-[#5B3FA0]">₹{course.fees?.emiStartsAt.toLocaleString('en-IN')}/mo</strong>
                      </div>
                    </div>

                    <div className="text-xs text-[#7A6F8F]">
                      <strong className="text-[#2D2442]">Eligibility: </strong>
                      {course.eligibility}
                    </div>
                  </div>

                  {/* Right Column: Fee Box & Action */}
                  <div className="w-full lg:w-72 bg-[#FAF7FF] p-5 rounded-2xl border border-[#DDD2F3] text-center space-y-3 shrink-0">
                    <span className="text-xs text-[#7A6F8F] uppercase font-semibold tracking-wider block">
                      Year 1 All-Inclusive
                    </span>
                    <div className="text-2xl sm:text-3xl font-bold text-[#7C5CBF]">
                      ₹{annualTotal.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-[#7A6F8F]">
                      Total {course.durationYears}-Year Investment:{' '}
                      <strong className="text-[#2D2442]">
                        ₹{(grandTotal / 100000).toFixed(1)} Lakhs
                      </strong>
                    </div>

                    <Button
                      variant="primary"
                      fullWidth
                      size="md"
                      onClick={() => setSelectedCourseForFee(course)}
                      icon={<FileText className="w-4 h-4" />}
                    >
                      View Full Fee Sheet
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Scholarships Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#2D2442]">Scholarships & Financial Aid</h2>
            <p className="text-xs text-[#7A6F8F]">Available for 2026 batch academic applicants</p>
          </div>
          <Badge variant="success" dot>
            Applications Active
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scholarships.map((sch) => (
            <Card key={sch.id} padding="md" className="border-[#DDD2F3]">
              <div className="flex items-start justify-between gap-2 mb-2">
                <Badge variant="lavender" size="sm">
                  {sch.badge}
                </Badge>
                <span className="text-[11px] text-[#7A6F8F]">Deadline: {sch.deadline}</span>
              </div>
              <h4 className="font-semibold text-sm text-[#2D2442] mb-1">{sch.title}</h4>
              <div className="text-xs font-semibold text-[#5BAE8A] mb-2">{sch.coverage}</div>
              <p className="text-xs text-[#7A6F8F] leading-relaxed mb-3">
                <strong>Eligibility: </strong>
                {sch.eligibility}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Fee Sheet Modal */}
      {selectedCourseForFee && selectedCourseForFee.fees && (
        <FeeSheetModal
          isOpen={Boolean(selectedCourseForFee)}
          onClose={() => setSelectedCourseForFee(null)}
          course={selectedCourseForFee}
          fees={selectedCourseForFee.fees}
        />
      )}
    </div>
  );
};
