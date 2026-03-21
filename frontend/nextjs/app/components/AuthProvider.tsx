'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface User {
    id: string;
    username: string;
    email: string;
    role: string;
    full_name?: string;
    avatar_url?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
    register: (data: { username: string; email: string; password: string }) => Promise<{ ok: boolean; error?: string }>;
    logout: () => void;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    loading: true,
    login: async () => ({ ok: false }),
    register: async () => ({ ok: false }),
    logout: () => {},
    isAdmin: false,
});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Load token from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('token');
        if (stored) {
            setToken(stored);
            fetchMe(stored);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchMe = async (jwt: string) => {
        try {
            const res = await fetch(`${API}/auth/me`, {
                headers: { Authorization: `Bearer ${jwt}` },
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                // Token invalid
                localStorage.removeItem('token');
                setToken(null);
            }
        } catch (_) {
            // API down — keep token but don't set user
        }
        setLoading(false);
    };

    const login = useCallback(async (email: string, password: string) => {
        try {
            const res = await fetch(`${API}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (res.ok && data.token) {
                setToken(data.token);
                setUser(data.user);
                localStorage.setItem('token', data.token);
                return { ok: true };
            }
            return { ok: false, error: data.message || 'Login failed' };
        } catch (_) {
            return { ok: false, error: 'Network error — is the backend running?' };
        }
    }, []);

    const register = useCallback(async (input: { username: string; email: string; password: string }) => {
        try {
            const res = await fetch(`${API}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(input),
            });
            const data = await res.json();
            if (res.ok && data.token) {
                setToken(data.token);
                setUser(data.user);
                localStorage.setItem('token', data.token);
                return { ok: true };
            }
            return { ok: false, error: data.message || 'Registration failed' };
        } catch (_) {
            return { ok: false, error: 'Network error — is the backend running?' };
        }
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
            {children}
        </AuthContext.Provider>
    );
}
