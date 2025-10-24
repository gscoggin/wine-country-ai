'use client'

import { FormEvent, useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  MapPin,
  Phone,
  Globe,
  Star,
  Wine,
  Utensils,
  Bed,
  DollarSign,
  Heart,
  PlusCircle,
  Loader2,
} from 'lucide-react'
import { SearchFilters, SearchFilters as SearchFiltersType } from '@/components/SearchFilters'

interface Venue {
  id: string
  name: string
  slug: string
  type: string
  region: string
  address: string
  phone: string
  website: string
  description: string
  priceLevel: number
  rating: number
  imageUrl?: string
  images: string[]
  amenities: string[]
  specialties: string[]
  tastingFee?: number
  cuisine?: string
  hotelType?: string
  coordinates?: { lat: number; lng: number }
}

interface TripOption {
  id: string
  name: string
  startDate?: string
  endDate?: string
  metadata?: Record<string, any> | null
}

const TAB_TYPE_MAP: Record<'wineries' | 'restaurants' | 'hotels', string> = {
  wineries: 'WINERY',
  restaurants: 'RESTAURANT',
  hotels: 'HOTEL',
}

const priceLevelMap: Record<number, string> = { 1: '$', 2: '$$', 3: '$$$', 4: '$$$$' }

const formatTripDateRange = (start?: string, end?: string) => {
  if (!start || !end) return 'Flexible dates'
  const startDate = new Date(start)
  const endDate = new Date(end)
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return 'Flexible dates'
  return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
}

