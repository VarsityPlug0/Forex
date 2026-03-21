'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Eye, Image, Video, Code, Heading1, Heading2, Bold, Italic, List } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function BlogEditorPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '', category_id: '',
    meta_title: '', meta_description: '', meta_keywords: '', tags: '',
    featured_image: '', is_published: false,
  });

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'title' && !prev.slug) updated.slug = slugify(value as string);
      return updated;
    });
  };

  const save = async (publish?: boolean) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const body = {
        ...form,
        is_published: publish ?? form.is_published,
        ...(publish ? { published_at: new Date().toISOString() } : {}),
      };
      if (token) {
        const res = await fetch(`${API}/blog`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(body),
        });
        if (res.ok) {
          router.push('/admin/blog');
          return;
        }
      }
      // Demo mode — just navigate back
      router.push('/admin/blog');
    } catch (_) {
      router.push('/admin/blog');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button onClick={() => router.push('/admin/blog')} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Posts
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => save(false)} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-surface-100 border border-white/10 text-white hover:bg-surface-200 transition-colors">
            <Save className="w-4 h-4" /> Save Draft
          </button>
          <button onClick={() => save(true)} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-brand-gold text-dark-500 font-semibold hover:bg-brand-gold-light transition-colors">
            <Eye className="w-4 h-4" /> Publish
          </button>
        </div>
      </div>

      {/* Title */}
      <input
        type="text"
        placeholder="Article title..."
        value={form.title}
        onChange={(e) => updateField('title', e.target.value)}
        className="w-full bg-transparent text-3xl font-bold text-white placeholder:text-slate-600 focus:outline-none"
      />
      <input
        type="text"
        placeholder="slug-will-auto-generate"
        value={form.slug}
        onChange={(e) => updateField('slug', e.target.value)}
        className="w-full bg-transparent text-sm text-slate-500 placeholder:text-slate-600 focus:outline-none font-mono"
      />

      {/* Toolbar */}
      <div className="flex items-center gap-1 bg-surface-100 rounded-xl p-1.5 border border-white/5 flex-wrap">
        {[Heading1, Heading2, Bold, Italic, List, Image, Video, Code].map((Icon, i) => (
          <button key={i} className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-colors">
            <Icon className="w-4 h-4" />
          </button>
        ))}
      </div>

      {/* Content editor */}
      <textarea
        placeholder="Write your article content... (Markdown and HTML supported)"
        value={form.content}
        onChange={(e) => updateField('content', e.target.value)}
        className="w-full bg-surface-100 border border-white/5 rounded-2xl p-6 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-brand-gold/20 min-h-[400px] resize-y font-mono leading-relaxed"
      />

      {/* Excerpt */}
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Excerpt</label>
        <textarea
          placeholder="Brief summary for previews and SEO..."
          value={form.excerpt}
          onChange={(e) => updateField('excerpt', e.target.value)}
          className="w-full bg-surface-100 border border-white/5 rounded-xl p-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-brand-gold/20 resize-y h-24"
        />
      </div>

      {/* SEO */}
      <div className="bg-surface-100 rounded-2xl border border-white/5 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-white">SEO Metadata</h3>
        <input type="text" placeholder="Meta Title" value={form.meta_title} onChange={(e) => updateField('meta_title', e.target.value)}
          className="w-full bg-dark-500 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-gold/20" />
        <textarea placeholder="Meta Description" value={form.meta_description} onChange={(e) => updateField('meta_description', e.target.value)}
          className="w-full bg-dark-500 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-gold/20 resize-y h-20" />
        <input type="text" placeholder="Keywords (comma separated)" value={form.meta_keywords} onChange={(e) => updateField('meta_keywords', e.target.value)}
          className="w-full bg-dark-500 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-gold/20" />
        <input type="text" placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => updateField('tags', e.target.value)}
          className="w-full bg-dark-500 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-gold/20" />
      </div>

      {/* Featured image */}
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Featured Image URL</label>
        <input type="text" placeholder="https://..." value={form.featured_image} onChange={(e) => updateField('featured_image', e.target.value)}
          className="w-full bg-surface-100 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-gold/20" />
      </div>
    </div>
  );
}
