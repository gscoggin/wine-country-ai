'use client'

import { useState, useEffect } from 'react'
import { MapPin, Phone, Globe, Star, Wine, Utensils, Bed, Clock, DollarSign } from 'lucide-react'
import { SearchFilters, SearchFilters as SearchFiltersType } from '@/components/SearchFilters'
import { wineries } from '@/data/wineries'
import { restaurants } from '@/data/restaurants'
import { hotels } from '@/data/hotels'
import { Winery, Restaurant, Hotel } from '@/types/wine-country'

type DirectoryItem = Winery | Restaurant | Hotel

export default function DirectoryPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'wineries' | 'restaurants' | 'hotels'>('all')
  const [filteredItems, setFilteredItems] = useState<DirectoryItem[]>([])
  const [allItems, setAllItems] = useState<DirectoryItem[]>([])

  useEffect(() => {
    // Combine all items for the directory
    const combined = [
      ...wineries.map(w => ({ ...w, itemType: 'winery' as const })),
      ...restaurants.map(r => ({ ...r, itemType: 'restaurant' as const })),
      ...hotels.map(h => ({ ...h, itemType: 'hotel' as const }))
    ]
    setAllItems(combined)
    setFilteredItems(combined)
  }, [])

  const handleSearch = (filters: SearchFiltersType) => {
    let filtered = [...allItems]

    // Filter by query
    if (filters.query) {
      const query = filters.query.toLowerCase()
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        (item as any).specialties?.some((s: string) => s.toLowerCase().includes(query)) ||
        (item as any).cuisine?.toLowerCase().includes(query) ||
        (item as any).type?.toLowerCase().includes(query)
      )
    }

    // Filter by region
    if (filters.region) {
      filtered = filtered.filter(item => item.region === filters.region)
    }

    // Filter by price range
    if (filters.priceRange) {
      filtered = filtered.filter(item => {
        const priceRange = (item as any).priceRange || (item as any).tastingFee
        if (typeof priceRange === 'string') {
          return priceRange === filters.priceRange
        } else if (typeof priceRange === 'number') {
          // Convert tasting fee to price range
          if (priceRange <= 25) return filters.priceRange === '$'
          if (priceRange <= 50) return filters.priceRange === '$$'
          if (priceRange <= 75) return filters.priceRange === '$$$'
          return filters.priceRange === '$$$$'
        }
        return false
      })
    }

    // Filter by rating
    if (filters.rating > 0) {
      filtered = filtered.filter(item => item.rating >= filters.rating)
    }

    // Filter by amenities
    if (filters.amenities.length > 0) {
      filtered = filtered.filter(item => {
        const itemAmenities = (item as any).amenities || []
        return filters.amenities.some(amenity => 
          itemAmenities.some((a: string) => a.toLowerCase().includes(amenity.toLowerCase()))
        )
      })
    }

    // Filter by specialties
    if (filters.specialties.length > 0) {
      filtered = filtered.filter(item => {
        const itemSpecialties = (item as any).specialties || []
        const itemCuisine = (item as any).cuisine || ''
        const itemType = (item as any).type || ''
        
        return filters.specialties.some(specialty =>
          itemSpecialties.some((s: string) => s.toLowerCase().includes(specialty.toLowerCase())) ||
          itemCuisine.toLowerCase().includes(specialty.toLowerCase()) ||
          itemType.toLowerCase().includes(specialty.toLowerCase())
        )
      })
    }

    // Sort results
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'price-low':
          const aPrice = (a as any).tastingFee || ((a as any).priceRange === '$' ? 1 : (a as any).priceRange === '$$' ? 2 : (a as any).priceRange === '$$$' ? 3 : 4)
          const bPrice = (b as any).tastingFee || ((b as any).priceRange === '$' ? 1 : (b as any).priceRange === '$$' ? 2 : (b as any).priceRange === '$$$' ? 3 : 4)
          return aPrice - bPrice
        case 'price-high':
          const aPriceHigh = (a as any).tastingFee || ((a as any).priceRange === '$' ? 1 : (a as any).priceRange === '$$' ? 2 : (a as any).priceRange === '$$$' ? 3 : 4)
          const bPriceHigh = (b as any).tastingFee || ((b as any).priceRange === '$' ? 1 : (b as any).priceRange === '$$' ? 2 : (b as any).priceRange === '$$$' ? 3 : 4)
          return bPriceHigh - aPriceHigh
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    setFilteredItems(filtered)
  }

  const getItemIcon = (item: DirectoryItem) => {
    const itemType = (item as any).itemType
    switch (itemType) {
      case 'winery':
        return <Wine size={20} className="text-wine-600" />
      case 'restaurant':
        return <Utensils size={20} className="text-vineyard-600" />
      case 'hotel':
        return <Bed size={20} className="text-gold-600" />
      default:
        return <MapPin size={20} className="text-gray-600" />
    }
  }

  const getItemType = (item: DirectoryItem) => {
    return (item as any).itemType || 'unknown'
  }

  const getItemPrice = (item: DirectoryItem) => {
    const tastingFee = (item as any).tastingFee
    const priceRange = (item as any).priceRange
    
    if (tastingFee) {
      return `$${tastingFee}`
    } else if (priceRange) {
      return priceRange
    }
    return ''
  }

  const getItemSpecialties = (item: DirectoryItem) => {
    const specialties = (item as any).specialties
    const cuisine = (item as any).cuisine
    const type = (item as any).type
    
    if (specialties) return specialties
    if (cuisine) return [cuisine]
    if (type) return [type]
    return []
  }

  const filteredByTab = activeTab === 'all' 
    ? filteredItems 
    : filteredItems.filter(item => getItemType(item) === activeTab.slice(0, -1)) // Remove 's' from plural

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Wine Country Directory</h1>
          <p className="text-xl text-gray-600">
            Discover the best wineries, restaurants, and hotels in Northern California
          </p>
        </div>

        {/* Search and Filters */}
        <SearchFilters onSearch={handleSearch} type={activeTab} />

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            {[
              { key: 'all', label: 'All', count: filteredItems.length },
              { key: 'wineries', label: 'Wineries', count: filteredItems.filter(item => getItemType(item) === 'winery').length },
              { key: 'restaurants', label: 'Restaurants', count: filteredItems.filter(item => getItemType(item) === 'restaurant').length },
              { key: 'hotels', label: 'Hotels', count: filteredItems.filter(item => getItemType(item) === 'hotel').length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-wine-600 text-white'
                    : 'text-gray-700 hover:text-wine-600 hover:bg-wine-50'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredByTab.map((item) => (
            <div key={item.id} className="card hover:shadow-xl transition-shadow duration-300">
              <div className="relative mb-4">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                  {getItemIcon(item)}
                  <span className="capitalize">{getItemType(item)}</span>
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                  <Star size={14} className="text-yellow-400 fill-current" />
                  <span>{item.rating}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                  <div className="flex items-center space-x-1 text-sm text-gray-500 mb-2">
                    <MapPin size={14} />
                    <span>{item.region}</span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                </div>

                {getItemSpecialties(item).length > 0 && (
                  <div>
                    <div className="flex flex-wrap gap-1">
                      {getItemSpecialties(item).slice(0, 3).map((specialty: string) => (
                        <span
                          key={specialty}
                          className="px-2 py-1 bg-wine-100 text-wine-700 rounded-full text-xs"
                        >
                          {specialty}
                        </span>
                      ))}
                      {getItemSpecialties(item).length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          +{getItemSpecialties(item).length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1 text-gray-500">
                    <DollarSign size={14} />
                    <span>{getItemPrice(item)}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <a
                      href={item.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-wine-600 hover:text-wine-700 flex items-center space-x-1"
                    >
                      <Globe size={14} />
                      <span>Website</span>
                    </a>
                    <a
                      href={`tel:${item.phone}`}
                      className="text-wine-600 hover:text-wine-700 flex items-center space-x-1"
                    >
                      <Phone size={14} />
                      <span>Call</span>
                    </a>
                  </div>
                </div>

                <button className="w-full btn-primary text-sm">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredByTab.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

