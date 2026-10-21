import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Building, RotateCcw, Save, CheckCircle, ShieldCheck } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<any>({
    name: 'K. J. Somaiya College of Engineering & Somaiya Vidyavihar',
    tagline: 'Vidyaniketan of Excellence, Innovation & Character – Mumbai',
    address: 'Somaiya Vidyavihar Campus, Vidyavihar (East), Mumbai 400077, Maharashtra',
    phone: '+91 22 6644 9191 / +91 22 6728 3000',
    email: 'admissions@somaiya.edu',
    website: 'https://kjsce.somaiya.edu',
    accreditation: "NAAC 'A+' Grade | Autonomous / SVU | NBA Accredited",
  });

  const [isSaved, setIsSaved] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .get('/admin/settings')
      .then((data) => setSettings(data))
      .catch(console.error);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/admin/settings', settings);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSeed = async () => {
    if (!confirm('This will restore all campus sample data, tour spots, and 5 demo accounts to initial state. Proceed?')) return;
    try {
      await api.post('/seed/reset');
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#2D2442]">
          Institutional Settings & Governance
        </h1>
        <p className="text-xs sm:text-sm text-[#7A6F8F] mt-1">
          Configure verified college accreditation, contact metadata, and database state
        </p>
      </div>

      {isSaved && (
        <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl flex items-center gap-2 border border-emerald-200">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          Settings saved successfully!
        </div>
      )}

      {resetSuccess && (
        <div className="p-3 bg-purple-50 text-purple-700 text-xs rounded-xl flex items-center gap-2 border border-purple-200">
          <CheckCircle className="w-4 h-4 text-purple-600" />
          CampusTour database successfully restored to fresh sample seed data!
        </div>
      )}

      <Card padding="lg" className="border-[#DDD2F3]">
        <form onSubmit={handleSave} className="space-y-4">
          <h3 className="font-semibold text-base text-[#2D2442] mb-2">
            College Profile Information
          </h3>

          <div>
            <label className="block text-xs font-medium text-[#2D2442] mb-1">
              Official Institution Name
            </label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#2D2442] mb-1">
              Motto & Tagline
            </label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#2D2442] mb-1">
                Admissions Phone
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#2D2442] mb-1">
                Admissions Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#2D2442] mb-1">
              Campus Address
            </label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#2D2442] mb-1">
              Official Accreditations & NIRF Ranking
            </label>
            <input
              type="text"
              value={settings.accreditation}
              onChange={(e) => setSettings({ ...settings, accreditation: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={loading}
              icon={<Save className="w-4 h-4" />}
            >
              Save Settings
            </Button>
          </div>
        </form>
      </Card>

      {/* Database Reset Action */}
      <Card padding="lg" className="border-rose-200 bg-rose-50/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-semibold text-sm text-rose-900">
              Database Seed & Demo Reset
            </h4>
            <p className="text-xs text-rose-700 mt-0.5">
              Restore the original 1 college, 8 tour spots, 10 facilities, 4 courses, and 5 sample accounts.
            </p>
          </div>

          <Button
            variant="danger"
            size="sm"
            onClick={handleResetSeed}
            icon={<RotateCcw className="w-4 h-4" />}
          >
            Reset Database
          </Button>
        </div>
      </Card>
    </div>
  );
};
