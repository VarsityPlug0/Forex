'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, UserPlus, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../components/AuthProvider';

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }
        if (password !== confirm) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        const result = await register({ username, email, password });
        setLoading(false);
        if (result.ok) {
            router.push('/dashboard');
        } else {
            setError(result.error || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-16">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 mb-4">
                        <UserPlus className="w-8 h-8 text-brand-gold" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-slate-400">Join 2,400+ traders on ForexEdge</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="card p-8 space-y-5">
                    {error && (
                        <div className="flex items-center gap-2 bg-danger/10 border border-danger/20 text-danger text-sm rounded-xl px-4 py-3">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Username */}
                    <div>
                        <label htmlFor="reg-username" className="text-sm font-medium text-slate-300 mb-1.5 block">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                id="reg-username"
                                type="text"
                                required
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="trader_name"
                                className="w-full pl-10 pr-4 py-3 bg-dark-500 border border-white/10 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-gold/40 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="reg-email" className="text-sm font-medium text-slate-300 mb-1.5 block">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                id="reg-email"
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full pl-10 pr-4 py-3 bg-dark-500 border border-white/10 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-gold/40 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="reg-password" className="text-sm font-medium text-slate-300 mb-1.5 block">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                id="reg-password"
                                type={showPw ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Min 8 characters"
                                className="w-full pl-10 pr-12 py-3 bg-dark-500 border border-white/10 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-gold/40 transition-colors"
                            />
                            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label htmlFor="reg-confirm" className="text-sm font-medium text-slate-300 mb-1.5 block">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                id="reg-confirm"
                                type={showPw ? 'text' : 'password'}
                                required
                                value={confirm}
                                onChange={e => setConfirm(e.target.value)}
                                placeholder="Re-enter password"
                                className="w-full pl-10 pr-4 py-3 bg-dark-500 border border-white/10 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-gold/40 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        id="register-submit"
                        className="btn-gold w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-dark-500/30 border-t-dark-500 rounded-full animate-spin" />
                        ) : (
                            <><UserPlus className="w-4 h-4" /> Create Account</>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center text-sm text-slate-500 mt-6">
                    Already have an account?{' '}
                    <Link href="/login" className="text-brand-gold hover:underline font-medium">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