export default function DirectoryPage() {
  const { status } = useSession()
  const isAuthenticated = status === 'authenticated'

  const [activeTab, setActiveTab] = useState<'all' | 'wineries' | 'restaurants' | 'hotels'>('all')
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentFilters, setCurrentFilters] = useState<SearchFiltersType | null>(null)

  const [favoritesMap, setFavoritesMap] = useState<Record<string, string>>({})
  const [favoriteLoading, setFavoriteLoading] = useState<string | null>(null)

  const [showTripModal, setShowTripModal] = useState(false)
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const [userTrips, setUserTrips] = useState<TripOption[]>([])
  const [tripLoading, setTripLoading] = useState(false)
  const [addingToTrip, setAddingToTrip] = useState(false)
  const [tripForm, setTripForm] = useState({
    tripId: '',
    date: '',
    startTime: '',
    notes: '',
  })

  const fetchVenues = useCallback(async (filters?: SearchFiltersType | null) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()

      if (filters?.query) params.set('query', filters.query)
      if (filters?.region) params.set('region', filters.region)
      if (filters?.priceRange) {
        const priceMap: Record<string, string> = { '$': '1', '$$': '2', '$$$': '3', '$$$$': '4' }
        params.set('priceLevel', priceMap[filters.priceRange] || '2')
      }
      if (filters?.rating > 0) params.set('minRating', filters.rating.toString())
      if (filters?.amenities.length) params.set('amenities', filters.amenities.join(','))
      if (filters?.specialties.length) params.set('specialties', filters.specialties.join(','))
      if (filters?.sortBy) params.set('sortBy', filters.sortBy === 'name' ? 'name' : 'rating')
      if (activeTab !== 'all') {
        params.set('type', TAB_TYPE_MAP[activeTab])
      }

      const query = params.toString()
      const response = await fetch(`/api/venues${query ? `?${query}` : ''}`)

      if (!response.ok) {
        throw new Error('Failed to fetch venues')
      }

      const data = await response.json()
      setVenues(data.venues || [])
    } catch (err) {
      console.error('Error fetching venues:', err)
      setError('Failed to load venues. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [activeTab])

  useEffect(() => {
    fetchVenues(currentFilters)
  }, [fetchVenues, currentFilters])

  const handleSearch = (filters: SearchFiltersType) => {
    setCurrentFilters(filters)
  }

  const getItemIcon = (venue: Venue) => {
    const type = venue.type.toLowerCase()
    switch (type) {
      case 'winery':
        return <Wine size={20} className="text-terracotta-600" />
      case 'restaurant':
        return <Utensils size={20} className="text-sage-600" />
      case 'hotel':
        return <Bed size={20} className="text-gold-600" />
      default:
        return <MapPin size={20} className="text-charcoal-600" />
    }
  }

  const getItemPrice = (venue: Venue) => {
    if (venue.tastingFee) {
      return `$${venue.tastingFee}`
    }
    return priceLevelMap[venue.priceLevel] || '$$'
  }

  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setFavoritesMap({})
      return
    }

    try {
      const response = await fetch('/api/favorites')
      if (!response.ok) {
        throw new Error('Failed to fetch favorites')
      }
      const data = await response.json()
      const map: Record<string, string> = {}
      for (const favorite of data.favorites || []) {
        map[favorite.venueId] = favorite.id
      }
      setFavoritesMap(map)
    } catch (err) {
      console.error('Error fetching favorites:', err)
    }
  }, [isAuthenticated])

  useEffect(() => {
    fetchFavorites()
  }, [fetchFavorites])

  const handleToggleFavorite = async (venueId: string) => {
    if (!isAuthenticated) {
      alert('Please sign in to save favorites.')
      return
    }

    const isFavorite = Boolean(favoritesMap[venueId])

    try {
      setFavoriteLoading(venueId)
      if (isFavorite) {
        const response = await fetch(`/api/favorites?venueId=${venueId}`, { method: 'DELETE' })
        if (!response.ok) {
          throw new Error('Failed to remove favorite')
        }
        setFavoritesMap(prev => {
          const next = { ...prev }
          delete next[venueId]
          return next
        })
      } else {
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ venueId }),
        })
        if (!response.ok) {
          throw new Error('Failed to add favorite')
        }
        const data = await response.json()
        setFavoritesMap(prev => ({ ...prev, [venueId]: data.favorite.id }))
      }
    } catch (err) {
      console.error('Favorite error:', err)
      alert('Unable to update favorites. Please try again.')
    } finally {
      setFavoriteLoading(null)
    }
  }

  const fetchUserTrips = useCallback(async (): Promise<TripOption[]> => {
    if (!isAuthenticated) {
      setUserTrips([])
      return []
    }

    try {
      setTripLoading(true)
      const response = await fetch('/api/trips')
      if (!response.ok) {
        throw new Error('Failed to load trips')
      }
      const data = await response.json()
      const trips: TripOption[] = (data.trips || []).map((trip: any) => ({
        id: trip.id,
        name: trip.name,
        startDate: trip.startDate,
        endDate: trip.endDate,
        metadata: trip.metadata,
      }))
      setUserTrips(trips)
      return trips
    } catch (err) {
      console.error('Error fetching trips:', err)
      alert('Unable to load trips. Please try again.')
      return []
    } finally {
      setTripLoading(false)
    }
  }, [isAuthenticated])

  const handleOpenTripModal = async (venue: Venue) => {
    if (!isAuthenticated) {
      alert('Please sign in to add venues to a trip.')
      return
    }

    let trips = userTrips
    if (!userTrips.length) {
      trips = await fetchUserTrips()
    }

    if (!trips.length) {
      alert('Create a trip first, then add venues to it.')
      return
    }

    setSelectedVenue(venue)
    setTripForm({
      tripId: trips[0]?.id || '',
      date: '',
      startTime: '',
      notes: '',
    })
    setShowTripModal(true)
  }

  const handleCloseTripModal = () => {
    setShowTripModal(false)
    setSelectedVenue(null)
    setTripForm({
      tripId: '',
      date: '',
      startTime: '',
      notes: '',
    })
  }

  useEffect(() => {
    if (!isAuthenticated) {
      setShowTripModal(false)
      setSelectedVenue(null)
      setTripForm({
        tripId: '',
        date: '',
        startTime: '',
        notes: '',
      })
    }
  }, [isAuthenticated])

  const handleAddVenueToTrip = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedVenue || !tripForm.tripId) return

    try {
      setAddingToTrip(true)
      const response = await fetch(`/api/trips/${tripForm.tripId}/itinerary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          venueId: selectedVenue.id,
          date: tripForm.date || null,
          startTime: tripForm.startTime || null,
          notes: tripForm.notes || '',
          status: 'PLANNED',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add venue to trip')
      }

      alert('Venue added to your trip!')
      handleCloseTripModal()
    } catch (err) {
      console.error('Error adding venue to trip:', err)
      alert('Unable to add venue to trip. Please try again.')
    } finally {
      setAddingToTrip(false)
    }
  }

  const filteredByTab = activeTab === 'all'
    ? venues
    : venues.filter(venue => venue.type.toLowerCase() === activeTab.slice(0, -1))

  return (
    <div className="min-h-screen bg-gradient-to-b from-tuscan-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12 space-y-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-charcoal-900 mb-3">
            Wine Country Directory
          </h1>
          <p className="text-lg sm:text-xl text-charcoal-700 max-w-2xl mx-auto leading-relaxed">
            Discover the best wineries, restaurants, and hotels in Northern California
          </p>
        </div>

        <SearchFilters onSearch={handleSearch} type={activeTab} />

        <div className="flex justify-center mb-8 overflow-x-auto pb-2">
          <div className="bg-white rounded-full p-1.5 shadow-md border border-terracotta-100 inline-flex min-w-max">
            {[
              { key: 'all', label: 'All', count: venues.length },
              { key: 'wineries', label: 'Wineries', count: venues.filter(v => v.type.toLowerCase() === 'winery').length },
              { key: 'restaurants', label: 'Restaurants', count: venues.filter(v => v.type.toLowerCase() === 'restaurant').length },
              { key: 'hotels', label: 'Hotels', count: venues.filter(v => v.type.toLowerCase() === 'hotel').length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'all' | 'wineries' | 'restaurants' | 'hotels')}
                className={`px-4 sm:px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-terracotta-600 text-white shadow-md'
                    : 'text-charcoal-700 hover:text-terracotta-600 hover:bg-terracotta-50'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta-600"></div>
            <p className="mt-4 text-charcoal-600">Loading venues...</p>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin size={32} className="text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Venues</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button onClick={() => fetchVenues(currentFilters)} className="btn-primary">
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredByTab.map((venue) => {
              const isFavorite = Boolean(favoritesMap[venue.id])
              const favoriteBusy = favoriteLoading === venue.id

              return (
                <div key={venue.id} className="card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative mb-4">
                    <img
                      src={venue.images?.[0] || venue.imageUrl || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'}
                      alt={venue.name}
                      className="w-full h-48 sm:h-56 object-cover rounded-lg"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium flex items-center space-x-1.5 shadow-md">
                      {getItemIcon(venue)}
                      <span className="capitalize">{venue.type.toLowerCase()}</span>
                    </div>
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-full text-xs font-medium flex items-center space-x-1 shadow-md">
                      <Star size={14} className="text-gold-500 fill-current" />
                      <span className="text-charcoal-900">{venue.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold text-charcoal-900 mb-1.5 leading-tight">{venue.name}</h3>
                      <div className="flex items-center space-x-1.5 text-sm text-charcoal-600 mb-2">
                        <MapPin size={14} />
                        <span>{venue.region}</span>
                      </div>
                      <p className="text-charcoal-700 text-sm line-clamp-2 leading-relaxed">{venue.description}</p>
                    </div>

                    {venue.specialties && venue.specialties.length > 0 && (
                      <div>
                        <div className="flex flex-wrap gap-1.5">
                          {venue.specialties.slice(0, 3).map((specialty: string) => (
                            <span
                              key={specialty}
                              className="px-2.5 py-1 bg-terracotta-100 text-terracotta-700 rounded-full text-xs font-medium"
                            >
                              {specialty}
                            </span>
                          ))}
                          {venue.specialties.length > 3 && (
                            <span className="px-2.5 py-1 bg-tuscan-100 text-tuscan-700 rounded-full text-xs font-medium">
                              +{venue.specialties.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm pt-2 border-t border-tuscan-100">
                      <div className="flex items-center space-x-1.5 text-charcoal-600 font-medium">
                        <DollarSign size={14} />
                        <span>{getItemPrice(venue)}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        {venue.website && (
                          <a
                            href={venue.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-terracotta-600 hover:text-terracotta-700 flex items-center space-x-1 transition-colors"
                          >
                            <Globe size={14} />
                            <span className="text-xs sm:text-sm">Website</span>
                          </a>
                        )}
                        {venue.phone && (
                          <a
                            href={`tel:${venue.phone}`}
                            className="text-terracotta-600 hover:text-terracotta-700 flex items-center space-x-1 transition-colors"
                          >
                            <Phone size={14} />
                            <span className="text-xs sm:text-sm">Call</span>
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-tuscan-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <button
                        onClick={() => handleToggleFavorite(venue.id)}
                        disabled={favoriteBusy}
                        className={`inline-flex items-center justify-center px-3 py-1.5 rounded-full border text-sm font-medium transition ${
                          isFavorite
                            ? 'border-terracotta-200 bg-terracotta-50 text-terracotta-700'
                            : 'border-tuscan-200 text-charcoal-600 hover:border-terracotta-200 hover:text-terracotta-700'
                        } ${favoriteBusy ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {favoriteBusy ? (
                          <Loader2 size={14} className="animate-spin mr-1.5" />
                        ) : (
                          <Heart size={14} className={isFavorite ? 'fill-current mr-1.5' : 'mr-1.5'} />
                        )}
                        <span>{favoriteBusy ? 'Saving...' : isFavorite ? 'Favorited' : 'Favorite'}</span>
                      </button>
                      <button
                        onClick={() => handleOpenTripModal(venue)}
                        className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-terracotta-600 text-white text-sm font-medium hover:bg-terracotta-700 transition"
                      >
                        <PlusCircle size={14} className="mr-1.5" />
                        Add to Trip
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {!loading && !error && filteredByTab.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      {showTripModal && selectedVenue && (
        <div className="fixed inset-0 bg-charcoal-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl">
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-start mb-6 gap-4">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-charcoal-900">Add to Trip</h2>
                  <p className="text-charcoal-600 mt-1">{selectedVenue.name}</p>
                  <p className="text-sm text-charcoal-500">
                    {selectedVenue.region} • {selectedVenue.type}
                  </p>
                </div>
                <button
                  onClick={handleCloseTripModal}
                  className="text-charcoal-400 hover:text-charcoal-600 transition-colors p-2"
                >
                  ✕
                </button>
              </div>

              {tripLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={24} className="animate-spin text-terracotta-600" />
                </div>
              ) : userTrips.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-charcoal-600 mb-2">You need a trip before adding venues.</p>
                  <a href="/trips" className="btn-primary inline-block mt-2">
                    Create a Trip
                  </a>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleAddVenueToTrip}>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">Choose Trip</label>
                    <select
                      className="input-field w-full"
                      value={tripForm.tripId}
                      onChange={(e) => setTripForm(prev => ({ ...prev, tripId: e.target.value }))}
                      required
                    >
                      {userTrips.map((trip) => (
                        <option key={trip.id} value={trip.id}>
                          {trip.name} • {formatTripDateRange(trip.startDate, trip.endDate)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-charcoal-700 mb-2">Date</label>
                      <input
                        type="date"
                        className="input-field w-full"
                        value={tripForm.date}
                        onChange={(e) => setTripForm(prev => ({ ...prev, date: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal-700 mb-2">Time</label>
                      <input
                        type="time"
                        className="input-field w-full"
                        value={tripForm.startTime}
                        onChange={(e) => setTripForm(prev => ({ ...prev, startTime: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">Notes</label>
                    <textarea
                      className="input-field w-full"
                      rows={3}
                      placeholder="Tasting preference, reservation details, etc."
                      value={tripForm.notes}
                      onChange={(e) => setTripForm(prev => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleCloseTripModal}
                      className="btn-secondary w-full sm:w-auto"
                      disabled={addingToTrip}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary w-full sm:w-auto"
                      disabled={addingToTrip}
                    >
                      {addingToTrip ? 'Adding...' : 'Add to Trip'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
