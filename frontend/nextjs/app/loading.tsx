// Route-level loading UI — shown instantly while the page chunk loads
// Uses CSS skeleton animation — zero JS, zero network

export default function Loading() {
    return (
        <div className="pt-24 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
            {/* Hero skeleton */}
            <div className="text-center mb-16">
                <div className="h-4 bg-surface-200 rounded-full w-32 mx-auto mb-6" />
                <div className="h-12 bg-surface-200 rounded-xl w-3/4 mx-auto mb-4" />
                <div className="h-12 bg-surface-200 rounded-xl w-1/2 mx-auto mb-8" />
                <div className="h-6 bg-surface-200 rounded w-2/3 mx-auto mb-10" />
                <div className="flex justify-center gap-4 mb-12">
                    <div className="h-14 bg-surface-200 rounded-xl w-44" />
                    <div className="h-14 bg-surface-300 rounded-xl w-44" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-surface-100 rounded-2xl p-6 h-28" />
                    ))}
                </div>
            </div>
        </div>
    )
}
