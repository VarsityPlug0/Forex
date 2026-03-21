'use client';

import { useState } from 'react';
import { Save, Globe, Search as SearchIcon, Link2, Bell } from 'lucide-react';

interface Setting { key: string; value: string; label: string; type: 'text' | 'textarea'; category: string; }

const defaultSettings: Setting[] = [
  { key: 'site.name', value: 'ForexEdge', label: 'Site Name', type: 'text', category: 'General' },
  { key: 'site.tagline', value: 'Professional Forex Education & PAMM Investing', label: 'Tagline', type: 'text', category: 'General' },
  { key: 'site.description', value: 'Master Forex trading with professional education, real-time community, and managed PAMM investment groups.', label: 'Site Description', type: 'textarea', category: 'General' },
  { key: 'seo.default_title', value: 'ForexEdge – Professional Forex Education & PAMM Investing', label: 'Default Meta Title', type: 'text', category: 'SEO' },
  { key: 'seo.default_description', value: 'Join ForexEdge for free trading education, community forums, and managed investment groups.', label: 'Default Meta Description', type: 'textarea', category: 'SEO' },
  { key: 'social.telegram', value: 'https://t.me/forexedge', label: 'Telegram Link', type: 'text', category: 'Social Links' },
  { key: 'social.discord', value: 'https://discord.gg/forexedge', label: 'Discord Link', type: 'text', category: 'Social Links' },
  { key: 'social.twitter', value: 'https://twitter.com/forexedge', label: 'Twitter/X Link', type: 'text', category: 'Social Links' },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [saved, setSaved] = useState(false);

  const updateSetting = (key: string, value: string) => {
    setSettings((prev) => prev.map((s) => (s.key === key ? { ...s, value } : s)));
    setSaved(false);
  };

  const save = () => {
    // Would POST to API in production
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const categories = Array.from(new Set(settings.map((s) => s.category)));
  const catIcons: Record<string, React.ElementType> = { General: Globe, SEO: SearchIcon, 'Social Links': Link2 };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-sm text-slate-400 mt-1">Platform configuration and SEO defaults</p>
        </div>
        <button onClick={save} className="flex items-center gap-2 bg-brand-gold text-dark-500 font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-brand-gold-light transition-colors">
          <Save className="w-4 h-4" /> {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {categories.map((cat) => {
        const Icon = catIcons[cat] || Globe;
        return (
          <div key={cat} className="bg-surface-100 rounded-2xl border border-white/5 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Icon className="w-4 h-4 text-brand-gold" /> {cat}
            </h3>
            {settings.filter((s) => s.category === cat).map((setting) => (
              <div key={setting.key}>
                <label className="text-xs text-slate-500 mb-1.5 block">{setting.label}</label>
                {setting.type === 'textarea' ? (
                  <textarea
                    value={setting.value}
                    onChange={(e) => updateSetting(setting.key, e.target.value)}
                    className="w-full bg-dark-500 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-gold/20 resize-y h-20"
                  />
                ) : (
                  <input
                    type="text"
                    value={setting.value}
                    onChange={(e) => updateSetting(setting.key, e.target.value)}
                    className="w-full bg-dark-500 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-gold/20"
                  />
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
