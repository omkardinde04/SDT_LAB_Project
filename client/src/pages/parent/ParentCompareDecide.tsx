import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { College } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  Scale,
  Star,
  CheckCircle2,
  Heart,
  TrendingUp,
  MapPin,
  Building,
  Check,
} from 'lucide-react';

export const ParentCompareDecide: React.FC = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [shortlisted, setShortlisted] = useState<Set<string>>(new Set(['col-kjsce', 'col-apex']));
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    c1: true,
    c2: true,
    c3: false,
    c4: true,
    c5: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<College[]>('/compare')
      .then((data) => {
        setColleges(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleShortlist = async (id: string) => {
    setShortlisted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    try {
      await api.post('/shortlist', { collegeId: id });
    } catch {}
  };

  const toggleChecklistItem = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const criteriaList = [
    { label: 'NIRF All-India Rank', render: (c: College) => `#${c.nirfRank} (Engineering)` },
    { label: 'NAAC Accreditation Grade', render: (c: College) => c.naacGrade },
    { label: 'Total 4-Year Fees (All-Inclusive)', render: (c: College) => `₹${c.totalFeesLakhs} Lakhs` },
    { label: 'Overall Placement Rate', render: (c: College) => `${c.placementRate}% Placed` },
    { label: 'Average Annual Package', render: (c: College) => `₹${c.avgPackageLpa} LPA` },
    { label: 'Highest Salary Package', render: (c: College) => `₹${c.highestPackageLpa} LPA` },
    { label: 'Student-to-Faculty Ratio', render: (c: College) => c.studentFacultyRatio },
    { label: 'Distance from Central Metro', render: (c: College) => `${c.distanceKm} km` },
    { label: 'Campus Area', render: (c: College) => `${c.campusSizeAcres} Acres` },
    { label: 'Hostel & Food Rating', render: (c: College) => `${c.rating} / 5.0 (${c.reviewsCount} reviews)` },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9E0FA] text-[#5B3FA0] text-xs font-semibold mb-2">
          <Scale className="w-3.5 h-3.5" />
          Comparative Decision Matrix
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#2D2442]">
          Side-by-Side College Comparison
        </h1>
        <p className="text-xs sm:text-sm text-[#7A6F8F] mt-1">
          Objective evaluation of fees, placement outcomes, hostel hygiene, and travel distance
        </p>
      </div>

      {/* Comparison Table Grid */}
      <Card padding="none" className="border-[#DDD2F3] overflow-x-auto shadow-purple-soft">
        <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-[#DDD2F3] bg-[#FAF7FF]">
              <th className="p-4 w-1/4 font-semibold text-[#5B3FA0] text-xs uppercase tracking-wider">
                Evaluation Metric
              </th>
              {colleges.map((col) => (
                <th key={col.id} className="p-4 w-1/4 align-top">
                  <div className="space-y-2">
                    <img
                      src={col.coverImage}
                      alt={col.name}
                      className="w-full h-28 object-cover rounded-xl"
                    />
                    <div className="font-semibold text-sm text-[#2D2442] line-clamp-2">
                      {col.name}
                    </div>
                    <Button
                      size="sm"
                      variant={shortlisted.has(col.id) ? 'primary' : 'outline'}
                      fullWidth
                      onClick={() => toggleShortlist(col.id)}
                      icon={<Heart className={`w-3.5 h-3.5 ${shortlisted.has(col.id) ? 'fill-current' : ''}`} />}
                    >
                      {shortlisted.has(col.id) ? 'Shortlisted' : 'Shortlist'}
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DDD2F3]/60">
            {criteriaList.map((crit, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#FAF7FF]/40'}>
                <td className="p-3.5 font-medium text-[#7A6F8F] text-xs">
                  {crit.label}
                </td>
                {colleges.map((col) => {
                  const isTopChoice = col.id === 'col-kjsce' || col.id === 'col-apex';
                  return (
                    <td
                      key={col.id}
                      className={`p-3.5 font-medium ${
                        isTopChoice ? 'text-[#7C5CBF] font-semibold bg-[#E9E0FA]/15' : 'text-[#2D2442]'
                      }`}
                    >
                      {crit.render(col)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Parent Decision Checklist Card */}
      <Card padding="lg" className="border-[#DDD2F3] space-y-4">
        <div>
          <h3 className="font-semibold text-base text-[#2D2442]">
            Parent Decision-Making Checklist
          </h3>
          <p className="text-xs text-[#7A6F8F]">
            Check off key considerations before confirming your candidate’s seat
          </p>
        </div>

        <div className="space-y-2.5">
          {[
            { key: 'c1', text: 'Checked NIRF Rank and verified NAAC A++ validity on official portal' },
            { key: 'c2', text: 'Confirmed 0% interest loan eligibility and absence of hidden fee surcharges' },
            { key: 'c3', text: 'Inspected student mess hygiene certificates & diet options in person' },
            { key: 'c4', text: 'Verified round-the-clock biometric security and resident warden presence' },
            { key: 'c5', text: 'Explored 360° virtual tour of engineering labs and student quad' },
          ].map((item) => (
            <div
              key={item.key}
              onClick={() => toggleChecklistItem(item.key)}
              className={`p-3 rounded-xl border text-xs sm:text-sm flex items-center justify-between cursor-pointer transition-all ${
                checklist[item.key]
                  ? 'bg-[#E9E0FA]/40 border-[#7C5CBF] text-[#5B3FA0] font-medium'
                  : 'bg-white border-[#DDD2F3] text-[#7A6F8F]'
              }`}
            >
              <span>{item.text}</span>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ml-3 transition-colors ${
                  checklist[item.key] ? 'bg-[#7C5CBF] border-[#7C5CBF] text-white' : 'border-[#DDD2F3]'
                }`}
              >
                {checklist[item.key] && <Check className="w-3.5 h-3.5" />}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
