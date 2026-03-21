// Dashboard loading skeleton — matches stats + chart + tabs layout
export default function DashboardLoading() {
    return (
        <div className="pt-24 pb-24 animate-pulse">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <div className="h-8 bg-surface-200 rounded w-52 mb-2" />
                        <div className="h-4 bg-surface-200 rounded w-36" />
                    </div>
                    <div className="h-4 bg-surface-200 rounded w-28" />
                </div>
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-surface-100 rounded-2xl p-6 h-24 border border-white/5" />
                    ))}
                </div>
                {/* Chart + Win Rate */}
                <div className="grid md:grid-cols-3 gap-6 mb-10">
                    <div className="md:col-span-2 bg-surface-100 rounded-2xl h-48 border border-white/5" />
                    <div className="bg-surface-100 rounded-2xl h-48 border border-white/5" />
                </div>
                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-surface-100 rounded-xl h-10 w-28" />
                    ))}
                </div>
                {/* Content */}
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-surface-100 rounded-2xl p-6 h-32 border border-white/5" />
                    ))}
                </div>
            </div>
        </div>
    )
}
