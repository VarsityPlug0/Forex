'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Edit3, Trash2, Eye, EyeOff, Search, Calendar } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface Post {
  id: string; title: string; slug: string; is_published: boolean;
  published_at: string | null; views_count: number; created_at: string;
  category?: { name: string }; author?: { username: string };
}

const demoPosts: Post[] = [
  { id: '1', title: 'EURUSD Weekly Forecast: Key Levels to Watch', slug: 'eurusd-weekly-forecast', is_published: true, published_at: '2024-03-10T00:00:00Z', views_count: 342, created_at: '2024-03-09T00:00:00Z', category: { name: 'Market Analysis' }, author: { username: 'admin' } },
  { id: '2', title: 'Understanding Order Flow in Forex', slug: 'understanding-order-flow', is_published: true, published_at: '2024-03-08T00:00:00Z', views_count: 1205, created_at: '2024-03-07T00:00:00Z', category: { name: 'Education' }, author: { username: 'admin' } },
  { id: '3', title: 'Risk Management: The 2% Rule Explained', slug: 'risk-management-2-percent', is_published: false, published_at: null, views_count: 0, created_at: '2024-03-11T00:00:00Z', category: { name: 'Strategy' }, author: { username: 'admin' } },
  { id: '4', title: 'NFP Week Trading Strategy', slug: 'nfp-week-strategy', is_published: true, published_at: '2024-03-05T00:00:00Z', views_count: 876, created_at: '2024-03-04T00:00:00Z', category: { name: 'Strategy' }, author: { username: 'admin' } },
];

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>(demoPosts);
  const [search, setSearch] = useState('');

  const filtered = posts.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));

  const togglePublish = async (post: Post) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${API}/blog/${post.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ is_published: !post.is_published, ...(!post.is_published && !post.published_at ? { published_at: new Date().toISOString() } : {}) }),
        });
      }
    } catch (_) {}
    setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, is_published: !p.is_published } : p)));
  };

  const deletePost = async (id: string) => {
    if (!confirm('Delete this post permanently?')) return;
    try {
      const token = localStorage.getItem('token');
      if (token) await fetch(`${API}/blog/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    } catch (_) {}
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog / Articles</h1>
          <p className="text-sm text-slate-400 mt-1">Manage blog posts, drafts, and scheduled content</p>
        </div>
        <Link
          href="/admin/blog/editor"
          className="flex items-center gap-2 bg-brand-gold text-dark-500 font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-brand-gold-light transition-colors"
        >
          <Plus className="w-4 h-4" /> New Post
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-surface-100 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-gold/30"
        />
      </div>

      {/* Posts list */}
      <div className="space-y-3">
        {filtered.map((post) => (
          <div key={post.id} className="bg-surface-100 rounded-2xl border border-white/5 p-5 hover:border-white/10 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${post.is_published ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                    {post.is_published ? 'Published' : 'Draft'}
                  </span>
                  {post.category && (
                    <span className="text-[11px] text-slate-500">{post.category.name}</span>
                  )}
                </div>
                <h3 className="font-semibold text-white text-sm truncate">{post.title}</h3>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Not published'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {post.views_count} views
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Link href={`/admin/blog/editor?id=${post.id}`} className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-brand-gold transition-colors">
                  <Edit3 className="w-4 h-4" />
                </Link>
                <button onClick={() => togglePublish(post)} className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-blue-400 transition-colors" title={post.is_published ? 'Unpublish' : 'Publish'}>
                  {post.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button onClick={() => deletePost(post.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors">
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
