'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Eye, Tag, Clock, User, ChevronRight } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Demo post for when API is not connected
const demoPost = {
  title: 'Understanding Order Flow in Forex Trading',
  slug: 'understanding-order-flow',
  excerpt: 'A deep dive into how institutional order flow drives price action and how retail traders can use this knowledge.',
  content: `
## What is Order Flow?

Order flow refers to the aggregate buying and selling pressure from all market participants. Understanding who is buying and selling — and at what levels — gives you a significant edge in forecasting price movement.

### Why Order Flow Matters

In every financial market, price moves because of an **imbalance between supply and demand**. When buyers are more aggressive than sellers, price rises. When sellers dominate, price falls. This seems simple, but the nuance lies in understanding *where* this imbalance occurs.

### Key Concepts

**1. Liquidity Pools**
Large clusters of stop-loss orders create "liquidity pools" — areas where market makers know there is significant order flow waiting. Price is often drawn to these areas before reversing.

**2. Order Blocks**
An order block is the last bullish or bearish candle before a strong impulse move. These represent areas where institutions placed significant orders and are likely to defend their positions.

**3. Fair Value Gaps (FVGs)**
When price moves rapidly, it can leave "gaps" in the market structure — areas where there was no real trading activity. Price often returns to fill these gaps.

### Applying Order Flow Analysis

Here's a practical framework for using order flow in your trading:

1. **Identify the trend** using higher timeframe structure
2. **Mark key liquidity levels** — previous highs/lows, equal highs/lows
3. **Look for institutional candles** — large-bodied candles with strong momentum
4. **Wait for price to return** to the order block or FVG zone
5. **Enter with a tight stop** behind the structure level
6. **Target the next liquidity pool** for your take-profit

### Risk Management Considerations

Order flow analysis is powerful, but it's not infallible. Always:
- Use proper position sizing (1-2% risk per trade)
- Wait for confirmation before entering
- Have a clear invalidation level
- Don't chase price — let it come to your zone

### Conclusion

Order flow analysis bridges the gap between retail and institutional trading. By understanding where liquidity sits and how institutions accumulate and distribute positions, you gain a significant edge. Combined with proper risk management, this approach can dramatically improve your trading results.
  `,
  featured_image: '',
  published_at: '2024-03-08T14:00:00Z',
  views_count: 1205,
  reading_time: 8,
  tags: 'order flow, liquidity, institutional trading, smart money',
  meta_title: 'Understanding Order Flow in Forex Trading | ForexEdge',
  meta_description: 'Learn how institutional order flow drives price action and how retail traders can use this knowledge for better entries.',
  category: { name: 'Education', slug: 'education' },
  author: { username: 'admin', full_name: 'ForexEdge Team', avatar_url: '' },
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState(demoPost);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${API}/blog/${params.slug}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data.post);
        }
      } catch (_) {}
      setLoading(false);
    };
    fetchPost();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="pt-24 pb-16 px-4 max-w-3xl mx-auto animate-pulse space-y-6">
        <div className="h-4 w-24 bg-surface-100 rounded" />
        <div className="h-10 w-3/4 bg-surface-100 rounded" />
        <div className="h-4 w-1/2 bg-surface-100 rounded" />
        <div className="h-[400px] bg-surface-100 rounded-2xl" />
      </div>
    );
  }

  return (
    <>
      <head>
        <title>{post.meta_title || post.title}</title>
        <meta name="description" content={post.meta_description || post.excerpt} />
      </head>
      <article className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link href="/blog" className="hover:text-brand-gold transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Blog
            </Link>
            <ChevronRight className="w-3 h-3" />
            {post.category && <span className="text-brand-gold">{post.category.name}</span>}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-8 pb-8 border-b border-white/5">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {post.author?.full_name || post.author?.username}
            </span>
            {post.published_at && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            )}
            {post.reading_time && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> {post.reading_time} min read
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" /> {post.views_count?.toLocaleString()} views
            </span>
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none
            prose-headings:text-white prose-headings:font-bold
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-slate-300 prose-p:leading-relaxed
            prose-strong:text-brand-gold prose-strong:font-semibold
            prose-ol:text-slate-300 prose-ul:text-slate-300
            prose-li:marker:text-brand-gold
            prose-code:text-brand-gold prose-code:bg-surface-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-a:text-brand-gold prose-a:no-underline hover:prose-a:underline
          ">
            {/* Simple markdown-to-HTML rendering */}
            {post.content.split('\n').map((line, i) => {
              const trimmed = line.trim();
              if (trimmed.startsWith('### ')) return <h3 key={i}>{trimmed.slice(4)}</h3>;
              if (trimmed.startsWith('## ')) return <h2 key={i}>{trimmed.slice(3)}</h2>;
              if (trimmed.startsWith('# ')) return <h1 key={i}>{trimmed.slice(2)}</h1>;
              if (trimmed.match(/^\d+\.\s/)) return <p key={i} className="ml-4">{trimmed}</p>;
              if (trimmed.startsWith('- ')) return <p key={i} className="ml-4">• {trimmed.slice(2)}</p>;
              if (!trimmed) return null;
              return <p key={i} dangerouslySetInnerHTML={{ __html: trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') }} />;
            })}
          </div>

          {/* Tags */}
          {post.tags && (
            <div className="flex flex-wrap items-center gap-2 mt-10 pt-8 border-t border-white/5">
              <Tag className="w-4 h-4 text-slate-500" />
              {post.tags.split(',').map((tag) => (
                <span key={tag.trim()} className="text-xs bg-surface-100 text-slate-400 px-3 py-1 rounded-full border border-white/5">
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}

          {/* AdSense placeholder zone */}
          <div className="mt-10 p-6 bg-surface-100 rounded-2xl border border-white/5 text-center">
            <p className="text-xs text-slate-600">Advertisement</p>
            <div className="h-24 flex items-center justify-center border-2 border-dashed border-white/5 rounded-xl mt-2">
              <p className="text-sm text-slate-600">AdSense Zone</p>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
