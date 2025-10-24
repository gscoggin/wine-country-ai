'use client'

import Image from 'next/image'
import { MapPin, Wine, Users, Star } from 'lucide-react'

interface Region {
  name: string
  description: string
  wineries: number
  specialties: string[]
  bestTime: string
  imageUrl: string
  color: string
}

const regions: Region[] = [
  {
    name: 'Napa Valley',
    description: 'World-renowned for premium Cabernet Sauvignon and luxury wine experiences',
    wineries: 400,
    specialties: ['Cabernet Sauvignon', 'Chardonnay', 'Sparkling Wine'],
    bestTime: 'September - November',
    imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600',
    color: 'from-terracotta-500 to-terracotta-700'
  },
  {
    name: 'Sonoma County',
    description: 'Diverse microclimates producing exceptional Pinot Noir, Chardonnay, and Zinfandel',
    wineries: 425,
    specialties: ['Pinot Noir', 'Chardonnay', 'Zinfandel'],
    bestTime: 'May - October',
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600',
    color: 'from-sage-500 to-sage-700'
  },
  {
    name: 'Mendocino County',
    description: 'Organic and biodynamic wines with sustainable practices and unique terroir',
    wineries: 100,
    specialties: ['Pinot Noir', 'Sparkling Wine', 'Gewürztraminer'],
    bestTime: 'June - September',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    color: 'from-gold-500 to-gold-700'
  }
]

export function WineRegions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {regions.map((region) => (
        <div key={region.name} className="card group hover:shadow-xl transition-shadow duration-300 flex flex-col">
          <div className={`h-48 bg-gradient-to-br ${region.color} rounded-lg mb-4 relative overflow-hidden`}>
            <Image
              src={region.imageUrl}
              alt={region.name}
              fill
              className="object-cover opacity-80 group-hover:opacity-90 transition-opacity duration-300"
              sizes="(min-width: 1024px) 33vw, 100vw"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-2xl font-bold">{region.name}</h3>
            </div>
          </div>

          <div className="space-y-4 flex-1 flex flex-col">
            <p className="text-gray-600">{region.description}</p>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Wine size={16} />
                <span>{region.wineries} wineries</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin size={16} />
                <span>Best: {region.bestTime}</span>
              </div>
            </div>
            
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-2">Specialties:</h4>
              <div className="flex flex-wrap gap-2">
                {region.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="px-3 py-1 bg-terracotta-100 text-terracotta-700 rounded-full text-sm"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            <button className="w-full btn-primary mt-4">
              Explore {region.name}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
