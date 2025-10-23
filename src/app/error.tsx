'use client'

import { useEffect } from 'react'
import { AlertTriangle, Home, RotateCcw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-b from-tuscan-50 to-white flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-32 h-32 bg-terracotta-100 rounded-full flex items-center justify-center">
            <AlertTriangle size={64} className="text-terracotta-600" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-charcoal-900">
            Oops! Something Went Wrong
          </h1>
          <p className="text-xl sm:text-2xl text-charcoal-700 max-w-xl mx-auto leading-relaxed">
            We encountered an unexpected error while processing your request.
          </p>

          {process.env.NODE_ENV === 'development' && (
            <details className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
              <summary className="cursor-pointer text-sm font-medium text-red-800 mb-2">
                Error Details (Development Only)
              </summary>
              <pre className="text-xs text-red-700 overflow-auto whitespace-pre-wrap">
                {error.message}
                {error.digest && `\nDigest: ${error.digest}`}
              </pre>
            </details>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <button
            onClick={reset}
            className="btn-primary flex items-center space-x-2 w-full sm:w-auto"
          >
            <RotateCcw size={20} />
            <span>Try Again</span>
          </button>
          <a
            href="/"
            className="btn-secondary flex items-center space-x-2 w-full sm:w-auto"
          >
            <Home size={20} />
            <span>Back to Home</span>
          </a>
        </div>

        {/* Help Text */}
        <div className="pt-8 border-t border-tuscan-200">
          <p className="text-sm text-charcoal-600">
            If this problem persists, please try refreshing the page or contact support.
          </p>
        </div>
      </div>
    </div>
  )
}
