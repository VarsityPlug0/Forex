import Link from 'next/link'
import {
    Users, Target, TrendingUp, BarChart3, GraduationCap, BookOpen,
    Quote, ArrowRight, Zap, Shield, LineChart, Award,
} from 'lucide-react'
import { GlowyWavesHero } from '@/components/ui/glowy-waves-hero-shadcnui'

// Pre-render this page at build time — served directly from CDN
export const dynamic = 'force-static'
export const revalidate = 3600 // ISR: rebuild every hour

const stats = [
    { label: 'Active Members', value: '2,400+', icon: <Users className="w-7 h-7 text-brand-gold" /> },
    { label: 'Win Rate', value: '73%', icon: <Target className="w-7 h-7 text-brand-gold" /> },
    { label: 'Avg Monthly Return', value: '+8.4%', icon: <TrendingUp className="w-7 h-7 text-brand-gold" /> },
    { label: 'Trades Analyzed', value: '50K+', icon: <BarChart3 className="w-7 h-7 text-brand-gold" /> },
]

const pammGroups = [
    { name: 'Scalping Elite', type: 'Scalping', risk: 'Medium', return: '+12.3%', drawdown: '4.2%', members: 187, color: 'from-brand-gold/20 to-transparent' },
    { name: 'Swing Masters', type: 'Swing', risk: 'Low', return: '+8.7%', drawdown: '2.8%', members: 342, color: 'from-blue-500/20 to-transparent' },
    { name: 'Hedge Shield', type: 'Hedge', risk: 'Very Low', return: '+5.1%', drawdown: '0.9%', members: 521, color: 'from-green-500/20 to-transparent' },
]

const testimonials = [
    { name: 'Marcus T.', role: 'PAMM Investor', text: 'Been in Swing Masters for 6 months. Consistent returns and full transparency. Best decision I made.', return: '+52%' },
    { name: 'Aisha K.', role: 'Academy Graduate', text: 'The Supply & Demand module completely changed how I read charts. From losing to consistently profitable.', return: '' },
    { name: 'James R.', role: 'Scalping Member', text: 'The community is unreal. Live trade breakdowns daily. These guys actually show their losses too — real transparency.', return: '' },
]

const modules = [
    { num: '01', title: 'Market Foundations', desc: 'How Forex works, major pairs, sessions and liquidity' },
    { num: '02', title: 'Supply & Demand', desc: 'Institutional-level order zones and price delivery' },
    { num: '03', title: 'Order Flow', desc: 'Understand smart money movements and liquidity sweeps' },
    { num: '04', title: 'Market Structure', desc: 'BOS, CHoCH, HH/HL analysis for trend direction' },
]

const recentTrades = [
    { pair: 'XAUUSD', dir: 'BUY', entry: '2,315.40', exit: '2,348.20', pips: '+328', rr: '1:4.1', result: 'WIN' },
    { pair: 'EURUSD', dir: 'SELL', entry: '1.0892', exit: '1.0821', pips: '+71', rr: '1:2.3', result: 'WIN' },
    { pair: 'GBPUSD', dir: 'BUY', entry: '1.2640', exit: '1.2598', pips: '-42', rr: '—', result: 'LOSS' },
    { pair: 'USDJPY', dir: 'SELL', entry: '153.80', exit: '152.45', pips: '+135', rr: '1:3.0', result: 'WIN' },
]

const tickerItems = [
    'EURUSD 1.0874 ▲+0.23%', 'GBPUSD 1.2638 ▼-0.14%', 'USDJPY 153.42 ▲+0.41%',
    'XAUUSD 2,341.50 ▲+0.87%', 'AUDUSD 0.6521 ▼-0.09%', 'USDCHF 0.9012 ▲+0.18%',
    'NZDUSD 0.5983 ▼-0.22%', 'USDCAD 1.3621 ▲+0.11%', 'WTI OIL 78.34 ▲+1.2%',
]

