// Blog loading skeleton — matches featured + grid layout
export default function BlogLoading() {
    return (
        <div className="pt-24 pb-24 animate-pulse">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="h-12 bg-surface-200 rounded-xl w-1/3 mx-auto mb-4" />
                    <div className="h-6 bg-surface-200 rounded w-1/2 mx-auto mb-6" />
                    <div className="flex justify-center gap-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-9 bg-surface-200 rounded-full w-24" />
                        ))}
                    </div>
                </div>
                {/* Featured */}
                <div className="bg-surface-100 rounded-2xl p-8 mb-10 h-48 border border-white/5" />
                {/* Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-surface-100 rounded-2xl p-6 h-56 border border-white/5" />
                    ))}
                </div>
            </div>
        </div>
    )
}
