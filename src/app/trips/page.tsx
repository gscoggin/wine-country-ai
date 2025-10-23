'use client'

import { useState, useEffect } from 'react'
import { Plus, MapPin, Calendar, Users, Wine, Utensils, Bed, Star } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import { Trip, TripItem } from '@/types/wine-country'
import { wineries } from '@/data/wineries'
import { restaurants } from '@/data/restaurants'

// Mock trips data - in production, this would come from a database
const mockTrips: Trip[] = [
  {
    id: '1',
    userId: '1',
    name: 'Napa Valley Weekend Getaway',
    description: 'A romantic weekend exploring the best of Napa Valley',
    startDate: new Date('2024-03-15'),
    endDate: new Date('2024-03-17'),
    region: 'Napa',
    itinerary: [
      {
        id: '1',
        type: 'hotel',
        itemId: '1',
        date: new Date('2024-03-15'),
        time: '15:00',
        notes: 'Check-in at luxury resort',
        booked: true
      },
      {
        id: '2',
        type: 'winery',
        itemId: '1',
        date: new Date('2024-03-15'),
        time: '16:00',
        notes: 'Sparkling wine tasting at Domaine Carneros',
        booked: true
      },
      {
        id: '3',
        type: 'restaurant',
        itemId: '1',
        date: new Date('2024-03-15'),
        time: '19:00',
        notes: 'Dinner at The French Laundry',
        booked: false
      }
    ],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-15')
  },
  {
    id: '2',
    userId: '1',
    name: 'Sonoma Wine Tour',
    description: 'Exploring the diverse wineries of Sonoma County',
    startDate: new Date('2024-04-20'),
    endDate: new Date('2024-04-22'),
    region: 'Sonoma',
    itinerary: [
      {
        id: '4',
        type: 'winery',
        itemId: '2',
        date: new Date('2024-04-20'),
        time: '10:00',
        notes: 'Zinfandel tasting at Ridge Vineyards',
        booked: true
      },
      {
        id: '5',
        type: 'restaurant',
        itemId: '2',
        date: new Date('2024-04-20'),
        time: '12:30',
        notes: 'Lunch at SingleThread',
        booked: false
      }
    ],
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-10')
  }
]

export default function TripsPage() {
  const { user } = useAuth()
  const [trips, setTrips] = useState<Trip[]>([])
  const [showCreateTrip, setShowCreateTrip] = useState(false)
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)

  useEffect(() => {
    // In production, this would fetch user's trips from the database
    setTrips(mockTrips)
  }, [])

  const getItemDetails = (type: string, itemId: string) => {
    switch (type) {
      case 'winery':
        return wineries.find(w => w.id === itemId)
      case 'restaurant':
        return restaurants.find(r => r.id === itemId)
      default:
        return null
    }
  }

  const getItemIcon = (type: string) => {
    switch (type) {
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (time?: string) => {
    if (!time) return ''
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  if (!user) {
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
        {/* Header */}
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

        {/* Trips Grid */}
        {trips.length === 0 ? (
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
        ) : (
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
                    <span className="font-medium">{trip.region}</span>
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
                    <span className="text-charcoal-600">Booked:</span>
                    <span className="font-semibold text-sage-700 bg-sage-100 px-2.5 py-1 rounded-full">
                      {trip.itinerary.filter(item => item.booked).length}/{trip.itinerary.length}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-tuscan-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-charcoal-600">
                      Updated {trip.updatedAt.toLocaleDateString()}
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

        {/* Trip Detail Modal */}
        {selectedTrip && (
          <div className="fixed inset-0 bg-charcoal-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-start mb-6 gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900 mb-3 leading-tight">
                      {selectedTrip.name}
                    </h2>
                    <p className="text-charcoal-700 mb-4 leading-relaxed">
                      {selectedTrip.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-charcoal-600">
                      <div className="flex items-center space-x-1.5 bg-terracotta-100 px-3 py-1.5 rounded-full">
                        <MapPin size={16} />
                        <span className="font-medium">{selectedTrip.region}</span>
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
                  {selectedTrip.itinerary.map((item, index) => {
                    const details = getItemDetails(item.type, item.itemId)
                    return (
                      <div key={item.id} className="border border-terracotta-200 rounded-xl p-4 sm:p-5 bg-tuscan-50/30 hover:bg-tuscan-50/50 transition-colors">
                        <div className="flex items-start space-x-3 sm:space-x-4">
                          <div className="flex-shrink-0 mt-1 p-2 bg-white rounded-lg shadow-sm">
                            {getItemIcon(item.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                              <h4 className="font-semibold text-charcoal-900 leading-tight">
                                {details?.name || `${item.type} ${item.itemId}`}
                              </h4>
                              <div className="flex items-center space-x-2 flex-shrink-0">
                                {item.booked ? (
                                  <span className="px-2.5 py-1 bg-sage-100 text-sage-800 text-xs font-medium rounded-full">
                                    Booked
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 bg-gold-100 text-gold-800 text-xs font-medium rounded-full">
                                    Pending
                                  </span>
                                )}
                                <div className="flex items-center space-x-1">
                                  <Star size={14} className="text-gold-500 fill-current" />
                                  <span className="text-sm text-charcoal-600 font-medium">{details?.rating}</span>
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-charcoal-700 mb-3 leading-relaxed">
                              {details?.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-charcoal-600">
                              <span className="font-medium">{formatDate(item.date)}</span>
                              {item.time && <span>{formatTime(item.time)}</span>}
                              {item.notes && <span className="text-terracotta-600">• {item.notes}</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
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

        {/* Create Trip Modal */}
        {showCreateTrip && (
          <div className="fixed inset-0 bg-charcoal-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl">
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
                    Create New Trip
                  </h2>
                  <button
                    onClick={() => setShowCreateTrip(false)}
                    className="text-charcoal-400 hover:text-charcoal-600 transition-colors p-2"
                  >
                    ✕
                  </button>
                </div>

                <form className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">
                      Trip Name
                    </label>
                    <input
                      type="text"
                      className="input-field w-full"
                      placeholder="e.g., Napa Valley Weekend Getaway"
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
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-charcoal-700 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        className="input-field w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal-700 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        className="input-field w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">
                      Region
                    </label>
                    <select className="input-field w-full">
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
                      onClick={() => setShowCreateTrip(false)}
                      className="btn-secondary w-full sm:w-auto"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary w-full sm:w-auto">
                      Create Trip
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

