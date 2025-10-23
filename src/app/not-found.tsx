import Link from 'next/link'
import { Wine, Home, Search, Map } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-tuscan-50 to-white flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 bg-terracotta-100 rounded-full flex items-center justify-center">
              <Wine size={64} className="text-terracotta-600" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-gold-600">404</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-charcoal-900">
            Page Not Found
          </h1>
          <p className="text-xl sm:text-2xl text-charcoal-700 max-w-xl mx-auto leading-relaxed">
            Looks like this page took a wrong turn on the vineyard path.
          </p>
          <p className="text-lg text-charcoal-600">
            The page you're looking for doesn't exist or may have been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link
            href="/"
            className="btn-primary flex items-center space-x-2 w-full sm:w-auto"
          >
            <Home size={20} />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/directory"
            className="btn-secondary flex items-center space-x-2 w-full sm:w-auto"
          >
            <Search size={20} />
            <span>Explore Directory</span>
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="pt-8 border-t border-tuscan-200">
          <p className="text-sm text-charcoal-600 mb-4">Looking for something specific?</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/directory?region=Napa"
              className="text-sm text-terracotta-600 hover:text-terracotta-700 hover:underline transition-colors"
            >
              Napa Valley Wineries
            </Link>
            <span className="text-charcoal-400">•</span>
            <Link
              href="/directory?region=Sonoma"
              className="text-sm text-terracotta-600 hover:text-terracotta-700 hover:underline transition-colors"
            >
              Sonoma Restaurants
            </Link>
            <span className="text-charcoal-400">•</span>
            <Link
              href="/trips"
              className="text-sm text-terracotta-600 hover:text-terracotta-700 hover:underline transition-colors"
            >
              Plan a Trip
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
