'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Trophy, Ruler, Brain, BarChart3, Landmark, PoundSterling } from 'lucide-react';

const categories = ['All', 'Market Analysis', 'Strategy', 'Psychology', 'Fundamentals', 'PAMM Updates', 'Education'];

const catIcons: Record<string, React.ReactNode> = {
  'Market Analysis': <BarChart3 className="w-4 h-4" />,
  'Strategy': <Ruler className="w-4 h-4" />,
  'Psychology': <Brain className="w-4 h-4" />,
  'Fundamentals': <Landmark className="w-4 h-4" />,
  'PAMM Updates': <BarChart3 className="w-4 h-4" />,
  'Education': <Brain className="w-4 h-4" />,
};

const posts = [
    {
        id: 1, cat: 'Market Analysis', icon: <Trophy className="w-10 h-10 text-brand-gold" />, readTime: '5 min',
        slug: 'gold-xauusd-setup-why-2400-is-the-key-level-this-week',
        title: 'Gold (XAUUSD) Setup: Why $2,400 Is The Key Level This Week',
        excerpt: 'We break down the weekly supply zone on Gold and the confluence factors pointing to a potential sell opportunity at the $2,400 psychological level.',
        tags: ['XAUUSD', 'Gold', 'Supply & Demand'],
        date: 'Mar 10, 2025', featured: true,
    },
    {
        id: 2, cat: 'Strategy', icon: <Ruler className="w-10 h-10 text-blue-400" />, readTime: '8 min',
        slug: 'how-to-draw-supply-and-demand-zones-correctly',
        title: 'How To Draw Supply & Demand Zones Correctly (Step-by-Step)',
        excerpt: 'The most common mistake traders make is drawing zones incorrectly. Here\'s the exact criteria we use — base formation, fresh vs. tested, and zone grading.',
        tags: ['Supply & Demand', 'Technical Analysis'],
        date: 'Mar 8, 2025', featured: false,
    },
    {
        id: 3, cat: 'Psychology', icon: <Brain className="w-10 h-10 text-pink-400" />, readTime: '6 min',
        slug: 'why-90-percent-of-traders-blow-their-accounts',
        title: 'Why 90% of Traders Blow Their Accounts (And How To Be In The 10%)',
        excerpt: 'It\'s not about the strategy. It\'s about execution. We analyzed 200 blown accounts and found 5 critical mistakes they all shared.',
        tags: ['Psychology', 'Risk Management'],
        date: 'Mar 5, 2025', featured: false,
    },
    {
        id: 4, cat: 'PAMM Updates', icon: <BarChart3 className="w-10 h-10 text-emerald-400" />, readTime: '3 min',
        slug: 'february-2025-pamm-performance-report',
        title: 'February 2025 PAMM Performance Report — All Groups',
        excerpt: 'Scalping Elite returned +14.3%, Swing Masters +9.1%, Hedge Shield +5.8%. Full trade-by-trade breakdown inside.',
        tags: ['PAMM', 'Performance'],
        date: 'Mar 1, 2025', featured: false,
    },
    {
        id: 5, cat: 'Fundamentals', icon: <Landmark className="w-10 h-10 text-amber-400" />, readTime: '7 min',
        slug: 'how-central-bank-decisions-move-forex-markets',
        title: 'How Central Bank Decisions Move Forex Markets — Beginner\'s Guide',
        excerpt: 'Interest rate decisions, CPI reports, and NFP releases — here\'s exactly how these events create the big moves you see on price charts.',
        tags: ['Fundamentals', 'Education'],
        date: 'Feb 26, 2025', featured: false,
    },
    {
        id: 6, cat: 'Market Analysis', icon: <PoundSterling className="w-10 h-10 text-brand-gold" />, readTime: '4 min',
        slug: 'gbpusd-weekly-outlook-key-levels-and-trade-setups',
        title: 'GBPUSD Weekly Outlook: Key Levels & Trade Setups',
        excerpt: 'Cable is at a critical juncture. We map out the demand zones to watch on the 4H chart going into the BoE decision week.',
        tags: ['GBPUSD', 'Market Analysis'],
        date: 'Feb 24, 2025', featured: false,
    },
];

