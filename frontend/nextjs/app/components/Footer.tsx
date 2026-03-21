import Link from 'next/link'

const footerLinks = {
    Platform: [
        { href: '/academy', label: 'Trading Academy' },
        { href: '/pamm', label: 'PAMM Investing' },
        { href: '/blog', label: 'Market Insights' },
        { href: '/community', label: 'Community' },
        { href: '/dashboard', label: 'Dashboard' },
    ],
    Resources: [
        { href: '/academy', label: 'Free Courses' },
        { href: '/blog', label: 'Forex Blog' },
        { href: '/community', label: 'Join Discord' },
        { href: '/community', label: 'Join Telegram' },
    ],
    Company: [
        { href: '/', label: 'About Us' },
        { href: '/', label: 'Risk Disclaimer' },
        { href: '/', label: 'Privacy Policy' },
        { href: '/', label: 'Terms of Service' },
    ],
}

export default function Footer() {
    return (
        <footer className="border-t border-[rgba(240,180,41,0.1)] bg-dark-400 mt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-lg bg-brand-gold flex items-center justify-center font-black text-dark-500">
                                FX
                            </div>
                            <span className="font-bold text-xl text-white">Forex<span className="gradient-text">Edge</span></span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                            Professional Forex education, community-driven learning, and expertly managed PAMM investment groups.
                        </p>
                        <div className="mt-6 flex gap-3">
                            <a href="#" className="w-9 h-9 rounded-lg bg-surface-100 border border-[rgba(240,180,41,0.1)] flex items-center justify-center text-slate-400 hover:text-brand-gold hover:border-brand-gold/40 transition-all" aria-label="Telegram">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
                            </a>
                            <a href="#" className="w-9 h-9 rounded-lg bg-surface-100 border border-[rgba(240,180,41,0.1)] flex items-center justify-center text-slate-400 hover:text-brand-gold hover:border-brand-gold/40 transition-all" aria-label="Discord">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" /></svg>
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{category}</h4>
                            <ul className="space-y-3">
                                {links.map(({ href, label }) => (
                                    <li key={label}>
                                        <Link href={href} className="text-slate-400 hover:text-brand-gold text-sm transition-colors">
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="glow-line my-8" />

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                    <p>© 2025 ForexEdge. All rights reserved.</p>
                    <p className="text-center max-w-lg">
                        ⚠️ <strong>Risk Warning:</strong> Trading Forex involves substantial risk of loss. Past performance is not indicative of future results. Only invest what you can afford to lose.
                    </p>
                </div>
            </div>
        </footer>
    )
}
