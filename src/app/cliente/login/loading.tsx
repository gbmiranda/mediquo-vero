export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        {/* Logo skeleton */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-48 mx-auto animate-pulse"></div>
        </div>

        {/* Login form skeleton */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-4">
            {/* Phone input skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-12 bg-gray-100 rounded animate-pulse"></div>
            </div>

            {/* Submit button skeleton */}
            <div className="h-12 bg-blue-200 rounded w-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
