import Link from 'next/link'
import {
    Send, Gamepad2, Users, Check, Flame, MessageSquare,
    Eye, CalendarDays, Radio, CircleDot,
} from 'lucide-react'

export const dynamic = 'force-static'

const channels = [
    {
        id: 'telegram-vip',
        name: 'Telegram VIP Group',
        icon: <Send className="w-10 h-10 text-blue-400" />,
        members: '2,400+',
        desc: 'Real-time trade alerts, live analysis sessions, and daily market breakdowns. This is where the action happens.',
        perks: ['Daily trade alerts', 'Live chart analysis', 'Q&A with traders', 'Monthly performance reports'],
        cta: 'Join Telegram',
        href: '#',
        color: 'from-blue-500/10 to-transparent',
        border: 'border-blue-400/20 hover:border-blue-400/40',
    },
    {
        id: 'discord-server',
        name: 'Discord Server',
        icon: <Gamepad2 className="w-10 h-10 text-purple-400" />,
        members: '1,800+',
        desc: 'Structured discussion channels for each trading style, educational resources, and community trading journals.',
        perks: ['Backtesting lounge', 'Trade journal channel', 'Education library', 'Weekly challenges'],
        cta: 'Join Discord',
        href: '#',
        color: 'from-purple-500/10 to-transparent',
        border: 'border-purple-400/20 hover:border-purple-400/40',
    },
]

const forumTopics = [
    { cat: 'Gold Analysis', title: 'XAUUSD - Waiting for $2,280 demand zone retest before buy', replies: 34, views: '1.2K', hot: true, time: '2h ago' },
    { cat: 'PAMM', title: 'Swing Masters February recap — +9.1% month breakdown', replies: 21, views: '890', hot: false, time: '5h ago' },
    { cat: 'Strategy', title: 'My supply and demand zone drawing process (with examples)', replies: 56, views: '2.4K', hot: true, time: '1d ago' },
    { cat: 'Newbie Help', title: 'How do I know if a zone is still valid after multiple touches?', replies: 18, views: '456', hot: false, time: '1d ago' },
    { cat: 'Psychology', title: 'Journaling template I\'ve used for 2 years — free download', replies: 89, views: '3.8K', hot: true, time: '3d ago' },
    { cat: 'Market Analysis', title: 'DXY weekly analysis — dollar strength fading?', replies: 27, views: '1.1K', hot: false, time: '3d ago' },
]

const events = [
    { date: 'Mar 14', title: 'Live Trading Session: London Open', time: '8:00 AM GMT', type: 'Live' },
    { date: 'Mar 17', title: 'Monthly PAMM Performance Review', time: '6:00 PM GMT', type: 'Webinar' },
    { date: 'Mar 21', title: 'Beginner\'s Q&A: Supply & Demand Deep Dive', time: '7:00 PM GMT', type: 'Q&A' },
    { date: 'Mar 28', title: 'Strategy Showcase: Member Submissions', time: '6:00 PM GMT', type: 'Community' },
]

const catColors: Record<string, string> = {
    'Gold Analysis': 'badge-gold',
    'PAMM': 'badge-green',
    'Strategy': 'bg-blue-500/20 text-blue-400 border border-blue-500/30 badge',
    'Newbie Help': 'bg-purple-500/20 text-purple-400 border border-purple-500/30 badge',
    'Psychology': 'bg-pink-500/20 text-pink-400 border border-pink-500/30 badge',
    'Market Analysis': 'badge-gold',
}

