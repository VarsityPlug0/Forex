import Link from 'next/link'
import { Users, AlertTriangle } from 'lucide-react'

export const dynamic = 'force-static'

const groups = [
    {
        id: 'scalping-elite',
        name: 'Scalping Elite',
        strategy: 'Scalping',
        pairs: ['XAUUSD', 'GBPUSD', 'EURUSD'],
        risk: 'Medium',
        riskColor: 'badge-gold',
        return: '+12.3%',
        ytd: '+87.4%',
        drawdown: '4.2%',
        winRate: '71%',
        members: 187,
        minInvest: '$500',
        fee: '20% profit share',
        highlight: true,
        months: [8.1, 11.2, 14.3, 9.8, 13.1, 12.0, 15.2, 11.8, 10.4, 9.3, 12.1, 14.3],
        desc: 'High-frequency scalping strategy targeting 20-80 pip moves. Mostly active during London and New York sessions.',
    },
    {
        id: 'swing-masters',
        name: 'Swing Masters',
        strategy: 'Swing Trading',
        pairs: ['EURUSD', 'USDJPY', 'XAUUSD', 'GBPJPY'],
        risk: 'Low',
        riskColor: 'badge-green',
        return: '+8.7%',
        ytd: '+62.1%',
        drawdown: '2.8%',
        winRate: '76%',
        members: 342,
        minInvest: '$300',
        fee: '15% profit share',
        highlight: false,
        months: [6.2, 9.1, 8.4, 7.8, 9.3, 8.0, 10.2, 8.1, 7.4, 9.3, 8.1, 9.3],
        desc: 'Patient swing trading on H4/Daily timeframes. Fewer trades, higher quality setups, minimal screen time required.',
    },
    {
        id: 'hedge-shield',
        name: 'Hedge Shield',
        strategy: 'Hedging',
        pairs: ['EURUSD', 'GBPUSD', 'USDCHF', 'AUDUSD'],
        risk: 'Very Low',
        riskColor: 'badge-green',
        return: '+5.1%',
        ytd: '+39.8%',
        drawdown: '0.9%',
        winRate: '84%',
        members: 521,
        minInvest: '$200',
        fee: '10% profit share',
        highlight: false,
        months: [3.8, 5.2, 4.9, 5.4, 6.1, 5.0, 5.8, 4.9, 5.1, 5.3, 5.0, 5.8],
        desc: 'Ultra-conservative hedging approach. Maximum capital preservation with steady compounding. Ideal for risk-averse investors.',
    },
]

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const steps = [
    { num: '01', title: 'Choose a Group', desc: 'Select the PAMM group that matches your risk appetite and investment goals.' },
    { num: '02', title: 'Connect Your Account', desc: 'Link your broker account using our secure allocation system. Your funds stay with your broker.' },
    { num: '03', title: 'Funds Allocated', desc: 'The master trader executes trades and profits/losses are automatically distributed to your account.' },
    { num: '04', title: 'Track & Withdraw', desc: 'Monitor performance in real-time on your dashboard. Withdraw anytime with no lock-in periods.' },
]

