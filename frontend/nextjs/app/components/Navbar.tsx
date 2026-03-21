'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogIn, LogOut, User, LayoutDashboard, ChevronDown } from 'lucide-react'
import { useAuth } from './AuthProvider'

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/academy', label: 'Academy' },
    { href: '/pamm', label: 'PAMM' },
    { href: '/blog', label: 'Blog' },
    { href: '/community', label: 'Community' },
    { href: '/dashboard', label: 'Dashboard' },
]

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const pathname = usePathname()
    const { user, logout, loading } = useAuth()

    useEffect(() => {
        let rafId: number
        const handleScroll = () => {
            rafId = requestAnimationFrame(() => setScrolled(window.scrollY > 20))
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => {
            window.removeEventListener('scroll', handleScroll)
            cancelAnimationFrame(rafId)
        }
    }, [])

    // Close dropdown on route change
    useEffect(() => {
        setDropdownOpen(false)
        setMenuOpen(false)
    }, [pathname])

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-dark-400/90 backdrop-blur-xl border-b border-[rgba(240,180,41,0.12)] shadow-card'
                : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-brand-gold flex items-center justify-center font-black text-dark-500 text-sm group-hover:shadow-gold transition-shadow">
                            FX
                        </div>
                        <span className="font-bold text-lg text-white">
                            Forex<span className="gradient-text">Edge</span>
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${pathname === href
                                    ? 'text-brand-gold bg-brand-gold/10'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>

                    {/* CTA buttons — auth-aware */}
                    <div className="hidden md:flex items-center gap-3">
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin" />
                        ) : user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-brand-gold/20 border border-brand-gold/30 flex items-center justify-center text-brand-gold font-bold text-xs">
                                        {user.username[0].toUpperCase()}
                                    </div>
                                    <span className="text-sm text-slate-300 font-medium">{user.username}</span>
                                    <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-surface-100 border border-white/10 rounded-xl shadow-card overflow-hidden z-50">
                                        <Link href="/dashboard" className="flex items-center gap-2 px-4 py-3 text-sm text-slate-300 hover:bg-white/5 transition-colors">
                                            <LayoutDashboard className="w-4 h-4" /> Dashboard
                                        </Link>
                                        {user.role === 'admin' && (
                                            <Link href="/admin" className="flex items-center gap-2 px-4 py-3 text-sm text-slate-300 hover:bg-white/5 transition-colors">
                                                <User className="w-4 h-4" /> Admin Panel
                                            </Link>
                                        )}
                                        <button
                                            onClick={logout}
                                            className="flex items-center gap-2 px-4 py-3 text-sm text-danger hover:bg-danger/5 w-full text-left transition-colors border-t border-white/5"
                                        >
                                            <LogOut className="w-4 h-4" /> Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-2 flex items-center gap-1.5">
                                    <LogIn className="w-4 h-4" /> Sign In
                                </Link>
                                <Link href="/register" className="btn-gold text-sm py-2 px-5">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        id="mobile-menu-btn"
                        className="md:hidden flex flex-col gap-1.5 p-2"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span className={`block w-6 h-0.5 bg-brand-gold transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                        <span className={`block w-6 h-0.5 bg-brand-gold transition-all ${menuOpen ? 'opacity-0' : ''}`} />
                        <span className={`block w-6 h-0.5 bg-brand-gold transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                    </button>
                </div>

                {/* Mobile menu */}
                {menuOpen && (
                    <div className="md:hidden pb-4 border-t border-[rgba(240,180,41,0.1)] mt-2 pt-4 animate-fade-in">
                        {navLinks.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setMenuOpen(false)}
                                className={`block px-4 py-3 rounded-lg text-sm font-medium mb-1 transition-all ${pathname === href
                                    ? 'text-brand-gold bg-brand-gold/10'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {label}
                            </Link>
                        ))}
                        <div className="pt-2 border-t border-[rgba(240,180,41,0.1)] mt-2 flex gap-3">
                            {user ? (
                                <>
                                    <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="btn-outline text-sm py-2 flex-1 text-center">Dashboard</Link>
                                    <button onClick={() => { logout(); setMenuOpen(false); }} className="btn-gold text-sm py-2 flex-1 text-center">Sign Out</button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" onClick={() => setMenuOpen(false)} className="btn-outline text-sm py-2 flex-1 text-center">Sign In</Link>
                                    <Link href="/register" onClick={() => setMenuOpen(false)} className="btn-gold text-sm py-2 flex-1 text-center">Get Started</Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}
