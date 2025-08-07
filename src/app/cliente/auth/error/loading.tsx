export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          {/* Error icon skeleton */}
          <div className="w-16 h-16 bg-red-200 rounded-full mx-auto mb-6 animate-pulse"></div>

          {/* Title skeleton */}
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4 animate-pulse"></div>

          {/* Description skeleton */}
          <div className="space-y-2 mb-6">
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
          </div>

          {/* Buttons skeleton */}
          <div className="space-y-3">
            <div className="h-12 bg-blue-200 rounded w-full animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
