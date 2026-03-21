'use client';

import { useState } from 'react';
import { Plus, Pin, Trash2, Edit3, Megaphone } from 'lucide-react';

interface AnnouncementItem { id: string; title: string; content: string; is_pinned: boolean; is_active: boolean; published_at: string; }

const demoAnnouncements: AnnouncementItem[] = [
  { id: '1', title: 'Platform Maintenance Scheduled', content: 'We will be performing system upgrades on Saturday 2AM-4AM UTC. Trading groups will remain active.', is_pinned: true, is_active: true, published_at: '2024-03-10T00:00:00Z' },
  { id: '2', title: 'New Scalping Strategy Module', content: 'We have added a new advanced scalping module to the Trading Academy. Check it out in the education section.', is_pinned: false, is_active: true, published_at: '2024-03-08T00:00:00Z' },
  { id: '3', title: 'February PAMM Performance Report', content: 'All three PAMM groups posted positive returns in February. Scalping Elite led with +8.3% return.', is_pinned: false, is_active: true, published_at: '2024-03-01T00:00:00Z' },
];

export default function AdminAnnouncementsPage() {
  const [items, setItems] = useState(demoAnnouncements);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', is_pinned: false });

  const togglePin = (id: string) => setItems((p) => p.map((a) => (a.id === id ? { ...a, is_pinned: !a.is_pinned } : a)));
  const remove = (id: string) => setItems((p) => p.filter((a) => a.id !== id));

  const addAnnouncement = () => {
    if (!form.title || !form.content) return;
    setItems((p) => [{ id: Date.now().toString(), ...form, is_active: true, published_at: new Date().toISOString() }, ...p]);
    setForm({ title: '', content: '', is_pinned: false });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Announcements</h1>
          <p className="text-sm text-slate-400 mt-1">Post updates and pin important notices</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-brand-gold text-dark-500 font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-brand-gold-light transition-colors">
          <Plus className="w-4 h-4" /> New Announcement
        </button>
      </div>

      {showForm && (
        <div className="bg-surface-100 rounded-2xl border border-brand-gold/20 p-5 space-y-4">
          <input type="text" placeholder="Announcement title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full bg-dark-500 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-gold/20" />
          <textarea placeholder="Content..." value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full bg-dark-500 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-gold/20 resize-y h-28" />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
              <input type="checkbox" checked={form.is_pinned} onChange={(e) => setForm({ ...form, is_pinned: e.target.checked })} className="accent-brand-gold" />
              Pin this announcement
            </label>
            <div className="flex gap-2">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
              <button onClick={addAnnouncement} className="px-4 py-2 bg-brand-gold text-dark-500 font-semibold rounded-xl text-sm">Post</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.sort((a, b) => (a.is_pinned === b.is_pinned ? 0 : a.is_pinned ? -1 : 1)).map((item) => (
          <div key={item.id} className={`bg-surface-100 rounded-2xl border p-5 transition-colors ${item.is_pinned ? 'border-brand-gold/20' : 'border-white/5'}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {item.is_pinned && <Pin className="w-3.5 h-3.5 text-brand-gold" />}
                  <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{item.content}</p>
                <p className="text-xs text-slate-600 mt-2">{new Date(item.published_at).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => togglePin(item.id)} className={`p-2 rounded-lg transition-colors ${item.is_pinned ? 'text-brand-gold hover:bg-brand-gold/10' : 'text-slate-500 hover:bg-white/5 hover:text-brand-gold'}`} title={item.is_pinned ? 'Unpin' : 'Pin'}>
                  <Pin className="w-4 h-4" />
                </button>
                <button onClick={() => remove(item.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
