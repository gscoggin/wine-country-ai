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
      <section className="relative bg-gradient-to-r from-wine-600 to-vineyard-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Wine Country
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-wine-100">
              Your AI-powered guide to Sonoma, Napa, and Mendocino
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/directory" className="btn-primary bg-white text-wine-600 hover:bg-wine-50 text-center">
                Explore Directory
              </a>
              <a href="/trips" className="btn-secondary border-2 border-white text-white hover:bg-white hover:text-vineyard-600 text-center">
                Start Planning
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Banner */}
      <AdBanner />

      {/* Chat Interface Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ask Me Anything About Wine Country
            </h2>
            <p className="text-lg text-gray-600">
              Get personalized recommendations for wineries, restaurants, hotels, and experiences
            </p>
          </div>
          <ChatInterface />
        </div>
      </section>

      {/* Wine Regions */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explore Our Wine Regions
            </h2>
            <p className="text-lg text-gray-600">
              Discover the unique character of each wine region
            </p>
          </div>
          <WineRegions />
        </div>
      </section>

      {/* Featured Experiences */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Experiences
            </h2>
            <p className="text-lg text-gray-600">
              Curated recommendations for your perfect wine country getaway
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