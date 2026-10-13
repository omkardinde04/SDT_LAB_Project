import React from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Download, Printer, ShieldCheck, CheckCircle2, Building2 } from 'lucide-react';
import { Course, CourseFees } from '../types';

interface FeeSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
  fees: CourseFees;
}

export const FeeSheetModal: React.FC<FeeSheetModalProps> = ({
  isOpen,
  onClose,
  course,
  fees,
}) => {
  const totalCourseFee = fees.breakdown.reduce((sum, item) => sum + item.total, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Fee Structure Breakdown"
      description={`${course.title} (${course.code}) • Academic Cycle 2026–2030`}
      maxWidth="lg"
    >
      <div className="space-y-6 text-[#2D2442] print:p-0" id="fee-printable-area">
        {/* Institutional Header Stamp */}
        <div className="flex items-center justify-between p-4 bg-[#FAF7FF] rounded-2xl border border-[#DDD2F3]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#7C5CBF] text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-base text-[#2D2442]">
                Apex Institute of Technology & Sciences
              </h4>
              <p className="text-xs text-[#7A6F8F]">
                NAAC A++ Accredited • NIRF Rank #18 • Transparency Document #FEE-2026-90
              </p>
            </div>
          </div>
          <Badge variant="success" dot>
            Verified & Regulated
          </Badge>
        </div>

        {/* Year-by-Year Table */}
        <div className="overflow-x-auto rounded-xl border border-[#DDD2F3]">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#E9E0FA]/50 text-[#5B3FA0] font-semibold border-b border-[#DDD2F3]">
              <tr>
                <th className="py-3 px-3.5">Academic Year</th>
                <th className="py-3 px-3.5">Tuition Fee</th>
                <th className="py-3 px-3.5">Twin AC Hostel</th>
                <th className="py-3 px-3.5">Mess (4 Meals)</th>
                <th className="py-3 px-3.5">Exam & Labs</th>
                <th className="py-3 px-3.5 text-right font-bold">Annual Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD2F3]/60">
              {fees.breakdown.map((row) => (
                <tr key={row.year} className="hover:bg-[#FAF7FF]/80 transition-colors">
                  <td className="py-3 px-3.5 font-medium">Year {row.year}</td>
                  <td className="py-3 px-3.5">₹{row.tuition.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3.5">₹{row.hostel.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3.5">₹{row.mess.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3.5">₹{row.examLab.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3.5 text-right font-semibold text-[#5B3FA0]">
                    ₹{row.total.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-[#FAF7FF] border-t-2 border-[#DDD2F3] font-semibold">
              <tr>
                <td colSpan={5} className="py-3.5 px-3.5 text-right text-[#5B3FA0] font-bold">
                  Total {course.durationYears}-Year Investment:
                </td>
                <td className="py-3.5 px-3.5 text-right font-bold text-base text-[#7C5CBF]">
                  ₹{totalCourseFee.toLocaleString('en-IN')}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Financial Transparency & Safety Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-[#FAF7FF] rounded-xl border border-[#DDD2F3] space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-[#5B3FA0]">
              <ShieldCheck className="w-4 h-4 text-[#7C5CBF]" />
              Zero Hidden Charges Guarantee
            </div>
            <p className="text-[#7A6F8F] leading-relaxed">
              No capitation fees, no sudden mid-year exam surcharges, and no surprise book levies. All digital infrastructure, high-speed Wi-Fi, and library access are included.
            </p>
          </div>
          <div className="p-3.5 bg-[#FAF7FF] rounded-xl border border-[#DDD2F3] space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-[#5B3FA0]">
              <CheckCircle2 className="w-4 h-4 text-[#5BAE8A]" />
              0% Interest EMI & Education Loans
            </div>
            <p className="text-[#7A6F8F] leading-relaxed">
              Direct tie-ups with SBI, HDFC Credila, and Eduvanz. Flexible monthly installments starting from ₹{fees.emiStartsAt.toLocaleString('en-IN')}/month with zero processing fees.
            </p>
          </div>
        </div>

        {/* Refund Policy */}
        <div className="p-3 bg-[#E9E0FA]/40 rounded-xl text-xs text-[#5B3FA0] border border-[#DDD2F3]/60">
          <span className="font-semibold">UGC Mandated Refund Policy: </span>
          {fees.refundPolicy}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#DDD2F3]">
          <span className="text-xs text-[#7A6F8F]">Authorized by Registrar & Finance Council</span>
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              icon={<Printer className="w-4 h-4" />}
            >
              Print / Save PDF
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handlePrint}
              icon={<Download className="w-4 h-4" />}
            >
              Download Fee Sheet
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
