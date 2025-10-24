'use client'

import { FormEvent, useCallback, useEffect, useState } from 'react'
import { Plus, MapPin, Calendar, Wine, Utensils, Bed, Star, Trash2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { Trip } from '@/types/wine-country'

const normalizeTrip = (trip: any): Trip => ({
  id: trip.id,
  name: trip.name,
  description: trip.description ?? '',
  startDate: trip.startDate ? new Date(trip.startDate) : new Date(),
  endDate: trip.endDate ? new Date(trip.endDate) : new Date(),
  status: trip.status ?? 'PLANNING',
  isPublic: Boolean(trip.isPublic),
  metadata: trip.metadata ?? {},
  itinerary: (trip.itinerary || []).map((item: any) => ({
    id: item.id,
    venueId: item.venueId,
    date: item.date ? new Date(item.date) : null,
    startTime: item.startTime ?? null,
    endTime: item.endTime ?? null,
    notes: item.notes ?? null,
    status: item.status ?? 'PLANNED',
    order: item.order ?? 0,
    venue: {
      id: item.venue?.id ?? '',
      name: item.venue?.name ?? 'Venue',
      slug: item.venue?.slug ?? '',
      type: item.venue?.type ?? 'VENUE',
      region: item.venue?.region ?? 'Wine Country',
      address: item.venue?.address,
      phone: item.venue?.phone,
      website: item.venue?.website,
      description: item.venue?.description,
      priceLevel: item.venue?.priceLevel ?? null,
      rating: item.venue?.rating ?? null,
      images: item.venue?.images ?? [],
      amenities: item.venue?.amenities ?? [],
      specialties: item.venue?.specialties ?? []
    }
  })),
  createdAt: trip.createdAt ? new Date(trip.createdAt) : new Date(),
  updatedAt: trip.updatedAt ? new Date(trip.updatedAt) : new Date()
})

const typeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'winery':
      return <Wine size={16} className="text-terracotta-600" />
    case 'restaurant':
      return <Utensils size={16} className="text-sage-600" />
    case 'hotel':
      return <Bed size={16} className="text-gold-600" />
    default:
      return <MapPin size={16} className="text-charcoal-600" />
  }
}

const formatDate = (value?: Date | string | null) => {
  if (!value) return ''
  const date = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
}