export default function CommunityPage() {
    return (
        <div className="pt-24 pb-24">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
                <h1 className="section-title text-5xl">Our Community</h1>
                <p className="section-subtitle max-w-xl mx-auto">
                    Join 2,400+ traders learning and growing together. Real traders. Real transparency. Real results.
                </p>
            </div>

            {/* Community Channels */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                <div className="grid md:grid-cols-2 gap-8">
                    {channels.map((ch) => (
                        <div key={ch.id} id={ch.id} className={`card bg-gradient-to-br ${ch.color} ${ch.border} border transition-all`}>
                            <div className="flex items-start gap-4 mb-6">
                                <div className="flex-shrink-0">{ch.icon}</div>
                                <div>
                                    <h2 className="text-white font-bold text-2xl mb-1">{ch.name}</h2>
                                    <div className="text-slate-400 text-sm flex items-center gap-1.5">
                                        <Users className="w-3.5 h-3.5" /> {ch.members} members
                                    </div>
                                </div>
                            </div>
                            <p className="text-slate-300 leading-relaxed mb-6">{ch.desc}</p>
                            <ul className="space-y-2 mb-8">
                                {ch.perks.map(p => (
                                    <li key={p} className="flex items-center gap-2 text-slate-300 text-sm">
                                        <Check className="w-4 h-4 text-success flex-shrink-0" /> {p}
                                    </li>
                                ))}
                            </ul>
                            <a href={ch.href} id={`join-${ch.id}`} className="btn-gold block text-center py-3">
                                {ch.cta} →
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            {/* Forum & Events */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-8">
                {/* Forum Topics */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-white font-bold text-2xl">Forum Topics</h2>
                        <button className="btn-outline text-sm py-2 px-4">New Topic</button>
                    </div>
                    <div className="space-y-3">
                        {forumTopics.map((t, i) => (
                            <div key={i} id={`forum-topic-${i + 1}`} className="card p-4 cursor-pointer group">
                                <div className="flex items-start gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <span className={catColors[t.cat] || 'badge'}>{t.cat}</span>
                                            {t.hot && (
                                                <span className="badge bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-1">
                                                    <Flame className="w-3 h-3" /> Hot
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-slate-200 font-semibold text-sm group-hover:text-brand-gold transition-colors leading-snug">
                                            {t.title}
                                        </h3>
                                    </div>
                                    <div className="flex-shrink-0 text-right text-xs text-slate-500 space-y-1">
                                        <div className="flex items-center gap-1 justify-end"><MessageSquare className="w-3 h-3" /> {t.replies}</div>
                                        <div className="flex items-center gap-1 justify-end"><Eye className="w-3 h-3" /> {t.views}</div>
                                        <div>{t.time}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-6">
                        <button className="btn-outline py-2 px-8 text-sm">View All Topics</button>
                    </div>
                </div>

                {/* Upcoming Events */}
                <div>
                    <h2 className="text-white font-bold text-2xl mb-6">Upcoming Events</h2>
                    <div className="space-y-4">
                        {events.map((ev, i) => (
                            <div key={i} id={`event-${i + 1}`} className="card p-4">
                                <div className="flex items-start gap-4">
                                    <div className="bg-brand-gold/10 border border-brand-gold/20 rounded-xl p-3 text-center flex-shrink-0 w-16">
                                        <div className="text-brand-gold font-bold text-xs">{ev.date.split(' ')[0]}</div>
                                        <div className="text-white font-black text-xl leading-none">{ev.date.split(' ')[1]}</div>
                                    </div>
                                    <div>
                                        <span className={`badge text-xs mb-2 inline-flex items-center gap-1 ${ev.type === 'Live' ? 'badge-red' : ev.type === 'Webinar' ? 'badge-green' : 'badge-gold'}`}>
                                            {ev.type === 'Live' && <Radio className="w-3 h-3" />}{ev.type}
                                        </span>
                                        <h3 className="text-white font-semibold text-sm leading-snug mb-1">{ev.title}</h3>
                                        <div className="text-slate-500 text-xs">{ev.time}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 card p-5 text-center border-brand-gold/20">
                        <CalendarDays className="w-10 h-10 text-brand-gold mx-auto mb-3" />
                        <h3 className="text-white font-bold mb-2">Never Miss an Event</h3>
                        <p className="text-slate-400 text-sm mb-4">Get notified in Telegram for all live sessions</p>
                        <a href="#" className="btn-gold block py-2 text-sm">Subscribe to Calendar</a>
                    </div>
                </div>
            </div>
        </div>
    )
}
