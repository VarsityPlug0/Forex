'use client';

import { useState, useEffect } from 'react';
import { Search, UserCheck, UserX, Shield, ChevronLeft, ChevronRight } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface UserRow {
  id: string; email: string; username: string; full_name: string | null;
  role: string; is_active: boolean; last_login: string | null; created_at: string;
}

const roleBadge: Record<string, string> = {
  admin: 'bg-red-500/15 text-red-400 border-red-500/30',
  moderator: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  premium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  user: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
};

// Demo data
const demoUsers: UserRow[] = [
  { id: '1', email: 'admin@forexedge.com', username: 'admin', full_name: 'Platform Admin', role: 'admin', is_active: true, last_login: new Date().toISOString(), created_at: '2024-01-15T00:00:00Z' },
  { id: '2', email: 'trader@example.com', username: 'traderx', full_name: 'John Smith', role: 'premium', is_active: true, last_login: new Date(Date.now() - 86400000).toISOString(), created_at: '2024-03-20T00:00:00Z' },
  { id: '3', email: 'learner@example.com', username: 'newbie', full_name: 'Sarah Chen', role: 'user', is_active: true, last_login: null, created_at: '2024-06-01T00:00:00Z' },
  { id: '4', email: 'mod@forexedge.com', username: 'moderator1', full_name: 'Mike B.', role: 'moderator', is_active: true, last_login: new Date(Date.now() - 3600000).toISOString(), created_at: '2024-02-10T00:00:00Z' },
  { id: '5', email: 'inactive@example.com', username: 'olduser', full_name: 'Disabled Account', role: 'user', is_active: false, last_login: null, created_at: '2023-12-01T00:00:00Z' },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>(demoUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(demoUsers.length);
  const totalPages = Math.ceil(total / 20);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const params = new URLSearchParams({ page: String(page), limit: '20' });
        if (search) params.set('search', search);
        if (roleFilter) params.set('role', roleFilter);
        const res = await fetch(`${API}/admin/users?${params}`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users);
          setTotal(data.total);
        }
      } catch (_) {}
    };
    fetchUsers();
  }, [page, search, roleFilter]);

  const toggleStatus = async (user: UserRow) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      await fetch(`${API}/admin/users/${user.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ is_active: !user.is_active }),
      });
    } catch (_) {}
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, is_active: !u.is_active } : u)));
  };

  const changeRole = async (userId: string, role: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      await fetch(`${API}/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role }),
      });
    } catch (_) {}
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">User Management</h1>
        <p className="text-sm text-slate-400 mt-1">Manage users, roles, and access</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by email, username, or name..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-surface-100 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-gold/30"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="bg-surface-100 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold/30"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
          <option value="premium">Premium</option>
          <option value="user">User</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-surface-100 rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Last Login</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Joined</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-medium text-white">{user.full_name || user.username}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => changeRole(user.id, e.target.value)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border bg-transparent cursor-pointer focus:outline-none ${roleBadge[user.role] || roleBadge.user}`}
                    >
                      <option value="user">User</option>
                      <option value="premium">Premium</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-5 py-4 text-slate-400 text-xs hidden md:table-cell">
                    {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-5 py-4 text-slate-400 text-xs hidden lg:table-cell">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${user.is_active ? 'text-emerald-400' : 'text-red-400'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-emerald-400' : 'bg-red-400'}`} />
                      {user.is_active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => toggleStatus(user)}
                      className={`p-2 rounded-lg transition-colors ${user.is_active ? 'hover:bg-red-500/10 text-slate-500 hover:text-red-400' : 'hover:bg-emerald-500/10 text-slate-500 hover:text-emerald-400'}`}
                      title={user.is_active ? 'Disable user' : 'Enable user'}
                    >
                      {user.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-white/5">
            <p className="text-xs text-slate-500">{total} users</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
              <span className="text-xs text-slate-400 px-2">{page} / {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