export default function PAMMPage() {
    return (
        <div className="pt-24 pb-24">
            {/* Hero */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
                <div className="badge-gold inline-block mb-4">Verified Track Record</div>
                <h1 className="section-title text-5xl">PAMM Investment Groups</h1>
                <p className="section-subtitle max-w-2xl mx-auto">
                    Let our expert traders grow your capital. Full transparency, verified performance,
                    and you always remain in control of your funds.
                </p>
            </div>

            {/* PAMM Groups */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 mb-24">
                {groups.map((g) => (
                    <div key={g.id} id={`pamm-${g.id}`} className={`card border ${g.highlight ? 'border-brand-gold/40 shadow-gold' : 'border-[rgba(240,180,41,0.1)]'} relative overflow-hidden`}>
                        {g.highlight && (
                            <div className="absolute top-0 right-0 bg-brand-gold text-dark-500 text-xs font-bold px-4 py-1 rounded-bl-xl">
                                MOST POPULAR
                            </div>
                        )}

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Group Info */}
                            <div className="md:col-span-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center font-black text-brand-gold">
                                        {g.name[0]}
                                    </div>
                                    <div>
                                        <h2 className="text-white font-bold text-xl">{g.name}</h2>
                                        <span className="text-slate-400 text-sm">{g.strategy}</span>
                                    </div>
                                </div>

                                <p className="text-slate-400 text-sm leading-relaxed mb-4">{g.desc}</p>

                                <div className="flex flex-wrap gap-2 mb-5">
                                    {g.pairs.map(p => (
                                        <span key={p} className="font-mono text-xs px-2 py-1 bg-surface-200 text-slate-300 rounded">{p}</span>
                                    ))}
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Risk Level</span>
                                        <span className={g.riskColor}>{g.risk}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Min Investment</span>
                                        <span className="text-white font-semibold">{g.minInvest}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Fee Structure</span>
                                        <span className="text-white">{g.fee}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Active Members</span>
                                        <span className="text-white flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {g.members}</span>
                                    </div>
                                </div>

                                <Link href="/community" className="btn-gold block text-center mt-6 py-3 text-sm">
                                    Join {g.name} →
                                </Link>
                            </div>

                            {/* Stats */}
                            <div className="md:col-span-2">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="bg-surface-200 rounded-xl p-4 text-center">
                                        <div className="text-2xl font-black text-success">{g.return}</div>
                                        <div className="text-slate-400 text-xs mt-1">Monthly Avg</div>
                                    </div>
                                    <div className="bg-surface-200 rounded-xl p-4 text-center">
                                        <div className="text-2xl font-black text-brand-gold">{g.ytd}</div>
                                        <div className="text-slate-400 text-xs mt-1">YTD Return</div>
                                    </div>
                                    <div className="bg-surface-200 rounded-xl p-4 text-center">
                                        <div className="text-2xl font-black text-white">{g.drawdown}</div>
                                        <div className="text-slate-400 text-xs mt-1">Max DD</div>
                                    </div>
                                    <div className="bg-surface-200 rounded-xl p-4 text-center">
                                        <div className="text-2xl font-black text-white">{g.winRate}</div>
                                        <div className="text-slate-400 text-xs mt-1">Win Rate</div>
                                    </div>
                                </div>

                                {/* Monthly performance chart (CSS bars) */}
                                <div>
                                    <div className="text-slate-400 text-xs font-semibold mb-3 uppercase tracking-wider">Monthly Returns (2024)</div>
                                    <div className="flex items-end gap-1.5 h-24">
                                        {g.months.map((val, i) => (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                                <div
                                                    className="w-full bg-success/20 border border-success/40 rounded-sm hover:bg-success/40 transition-colors"
                                                    style={{ height: `${(val / 16) * 100}%` }}
                                                    title={`${monthNames[i]}: +${val}%`}
                                                />
                                                <span className="text-slate-500 text-[9px]">{monthNames[i][0]}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* How it Works */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <div className="text-center mb-12">
                    <h2 className="section-title">How PAMM Works</h2>
                    <p className="section-subtitle">Simple, transparent, and you stay in control</p>
                </div>
                <div className="grid md:grid-cols-4 gap-6">
                    {steps.map((s) => (
                        <div key={s.num} className="card text-center">
                            <div className="w-12 h-12 rounded-xl bg-brand-gold text-dark-500 font-black flex items-center justify-center mx-auto mb-4">
                                {s.num}
                            </div>
                            <h3 className="text-white font-bold mb-2">{s.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Risk disclaimer */}
            <div className="max-w-3xl mx-auto px-4 text-center">
                <div className="bg-danger/5 border border-danger/20 rounded-2xl p-6">
                    <div className="text-danger font-semibold mb-2 flex items-center justify-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> Important Risk Disclosure
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        PAMM investing involves substantial risk. Past performance does not guarantee future results.
                        All return figures shown are historical and actual returns may vary. Only invest capital you can afford to lose.
                    </p>
                </div>
            </div>
        </div>
    )
}
