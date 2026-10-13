import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { User, UserRole } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import {
  Users,
  Search,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  Ban,
  Mail,
  Phone,
} from 'lucide-react';

export const AdminManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [showAddRepModal, setShowAddRepModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // New Rep Form
  const [repName, setRepName] = useState('');
  const [repEmail, setRepEmail] = useState('');
  const [repMobile, setRepMobile] = useState('');
  const [repPassword, setRepPassword] = useState('password123');
  const [repDept, setRepDept] = useState('Admissions & Student Advisory');
  const [repTitle, setRepTitle] = useState('Assistant Admissions Counsellor');

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, query]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (roleFilter !== 'all') q.set('role', roleFilter);
      if (query.trim()) q.set('query', query.trim());
      const data = await api.get<User[]>(`/admin/users?${q.toString()}`);
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      await api.patch(`/admin/users/${user.id}/status`, { disabled: !user.disabled });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, disabled: !u.disabled } : u))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateRep = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newRep = await api.post('/admin/users/rep', {
        name: repName,
        email: repEmail,
        mobile: repMobile,
        password: repPassword,
        department: repDept,
        title: repTitle,
      });
      setUsers((prev) => [...prev, newRep]);
      setShowAddRepModal(false);
      setRepName('');
      setRepEmail('');
      setRepMobile('');
    } catch (err: any) {
      alert(err.message || 'Failed to create representative.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#2D2442]">
            User & Representative Directory
          </h1>
          <p className="text-xs sm:text-sm text-[#7A6F8F] mt-1">
            Search prospective students, parents, assign admissions representatives, and control account status
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setShowAddRepModal(true)}
          icon={<UserPlus className="w-4 h-4" />}
        >
          Add New Representative
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#7A6F8F] absolute left-3.5 top-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-[#DDD2F3] text-xs sm:text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-[#DDD2F3] w-full sm:w-auto overflow-x-auto">
          {['all', 'student', 'parent', 'rep', 'admin'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer whitespace-nowrap ${
                roleFilter === r
                  ? 'bg-[#7C5CBF] text-white shadow-xs'
                  : 'text-[#7A6F8F] hover:text-[#2D2442]'
              }`}
            >
              {r === 'all' ? 'All Roles' : r === 'rep' ? 'Representatives' : r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <Card padding="none" className="border-[#DDD2F3] overflow-x-auto shadow-purple-sm">
        <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[650px]">
          <thead className="bg-[#FAF7FF] border-b border-[#DDD2F3] text-[#5B3FA0] font-semibold">
            <tr>
              <th className="p-3.5">User Profile</th>
              <th className="p-3.5">Assigned Role</th>
              <th className="p-3.5">Contact Details</th>
              <th className="p-3.5">Verification</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DDD2F3]/60">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-[#FAF7FF]/50 transition-colors">
                <td className="p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#E9E0FA] text-[#5B3FA0] flex items-center justify-center font-bold text-xs shrink-0">
                      {u.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-[#2D2442]">{u.name}</div>
                      <div className="text-[11px] text-[#7A6F8F]">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-3.5">
                  <Badge
                    variant={
                      u.role === 'admin'
                        ? 'primary'
                        : u.role === 'rep'
                        ? 'lavender'
                        : 'outline'
                    }
                    size="sm"
                  >
                    {u.role.toUpperCase()}
                  </Badge>
                </td>
                <td className="p-3.5 text-xs text-[#7A6F8F]">
                  <div>{u.mobile}</div>
                </td>
                <td className="p-3.5">
                  <Badge variant={u.verified ? 'success' : 'warning'} size="sm" dot>
                    {u.verified ? 'Verified' : 'Pending OTP'}
                  </Badge>
                </td>
                <td className="p-3.5 text-right">
                  {u.role !== 'admin' && (
                    <Button
                      size="sm"
                      variant={u.disabled ? 'primary' : 'outline'}
                      onClick={() => handleToggleStatus(u)}
                    >
                      {u.disabled ? 'Enable Account' : 'Deactivate'}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Add New Rep Modal */}
      <Modal
        isOpen={showAddRepModal}
        onClose={() => setShowAddRepModal(false)}
        title="Add New College Admissions Representative"
        description="Create credentials for a counselling officer to chat live with students and parents."
      >
        <form onSubmit={handleCreateRep} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#2D2442] mb-1">
                Representative Name *
              </label>
              <input
                type="text"
                required
                value={repName}
                onChange={(e) => setRepName(e.target.value)}
                placeholder="e.g. Dr. K. Venkat"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#2D2442] mb-1">
                Official Email *
              </label>
              <input
                type="email"
                required
                value={repEmail}
                onChange={(e) => setRepEmail(e.target.value)}
                placeholder="venkat@campustour.edu"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#2D2442] mb-1">
                Designated Department
              </label>
              <input
                type="text"
                value={repDept}
                onChange={(e) => setRepDept(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#2D2442] mb-1">
                Initial Password
              </label>
              <input
                type="text"
                value={repPassword}
                onChange={(e) => setRepPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD2F3] text-sm text-[#2D2442] focus:outline-none focus:border-[#7C5CBF] bg-[#FAF7FF]/50 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#DDD2F3]">
            <Button type="button" variant="ghost" onClick={() => setShowAddRepModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Representative Account
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