export default function BlogPage() {
    const [activeCat, setActiveCat] = useState('All');
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        let result = posts;
        if (activeCat !== 'All') {
            result = result.filter(p => p.cat === activeCat);
        }
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(p =>
                p.title.toLowerCase().includes(q) ||
                p.tags.some(t => t.toLowerCase().includes(q)) ||
                p.excerpt.toLowerCase().includes(q)
            );
        }
        return result;
    }, [activeCat, search]);

    const featured = filtered.find(p => p.featured);
    const rest = filtered.filter(p => !p.featured);

    return (
        <div className="pt-24 pb-24">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
                <h1 className="section-title text-5xl">Market Insights</h1>
                <p className="section-subtitle max-w-xl mx-auto">
                    Trade breakdowns, strategy deep-dives, and market analysis — published weekly.
                </p>

                {/* Search */}
                <div className="max-w-md mx-auto mb-6 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        id="blog-search"
                        placeholder="Search articles..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-surface-100 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold/40 transition-colors"
                    />
                </div>

                {/* Categories */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            id={`cat-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                            onClick={() => setActiveCat(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${activeCat === cat ? 'bg-brand-gold text-dark-500 font-bold' : 'bg-surface-100 text-slate-400 hover:text-white hover:bg-surface-200 border border-white/5'
                                }`}
                        >
                            {cat !== 'All' && catIcons[cat]}
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* No results */}
                {filtered.length === 0 && (
                    <div className="text-center py-16">
                        <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400 text-lg">No articles found matching your criteria.</p>
                        <button onClick={() => { setActiveCat('All'); setSearch(''); }} className="btn-outline text-sm py-2 px-6 mt-4">
                            Clear Filters
                        </button>
                    </div>
                )}

                {/* Featured post */}
                {featured && (
                    <Link href={`/blog/${featured.slug}`} className="block">
                        <div className="card-glow mb-10 border-brand-gold/25" id={`post-${featured.id}`}>
                            <div className="flex items-start gap-4 flex-col md:flex-row">
                                <div className="flex-shrink-0">{featured.icon}</div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="badge-gold badge">Featured</span>
                                        <span className="text-slate-400 text-xs">{featured.cat}</span>
                                        <span className="text-slate-500 text-xs">· {featured.readTime} read</span>
                                    </div>
                                    <h2 className="text-white font-black text-2xl md:text-3xl mb-3 leading-tight hover:text-brand-gold transition-colors">
                                        {featured.title}
                                    </h2>
                                    <p className="text-slate-400 leading-relaxed mb-5">{featured.excerpt}</p>
                                    <div className="flex items-center justify-between flex-wrap gap-3">
                                        <div className="flex flex-wrap gap-2">
                                            {featured.tags.map(t => (
                                                <span key={t} className="text-xs px-3 py-1 bg-surface-200 text-slate-300 rounded-full">{t}</span>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-slate-500 text-xs">{featured.date}</span>
                                            <span className="btn-gold text-sm py-2 px-4">Read Article →</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                )}

                {/* Rest of posts */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rest.map((post) => (
                        <Link key={post.id} href={`/blog/${post.slug}`}>
                            <article id={`post-${post.id}`} className="card-glow cursor-pointer group h-full">
                                <div className="mb-4">{post.icon}</div>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-brand-gold text-xs font-semibold">{post.cat}</span>
                                    <span className="text-slate-600">·</span>
                                    <span className="text-slate-500 text-xs">{post.readTime} read</span>
                                </div>
                                <h2 className="text-white font-bold text-lg leading-snug mb-3 group-hover:text-brand-gold transition-colors">
                                    {post.title}
                                </h2>
                                <p className="text-slate-400 text-sm leading-relaxed mb-5 line-clamp-3">{post.excerpt}</p>
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {post.tags.map(t => (
                                        <span key={t} className="text-xs px-2 py-0.5 bg-surface-200 text-slate-400 rounded">{t}</span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 text-xs">{post.date}</span>
                                    <span className="text-brand-gold text-sm hover:underline">Read →</span>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>

                {filtered.length > 0 && (
                    <div className="text-center mt-12">
                        <button id="load-more-posts" className="btn-outline px-10 py-3">Load More Articles</button>
                    </div>
                )}
            </div>
        </div>
    );
}
