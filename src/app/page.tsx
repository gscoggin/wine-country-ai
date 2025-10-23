'use client'

import { useState } from 'react'
import { ChatInterface } from '@/components/ChatInterface'
import { AdBanner } from '@/components/AdBanner'
import { FeaturedExperiences } from '@/components/FeaturedExperiences'
import { WineRegions } from '@/components/WineRegions'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-terracotta-400 via-tuscan-300 to-gold-400 text-charcoal-900 py-32 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-charcoal-900 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-charcoal-900 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-8">
            <div className="inline-block">
              <span className="text-sm uppercase tracking-widest text-charcoal-700 font-medium">Your Personal Wine Country Concierge</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-charcoal-900 leading-tight">
              Savor Every Moment<br/>
              <span className="text-terracotta-800">in Wine Country</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-charcoal-800 max-w-3xl mx-auto leading-relaxed">
              Experience the finest wineries, restaurants, and hideaways across Sonoma, Napa, and Mendocino—curated by your AI sommelier.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a href="/directory" className="btn-primary bg-charcoal-900 hover:bg-charcoal-800 text-white shadow-xl hover:shadow-2xl text-center min-w-[200px]">
                Explore Discoveries
              </a>
              <a href="/trips" className="btn-secondary bg-white/80 backdrop-blur-sm hover:bg-white text-charcoal-900 border-2 border-charcoal-900 text-center min-w-[200px]">
                Plan Your Journey
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Banner */}
      <AdBanner />

      {/* Chat Interface Section */}
      <section className="py-24 bg-gradient-to-b from-white to-tuscan-50">
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