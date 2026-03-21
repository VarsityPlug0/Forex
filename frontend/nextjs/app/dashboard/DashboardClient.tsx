'use client'
import { useState } from 'react'
import Link from 'next/link'

const investments = [
    { group: 'Scalping Elite', invested: 1000, current: 1218, start: 'Sep 2024', roi: '+21.8%', status: 'Active' },
    { group: 'Swing Masters', invested: 2000, current: 2341, start: 'Jul 2024', roi: '+17.1%', status: 'Active' },
    { group: 'Hedge Shield', invested: 500, current: 524, start: 'Oct 2024', roi: '+4.8%', status: 'Active' },
]

const trades = [
    { date: 'Mar 10', pair: 'XAUUSD', dir: 'BUY', lots: 0.5, pl: '+$142.50', group: 'Scalping Elite', status: 'WIN' },
    { date: 'Mar 10', pair: 'EURUSD', dir: 'SELL', lots: 0.3, pl: '+$67.20', group: 'Swing Masters', status: 'WIN' },
    { date: 'Mar 9', pair: 'GBPUSD', dir: 'BUY', lots: 0.4, pl: '-$48.00', group: 'Scalping Elite', status: 'LOSS' },
    { date: 'Mar 8', pair: 'USDJPY', dir: 'SELL', lots: 0.5, pl: '+$112.00', group: 'Swing Masters', status: 'WIN' },
    { date: 'Mar 7', pair: 'USDCHF', dir: 'BUY', lots: 0.2, pl: '+$31.40', group: 'Hedge Shield', status: 'WIN' },
    { date: 'Mar 6', pair: 'AUDUSD', dir: 'SELL', lots: 0.3, pl: '+$55.80', group: 'Swing Masters', status: 'WIN' },
]

const monthlyData = [
    { month: 'Sep', pct: +4.2 }, { month: 'Oct', pct: +6.8 }, { month: 'Nov', pct: -1.2 },
    { month: 'Dec', pct: +9.1 }, { month: 'Jan', pct: +7.4 }, { month: 'Feb', pct: +8.3 },
]

const totalInvested = investments.reduce((a, b) => a + b.invested, 0)
const totalCurrent = investments.reduce((a, b) => a + b.current, 0)
const totalPL = totalCurrent - totalInvested
const totalROI = ((totalPL / totalInvested) * 100).toFixed(1)

const winTrades = trades.filter(t => t.status === 'WIN').length
const overallWinRate = Math.round((winTrades / trades.length) * 100)

