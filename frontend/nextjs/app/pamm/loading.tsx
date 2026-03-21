// PAMM loading skeleton — matches group cards layout
export default function PAMMLoading() {
    return (
        <div className="pt-24 pb-24 animate-pulse">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="h-5 bg-surface-200 rounded-full w-40 mx-auto mb-4" />
                    <div className="h-12 bg-surface-200 rounded-xl w-2/3 mx-auto mb-4" />
                    <div className="h-6 bg-surface-200 rounded w-1/2 mx-auto" />
                </div>
                {/* Group cards */}
                <div className="space-y-8">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-surface-100 rounded-2xl p-8 border border-white/5">
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-surface-200 rounded-xl" />
                                        <div className="space-y-2">
                                            <div className="h-5 bg-surface-200 rounded w-32" />
                                            <div className="h-3 bg-surface-200 rounded w-20" />
                                        </div>
                                    </div>
                                    <div className="h-16 bg-surface-200 rounded" />
                                </div>
                                <div className="md:col-span-2 space-y-4">
                                    <div className="grid grid-cols-4 gap-4">
                                        {Array.from({ length: 4 }).map((_, j) => (
                                            <div key={j} className="bg-surface-200 rounded-xl h-20" />
                                        ))}
                                    </div>
                                    <div className="bg-surface-200 rounded-xl h-28" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
