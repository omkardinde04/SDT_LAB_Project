import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Course, CourseFees, Scholarship } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { FeeSheetModal } from '../../components/FeeSheetModal';
import {
  FileText,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  Download,
  Printer,
  Sparkles,
  HelpCircle,
  CreditCard,
} from 'lucide-react';

export const ParentFeeTransparency: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('crs-1');
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [activeYearTab, setActiveYearTab] = useState<number>(1);
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [emiMonths, setEmiMonths] = useState<number>(24);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [crsData, schData] = await Promise.all([
          api.get<Course[]>('/courses'),
          api.get<Scholarship[]>('/scholarships'),
        ]);
        setCourses(crsData);
        if (crsData.length > 0) setSelectedCourseId(crsData[0].id);
        setScholarships(schData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];
  const fees = activeCourse?.fees;
  const currentYearData = fees?.breakdown.find((b) => b.year === activeYearTab) || fees?.breakdown[0];
  const total4Years = fees?.breakdown.reduce((s, r) => s + r.total, 0) || 0;

  // EMI Calculator calculation (0% interest partner estimate)
  const calculatedEmi = Math.round(total4Years / emiMonths);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9E0FA] text-[#5B3FA0] text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Fee Transparency Policy
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#2D2442]">
            Comprehensive Fee Structure & Schedule
          </h1>
          <p className="text-xs sm:text-sm text-[#7A6F8F] mt-1">
            Zero hidden costs • Itemized annual line items • Verified by state regulatory committee
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="md"
            onClick={() => setShowFeeModal(true)}
            icon={<Download className="w-4 h-4" />}
          >
            Download Official Fee Sheet
          </Button>
        </div>
      </div>

      {/* Select Course Program Strip */}
      <div>
        <label className="block text-xs font-semibold text-[#7A6F8F] uppercase tracking-wider mb-2">
          Select Academic Program
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {courses.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCourseId(c.id);
                setActiveYearTab(1);
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedCourseId === c.id
                  ? 'bg-[#7C5CBF] text-white shadow-purple-sm'
                  : 'bg-white text-[#2D2442] hover:bg-[#FAF7FF] border border-[#DDD2F3]'
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>
      </div>

      {/* Year-by-Year Tabs & Line Items Container */}
      {activeCourse && fees && currentYearData && (
        <Card padding="lg" className="border-[#DDD2F3] space-y-6">
          {/* Year Tabs */}
          <div className="flex items-center justify-between border-b border-[#DDD2F3] pb-4 flex-wrap gap-3">
            <div>
              <h3 className="text-lg font-semibold text-[#2D2442]">{activeCourse.title}</h3>
              <p className="text-xs text-[#7A6F8F]">
                Duration: {activeCourse.durationYears} Years • Seats: {activeCourse.totalSeats}
              </p>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-[#FAF7FF] rounded-2xl border border-[#DDD2F3]">
              {fees.breakdown.map((item) => (
                <button
                  key={item.year}
                  onClick={() => setActiveYearTab(item.year)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeYearTab === item.year
                      ? 'bg-[#7C5CBF] text-white shadow-sm'
                      : 'text-[#7A6F8F] hover:text-[#2D2442]'
                  }`}
                >
                  Year {item.year}
                </button>
              ))}
            </div>
          </div>

          {/* Itemized Cards Grid for Selected Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#FAF7FF] border border-[#DDD2F3]">
              <span className="text-xs text-[#7A6F8F] block">Academic Tuition</span>
              <div className="text-xl font-bold text-[#2D2442] mt-1">
                ₹{currentYearData.tuition.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-[#7A6F8F] mt-1 block">
                Classroom, lab licenses & faculty
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7FF] border border-[#DDD2F3]">
              <span className="text-xs text-[#7A6F8F] block">Twin AC Hostel & Living</span>
              <div className="text-xl font-bold text-[#2D2442] mt-1">
                ₹{currentYearData.hostel.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-[#7A6F8F] mt-1 block">
                Electricity, water, Wi-Fi & cleaning
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7FF] border border-[#DDD2F3]">
              <span className="text-xs text-[#7A6F8F] block">Mess & Nutrition (4 Meals)</span>
              <div className="text-xl font-bold text-[#2D2442] mt-1">
                ₹{currentYearData.mess.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-[#7A6F8F] mt-1 block">
                Breakfast, lunch, snacks & dinner
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7FF] border border-[#DDD2F3]">
              <span className="text-xs text-[#7A6F8F] block">Examination & Lab Supplies</span>
              <div className="text-xl font-bold text-[#2D2442] mt-1">
                ₹{currentYearData.examLab.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-[#7A6F8F] mt-1 block">
                Semester evaluations & components
              </span>
            </div>
          </div>

          {/* Annual Total Highlight Bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#FAF7FF] to-[#F1EAFF] border border-[#DDD2F3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-[#5B3FA0] uppercase tracking-wider block">
                Total Net Payable for Year {activeYearTab}
              </span>
              <div className="text-2xl sm:text-3xl font-bold text-[#7C5CBF] mt-0.5">
                ₹{currentYearData.total.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-[#7A6F8F] block">Total {activeCourse.durationYears}-Year Cumulative:</span>
              <strong className="text-base text-[#2D2442]">₹{total4Years.toLocaleString('en-IN')}</strong>
            </div>
          </div>
        </Card>
      )}

      {/* Interactive EMI & Financing Simulator */}
      <Card padding="lg" className="border-[#DDD2F3] space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E9E0FA] text-[#5B3FA0] flex items-center justify-center">
            <Calculator className="w-5 h-5 text-[#7C5CBF]" />
          </div>
          <div>
            <h3 className="font-semibold text-base text-[#2D2442]">
              0% Interest Education Loan & EMI Simulator
            </h3>
            <p className="text-xs text-[#7A6F8F]">
              Direct pre-approved financing with SBI, HDFC Credila, and Eduvanz with zero foreclosure penalties
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="md:col-span-2 space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                <span>Repayment Tenure</span>
                <strong className="text-[#7C5CBF] font-semibold">{emiMonths} Months</strong>
              </div>
              <input
                type="range"
                min="12"
                max="48"
                step="6"
                value={emiMonths}
                onChange={(e) => setEmiMonths(Number(e.target.value))}
                className="w-full accent-[#7C5CBF] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#7A6F8F] mt-1">
                <span>12 Months</span>
                <span>24 Months</span>
                <span>36 Months</span>
                <span>48 Months</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#FAF7FF] rounded-xl border border-[#DDD2F3]/60">
                <span className="text-[#7A6F8F] block">Interest Rate:</span>
                <strong className="text-[#5BAE8A] font-semibold">0% Subsidized EMI</strong>
              </div>
              <div className="p-3 bg-[#FAF7FF] rounded-xl border border-[#DDD2F3]/60">
                <span className="text-[#7A6F8F] block">Processing Fee:</span>
                <strong className="text-[#2D2442] font-semibold">₹0 (Waived for CampusTour)</strong>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF7FF] border border-[#DDD2F3] text-center flex flex-col justify-center space-y-2">
            <span className="text-xs text-[#7A6F8F] uppercase font-semibold tracking-wider">
              Estimated Monthly Outlay
            </span>
            <div className="text-3xl font-bold text-[#7C5CBF]">
              ₹{calculatedEmi.toLocaleString('en-IN')}<span className="text-xs font-normal text-[#7A6F8F]">/mo</span>
            </div>
            <p className="text-[11px] text-[#7A6F8F]">
              No collateral required up to ₹7.5 Lakhs under Vidyalakshmi Scheme
            </p>
          </div>
        </div>
      </Card>

      {/* Fee Sheet Modal */}
      {activeCourse && fees && (
        <FeeSheetModal
          isOpen={showFeeModal}
          onClose={() => setShowFeeModal(false)}
          course={activeCourse}
          fees={fees}
        />
      )}
    </div>
  );
};
