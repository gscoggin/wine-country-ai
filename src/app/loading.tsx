export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-tuscan-50 to-white flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* Animated Wine Glass */}
        <div className="flex justify-center">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 bg-terracotta-600 rounded-full opacity-20 animate-ping"></div>
            <div className="relative flex items-center justify-center w-24 h-24 bg-terracotta-100 rounded-full">
              <svg
                className="w-12 h-12 text-terracotta-600 animate-pulse"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 2h8l-1 7h-6l-1-7zm-1 9h10c0 3-1 5-5 5s-5-2-5-5zm5 7c-3.3 0-6-2.7-6-6h12c0 3.3-2.7 6-6 6z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <p className="text-xl font-serif font-semibold text-charcoal-900 animate-pulse">
            Loading...
          </p>
          <p className="text-sm text-charcoal-600">
            Preparing your wine country experience
          </p>
        </div>
      </div>
    </div>
  )
}
