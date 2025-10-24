export interface Winery {
  id: string
  name: string
  region: 'Sonoma' | 'Napa' | 'Mendocino'
  address: string
  phone: string
  website: string
  description: string
  specialties: string[]
  tastingFee: number
  reservationRequired: boolean
  familyFriendly: boolean
  rating: number
  imageUrl: string
  coordinates: {
    lat: number
    lng: number
  }
}

export interface Restaurant {
  id: string
  name: string
  region: 'Sonoma' | 'Napa' | 'Mendocino'
  address: string
  phone: string
  website: string
  description: string
  cuisine: string
  priceRange: '$' | '$$' | '$$$' | '$$$$'
  michelinStars?: number
  wineList: boolean
  outdoorSeating: boolean
  rating: number
  imageUrl: string
  coordinates: {
    lat: number
    lng: number
  }
}

export interface Hotel {
  id: string
  name: string
  region: 'Sonoma' | 'Napa' | 'Mendocino'
  address: string
  phone: string
  website: string
  description: string
  type: 'Resort' | 'Boutique Hotel' | 'B&B' | 'Inn' | 'Luxury'
  amenities: string[]
  priceRange: '$' | '$$' | '$$$' | '$$$$'
  spa: boolean
  petFriendly: boolean
  rating: number
  imageUrl: string
  coordinates: {
    lat: number
    lng: number
  }
}

export interface Experience {
  id: string
  name: string
  region: 'Sonoma' | 'Napa' | 'Mendocino'
  type: 'Wine Tasting' | 'Tour' | 'Activity' | 'Event' | 'Class'
  description: string
  duration: string
  price: number
  seasonality: string[]
  difficulty: 'Easy' | 'Moderate' | 'Challenging'
  familyFriendly: boolean
  rating: number
  imageUrl: string
  provider: string
}

export interface TripVenue {
  id: string
  name: string
  slug: string
  type: string
  region: string
  address?: string | null
  phone?: string | null
  website?: string | null
  description?: string | null
  priceLevel?: number | null
  rating?: number | null
  images: string[]
  amenities: string[]
  specialties: string[]
}

export interface TripItem {
  id: string
  venueId: string
  date: Date | null
  startTime?: string | null
  endTime?: string | null
  notes?: string | null
  status: string
  order: number
  venue: TripVenue
}

export interface Trip {
  id: string
  name: string
  description?: string | null
  startDate: Date
  endDate: Date
  status: string
  isPublic: boolean
  metadata?: Record<string, any> | null
  itinerary: TripItem[]
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  email: string
  name: string
  preferences: {
    wineTypes: string[]
    budget: string
    travelStyle: string
    interests: string[]
  }
  createdAt: Date
  updatedAt: Date
}