const formatTime = (time?: string | null) => {
  if (!time) return ''
  return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

export default function TripsPage() {
  const { data: session, status } = useSession()
  const [trips, setTrips] = useState<Trip[]>([])
  const [showCreateTrip, setShowCreateTrip] = useState(false)
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [tripName, setTripName] = useState('')
  const [tripDescription, setTripDescription] = useState('')
  const [tripRegion, setTripRegion] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [itineraryActionId, setItineraryActionId] = useState<string | null>(null)

  const fetchTrips = useCallback(async () => {
    if (!session?.user?.email) {
      setTrips([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/trips')

      if (!response.ok) {
        throw new Error('Failed to fetch trips')
      }

      const data = await response.json()
      const normalized = (data.trips || []).map((trip: any) => normalizeTrip(trip))
      setTrips(normalized)
      setSelectedTrip(prev => {
        if (!prev) return null
        return normalized.find(t => t.id === prev.id) || null
      })
    } catch (err) {
      console.error('Error fetching trips:', err)
      setError('Failed to load trips. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [session?.user?.email])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchTrips()
    } else if (status === 'unauthenticated') {
      setTrips([])
      setLoading(false)
    }
  }, [status, fetchTrips])

  const getMinEndDate = (start: string) => {
    if (!start) return ''
    const startDateObj = new Date(start)
    startDateObj.setDate(startDateObj.getDate() + 1)
    return startDateObj.toISOString().split('T')[0]
  }

  const handleStartDateChange = (value: string) => {
    setStartDate(value)

    if (endDate) {
      const start = new Date(value)
      const end = new Date(endDate)
      if (end <= start) {
        const newEndDate = new Date(start)
        newEndDate.setDate(newEndDate.getDate() + 1)
        setEndDate(newEndDate.toISOString().split('T')[0])
      }
    }
  }

  const handleEndDateChange = (value: string) => {
    if (!startDate) return

    const start = new Date(startDate)
    const end = new Date(value)

    if (end <= start) {
      const minEnd = new Date(start)
      minEnd.setDate(minEnd.getDate() + 1)
      setEndDate(minEnd.toISOString().split('T')[0])
    } else {
      setEndDate(value)
    }
  }

  const handleCloseCreateTrip = () => {
    setShowCreateTrip(false)
    setStartDate('')
    setEndDate('')
    setTripName('')
    setTripDescription('')
    setTripRegion('')
  }

  const handleCreateTrip = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (status !== 'authenticated') {
      alert('Please log in to create a trip')
      return
    }

    if (!tripName || !startDate || !endDate) {
      alert('Please fill in all required fields')
      return
    }

    try {
      setCreating(true)
      setError(null)

      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: tripName,
          description: tripDescription,
          startDate,
          endDate,
          isPublic: false,
          metadata: {
            region: tripRegion || 'Wine Country',
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create trip')
      }

      await fetchTrips()
      handleCloseCreateTrip()
      alert('Trip created successfully!')
    } catch (err) {
      console.error('Error creating trip:', err)
      alert('Failed to create trip. Please try again.')
    } finally {
      setCreating(false)
    }
  }

  const handleRemoveItineraryItem = async (tripId: string, itemId: string) => {
    try {
      setItineraryActionId(itemId)
      const response = await fetch(`/api/trips/${tripId}/itinerary?itemId=${itemId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to remove itinerary item')
      }

      await fetchTrips()
    } catch (err) {
      console.error('Error removing itinerary item:', err)
      alert('Failed to remove itinerary item. Please try again.')
    } finally {
      setItineraryActionId(null)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-tuscan-50 to-white px-4">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta-600"></div>
          <p className="text-charcoal-700 text-lg">Loading your session...</p>
        </div>
      </div>
    )
  }

  if (status !== 'authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-tuscan-50 to-white px-4">
        <div className="text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900 mb-4">
            Please log in to view your trips
          </h2>
          <p className="text-charcoal-700 text-lg">
            Sign in to access your wine country trip plans
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-tuscan-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-charcoal-900">
              My Trips
            </h1>
            <p className="text-charcoal-700 text-lg">
              Plan and manage your wine country adventures
            </p>
          </div>
          <button
            onClick={() => setShowCreateTrip(true)}
            className="btn-primary flex items-center space-x-2 w-full sm:w-auto whitespace-nowrap"
          >
            <Plus size={20} />
            <span>Create New Trip</span>
          </button>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta-600"></div>
            <p className="mt-4 text-charcoal-600">Loading your trips...</p>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wine size={32} className="text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Trips</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button onClick={fetchTrips} className="btn-primary">
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && trips.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="w-24 h-24 bg-terracotta-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wine size={32} className="text-terracotta-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-semibold text-charcoal-900 mb-3">
              No trips yet
            </h3>
            <p className="text-charcoal-700 text-lg mb-6">
              Start planning your wine country adventure
            </p>
            <button
              onClick={() => setShowCreateTrip(true)}
              className="btn-primary"
            >
              Create Your First Trip
            </button>
          </div>
        ) : null}

        {!loading && !error && trips.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onClick={() => setSelectedTrip(trip)}
              >
                <div className="flex items-start justify-between mb-4 gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-charcoal-900 mb-1.5 leading-tight">
                      {trip.name}
                    </h3>
                    <p className="text-sm text-charcoal-700 line-clamp-2">
                      {trip.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-charcoal-600 bg-terracotta-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                    <MapPin size={14} />
                    <span className="font-medium">{trip.metadata?.region || 'Wine Country'}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-charcoal-600 mb-4 pb-4 border-b border-tuscan-100">
                  <div className="flex items-center space-x-1.5">
                    <Calendar size={14} />
                    <span className="text-xs sm:text-sm">
                      {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-charcoal-600">Itinerary Items:</span>
                    <span className="font-semibold text-charcoal-900 bg-tuscan-100 px-2.5 py-1 rounded-full">
                      {trip.itinerary.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-charcoal-600">Status:</span>
                    <span className="font-semibold text-sage-700 bg-sage-100 px-2.5 py-1 rounded-full capitalize">
                      {trip.status.toLowerCase()}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-tuscan-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-charcoal-600">
                      Updated {formatDate(trip.updatedAt)}
                    </span>
                    <button className="text-terracotta-600 hover:text-terracotta-700 text-sm font-medium transition-colors">
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedTrip && (
          <div className="fixed inset-0 bg-charcoal-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-start mb-6 gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900 mb-3 leading-tight">
                      {selectedTrip.name}
                    </h2>
                    {selectedTrip.description && (
                      <p className="text-charcoal-700 mb-4 leading-relaxed">
                        {selectedTrip.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-charcoal-600">
                      <div className="flex items-center space-x-1.5 bg-terracotta-100 px-3 py-1.5 rounded-full">
                        <MapPin size={16} />
                        <span className="font-medium">{selectedTrip.metadata?.region || 'Wine Country'}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 bg-tuscan-100 px-3 py-1.5 rounded-full">
                        <Calendar size={16} />
                        <span className="font-medium">
                          {formatDate(selectedTrip.startDate)} - {formatDate(selectedTrip.endDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTrip(null)}
                    className="text-charcoal-400 hover:text-charcoal-600 transition-colors p-2 flex-shrink-0"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-serif font-semibold text-charcoal-900 mb-4">
                    Itinerary
                  </h3>
                  {selectedTrip.itinerary.length === 0 ? (
                    <div className="text-center py-8 border border-terracotta-200 rounded-xl bg-tuscan-50/30">
                      <p className="text-charcoal-600">No venues added to this trip yet.</p>
                      <p className="text-charcoal-500 mt-2 text-sm">
                        Use the directory to add wineries, restaurants, or hotels.
                      </p>
                    </div>
                  ) : (
                    selectedTrip.itinerary
                      .slice()
                      .sort((a, b) => a.order - b.order)
                      .map((item) => {
                        const venue = item.venue
                        return (
                          <div key={item.id} className="border border-terracotta-200 rounded-xl p-4 sm:p-5 bg-tuscan-50/30 hover:bg-tuscan-50/50 transition-colors">
                            <div className="flex items-start space-x-3 sm:space-x-4">
                              <div className="flex-shrink-0 mt-1 p-2 bg-white rounded-lg shadow-sm">
                                {typeIcon(venue?.type || '')}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                                  <h4 className="font-semibold text-charcoal-900 leading-tight">
                                    {venue?.name || 'Venue'}
                                  </h4>
                                  <div className="flex items-center space-x-2 flex-shrink-0">
                                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                                      item.status === 'CONFIRMED' ? 'bg-sage-100 text-sage-800' : 'bg-gold-100 text-gold-800'
                                    }`}>
                                      {item.status === 'CONFIRMED' ? 'Booked' : 'Pending'}
                                    </span>
                                    {venue?.rating && (
                                      <div className="flex items-center space-x-1">
                                        <Star size={14} className="text-gold-500 fill-current" />
                                        <span className="text-sm text-charcoal-600 font-medium">{venue.rating.toFixed(1)}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {venue?.description && (
                                  <p className="text-sm text-charcoal-700 mb-3 leading-relaxed">
                                    {venue.description}
                                  </p>
                                )}
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-charcoal-600 mb-3">
                                  {item.date && <span className="font-medium">{formatDate(item.date)}</span>}
                                  {item.startTime && <span>{formatTime(item.startTime)}</span>}
                                  {item.notes && <span className="text-terracotta-600">• {item.notes}</span>}
                                </div>
                                <div className="flex items-center space-x-2">
                                  {venue?.region && (
                                    <span className="text-xs uppercase tracking-wide text-charcoal-500">
                                      {venue.region}
                                    </span>
                                  )}
                                  {venue?.specialties?.slice(0, 2).map((specialty) => (
                                    <span
                                      key={specialty}
                                      className="text-xs bg-white border border-terracotta-200 text-charcoal-600 px-2 py-0.5 rounded-full"
                                    >
                                      {specialty}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemoveItineraryItem(selectedTrip.id, item.id)}
                                className="text-charcoal-400 hover:text-red-500 transition-colors"
                                aria-label="Remove itinerary item"
                              >
                                {itineraryActionId === item.id ? (
                                  <span className="text-xs">...</span>
                                ) : (
                                  <Trash2 size={16} />
                                )}
                              </button>
                            </div>
                          </div>
                        )
                      })
                  )}
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedTrip(null)}
                    className="btn-secondary"
                  >
                    Close
                  </button>
                  <button className="btn-primary">
                    Edit Trip
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showCreateTrip && (
          <div className="fixed inset-0 bg-charcoal-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl">
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
                    Create New Trip
                  </h2>
                  <button
                    onClick={handleCloseCreateTrip}
                    className="text-charcoal-400 hover:text-charcoal-600 transition-colors p-2"
                  >
                    ✕
                  </button>
                </div>

                <form className="space-y-5" onSubmit={handleCreateTrip}>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">
                      Trip Name *
                    </label>
                    <input
                      type="text"
                      className="input-field w-full"
                      placeholder="e.g., Napa Valley Weekend Getaway"
                      value={tripName}
                      onChange={(e) => setTripName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">
                      Description
                    </label>
                    <textarea
                      className="input-field w-full"
                      rows={3}
                      placeholder="Describe your trip..."
                      value={tripDescription}
                      onChange={(e) => setTripDescription(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-charcoal-700 mb-2">
                        Check-in Date
                      </label>
                      <input
                        type="date"
                        className="input-field w-full"
                        value={startDate}
                        onChange={(e) => handleStartDateChange(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal-700 mb-2">
                        Check-out Date {startDate && <span className="text-xs text-charcoal-500">(min: {new Date(getMinEndDate(startDate)).toLocaleDateString()})</span>}
                      </label>
                      <input
                        type="date"
                        className="input-field w-full"
                        value={endDate}
                        onChange={(e) => handleEndDateChange(e.target.value)}
                        min={startDate ? getMinEndDate(startDate) : ''}
                        disabled={!startDate}
                        required
                      />
                      {!startDate && (
                        <p className="text-xs text-charcoal-500 mt-1">Please select a check-in date first</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">
                      Region
                    </label>
                    <select
                      className="input-field w-full"
                      value={tripRegion}
                      onChange={(e) => setTripRegion(e.target.value)}
                    >
                      <option value="">Select a region</option>
                      <option value="Napa">Napa Valley</option>
                      <option value="Sonoma">Sonoma County</option>
                      <option value="Mendocino">Mendocino County</option>
                      <option value="All">All Regions</option>
                    </select>
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCloseCreateTrip}
                      className="btn-secondary w-full sm:w-auto"
                      disabled={creating}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary w-full sm:w-auto"
                      disabled={creating}
                    >
                      {creating ? 'Creating...' : 'Create Trip'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
