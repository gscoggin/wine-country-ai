'use client'

import { useState, useEffect } from 'react'

interface Ad {
  id: string
  title: string
  description: string
  imageUrl: string
  link: string
  category: 'travel' | 'dining' | 'wine' | 'hotel'
}

// Mock ad data - in production, this would come from an ad network
const mockAds: Ad[] = [
  {
    id: '1',
    title: 'Luxury Wine Country Tours',
    description: 'Experience the best of Napa Valley with our premium guided tours',
    imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400',
    link: '#',
    category: 'travel'
  },
  {
    id: '2',
    title: 'Fine Dining Reservations',
    description: 'Book exclusive tables at Michelin-starred restaurants',
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
    link: '#',
    category: 'dining'
  },
  {
    id: '3',
    title: 'Wine Country Hotels',
    description: 'Stay at the most luxurious resorts and boutique hotels',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
    link: '#',
    category: 'hotel'
  },
  {
    id: '4',
    title: 'Premium Wine Club',
    description: 'Join our exclusive wine club for curated selections',
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400',
    link: '#',
    category: 'wine'
  }
]

export function AdBanner() {
  const [currentAd, setCurrentAd] = useState<Ad>(mockAds[0])
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAd(prevAd => {
        const currentIndex = mockAds.findIndex(ad => ad.id === prevAd.id)
        const nextIndex = (currentIndex + 1) % mockAds.length
        return mockAds[nextIndex]
      })
    }, 5000) // Change ad every 5 seconds

    return () => clearInterval(interval)
  }, [])

  if (!isVisible) return null

  return (
    <div className="bg-gradient-to-r from-tuscan-50 to-terracotta-50 border-y border-terracotta-200 py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:justify-between">
          <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 flex-1">
            <img
              src={currentAd.imageUrl}
              alt={currentAd.title}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover shadow-md flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-charcoal-900 mb-1">{currentAd.title}</h3>
              <p className="text-sm text-charcoal-700">{currentAd.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
            <button
              onClick={() => window.open(currentAd.link, '_blank')}
              className="btn-primary text-sm flex-1 sm:flex-initial"
            >
              Learn More
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="text-charcoal-400 hover:text-charcoal-600 transition-colors p-2"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}