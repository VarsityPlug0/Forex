// Community loading skeleton — matches channels + forum layout
export default function CommunityLoading() {
    return (
        <div className="pt-24 pb-24 animate-pulse">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="h-12 bg-surface-200 rounded-xl w-1/3 mx-auto mb-4" />
                    <div className="h-6 bg-surface-200 rounded w-1/2 mx-auto" />
                </div>
                {/* Channel cards */}
                <div className="grid md:grid-cols-2 gap-8 mb-20">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="bg-surface-100 rounded-2xl p-8 h-64 border border-white/5" />
                    ))}
                </div>
                {/* Forum + Events */}
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-3">
                        <div className="h-8 bg-surface-200 rounded w-40 mb-4" />
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="bg-surface-100 rounded-2xl p-4 h-20 border border-white/5" />
                        ))}
                    </div>
                    <div className="space-y-4">
                        <div className="h-8 bg-surface-200 rounded w-36 mb-2" />
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="bg-surface-100 rounded-2xl p-4 h-24 border border-white/5" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
