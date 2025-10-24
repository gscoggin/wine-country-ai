'use client'

import Image from 'next/image'
import { Star, MapPin, Clock, Users } from 'lucide-react'

interface Experience {
  id: string
  name: string
  type: string
  region: string
  description: string
  duration: string
  price: string
  rating: number
  imageUrl: string
  featured: boolean
}

const experiences: Experience[] = [
  {
    id: '1',
    name: 'Hot Air Balloon Ride',
    type: 'Adventure',
    region: 'Napa Valley',
    description: 'Soar above the vineyards at sunrise for breathtaking views of wine country',
    duration: '3 hours',
    price: '$250',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    featured: true
  },
  {
    id: '2',
    name: 'Wine & Food Pairing Class',
    type: 'Culinary',
    region: 'Sonoma',
    description: 'Learn the art of pairing wine with local cuisine from expert sommeliers',
    duration: '2 hours',
    price: '$120',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
    featured: true
  },
  {
    id: '3',
    name: 'Vineyard Hiking Tour',
    type: 'Outdoor',
    region: 'Mendocino',
    description: 'Explore scenic trails through organic vineyards with wine tasting stops',
    duration: '4 hours',
    price: '$85',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    featured: true
  },
  {
    id: '4',
    name: 'Private Winery Tour',
    type: 'Wine Tasting',
    region: 'Napa Valley',
    description: 'Exclusive behind-the-scenes tour of a premium winery with barrel tasting',
    duration: '2.5 hours',
    price: '$180',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400',
    featured: true
  },
  {
    id: '5',
    name: 'Cooking Class with Local Chef',
    type: 'Culinary',
    region: 'Sonoma',
    description: 'Hands-on cooking class featuring farm-to-table techniques and wine pairing',
    duration: '3 hours',
    price: '$150',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
    featured: true
  },
  {
    id: '6',
    name: 'Spa & Wine Retreat',
    type: 'Wellness',
    region: 'Mendocino',
    description: 'Luxurious spa treatments followed by wine tasting in a serene setting',
    duration: '5 hours',
    price: '$320',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
    featured: true
  }
]

export function FeaturedExperiences() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {experiences.map((experience) => (
        <div key={experience.id} className="card group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="relative">
            <div className="relative w-full h-48 mb-4">
              <Image
                src={experience.imageUrl}
                alt={experience.name}
                fill
                className="object-cover rounded-lg"
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              />
            </div>
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium">
              {experience.type}
            </div>
            <div className="absolute top-4 left-4 bg-terracotta-600 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-md">
              {experience.region}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold text-charcoal-900 group-hover:text-terracotta-600 transition-colors leading-tight">
                {experience.name}
              </h3>
              <div className="flex items-center space-x-1 text-sm text-charcoal-600">
                <Star size={16} className="text-gold-500 fill-current" />
                <span className="font-medium">{experience.rating}</span>
              </div>
            </div>

            <p className="text-charcoal-700 text-sm leading-relaxed">{experience.description}</p>

            <div className="flex items-center justify-between text-sm text-charcoal-600 pt-2 border-t border-tuscan-100">
              <div className="flex items-center space-x-1.5">
                <Clock size={16} />
                <span>{experience.duration}</span>
              </div>
              <div className="text-terracotta-600 font-semibold text-base">
                {experience.price}
              </div>
            </div>
            
            <button className="w-full btn-primary text-sm">
              Book Experience
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
