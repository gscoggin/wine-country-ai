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

export interface Trip {
  id: string
  userId: string
  name: string
  description: string
  startDate: Date
  endDate: Date
  region: 'Sonoma' | 'Napa' | 'Mendocino' | 'All'
  itinerary: TripItem[]
  createdAt: Date
  updatedAt: Date
}

export interface TripItem {
  id: string
  type: 'winery' | 'restaurant' | 'hotel' | 'experience'
  itemId: string
  date: Date
  time?: string
  notes?: string
  booked: boolean
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