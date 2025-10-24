'use client'

import { useState, useEffect } from 'react'
import { ChatInterface } from '@/components/ChatInterface'
import { AdBanner } from '@/components/AdBanner'
import { FeaturedExperiences } from '@/components/FeaturedExperiences'
import { WineRegions } from '@/components/WineRegions'

// Local vineyard images - optimized for web performance
const localImages = [
  '/images/hero/optimized/DSC_0209.jpg',
  '/images/hero/optimized/IMG_20180528_111523.jpg',
  '/images/hero/optimized/IMG_2101.jpg',
  '/images/hero/optimized/IMG_3322.jpg',
  '/images/hero/optimized/IMG_3323.jpg',
  '/images/hero/optimized/IMG_4727.jpg',
  '/images/hero/optimized/MVIMG_20180816_154435-EFFECTS.jpg',
  '/images/hero/optimized/PXL_20210812_180220589.jpg',
  '/images/hero/optimized/PXL_20210904_173923010.jpg',
  '/images/hero/optimized/PXL_20220818_002728282.jpg',
  '/images/hero/optimized/PXL_20221111_205536911.jpg',
]

// Fallback Unsplash images (used until you add your own)
const fallbackImages = [
  'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1920&q=80',
  'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1920&q=80',
  'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=1920&q=80',
  'https://images.unsplash.com/photo-1596142332133-327e2a0bc6ec?w=1920&q=80',
  'https://images.unsplash.com/photo-1586116654173-26cb2cf23de7?w=1920&q=80',
  'https://images.unsplash.com/photo-1523995462485-3d171b5c8fa9?w=1920&q=80',
  'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=1920&q=80',
  'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=1920&q=80',
]

// Use local images - you can replace these with your own photos
const vineyardImages = localImages

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % vineyardImages.length)
    }, 23000) // 23 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        {/* Background Images with Crossfade */}
        {vineyardImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-charcoal-900/60 via-terracotta-900/40 to-charcoal-900/70"></div>
          </div>
        ))}

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center space-y-8">
              <div className="inline-block">
                <span className="text-sm uppercase tracking-widest text-white/90 font-medium bg-charcoal-900/30 backdrop-blur-sm px-4 py-2 rounded-full">
                  Your Personal Wine Country Concierge
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-white leading-tight drop-shadow-2xl">
                Savor Every Moment<br/>
                <span className="text-terracotta-300">in Wine Country</span>
              </h1>
              <p className="text-xl md:text-2xl mb-10 text-white/95 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
                Experience the finest wineries, restaurants, and hideaways across Sonoma, Napa, and Mendocino—curated by your AI sommelier.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button
                  onClick={() => {
                    const chatSection = document.getElementById('chat-concierge')
                    chatSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                  className="btn-primary bg-terracotta-600 hover:bg-terracotta-700 text-white shadow-2xl hover:shadow-3xl text-center min-w-[200px] backdrop-blur-sm"
                >
                  Plan Your Visit
                </button>
                <a href="/directory" className="btn-secondary bg-white/90 backdrop-blur-md hover:bg-white text-charcoal-900 border-2 border-white text-center min-w-[200px]">
                  Browse Itineraries
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Image indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {vineyardImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? 'bg-white w-8'
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`View image ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Ad Banner */}
      <AdBanner />

      {/* Chat Interface Section */}
      <section id="chat-concierge" className="py-24 bg-gradient-to-b from-white to-tuscan-50 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-charcoal-900 mb-4">
              Your Personal Wine Concierge
            </h2>
            <p className="text-xl text-charcoal-700 leading-relaxed max-w-2xl mx-auto">
              Ask about wineries, restaurants, accommodations, or let us craft the perfect itinerary for your wine country escape
            </p>
          </div>
          <ChatInterface />
        </div>
      </section>

      {/* Wine Regions */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-charcoal-900">
              Explore the Regions
            </h2>
            <p className="text-xl text-charcoal-700 max-w-2xl mx-auto">
              Each wine region offers its own distinct character and charm
            </p>
          </div>
          <WineRegions />
        </div>
      </section>

      {/* Featured Experiences */}
      <section className="py-24 bg-gradient-to-b from-tuscan-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-charcoal-900">
              Curated Experiences
            </h2>
            <p className="text-xl text-charcoal-700 max-w-2xl mx-auto">
              Handpicked moments that define the wine country lifestyle
            </p>
          </div>
          <FeaturedExperiences />
        </div>
      </section>

      {/* Ad Banner */}
      <AdBanner />
    </div>
  )
}