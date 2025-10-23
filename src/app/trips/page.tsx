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
        return <Wine size={16} className="text-wine-600" />
      case 'restaurant':
        return <Utensils size={16} className="text-vineyard-600" />
      case 'hotel':
        return <Bed size={16} className="text-gold-600" />
      default:
        return <MapPin size={16} className="text-gray-600" />
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your trips</h2>
          <p className="text-gray-600">Sign in to access your wine country trip plans</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
            <p className="text-gray-600 mt-2">Plan and manage your wine country adventures</p>
          </div>
          <button
            onClick={() => setShowCreateTrip(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Create New Trip</span>
          </button>
        </div>

        {/* Trips Grid */}
        {trips.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-wine-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wine size={32} className="text-wine-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No trips yet</h3>
            <p className="text-gray-600 mb-6">Start planning your wine country adventure</p>
            <button
              onClick={() => setShowCreateTrip(true)}
              className="btn-primary"
            >
              Create Your First Trip
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="card hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                onClick={() => setSelectedTrip(trip)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{trip.name}</h3>
                    <p className="text-sm text-gray-600">{trip.description}</p>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <MapPin size={14} />
                    <span>{trip.region}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Itinerary Items:</span>
                    <span className="font-medium">{trip.itinerary.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Booked:</span>
                    <span className="font-medium text-green-600">
                      {trip.itinerary.filter(item => item.booked).length}/{trip.itinerary.length}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Updated {trip.updatedAt.toLocaleDateString()}
                    </span>
                    <button className="text-wine-600 hover:text-wine-700 text-sm font-medium">
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedTrip.name}</h2>
                    <p className="text-gray-600 mb-4">{selectedTrip.description}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPin size={16} />
                        <span>{selectedTrip.region}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar size={16} />
                        <span>{formatDate(selectedTrip.startDate)} - {formatDate(selectedTrip.endDate)}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTrip(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Itinerary</h3>
                  {selectedTrip.itinerary.map((item, index) => {
                    const details = getItemDetails(item.type, item.itemId)
                    return (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            {getItemIcon(item.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">
                                {details?.name || `${item.type} ${item.itemId}`}
                              </h4>
                              <div className="flex items-center space-x-2">
                                {item.booked ? (
                                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                    Booked
                                  </span>
                                ) : (
                                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                    Pending
                                  </span>
                                )}
                                <Star size={14} className="text-yellow-400" />
                                <span className="text-sm text-gray-500">{details?.rating}</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{details?.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{formatDate(item.date)}</span>
                              {item.time && <span>{formatTime(item.time)}</span>}
                              {item.notes && <span>• {item.notes}</span>}
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Create New Trip</h2>
                  <button
                    onClick={() => setShowCreateTrip(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trip Name
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g., Napa Valley Weekend Getaway"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      className="input-field"
                      rows={3}
                      placeholder="Describe your trip..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Region
                    </label>
                    <select className="input-field">
                      <option value="">Select a region</option>
                      <option value="Napa">Napa Valley</option>
                      <option value="Sonoma">Sonoma County</option>
                      <option value="Mendocino">Mendocino County</option>
                      <option value="All">All Regions</option>
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateTrip(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
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

