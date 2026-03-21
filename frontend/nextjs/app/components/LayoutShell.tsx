'use client';

import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import AuthProvider from './AuthProvider';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith('/admin');

    if (isAdmin) {
        // Admin pages use their own layout — no public navbar/footer
        return <AuthProvider>{children}</AuthProvider>;
    }

    return (
        <AuthProvider>
            <Suspense fallback={
                <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-dark-400/90 backdrop-blur-xl border-b border-[rgba(240,180,41,0.12)]" />
            }>
                <Navbar />
            </Suspense>
            <main className="flex-1">{children}</main>
            <Footer />
        </AuthProvider>
    );
}
