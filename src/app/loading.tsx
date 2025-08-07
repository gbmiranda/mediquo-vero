export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header skeleton */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Hero section skeleton */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="h-12 bg-gray-200 rounded w-96 mx-auto mb-6 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-full mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-8 animate-pulse"></div>
          <div className="h-12 bg-blue-200 rounded w-48 mx-auto animate-pulse"></div>
        </div>
      </div>

      {/* Features section skeleton */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6">
              <div className="w-12 h-12 bg-blue-200 rounded-lg mb-4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
