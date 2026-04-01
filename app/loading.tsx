export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse space-y-10">
      {/* Hero skeleton — matches hero section dimensions to prevent CLS */}
      <div className="w-full h-[420px] bg-gray-200 rounded-2xl" />

      {/* Category filter skeleton */}
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-8 w-20 bg-gray-200 rounded-full" />
        ))}
      </div>

      {/* Article grid skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-40 bg-gray-200 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-100">
              <div className="h-48 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 w-16 bg-gray-200 rounded-full" />
                <div className="h-5 w-full bg-gray-200 rounded" />
                <div className="h-5 w-3/4 bg-gray-200 rounded" />
                <div className="flex justify-between pt-2">
                  <div className="h-3 w-20 bg-gray-200 rounded" />
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
