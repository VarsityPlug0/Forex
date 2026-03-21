'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Globe, Scale, Droplets, Building2, Shield, Brain, Settings,
    Rocket, Film, Timer, ChevronDown, ChevronUp,
} from 'lucide-react';

const moduleIcons: Record<string, React.ReactNode> = {
    '01': <Globe className="w-10 h-10 text-blue-400" />,
    '02': <Scale className="w-10 h-10 text-brand-gold" />,
    '03': <Droplets className="w-10 h-10 text-cyan-400" />,
    '04': <Building2 className="w-10 h-10 text-amber-400" />,
    '05': <Shield className="w-10 h-10 text-emerald-400" />,
    '06': <Brain className="w-10 h-10 text-pink-400" />,
    '07': <Settings className="w-10 h-10 text-purple-400" />,
};

const modules = [
    {
        num: '01', title: 'Market Foundations', slug: 'market-foundations', duration: '3h 20m', lessons: 8,
        topics: ['What is Forex?', 'Major, Minor & Exotic Pairs', 'Market Sessions & Overlaps', 'Bid/Ask & Spreads', 'Pips, Lots & Leverage', 'Brokers & Execution'],
        desc: 'Everything you need to understand how the Forex market operates before placing a single trade.',
        level: 'Beginner',
    },
    {
        num: '02', title: 'Supply & Demand', slug: 'supply-and-demand', duration: '4h 10m', lessons: 10,
        topics: ['Institutional Order Zones', 'Fresh vs. Tested Zones', 'Zone Drawing Rules', 'Base Formation', 'Zone Confluence', 'Live Examples'],
        desc: 'The foundational concept behind all price movement. Learn to read the market like institutions do.',
        level: 'Beginner',
    },
    {
        num: '03', title: 'Order Flow & Liquidity', slug: 'order-flow-and-liquidity', duration: '3h 45m', lessons: 9,
        topics: ['Buy/Sell Side Liquidity', 'Stop Hunts', 'Liquidity Sweeps', 'Fair Value Gaps', 'Order Blocks', 'Smart Money Concepts'],
        desc: 'Understand where large players are accumulating and distributing positions, and trade alongside them.',
        level: 'Intermediate',
    },
    {
        num: '04', title: 'Market Structure', slug: 'market-structure', duration: '3h 00m', lessons: 7,
        topics: ['Higher Highs & Higher Lows', 'Break of Structure (BOS)', 'Change of Character (CHoCH)', 'Range Identification', 'Trend Continuation vs. Reversal', 'Multi-Timeframe Analysis'],
        desc: 'Master the language of price action. Know exactly what the market is telling you at every moment.',
        level: 'Intermediate',
    },
    {
        num: '05', title: 'Risk Management', slug: 'risk-management', duration: '2h 30m', lessons: 6,
        topics: ['Position Sizing', 'Risk-to-Reward Ratios', 'Daily Loss Limits', 'Account Drawdown Rules', 'Correlation Risk', 'Portfolio Risk'],
        desc: 'The #1 skill that separates profitable traders from losers. Risk management is non-negotiable.',
        level: 'Intermediate',
    },
    {
        num: '06', title: 'Trading Psychology', slug: 'trading-psychology', duration: '2h 15m', lessons: 5,
        topics: ['Emotional Discipline', 'Fear & Greed Cycles', 'Journaling & Review', 'Revenge Trading', 'Consistency Framework', 'Mindset Habits'],
        desc: 'Your mindset is your edge. Learn to control emotions and execute your strategy with consistency.',
        level: 'Advanced',
    },
    {
        num: '07', title: 'Strategy Development', slug: 'strategy-development', duration: '4h 50m', lessons: 12,
        topics: ['Building a Trading Plan', 'Backtesting Methodology', 'Forward Testing', 'Journaling Systems', 'KPIs & Metrics', 'Optimizing Your Edge'],
        desc: 'Develop, test, and refine a personal trading strategy backed by data — not guesswork.',
        level: 'Advanced',
    },
];

const levelColors: Record<string, string> = {
    Beginner: 'badge-green',
    Intermediate: 'bg-blue-500/20 text-blue-400 border border-blue-400/30 badge',
    Advanced: 'badge-gold',
};

export default function AcademyPage() {
    const [expanded, setExpanded] = useState<string | null>(null);

    return (
        <div className="pt-24 pb-24">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
                <div className="badge-gold inline-block mb-4">100% Free Forever</div>
                <h1 className="section-title text-5xl">Free Trading Academy</h1>
                <p className="section-subtitle max-w-2xl mx-auto">
                    7 professional modules. From complete beginner to institutional-level trader.
                    No email required. No upsells. Just real education.
                </p>
                <div className="flex items-center justify-center gap-8 text-sm text-slate-400">
                    {[['7', 'Modules'], ['55+', 'Lessons'], ['24h+', 'Content'], ['0', 'Cost']].map(([val, lbl]) => (
                        <div key={lbl} className="text-center">
                            <div className="text-2xl font-black gradient-text">{val}</div>
                            <div>{lbl}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modules */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {modules.map((mod, i) => (
                    <div key={mod.num} className={`card-glow group ${i % 2 === 0 ? '' : 'border-blue-400/10'}`} id={`module-${mod.num}`}>
                        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                            {/* Icon & Number */}
                            <div className="flex-shrink-0 text-center lg:w-24">
                                <div className="mb-2">{moduleIcons[mod.num]}</div>
                                <div className="font-mono text-brand-gold font-bold text-sm">{mod.num}</div>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-3 mb-3">
                                    <h2 className="text-white font-bold text-2xl">{mod.title}</h2>
                                    <span className={levelColors[mod.level]}>{mod.level}</span>
                                </div>
                                <p className="text-slate-400 mb-4 leading-relaxed">{mod.desc}</p>

                                {/* Expandable topics */}
                                <button
                                    onClick={() => setExpanded(expanded === mod.num ? null : mod.num)}
                                    className="flex items-center gap-1.5 text-sm text-brand-gold hover:text-brand-gold-light transition-colors mb-4"
                                >
                                    {expanded === mod.num ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    {expanded === mod.num ? 'Hide Topics' : 'View Topics'}
                                </button>

                                {expanded === mod.num && (
                                    <div className="flex flex-wrap gap-2 mb-5 animate-in slide-in-from-top-2">
                                        {mod.topics.map((t) => (
                                            <span key={t} className="text-xs px-3 py-1 rounded-full bg-surface-200 text-slate-300 border border-white/5">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="flex items-center gap-6 text-sm text-slate-400">
                                    <span className="flex items-center gap-1.5"><Film className="w-4 h-4" /> {mod.lessons} lessons</span>
                                    <span className="flex items-center gap-1.5"><Timer className="w-4 h-4" /> {mod.duration}</span>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="lg:w-40 flex-shrink-0">
                                <Link href={`/academy/${mod.slug}`} className="btn-gold block text-center text-sm py-3 mb-3">
                                    Start Module
                                </Link>
                                <p className="text-xs text-slate-500 text-center">{mod.lessons} lessons inside</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom CTA */}
            <div className="max-w-3xl mx-auto px-4 mt-16 text-center">
                <div className="card py-12 border-brand-gold/20">
                    <Rocket className="w-12 h-12 text-brand-gold mx-auto mb-4" />
                    <h2 className="text-3xl font-black text-white mb-3">Ready to Start?</h2>
                    <p className="text-slate-400 mb-8">Join the community to access all modules, live trade breakdowns, and group coaching.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/community" className="btn-gold px-8 py-4">Join Community</Link>
                        <Link href="/pamm" className="btn-outline px-8 py-4">View PAMM Groups</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
