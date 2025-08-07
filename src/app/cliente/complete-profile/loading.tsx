export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header skeleton */}
          <div className="text-center mb-8">
            <div className="h-8 bg-gray-200 rounded w-80 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>

          {/* Form skeleton */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              {/* Form fields */}
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                  <div className="h-10 bg-gray-100 rounded animate-pulse"></div>
                </div>
              ))}

              {/* Submit button skeleton */}
              <div className="pt-4">
                <div className="h-12 bg-blue-200 rounded w-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
