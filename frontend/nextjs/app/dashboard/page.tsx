import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Lazy-load the heavy client component — keeps initial JS bundle lean
const DashboardClient = dynamic(() => import('./DashboardClient'), {
    ssr: false,
    loading: () => (
        <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-surface-100 rounded-2xl p-6 h-24" />
                ))}
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-surface-100 rounded-2xl h-48" />
                <div className="bg-surface-100 rounded-2xl h-48" />
            </div>
            <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-surface-100 rounded-xl h-10 w-28" />
                ))}
            </div>
        </div>
    ),
})

export default function DashboardPage() {
    return (
        <div className="pt-24 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header — server-rendered immediately */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-white">Member Dashboard</h1>
                        <p className="text-slate-400 mt-1">Welcome back, <span className="text-brand-gold">Trader</span></p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                        <span className="text-success text-sm font-semibold">All Groups Live</span>
                    </div>
                </div>

                {/* Client island — lazy-loaded */}
                <Suspense fallback={null}>
                    <DashboardClient />
                </Suspense>
            </div>
        </div>
    )
}
