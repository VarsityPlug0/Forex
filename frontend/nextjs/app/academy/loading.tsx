// Academy loading skeleton — matches card list layout
export default function AcademyLoading() {
    return (
        <div className="pt-24 pb-24 animate-pulse">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="h-5 bg-surface-200 rounded-full w-36 mx-auto mb-4" />
                    <div className="h-12 bg-surface-200 rounded-xl w-2/3 mx-auto mb-4" />
                    <div className="h-6 bg-surface-200 rounded w-1/2 mx-auto mb-6" />
                    <div className="flex justify-center gap-8">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="text-center">
                                <div className="h-8 bg-surface-200 rounded w-12 mx-auto mb-1" />
                                <div className="h-4 bg-surface-200 rounded w-16" />
                            </div>
                        ))}
                    </div>
                </div>
                {/* Module cards */}
                <div className="space-y-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-surface-100 rounded-2xl p-6 h-40 border border-white/5" />
                    ))}
                </div>
            </div>
        </div>
    )
}