export default function DashboardClient() {
    const [activeTab, setActiveTab] = useState<'portfolio' | 'trades' | 'reports'>('portfolio')

    return (
        <>
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                <div className="card text-center">
                    <div className="text-slate-400 text-xs mb-2 uppercase tracking-wider">Total Invested</div>
                    <div className="text-2xl font-black text-white">${totalInvested.toLocaleString()}</div>
                </div>
                <div className="card text-center">
                    <div className="text-slate-400 text-xs mb-2 uppercase tracking-wider">Current Value</div>
                    <div className="text-2xl font-black text-white">${totalCurrent.toLocaleString()}</div>
                </div>
                <div className="card text-center">
                    <div className="text-slate-400 text-xs mb-2 uppercase tracking-wider">Total Profit</div>
                    <div className="text-2xl font-black text-success">+${totalPL.toFixed(0)}</div>
                </div>
                <div className="card text-center">
                    <div className="text-slate-400 text-xs mb-2 uppercase tracking-wider">Overall ROI</div>
                    <div className="text-2xl font-black gradient-text">+{totalROI}%</div>
                </div>
            </div>

            {/* Equity Curve & Win Rate */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
                {/* Monthly performance */}
                <div className="md:col-span-2 card">
                    <h3 className="text-white font-bold mb-6">Monthly Performance (Portfolio)</h3>
                    <div className="flex items-end gap-3 h-32">
                        {monthlyData.map((d) => (
                            <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full flex items-end justify-center" style={{ height: '100px' }}>
                                    <div
                                        className={`w-full rounded-md transition-all ${d.pct >= 0 ? 'bg-success/30 border border-success/50' : 'bg-danger/30 border border-danger/50'}`}
                                        style={{ height: `${Math.abs(d.pct) * 8}px` }}
                                    />
                                </div>
                                <div className={`text-xs font-mono font-semibold ${d.pct >= 0 ? 'text-success' : 'text-danger'}`}>
                                    {d.pct > 0 ? '+' : ''}{d.pct}%
                                </div>
                                <div className="text-slate-500 text-xs">{d.month}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Win Rate */}
                <div className="card flex flex-col items-center justify-center text-center">
                    <div className="text-slate-400 text-xs uppercase tracking-wider mb-4">Overall Win Rate</div>
                    <div className="relative w-28 h-28 mb-4">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                            <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                            <circle
                                cx="60" cy="60" r="50" fill="none" stroke="#10B981" strokeWidth="10"
                                strokeDasharray={`${(overallWinRate / 100) * 314} 314`}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-black text-white">{overallWinRate}%</span>
                        </div>
                    </div>
                    <div className="text-slate-400 text-sm">{winTrades} wins / {trades.length} trades</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                {(['portfolio', 'trades', 'reports'] as const).map(tab => (
                    <button
                        key={tab}
                        id={`tab-${tab}`}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all ${activeTab === tab
                                ? 'bg-brand-gold text-dark-500'
                                : 'bg-surface-100 text-slate-400 hover:text-white'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Portfolio Tab */}
            {activeTab === 'portfolio' && (
                <div className="space-y-4">
                    {investments.map((inv) => {
                        const pl = inv.current - inv.invested
                        const pct = ((pl / inv.invested) * 100).toFixed(1)
                        const progress = (inv.current / (inv.invested * 1.3)) * 100
                        return (
                            <div key={inv.group} className="card-glow">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center font-black text-brand-gold">
                                            {inv.group[0]}
                                        </div>
                                        <div>
                                            <div className="text-white font-bold">{inv.group}</div>
                                            <div className="text-slate-400 text-xs">Since {inv.start}</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-6 text-sm">
                                        <div className="text-center">
                                            <div className="text-slate-400 text-xs mb-1">Invested</div>
                                            <div className="text-white font-semibold">${inv.invested.toLocaleString()}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-slate-400 text-xs mb-1">Current</div>
                                            <div className="text-white font-semibold">${inv.current.toLocaleString()}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-slate-400 text-xs mb-1">ROI</div>
                                            <div className="text-success font-bold">{inv.roi}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="badge-green badge">{inv.status}</span>
                                        <button className="btn-outline text-xs py-1.5 px-4">Withdraw</button>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                                        <span>Growth progress</span>
                                        <span className="text-success">+${pl.toFixed(0)} profit</span>
                                    </div>
                                    <div className="h-1.5 bg-surface-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-success rounded-full" style={{ width: `${Math.min(progress, 100)}%` }} />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    <div className="text-center pt-4">
                        <Link href="/pamm" className="btn-gold px-8 py-3 inline-block">Add Investment</Link>
                    </div>
                </div>
            )}

            {/* Trades Tab */}
            {activeTab === 'trades' && (
                <div className="overflow-x-auto rounded-2xl border border-[rgba(240,180,41,0.1)]">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-surface-100 text-slate-400 text-sm">
                                {['Date', 'Pair', 'Dir', 'Lots', 'P&L', 'Group', 'Result'].map(h => (
                                    <th key={h} className="px-5 py-4 text-left font-semibold">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {trades.map((t, i) => (
                                <tr key={i} className="border-t border-[rgba(255,255,255,0.04)] hover:bg-surface-100/50 transition-colors">
                                    <td className="px-5 py-4 text-slate-400 text-sm">{t.date}</td>
                                    <td className="px-5 py-4 font-mono font-bold text-white text-sm">{t.pair}</td>
                                    <td className="px-5 py-4">
                                        <span className={`badge ${t.dir === 'BUY' ? 'badge-green' : 'badge-red'}`}>{t.dir}</span>
                                    </td>
                                    <td className="px-5 py-4 text-slate-300 font-mono text-sm">{t.lots}</td>
                                    <td className={`px-5 py-4 font-mono font-bold text-sm ${t.status === 'WIN' ? 'text-success' : 'text-danger'}`}>{t.pl}</td>
                                    <td className="px-5 py-4 text-slate-400 text-sm">{t.group}</td>
                                    <td className="px-5 py-4">
                                        <span className={`badge ${t.status === 'WIN' ? 'badge-green' : 'badge-red'}`}>{t.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
                <div className="card text-center py-16">
                    <div className="text-6xl mb-4">📄</div>
                    <h3 className="text-white font-bold text-xl mb-2">Monthly Reports</h3>
                    <p className="text-slate-400 mb-8">Detailed performance reports are published on the 1st of each month.</p>
                    <div className="grid md:grid-cols-3 gap-4 max-w-xl mx-auto mb-8">
                        {['February 2025', 'January 2025', 'December 2024'].map(m => (
                            <button key={m} className="card text-sm font-semibold text-slate-300 hover:text-brand-gold hover:border-brand-gold/30 transition-all py-3">
                                📊 {m}
                            </button>
                        ))}
                    </div>
                    <Link href="/community" className="btn-outline py-3 px-8 inline-block">Join Community for All Reports</Link>
                </div>
            )}
        </>
    )
}