export default function HomePage() {
    return (
        <div className="relative">
            {/* ── Hero — animated glowy waves canvas ── */}
            <GlowyWavesHero />

            {/* Ticker Tape */}
            <div className="ticker-wrap py-3">
                <div className="ticker-inner">
                    {[...tickerItems, ...tickerItems].map((item, i) => (
                        <span key={i} className="text-sm font-mono text-slate-300 flex-shrink-0">
                            {item}
                        </span>
                    ))}
                </div>
            </div>

            {/* Recent Trades */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="section-title">Recent Trade Breakdowns</h2>
                        <p className="text-slate-400">Full transparency — wins AND losses</p>
                    </div>
                    <Link href="/community" className="btn-outline text-sm py-2">View All →</Link>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-[rgba(240,180,41,0.1)]">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-surface-100 text-slate-400 text-sm">
                                {['Pair', 'Direction', 'Entry', 'Exit', 'Pips', 'R:R', 'Result'].map(h => (
                                    <th key={h} className="px-6 py-4 text-left font-semibold">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {recentTrades.map((t, i) => (
                                <tr key={i} className="border-t border-[rgba(255,255,255,0.04)] hover:bg-surface-100/50 transition-colors">
                                    <td className="px-6 py-4 font-mono font-bold text-white">{t.pair}</td>
                                    <td className="px-6 py-4">
                                        <span className={`badge ${t.dir === 'BUY' ? 'badge-green' : 'badge-red'}`}>{t.dir}</span>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-slate-300 text-sm">{t.entry}</td>
                                    <td className="px-6 py-4 font-mono text-slate-300 text-sm">{t.exit}</td>
                                    <td className={`px-6 py-4 font-mono font-semibold ${t.result === 'WIN' ? 'text-success' : 'text-danger'}`}>{t.pips}</td>
                                    <td className="px-6 py-4 text-slate-400 text-sm font-mono">{t.rr}</td>
                                    <td className="px-6 py-4">
                                        <span className={`badge ${t.result === 'WIN' ? 'badge-green' : 'badge-red'}`}>{t.result}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* PAMM Groups Preview */}
            <section className="py-20 bg-dark-400/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="section-title">PAMM Investment Groups</h2>
                        <p className="section-subtitle">Let expert traders grow your capital — fully transparent performance</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {pammGroups.map((g) => (
                            <div key={g.name} className={`card-glow bg-gradient-to-br ${g.color}`}>
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-white font-bold text-xl">{g.name}</h3>
                                        <span className="text-slate-400 text-sm">{g.type} Strategy</span>
                                    </div>
                                    <span className={`badge ${g.risk === 'Very Low' ? 'badge-green' : g.risk === 'Low' ? 'badge-green' : 'badge-gold'}`}>{g.risk} Risk</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-black/20 rounded-xl p-3 text-center">
                                        <div className="text-2xl font-black text-success">{g.return}</div>
                                        <div className="text-slate-400 text-xs mt-1">Monthly Avg</div>
                                    </div>
                                    <div className="bg-black/20 rounded-xl p-3 text-center">
                                        <div className="text-2xl font-black text-white">{g.drawdown}</div>
                                        <div className="text-slate-400 text-xs mt-1">Max Drawdown</div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm text-slate-400 mb-5">
                                    <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {g.members} members</span>
                                </div>

                                <Link href="/pamm" className="btn-gold w-full text-center text-sm block">Join Group →</Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Academy Preview */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="badge-gold inline-block mb-4">100% Free</div>
                        <h2 className="section-title">Professional Trading Academy</h2>
                        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                            7 structured modules covering everything from basics to advanced institutional concepts.
                            No fluff, no paid upsells — just real trading knowledge.
                        </p>
                        <div className="space-y-3 mb-8">
                            {modules.map((m) => (
                                <div key={m.num} className="flex items-start gap-4 p-4 rounded-xl bg-surface-100 border border-[rgba(240,180,41,0.08)] hover:border-brand-gold/25 transition-all">
                                    <span className="font-mono text-brand-gold font-bold text-sm flex-shrink-0 mt-0.5">{m.num}</span>
                                    <div>
                                        <div className="text-white font-semibold text-sm">{m.title}</div>
                                        <div className="text-slate-400 text-xs mt-0.5">{m.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Link href="/academy" className="btn-gold inline-flex items-center gap-2">
                            Start Academy <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-radial from-brand-gold/10 to-transparent rounded-3xl" />
                        <div className="card text-center py-12 relative">
                            <BookOpen className="w-16 h-16 text-brand-gold mx-auto mb-4" />
                            <div className="text-4xl font-black gradient-text mb-2">7 Modules</div>
                            <div className="text-slate-400 mb-6">Structured curriculum</div>
                            <div className="grid grid-cols-3 gap-3 text-center">
                                {['Basics', 'Technical', 'Psychology', 'Risk Mgmt', 'Strategy', 'Advanced'].map(t => (
                                    <div key={t} className="bg-surface-200 rounded-lg py-2 px-2 text-xs text-slate-300">{t}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-dark-400/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="section-title">Member Results</h2>
                        <p className="section-subtitle">Real people, real outcomes</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((t) => (
                            <div key={t.name} className="card-glow">
                                <Quote className="w-6 h-6 text-brand-gold mb-4" />
                                <p className="text-slate-300 leading-relaxed mb-6">{t.text}</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-brand-gold/20 border border-brand-gold/30 flex items-center justify-center font-bold text-brand-gold text-sm">
                                            {t.name[0]}
                                        </div>
                                        <div>
                                            <div className="text-white font-semibold text-sm">{t.name}</div>
                                            <div className="text-slate-500 text-xs">{t.role}</div>
                                        </div>
                                    </div>
                                    {t.return && <span className="badge-green badge text-sm font-bold">{t.return}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="card text-center py-16 bg-gradient-to-br from-brand-gold/10 to-surface-100 border-brand-gold/30 animate-pulse-glow">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                        Ready to <span className="gradient-text">Get Started?</span>
                    </h2>
                    <p className="text-slate-400 text-lg mb-8">Join 2,400+ traders already growing with ForexEdge</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/academy" className="btn-gold text-lg px-10 py-4">Start Free Academy</Link>
                        <Link href="/community" className="btn-outline text-lg px-10 py-4">Join Community</Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
